import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';

const source=(await readFile(new URL('../app/presenters/usePaymentHistoryPresenter.js',import.meta.url),'utf8'))
  .replace(/^import .*;$/gm,'').replace('export function','function');
const payment={id:1,user_name:'Budi',company:'PT A',division:'HR',payment_date:'2026-10-17'};
const flush=()=>new Promise(resolve=>setImmediate(resolve));
const event={preventDefault(){}};

function setup(overrides={}) {
  const slots=[],effects=[],queued=[],errors=[],toasts=[],calls=[];
  let index=0;
  let options={token:'session-1',active:true,onError:error=>errors.push(error),showToast:message=>toasts.push(message)};
  const model={
    list:async()=>({payments:[payment],hasMore:false}),
    create:async body=>{calls.push(['create',body]);return {success:true,payment:{id:2,...body}}},
    update:async(id,body)=>{calls.push(['update',id,body]);return {success:true,payment:{id,...body}}},
    remove:async id=>{calls.push(['remove',id]);return {success:true,payment:{id}}},
    ...overrides
  };
  const context={AbortController,paymentHistoryModel:model,jakartaIsoDate:()=> '2026-10-17',
    useState(initial){const slot=index++;if(!(slot in slots))slots[slot]=typeof initial==='function'?initial():initial;
      return [slots[slot],value=>{slots[slot]=typeof value==='function'?value(slots[slot]):value;}];},
    useRef(initial){const slot=index++;if(!(slot in slots))slots[slot]={current:initial};return slots[slot];},
    useEffect(callback,deps){const slot=index++,previous=effects[slot];
      if(!previous||deps.some((value,i)=>value!==previous.deps[i])){
        previous?.cleanup?.();effects[slot]={deps};queued.push(()=>{effects[slot].cleanup=callback();});
      }
    }};
  vm.createContext(context);vm.runInContext(source+';globalThis.hook=usePaymentHistoryPresenter;',context);
  return {errors,toasts,calls,render(next={}){
    options={...options,...next};index=0;const result=context.hook(options);
    while(queued.length)queued.shift()();
    return result;
  }};
}

test('Manual creation sends the chosen date and resets form only after server confirmation',async()=>{
  let complete,calls=0;
  const app=setup({create:body=>{calls++;assert.equal(body.payment_date,'2026-01-02');return new Promise(resolve=>{complete=resolve;});}});
  let p=app.render();await flush();p=app.render();
  p.setPaymentHistoryForm({...payment,payment_date:'2026-01-02'});p=app.render();
  const saving=p.handleSavePaymentHistory(event);
  await p.handleSavePaymentHistory(event);
  p=app.render();assert.equal(calls,1);assert.equal(p.paymentHistorySaving,true);
  assert.equal(p.paymentHistoryForm.user_name,'Budi');
  complete({success:true,payment});await saving;
  p=app.render();assert.equal(p.paymentHistoryForm.user_name,'');assert.equal(p.paymentHistorySaving,false);
  assert.equal(app.toasts.length,1);
});
test('Failed edit preserves edited fields and existing row for retry',async()=>{
  const app=setup({update:async()=>{throw Error('Database offline')}});
  app.render();await flush();let p=app.render();
  p.startPaymentHistoryEdit(payment);p=app.render();
  p.setPaymentHistoryForm(previous=>({...previous,user_name:'Budi Baru',payment_date:'2026-01-02'}));p=app.render();
  await p.handleSavePaymentHistory(event);p=app.render();
  assert.equal(p.editingPaymentHistoryId,'1');assert.equal(p.paymentHistoryForm.user_name,'Budi Baru');
  assert.equal(p.paymentHistory[0].user_name,'Budi');assert.equal(p.historyMutationError,'Database offline');
  assert.equal(app.toasts.length,0);
});
test('Delete requires confirmation and failure keeps row and confirmation available',async()=>{
  let calls=0;
  const app=setup({remove:async()=>{calls++;throw Error('Delete failed')}});
  app.render();await flush();let p=app.render();
  p.requestPaymentHistoryDelete(payment);p=app.render();assert.equal(calls,0);
  await p.confirmPaymentHistoryDelete();p=app.render();
  assert.equal(calls,1);assert.equal(p.paymentHistory.length,1);
  assert.equal(p.paymentHistoryDeleteTarget.id,1);assert.equal(p.historyMutationError,'Delete failed');
});
test('Deleting the final row on page two returns to the preceding page',async()=>{
  let removed=false;
  const app=setup({list:async page=>({payments:page===2&&removed?[]:[payment],hasMore:page===1}),
    remove:async()=>{removed=true;return {success:true}}});
  app.render();await flush();let p=app.render();
  p.setHistoryPage(2);app.render();await flush();p=app.render();
  p.requestPaymentHistoryDelete(payment);p=app.render();await p.confirmPaymentHistoryDelete();
  app.render();await flush();p=app.render();
  assert.equal(p.historyPage,1);await flush();p=app.render();
  assert.equal(p.paymentHistory.length,1);assert.equal(p.paymentHistoryDeleteTarget,null);
});
test('Late save response cannot clear another admin session form',async()=>{
  let complete;
  const app=setup({create:()=>new Promise(resolve=>{complete=resolve;})});
  app.render();await flush();let p=app.render();
  p.setPaymentHistoryForm(payment);p=app.render();const saving=p.handleSavePaymentHistory(event);
  p=app.render({token:'session-2'});assert.equal(p.paymentHistoryForm.user_name,'');
  complete({success:true,payment});await saving;p=app.render();
  assert.equal(app.toasts.length,0);assert.equal(p.paymentHistoryForm.user_name,'');
});

test('Applying filters returns to page one and editing draft does not trigger requests', async () => {
  const requests = [];
  const app = setup({ list: async (page, _token, _signal, filters) => {
    requests.push({ page, filters: JSON.parse(JSON.stringify(filters)) });
    return { payments: [payment], hasMore: true };
  } });
  app.render(); await flush(); let p = app.render();
  p.setHistoryPage(3); app.render(); await flush(); p = app.render();
  const previous = requests.length;
  p.setHistoryFilters(draft => ({ ...draft, search: ' Budi ', company: 'PT A', division: 'HR',
    dateFilterType: 'range', startDate: '2026-10-01', endDate: '2026-10-24' }));
  p = app.render(); await flush();
  assert.equal(requests.length, previous);
  p.applyHistoryFilters(event); app.render(); await flush(); p = app.render();
  assert.equal(p.historyPage, 1); assert.equal(p.historyFiltersActive, true);
  assert.deepEqual(requests.at(-1), { page: 1, filters: { search: 'Budi', company: 'PT A', division: 'HR',
    startDate: '2026-10-01', endDate: '2026-10-24' } });
  p.resetHistoryFilters(); app.render(); await flush(); p = app.render();
  assert.deepEqual(requests.at(-1).filters, {});
  assert.equal(p.historyFilters.search, ''); assert.equal(p.historyFiltersActive, false);
});

test('Invalid ranges keep applied data and do not submit a new filter request', async () => {
  let count = 0;
  const app = setup({ list: async () => { count++; return { payments: [payment], hasMore: false }; } });
  app.render(); await flush(); let p = app.render();
  p.setHistoryFilters(draft => ({ ...draft, dateFilterType: 'range', startDate: '2026-10-25', endDate: '2026-10-01' }));
  p = app.render(); p.applyHistoryFilters(event); p = app.render();
  assert.match(p.historyFilterError, /Tanggal awal/); assert.equal(count, 1);
  assert.equal(p.paymentHistory.length, 1);
});

test('A late response from old filters cannot overwrite the newly filtered list', async () => {
  const requests = [];
  const app = setup({ list: (page, token, signal, filters) => new Promise(resolve => {
    requests.push({ page, token, signal, filters, resolve });
  }) });
  let p = app.render();
  p.setHistoryFilters(draft => ({ ...draft, search: 'Newest' }));
  p = app.render(); p.applyHistoryFilters(event); app.render();
  assert.equal(requests.length, 2); assert.equal(requests[0].signal.aborted, true);
  requests[1].resolve({ payments: [{ ...payment, user_name: 'Newest' }], hasMore: false });
  await flush(); p = app.render(); assert.equal(p.paymentHistory[0].user_name, 'Newest');
  requests[0].resolve({ payments: [payment], hasMore: false });
  await flush(); p = app.render(); assert.equal(p.paymentHistory[0].user_name, 'Newest');
});

test('Month period and today filters use the selected month and Jakarta date', async () => {
  const requests = [];
  const app = setup({ list: async (_page, _token, _signal, filters) => {
    requests.push(JSON.parse(JSON.stringify(filters))); return { payments: [], hasMore: false };
  } });
  app.render(); await flush(); let p = app.render();
  p.setHistoryFilters(draft => ({ ...draft, dateFilterType: 'month_year', periodMonth: '2024-02' }));
  p = app.render(); p.applyHistoryFilters(event); app.render(); await flush(); p = app.render();
  assert.equal(requests.at(-1).month, '02'); assert.equal(requests.at(-1).year, '2024');
  p.setHistoryFilters(draft => ({ ...draft, dateFilterType: 'today' }));
  p = app.render(); p.applyHistoryFilters(event); app.render(); await flush();
  assert.equal(requests.at(-1).date, '2026-10-17');
  assert.equal(requests.at(-1).month, undefined);
});
