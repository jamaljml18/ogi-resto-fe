import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
async function sourceModule(file) {
  const source=await readFile(new URL('../app/models/'+file,import.meta.url),'utf8');
  return import('data:text/javascript;base64,'+Buffer.from(source).toString('base64'));
}
const dates=await sourceModule('dateModel.js');
const report=await sourceModule('kasbonReportModel.js');
const api=await sourceModule('apiClient.js');
test('Business date follows Jakarta at UTC date boundary and rolls across years',()=>{
  assert.equal(dates.jakartaIsoDate(new Date('2026-12-31T18:00:00Z')),'2027-01-01');
  assert.equal(dates.addDays('2026-12-31',1),'2027-01-01');
  assert.equal(dates.dayName('2026-10-13'),'Selasa');
});
test('Kasbon summary preserves historic amount and separately calculates unpaid balance',()=>{
  const result=report.buildKasbonMatrix([
    {totalKasbon:250000,totalCash:80000,isPaid:true},
    {totalKasbon:100000,totalCash:20000,isPaid:false}
  ],2,2024);
  assert.equal(result.totalKasbonAmount,350000);assert.equal(result.unpaidKasbonAmount,100000);
  assert.equal(result.totalCashAmount,100000);assert.equal(result.daysInMonth,29);
});
test('API surfaces backend validation errors and puts bearer token in header',async t=>{
  const original=globalThis.fetch;t.after(()=>{globalThis.fetch=original;});
  let request;
  globalThis.fetch=async(url,options)=>{request={url,options};
    return {ok:false,status:401,json:async()=>({error:'Sesi kedaluwarsa'})};};
  await assert.rejects(()=>api.apiRequest('/admin/kasbon',{token:'synthetic'}),error=>error.status===401 && error.message==='Sesi kedaluwarsa');
  assert.equal(request.options.headers.get('Authorization'),'Bearer synthetic');
  assert.ok(!request.url.includes('synthetic'));
});
test('Query filters encode names and omit all-values markers',()=>{
  const query=api.queryString({company:'PT A & B',division:'Semua',month:1});
  assert.equal(new URLSearchParams(query).get('company'),'PT A & B');
  assert.equal(new URLSearchParams(query).has('division'),false);
});

test('Daily totals use all three case-insensitive identity fields and retain date separation',async()=>{
 const {orderDailyIdentity,uniqueIdentityValues}=await sourceModule('identityModel.js');
 const a={user_name:' Hanan ',company:'PT Contoh',division:'HR',order_date:'2026-10-25'};
 const b={user_name:'hanan',company:'pt contoh',division:'hr',order_date:'2026-10-25'};
 assert.equal(orderDailyIdentity(a),orderDailyIdentity(b));
 assert.notEqual(orderDailyIdentity(a),orderDailyIdentity({...b,division:'IT'}));
 assert.notEqual(orderDailyIdentity(a),orderDailyIdentity({...b,order_date:'2026-10-26'}));
 assert.deepEqual(uniqueIdentityValues(['HR','hr',' Hr ','QA']),['HR','QA']);
 assert.equal(a.user_name,' Hanan ');
});


test('PT BMT aliases share the same company identity and canonical WhatsApp label',async()=>{
  const {normalizeCompany,orderDailyIdentity}=await sourceModule('identityModel.js');
  for(const company of ['pt bmt','PT Bright Mobile Telecommunication','pt bright mobile telecommuncation']) {
    assert.equal(normalizeCompany(company),'PT BMT');
    const order={user_name:'Hanan',company,division:'HR',order_date:'2026-10-25'};
    assert.equal(orderDailyIdentity(order),orderDailyIdentity({...order,company:'PT BMT'}));
  }
  assert.equal(normalizeCompany('PT Contoh'),'PT Contoh');
});
