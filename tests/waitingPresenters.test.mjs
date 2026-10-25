import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const flush = () => new Promise(resolve => setImmediate(resolve));
const order = { order_number:'ORD-SYNTHETIC-1', payment_status_token:'a'.repeat(64),
  user_name:'Budi',company:'PT A',division:'HR',total_price:3000 };
const event = { preventDefault() {} };

async function harness(file, name, extras = {}, initialProps) {
  const source = (await readFile(new URL('../app/presenters/'+file,import.meta.url),'utf8'))
    .replace(/^import .*;$/gm,'').replace('export function','function');
  const slots=[],effects=[],queued=[],timers=new Map(),storage=new Map();
  let slot=0, clock=0, props=initialProps;
  const context = {
    AbortController, console, ...extras,
    localStorage:{getItem:key=>storage.get(key)||null,setItem:(key,value)=>storage.set(key,value),removeItem:key=>storage.delete(key)},
    document:{hidden:false,addEventListener(){},removeEventListener(){}},
    setTimeout(callback){const id=++clock;timers.set(id,callback);return id;},
    clearTimeout(id){timers.delete(id);},
    useState(initial){const index=slot++;if(!(index in slots))slots[index]=typeof initial==='function'?initial():initial;
      return [slots[index],value=>{slots[index]=typeof value==='function'?value(slots[index]):value;}];},
    useRef(initial){const index=slot++;if(!(index in slots))slots[index]={current:initial};return slots[index];},
    useEffect(callback,deps){const index=slot++,previous=effects[index];
      if(!previous||deps.some((value,i)=>value!==previous.deps[i])){
        previous?.cleanup?.();effects[index]={deps};queued.push(()=>{effects[index].cleanup=callback();});
      }}
  };
  vm.createContext(context);vm.runInContext(source+';globalThis.hook='+name+';',context);
  return { storage,timers,context,
    render(next){if(next!==undefined)props=next;slot=0;const result=context.hook(props);while(queued.length)queued.shift()();return result;},
    async tick(){const item=timers.entries().next().value;if(item){timers.delete(item[0]);await item[1]();}await flush();},
    close(){for(const effect of effects)effect?.cleanup?.();timers.clear();}
  };
}

test('Waiting popup opens on receipt finish and closes only after server confirmation',async t=>{
  let complete;const calls=[];
  const app=await harness('usePendingPaymentPresenter.js','usePendingPaymentPresenter',{
    orderModel:{paymentStatus:(number,token,signal)=>{calls.push({number,token,signal});return new Promise(resolve=>{complete=resolve;});}}
  });
  t.after(()=>app.close());
  let p=app.render();await flush();
  p.trackWaitingOrder(order);p=app.render();
  assert.equal(p.paymentInstructionsOpen,false);
  p.showPaymentInstructions();p=app.render();assert.equal(p.paymentInstructionsOpen,true);
  assert.equal(calls[0].token,order.payment_status_token);
  complete({order_number:order.order_number,status:'paid'});await flush();p=app.render();
  assert.equal(p.pendingOrder,null);assert.equal(p.paymentInstructionsOpen,false);
  assert.equal(p.confirmedOrderNumber,order.order_number);assert.equal(app.storage.size,0);
});

test('A refresh restores pending instructions and a network error does not dismiss them',async t=>{
  let attempt=0;
  const app=await harness('usePendingPaymentPresenter.js','usePendingPaymentPresenter',{
    orderModel:{async paymentStatus(){attempt++;if(attempt===1)throw Error('offline');return {order_number:order.order_number,status:'paid'};}}
  });
  t.after(()=>app.close());
  app.storage.set('ogi_waiting_payment',JSON.stringify(order));
  app.render();await flush();app.render();await flush();let p=app.render();
  assert.equal(p.paymentInstructionsOpen,true);assert.ok(p.pendingOrder);assert.match(p.paymentStatusError,/belum dapat diperiksa/);
  await app.tick();p=app.render();assert.equal(p.pendingOrder,null);assert.equal(p.paymentInstructionsOpen,false);
});

test('An old status response cannot dismiss another pending order',async t=>{
  const requests=[];
  const app=await harness('usePendingPaymentPresenter.js','usePendingPaymentPresenter',{
    orderModel:{paymentStatus:(number,token,signal)=>new Promise(resolve=>requests.push({number,token,signal,resolve}))}
  });
  t.after(()=>app.close());
  let p=app.render();await flush();p.trackWaitingOrder(order);p=app.render();
  const next={...order,order_number:'ORD-SYNTHETIC-2',payment_status_token:'b'.repeat(64)};
  p.trackWaitingOrder(next);p=app.render();
  assert.equal(requests[0].signal.aborted,true);
  requests[0].resolve({order_number:order.order_number,status:'paid'});await flush();p=app.render();
  assert.equal(p.pendingOrder.order_number,next.order_number);
  requests[1].resolve({order_number:next.order_number,status:'waiting'});await flush();
});

test('A deleted order shows cancellation and stops polling until the user returns to menu',async t=>{
  const app=await harness('usePendingPaymentPresenter.js','usePendingPaymentPresenter',{
    orderModel:{async paymentStatus(){return {order_number:order.order_number,status:'deleted'};}}
  });
  t.after(()=>app.close());
  let p=app.render();await flush();p.trackWaitingOrder(order);app.render();await flush();p=app.render();
  assert.equal(p.paymentStatus,'deleted');assert.equal(p.paymentInstructionsOpen,true);
  assert.equal(app.timers.size,0);
  p.dismissCancelledPayment();p=app.render();assert.equal(p.pendingOrder,null);
});

test('Admin confirmation blocks duplicate clicks and refreshes orders only after payment succeeds',async t=>{
  let complete, paid=0, refreshed=0;const toasts=[];
  const props={token:'admin-one',active:true,onError(){},showToast:value=>toasts.push(value),onUpdated:()=>{refreshed++;}};
  const app=await harness('useWaitingPaymentsPresenter.js','useWaitingPaymentsPresenter',{
    waitingPaymentsModel:{
      async list(){return {payments:[order],hasMore:false};},
      pay(){paid++;return new Promise(resolve=>{complete=resolve;});},
      async remove(){throw Error('Not expected');}
    }
  },props);
  t.after(()=>app.close());
  app.render();await flush();let p=app.render();
  p.requestWaitingPaymentAction(order,'pay');p=app.render();assert.equal(paid,0);
  const sending=p.confirmWaitingPaymentAction();await p.confirmWaitingPaymentAction();
  assert.equal(paid,1);assert.equal(refreshed,0);
  complete({success:true,status:'paid'});await sending;p=app.render();
  assert.equal(refreshed,1);assert.equal(toasts.length,1);assert.equal(p.waitingConfirmation,null);
});

test('A late admin result does not alter another authenticated session',async t=>{
  let complete;const toasts=[];
  const base={token:'admin-one',active:true,onError(){},showToast:msg=>toasts.push(msg)};
  const app=await harness('useWaitingPaymentsPresenter.js','useWaitingPaymentsPresenter',{
    waitingPaymentsModel:{async list(){return {payments:[order],hasMore:false};},
      remove:()=>new Promise(resolve=>{complete=resolve;})}
  },base);
  t.after(()=>app.close());
  app.render();await flush();let p=app.render();
  p.requestWaitingPaymentAction(order,'delete');p=app.render();const sending=p.confirmWaitingPaymentAction();
  app.render({...base,token:'admin-two'});
  complete({success:true,status:'deleted'});await sending;p=app.render();
  assert.equal(toasts.length,0);assert.equal(p.waitingConfirmation,null);assert.equal(p.waitingPending,false);
});


test('The admin entry does not restore the customer payment blocker',async t=>{
  const app=await harness('usePendingPaymentPresenter.js','usePendingPaymentPresenter',{
    orderModel:{paymentStatus(){assert.fail('Admin page should not restore a user blocker');}}
  },{restore:false});
  t.after(()=>app.close());
  app.storage.set('ogi_waiting_payment',JSON.stringify(order));
  app.render();await flush();const p=app.render();
  assert.equal(p.pendingOrder,null);assert.equal(p.paymentInstructionsOpen,false);
  assert.equal(app.storage.size,1);
});
