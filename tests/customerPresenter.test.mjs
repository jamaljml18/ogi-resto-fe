import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';
const cartSource=await readFile(new URL('../app/models/cartModel.js',import.meta.url),'utf8');
const {summarizeCart}=await import('data:text/javascript;base64,'+Buffer.from(cartSource).toString('base64'));
const hookSource=(await readFile(new URL('../app/presenters/useCustomerOrderPresenter.js',import.meta.url),'utf8'))
  .replace(/^import .*;$/gm,'').replace('export function','function');
const schedule={orderMode:'today',todayName:'Selasa',tomorrowName:'Rabu',customDayName:'Kamis',
  todayIsoDate:'2026-10-13',tomorrowIsoDate:'2026-10-14',customDate:'2026-10-15',defaultCustomIsoDate:'2026-10-15'};
function presenter(submitOrder,props={}) {
  const slots=[];let index=0;
  const context={orderModel:{submitOrder},summarizeCart,
    useMemo:callback=>callback(),
    useState:initial=>{
      const slot=index++;
      if (!(slot in slots)) slots[slot]=typeof initial==='function' ? initial() : initial;
      return [slots[slot],value=>{slots[slot]=typeof value==='function' ? value(slots[slot]) : value;}];
    },
    useRef:initial=>{
      const slot=index++;if (!(slot in slots)) slots[slot]={current:initial};return slots[slot];
    }};
  vm.createContext(context);
  vm.runInContext(hookSource+';globalThis.hook=useCustomerOrderPresenter;',context);
  let options={menus:[{id:'m-21',name:'Ayam balado',price:8000}],catalogReady:true,catalogError:'',schedule,...props};
  return {render(next={}){options={...options,...next};index=0;return context.hook(options);}};
}
const event={preventDefault(){}};
test('Cart uses current API menu identity and price',()=>{
  const app=presenter(async()=>{});let p=app.render();p.handleAddToCart('m-21');p=app.render();
  assert.equal(p.cartSummary.totalPrice,8000);assert.equal(p.cartSummary.itemsList[0].name,'Ayam balado');
});
test('Checkout failure preserves cart, never displays success and surfaces error',async()=>{
  const app=presenter(async()=>{throw Error('Database offline');});
  let p=app.render();p.handleAddToCart('m-21');p.setShowCheckoutModal(true);p=app.render();
  await p.handleSubmitOrder(event);p=app.render();
  assert.equal(p.cartSummary.totalItems,1);assert.equal(p.showSuccessModal,false);
  assert.equal(p.showCheckoutModal,true);assert.equal(p.lastSubmittedOrder,null);
  assert.equal(p.checkoutError,'Database offline');
});
test('Checkout blocks stale day catalog and duplicate submissions',async()=>{
  let submissions=0,complete;
  const app=presenter(()=>{submissions++;return new Promise(resolve=>{complete=resolve;});});
  let p=app.render();p.handleAddToCart('m-21');p=app.render({catalogReady:false});
  await p.handleSubmitOrder(event);assert.equal(submissions,0);
  p=app.render({catalogReady:true});
  const pending=p.handleSubmitOrder(event);
  await p.handleSubmitOrder(event);assert.equal(submissions,1);
  complete({success:true,order:{order_number:'synthetic'}});await pending;p=app.render();
  assert.equal(p.showSuccessModal,true);assert.equal(p.cartSummary.totalItems,0);
});
