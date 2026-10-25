import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';
import React from 'react';
import {renderToString} from 'react-dom/server';
const source=(await readFile(new URL('../app/presenters/useOrderSchedulePresenter.js',import.meta.url),'utf8'))
  .replace(/^import .*;$/gm,'').replace('export function','function');
const dateSource=await readFile(new URL('../app/models/dateModel.js',import.meta.url),'utf8');
const dates=await import('data:text/javascript;base64,'+Buffer.from(dateSource).toString('base64'));
function hook(context) {
  vm.createContext(context);vm.runInContext(source+';globalThis.hook=useOrderSchedulePresenter;',context);return context.hook;
}
test('Static schedule markup matches across build and browser dates without reading the clock during render',()=>{
  function html(day) {
    let clockReads=0;
    const scheduleHook=hook({...dates,useState:React.useState,useEffect:React.useEffect,
      jakartaIsoDate:()=>{clockReads++;return day;}});
    function Fixture(){const s=scheduleHook();return React.createElement('p',null,s.todayName+', '+s.todayDateStr+' / '+s.tomorrowName+', '+s.tomorrowDateStr);}
    const result=renderToString(React.createElement(Fixture));assert.equal(clockReads,0);return result;
  }
  assert.equal(html('2026-10-25'),html('2026-10-26'));
  assert.equal(html('2026-12-31'),html('2027-01-01'));
});
test('After mounting schedule uses current Jakarta date, follows midnight and preserves a valid custom date',()=>{
  let day='2026-10-26',index=0,effect,frame,interval,cancelled=false,cleared=false;const slots=[];
  const scheduleHook=hook({...dates,jakartaIsoDate:()=>day,
    useState:initial=>{const i=index++;if(!(i in slots))slots[i]=initial;return [slots[i],value=>{slots[i]=value;}];},
    useEffect:fn=>{effect=fn;},requestAnimationFrame:fn=>{frame=fn;return 1;},cancelAnimationFrame:()=>{cancelled=true;},
    setInterval:(fn,ms)=>{assert.equal(ms,10000);interval=fn;return 2;},clearInterval:()=>{cleared=true;}});
  const render=()=>{index=0;return scheduleHook();};
  let s=render();assert.equal(s.activeSelectedDay,'');assert.equal(s.todayDateStr,'?');
  const cleanup=effect();frame();s=render();assert.equal(s.todayIsoDate,'2026-10-26');assert.equal(s.todayName,'Senin');
  assert.equal(s.tomorrowIsoDate,'2026-10-27');assert.equal(s.customDate,'2026-10-28');
  s.setCustomDate('2026-11-02');day='2026-10-27';interval();s=render();
  assert.equal(s.todayName,'Selasa');assert.equal(s.customDate,'2026-11-02');cleanup();assert.equal(cancelled&&cleared,true);
});
