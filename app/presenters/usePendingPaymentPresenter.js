'use client';

import { useEffect, useRef, useState } from 'react';
import { orderModel } from '../models/orderModel';

const STORAGE_KEY = 'ogi_waiting_payment';
const validPending = value => value && /^ORD-[A-Za-z0-9-]{1,46}$/.test(value.order_number || '') &&
  /^[a-f0-9]{64}$/.test(value.payment_status_token || '');

export function usePendingPaymentPresenter({ restore = true } = {}) {
  const [pendingOrder, setPendingOrder] = useState(null);
  const [paymentInstructionsOpen, setPaymentInstructionsOpen] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState('waiting');
  const [paymentStatusError, setPaymentStatusError] = useState('');
  const [confirmedOrderNumber, setConfirmedOrderNumber] = useState('');
  const [checkRevision, setCheckRevision] = useState(0);
  const current = useRef(null);
  const storageError = useRef('');

  function remember(order) {
    try {
      if (order) localStorage.setItem(STORAGE_KEY, JSON.stringify(order));
      else localStorage.removeItem(STORAGE_KEY);
      storageError.current = '';
    } catch {
      storageError.current = 'Penyimpanan browser tidak tersedia. Biarkan halaman ini terbuka hingga konfirmasi selesai.';
    }
  }

  useEffect(() => {
    if (!restore) return;
    let active = true;
    Promise.resolve().then(() => {
      if (!active || current.current) return;
      try {
        const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
        if (validPending(stored)) {
          current.current = stored;
          setPendingOrder(stored); setPaymentInstructionsOpen(true);
        }
      } catch { /* Invalid/disabled storage must not prevent the catalog from opening. */ }
    });
    return () => { active = false; };
  }, [restore]);

  useEffect(() => {
    if (!pendingOrder) return;
    const order = pendingOrder;
    let disposed = false, inFlight = false, terminal = false, timer;
    const controller = new AbortController();
    async function poll() {
      if (disposed || inFlight || terminal) return;
      clearTimeout(timer);
      if (typeof document !== 'undefined' && document.hidden) {
        timer = setTimeout(poll, 10000); return;
      }
      inFlight = true;
      try {
        const result = await orderModel.paymentStatus(order.order_number, order.payment_status_token, controller.signal);
        if (disposed || current.current !== order) return;
        if (result.order_number !== order.order_number || !['waiting', 'paid', 'deleted'].includes(result.status)) {
          throw new Error('Respons status tidak valid.');
        }
        setPaymentStatusError(storageError.current);
        setPaymentStatus(result.status);
        if (result.status === 'paid') {
          remember(null); current.current = null;
          setConfirmedOrderNumber(order.order_number);
          setPendingOrder(null); setPaymentInstructionsOpen(false);
          return;
        }
        if (result.status === 'deleted') {
          terminal = true; setPaymentInstructionsOpen(true);
          return;
        }
      } catch (error) {
        if (disposed || controller.signal.aborted) return;
        setPaymentStatusError('Status belum dapat diperiksa. Pesanan tetap menunggu; jangan membuat pesanan yang sama lagi. Sistem akan mencoba kembali.');
      } finally {
        inFlight = false;
        if (!disposed && !terminal && current.current === order) timer = setTimeout(poll, 5000);
      }
    }
    function visible() {
      if (!document.hidden) void poll();
    }
    void poll();
    document.addEventListener('visibilitychange', visible);
    return () => {
      disposed = true; clearTimeout(timer); controller.abort();
      document.removeEventListener('visibilitychange', visible);
    };
  }, [pendingOrder, checkRevision]);

  function trackWaitingOrder(order) {
    if (!validPending(order)) throw new Error('Token pemantauan pesanan tidak tersedia.');
    const saved = {
      order_number: order.order_number, payment_status_token: order.payment_status_token,
      user_name: order.user_name || order.userName, company: order.company, division: order.division,
      total_price: order.total_price ?? order.totalPrice, order_date: order.order_date
    };
    remember(saved); current.current = saved;
    setPendingOrder(saved); setPaymentStatus('waiting'); setPaymentStatusError(storageError.current);
    setConfirmedOrderNumber(''); setPaymentInstructionsOpen(false);
  }
  function showPaymentInstructions() {
    if (current.current) setPaymentInstructionsOpen(true);
  }
  function dismissCancelledPayment() {
    if (paymentStatus !== 'deleted') return;
    remember(null); current.current = null; setPendingOrder(null); setPaymentInstructionsOpen(false);
  }

  return { pendingOrder, paymentInstructionsOpen, paymentStatus, paymentStatusError, confirmedOrderNumber,
    trackWaitingOrder, showPaymentInstructions, dismissCancelledPayment,
    retryPaymentStatus: () => setCheckRevision(value => value + 1) };
}
