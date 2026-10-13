'use client';
import { useState,useEffect } from 'react';
import { jakartaIsoDate,addDays,dayName,dateLabel } from '../models/dateModel';
export function useOrderSchedulePresenter() {
  const [orderMode,setOrderMode] = useState('today');
  const [todayIsoDate,setTodayIsoDate] = useState(jakartaIsoDate);
  const [customDate,setCustomDate] = useState(() => addDays(jakartaIsoDate(),2));
  useEffect(() => {
    const timer = setInterval(() => setTodayIsoDate(jakartaIsoDate()),10000);
    return () => clearInterval(timer);
  },[]);
  const tomorrowIsoDate = addDays(todayIsoDate,1);
  const defaultCustomIsoDate = addDays(todayIsoDate,2);
  const effectiveCustomDate = customDate && customDate >= tomorrowIsoDate ? customDate : defaultCustomIsoDate;
  const todayName = dayName(todayIsoDate),tomorrowName = dayName(tomorrowIsoDate),customDayName = dayName(effectiveCustomDate);
  return { orderMode,setOrderMode,todayIsoDate,tomorrowIsoDate,defaultCustomIsoDate,
    todayName,tomorrowName,todayDateStr:dateLabel(todayIsoDate),tomorrowDateStr:dateLabel(tomorrowIsoDate),
    customDate:effectiveCustomDate,setCustomDate,customDayName,customDateStr:dateLabel(effectiveCustomDate,true),
    activeSelectedDay:orderMode === 'today' ? todayName : orderMode === 'tomorrow' ? tomorrowName : customDayName };
}
