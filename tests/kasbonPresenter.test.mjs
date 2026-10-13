import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';
const matrixSource=await readFile(new URL('../app/models/kasbonReportModel.js',import.meta.url),'utf8');
const {buildKasbonMatrix}=await import('data:text/javascript;base64,'+Buffer.from(matrixSource).toString('base64'));
const source=(await readFile(new URL('../app/presenters/useKasbonPresenter.js',import.meta.url),'utf8'))
  .replace(/^import .*;$/gm,'').replace('export function','function');
const employee={employeeKey:'a'.repeat(64),userName:'Budi',company:'PT A',division:'HR',
  days:{},totalKasbon:250000,totalCash:80000,isPaid:false,paidAt:null};
function setup(setPayment) {
  const slots=[],effects=[],pendingEffects=[];
  let index=0;const errors=[];
  const stableError=error=>errors.push(error),stableToast=()=>{};
  const context={AbortController,JSON,Number,Set,
    jakartaIsoDate:()=> '2026-01-15',buildKasbonMatrix,
    orderModel:{exportKasbonCsv:async()=>{}},
    kasbonModel:{getReport:async()=>({rows:[{...employee}],orders:[]}),setPayment},
    useState:initial=>{
      const slot=index++;
      if (!(slot in slots)) slots[slot]=typeof initial==='function' ? initial() : initial;
      return [slots[slot],value=>{slots[slot]=typeof value==='function' ? value(slots[slot]) : value;}];
    },
    useRef:initial=>{const slot=index++;if (!(slot in slots)) slots[slot]={current:initial};return slots[slot];},
    useMemo:callback=>callback(),useCallback:callback=>callback,
    useEffect:(callback,deps)=>{
      const slot=index++,previous=effects[slot];
      if (!previous || deps.some((dep,i)=>dep!==previous.deps[i])) {
        previous?.cleanup?.();effects[slot]={deps};
        pendingEffects.push(()=>{effects[slot].cleanup=callback();});
      }
    }};
  vm.createContext(context);vm.runInContext(source+';globalThis.hook=useKasbonPresenter;',context);
  return {errors,render(){
    index=0;const result=context.hook({token:'synthetic',isLoggedIn:true,onError:stableError,showToast:stableToast});
    while(pendingEffects.length)pendingEffects.shift()();
    return result;
  }};
}
const flush=()=>new Promise(resolve=>setImmediate(resolve));
test('Payment toggle waits for server confirmation and prevents duplicate saves',async()=>{
  let resolve,calls=0;
  const app=setup(()=>{calls++;return new Promise(done=>{resolve=done;});});
  app.render();await flush();let p=app.render();
  const operation=p.handleToggleKasbonPayment(p.monthlyKasbonMatrix.rows[0],true);
  p=app.render();assert.equal(p.monthlyKasbonMatrix.rows[0].isPaid,false);
  assert.equal(p.savingPayments[employee.employeeKey],true);
  await p.handleToggleKasbonPayment(p.monthlyKasbonMatrix.rows[0],true);assert.equal(calls,1);
  resolve({payment:{is_paid:true,paid_at:'2026-02-03T00:00:00Z'}});await operation;
  p=app.render();assert.equal(p.monthlyKasbonMatrix.rows[0].isPaid,true);
  assert.equal(p.monthlyKasbonMatrix.totalKasbonAmount,250000);
});
test('Cloud failure preserves false payment status and surfaces error',async()=>{
  const app=setup(async()=>{throw Error('Supabase offline');});
  app.render();await flush();let p=app.render();
  await p.handleToggleKasbonPayment(p.monthlyKasbonMatrix.rows[0],true);p=app.render();
  assert.equal(p.monthlyKasbonMatrix.rows[0].isPaid,false);
  assert.equal(p.savingPayments[employee.employeeKey],undefined);
  assert.equal(app.errors[0].message,'Supabase offline');
});
test('Late January payment response cannot mark February paid',async()=>{
  let resolve;
  const app=setup(()=>new Promise(done=>{resolve=done;}));
  app.render();await flush();let p=app.render();
  const operation=p.handleToggleKasbonPayment(p.monthlyKasbonMatrix.rows[0],true);
  p.setKasbonMonth(2);p=app.render();
  assert.equal(p.monthlyKasbonMatrix.rows.length,0);
  await flush();p=app.render();
  resolve({payment:{is_paid:true,paid_at:'2026-02-03T00:00:00Z'}});await operation;
  p=app.render();assert.equal(p.kasbonMonth,2);assert.equal(p.monthlyKasbonMatrix.rows[0].isPaid,false);
});
