import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
const flush=()=>new Promise(resolve=>setImmediate(resolve));
const modelSource=await readFile(new URL('../app/models/orderEditModel.js',import.meta.url),'utf8');
const {createOrderEditDraft,calculateOrderEdit}=await import('data:text/javascript;base64,'+Buffer.from(modelSource).toString('base64'));
const menus=[{id:'a',name:'Menu A',price:4000,is_active:true},{id:'b',name:'Menu B',price:7000,is_active:true}];
const order={order_number:'ORD-EDITOR',revision:2,user_name:'Budi',company:'PT A',division:'HR',total_price:3000,items:[{name:'Menu A',qty:1,price:3000}]};
const props={token:'synthetic',active:true,onError(){},showToast(){},onSaved(){}};
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

test('Legacy names match only a unique current menu and all preview prices use the master',()=>{
 const draft=createOrderEditDraft(order,menus),result=calculateOrderEdit(draft,menus);
 assert.equal(draft[0].id,'a');assert.equal(result.total,4000);assert.equal(result.items[0].expectedPrice,4000);
 assert.equal(createOrderEditDraft(order,[...menus,{id:'duplicate',name:'Menu A',price:1}])[0].id,'');
 assert.ok(calculateOrderEdit([{key:1,id:'a',qty:'0'}],menus).error);
 assert.ok(calculateOrderEdit([{key:1,id:'a',qty:'1'},{key:2,id:'a',qty:'1'}],menus).error);
});
test('Editor previews replacement total and sends only IDs, quantities, expected prices and revision',async t=>{
 let request,saved;const app=await harness('useOrderEditorPresenter.js','useOrderEditorPresenter',{
 createOrderEditDraft,calculateOrderEdit,orderModel:{async getOrderForEditing(){return {order,menus}},async editOrderItems(number,body,token){request={number,body,token};return {success:true,order:{...order,total_price:14000,revision:3}}}}
 },{...props,onSaved:value=>{saved=value}});t.after(()=>app.close());
 let p=app.render();await p.openOrderEditor('ORD-EDITOR');p=app.render();
 assert.equal(p.orderEditorTotal,4000);
 p.updateOrderEditorLine(1,'id','b');p.updateOrderEditorLine(1,'qty','2');p=app.render();
 assert.equal(p.orderEditorTotal,14000);await p.saveOrderEditor({preventDefault(){}});
 assert.deepEqual(JSON.parse(JSON.stringify(request.body)),{revision:2,items:[{id:'b',qty:2,expectedPrice:7000}]});
 assert.equal(saved.total_price,14000);assert.equal(app.render().orderEditor,null);
});
test('Repeated save clicks send one request, and closing is blocked until save completes',async t=>{
 let resolve,calls=0;const app=await harness('useOrderEditorPresenter.js','useOrderEditorPresenter',{
 createOrderEditDraft,calculateOrderEdit,orderModel:{async getOrderForEditing(){return {order,menus}},editOrderItems(){calls++;return new Promise(done=>{resolve=done})}}
 },props);t.after(()=>app.close());
 let p=app.render();await p.openOrderEditor('ORD-EDITOR');p=app.render();
 const pending=p.saveOrderEditor();await p.saveOrderEditor();p.closeOrderEditor();
 assert.equal(calls,1);assert.ok(app.render().orderEditor);
 resolve({success:true,order:{...order,revision:3}});await pending;assert.equal(app.render().orderEditor,null);
});
test('Conflict keeps the draft and requires a deliberate reload; late closed requests are ignored',async t=>{
 let load,attempts=0;const app=await harness('useOrderEditorPresenter.js','useOrderEditorPresenter',{
 createOrderEditDraft,calculateOrderEdit,orderModel:{getOrderForEditing(){attempts++;return attempts===1?Promise.resolve({order,menus}):new Promise(resolve=>{load=resolve})},async editOrderItems(){throw Object.assign(Error('Pesanan berubah'),{status:409})}}
 },props);t.after(()=>app.close());
 let p=app.render();await p.openOrderEditor('ORD-EDITOR');p=app.render();p.updateOrderEditorLine(1,'qty','3');p=app.render();
 await p.saveOrderEditor();p=app.render();assert.equal(p.orderEditor.draft[0].qty,'3');assert.match(p.orderEditor.error,/berubah/);
 const pending=p.reloadOrderEditor();p=app.render();p.closeOrderEditor();load({order,menus});await pending;assert.equal(app.render().orderEditor,null);
});
test('A response from a previous admin session cannot save or reopen the current editor',async t=>{
 let resolve,saved=0;const app=await harness('useOrderEditorPresenter.js','useOrderEditorPresenter',{
 createOrderEditDraft,calculateOrderEdit,orderModel:{async getOrderForEditing(){return {order,menus}},editOrderItems(){return new Promise(done=>{resolve=done})}}
 },{...props,onSaved(){saved++}});t.after(()=>app.close());
 let p=app.render();await p.openOrderEditor('ORD-EDITOR');p=app.render();const pending=p.saveOrderEditor();
 app.render({...props,token:'different-admin'});resolve({success:true,order});await pending;
 assert.equal(app.render().orderEditor,null);assert.equal(saved,0);
});
