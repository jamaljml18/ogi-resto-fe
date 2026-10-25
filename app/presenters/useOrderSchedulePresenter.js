'use client';
import { useState,useEffect } from 'react';
import { jakartaIsoDate,addDays,dayName,dateLabel } from '../models/dateModel';
export function useOrderSchedulePresenter() {
  const [orderMode,setOrderMode] = useState('today');
  // Static HTML and the first browser render must match even on different dates.
  const [todayIsoDate,setTodayIsoDate] = useState('');
  const [customDate,setCustomDate] = useState('');
  useEffect(() => {
    const updateDate = () => setTodayIsoDate(jakartaIsoDate());
    const frame = requestAnimationFrame(updateDate);
    const timer = setInterval(updateDate,10000);
    return () => { cancelAnimationFrame(frame); clearInterval(timer); };
  },[]);
  const tomorrowIsoDate = todayIsoDate ? addDays(todayIsoDate,1) : '';
  const defaultCustomIsoDate = todayIsoDate ? addDays(todayIsoDate,2) : '';
  const effectiveCustomDate = customDate && customDate >= tomorrowIsoDate ? customDate : defaultCustomIsoDate;
  const todayName = todayIsoDate ? dayName(todayIsoDate) : '';
  const tomorrowName = tomorrowIsoDate ? dayName(tomorrowIsoDate) : '';
  const customDayName = effectiveCustomDate ? dayName(effectiveCustomDate) : '';
  return { orderMode,setOrderMode,todayIsoDate,tomorrowIsoDate,defaultCustomIsoDate,
    todayName,tomorrowName,todayDateStr:todayIsoDate ? dateLabel(todayIsoDate) : '?',tomorrowDateStr:tomorrowIsoDate ? dateLabel(tomorrowIsoDate) : '?',
    customDate:effectiveCustomDate,setCustomDate,customDayName,customDateStr:effectiveCustomDate ? dateLabel(effectiveCustomDate,true) : '?',
    activeSelectedDay:orderMode === 'today' ? todayName : orderMode === 'tomorrow' ? tomorrowName : customDayName };
}
