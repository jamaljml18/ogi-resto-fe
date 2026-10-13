'use client';
import { useState,useEffect,useMemo,useRef,useCallback } from 'react';
import { kasbonModel,buildKasbonMatrix } from '../models/kasbonModel';
import { orderModel } from '../models/orderModel';
import { jakartaIsoDate } from '../models/dateModel';
export function useKasbonPresenter({ token,isLoggedIn,onError,showToast }) {
  const [initialPeriod] = useState(() => jakartaIsoDate().split('-'));
  const [kasbonMonth,updateKasbonMonth] = useState(Number(initialPeriod[1]));
  const [kasbonYear,updateKasbonYear] = useState(Number(initialPeriod[0]));
  const [kasbonCompany,updateKasbonCompany] = useState('Semua');
  const [kasbonDivision,updateKasbonDivision] = useState('Semua');
  const [report,setReport] = useState({ key:'',rows:[],orders:[] });
  const [failure,setFailure] = useState({key:'',message:''});
  const [savingPayments,setSavingPayments] = useState({});
  const inFlight = useRef(new Set());
  const setKasbonMonth = useCallback(value => {
    if (value === kasbonMonth) return;
    setReport({key:'',rows:[],orders:[]});setFailure({key:'',message:''});
    updateKasbonMonth(value);
  },[kasbonMonth]);
  const setKasbonYear = useCallback(value => {
    if (value === kasbonYear) return;
    setReport({key:'',rows:[],orders:[]});setFailure({key:'',message:''});
    updateKasbonYear(value);
  },[kasbonYear]);
  const setKasbonCompany = useCallback(value => {
    if (value === kasbonCompany) return;
    setReport({key:'',rows:[],orders:[]});setFailure({key:'',message:''});
    updateKasbonCompany(value);
  },[kasbonCompany]);
  const setKasbonDivision = useCallback(value => {
    if (value === kasbonDivision) return;
    setReport({key:'',rows:[],orders:[]});setFailure({key:'',message:''});
    updateKasbonDivision(value);
  },[kasbonDivision]);
  const queryKey = JSON.stringify([token,kasbonMonth,kasbonYear,kasbonCompany,kasbonDivision]);
  useEffect(() => {
    if (!isLoggedIn) return;
    const controller = new AbortController();
    kasbonModel.getReport({month:kasbonMonth,year:kasbonYear,company:kasbonCompany,division:kasbonDivision},token,controller.signal)
      .then(data => {
        if (!controller.signal.aborted) {
          setReport({key:queryKey,rows:data.rows,orders:data.orders});
          setFailure({key:queryKey,message:''});
        }
      }).catch(error => {
        if (!controller.signal.aborted) {
          setFailure({key:queryKey,message:error.message});onError(error);
        }
      });
    return () => controller.abort();
  },[isLoggedIn,token,kasbonMonth,kasbonYear,kasbonCompany,kasbonDivision,queryKey,onError]);
  const loaded = isLoggedIn && report.key === queryKey && !(failure.key === queryKey && failure.message);
  const rows = useMemo(() => loaded ? report.rows : [],[loaded,report.rows]);
  const kasbonOrders = loaded ? report.orders : [];
  const monthlyKasbonMatrix = useMemo(() => buildKasbonMatrix(rows,kasbonMonth,kasbonYear),[rows,kasbonMonth,kasbonYear]);
  const handleToggleKasbonPayment = async (row,isPaid) => {
    const operationKey = queryKey + row.employeeKey;
    if (!loaded || row.totalKasbon <= 0 || inFlight.current.has(operationKey)) return;
    inFlight.current.add(operationKey);
    setSavingPayments(prev => ({...prev,[row.employeeKey]:true}));
    try {
      const { payment } = await kasbonModel.setPayment({
        month:kasbonMonth,year:kasbonYear,employeeKey:row.employeeKey,isPaid
      },token);
      setReport(prev => prev.key !== queryKey ? prev : {...prev,rows:prev.rows.map(item =>
        item.employeeKey === row.employeeKey ? {...item,isPaid:payment.is_paid,paidAt:payment.paid_at} : item)});
      showToast(isPaid ? 'Pelunasan kasbon berhasil dicatat.' : 'Status dikembalikan menjadi belum lunas.');
    } catch (error) { onError(error); }
    finally {
      inFlight.current.delete(operationKey);
      setSavingPayments(prev => {const next={...prev};delete next[row.employeeKey];return next;});
    }
  };
  const handleExportKasbonCsv = async () => {
    try { await orderModel.exportKasbonCsv({month:kasbonMonth,year:kasbonYear,company:kasbonCompany,division:kasbonDivision},token); }
    catch(error) {onError(error);}
  };
  return {kasbonMonth,setKasbonMonth,kasbonYear,setKasbonYear,kasbonCompany,setKasbonCompany,
    kasbonDivision,setKasbonDivision,kasbonOrders,monthlyKasbonMatrix,savingPayments,handleToggleKasbonPayment,
    handleExportKasbonCsv,kasbonLoading:isLoggedIn && report.key !== queryKey && failure.key !== queryKey,
    kasbonError:failure.key === queryKey ? failure.message : ''};
}
