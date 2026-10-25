'use client';

import { useEffect, useRef, useState } from 'react';
import { waitingPaymentsModel } from '../models/waitingPaymentsModel';

export function useWaitingPaymentsPresenter({ token, active, onError, showToast, onUpdated }) {
  const [page, setPage] = useState(1);
  const [revision, setRevision] = useState(0);
  const [result, setResult] = useState({ payments: [], hasMore: false, key: '', error: '' });
  const [confirmation, setConfirmation] = useState(null);
  const [busy, setBusy] = useState(null);
  const [actionError, setActionError] = useState('');
  const locked = useRef(false);
  const session = useRef(null);
  const key = token + ':' + page + ':' + revision;
  const pending = busy?.token === token;
  const target = confirmation?.token === token ? confirmation : null;

  useEffect(() => {
    const identity = { valid: true };
    session.current = identity;
    return () => { identity.valid = false; };
  }, [token, active]);

  useEffect(() => {
    if (!active || !token) return;
    let disposed = false, timer;
    const controller = new AbortController();
    async function load() {
      try {
        const data = await waitingPaymentsModel.list(page, token, controller.signal);
        if (disposed) return;
        if (!data.payments.length && page > 1) { setPage(value => value - 1); return; }
        setResult({ ...data, key, error: '' });
      } catch (error) {
        if (disposed || controller.signal.aborted) return;
        setResult({ payments: [], hasMore: false, key, error: error.message });
        onError(error);
      } finally {
        if (!disposed) timer = setTimeout(load, 5000);
      }
    }
    void load();
    return () => { disposed = true; clearTimeout(timer); controller.abort(); };
  }, [active, token, page, key, onError]);

  function select(order, action) {
    if (locked.current) return;
    setActionError(''); setConfirmation({ order, action, token });
  }
  async function confirm() {
    if (!target || locked.current || !active) return;
    const identity = session.current;
    locked.current = true; setBusy({ token, action: target.action }); setActionError('');
    try {
      const result = await (target.action === 'pay'
        ? waitingPaymentsModel.pay(target.order.order_number, token)
        : waitingPaymentsModel.remove(target.order.order_number, token));
      if (!result?.success) throw new Error('Perubahan belum dikonfirmasi oleh server.');
      if (!identity?.valid || session.current !== identity) return;
      setConfirmation(null); setRevision(value => value + 1);
      showToast(target.action === 'pay' ? 'Pembayaran dikonfirmasi. Pesanan masuk ke riwayat pesanan.' : 'Pesanan menunggu telah dihapus.');
      if (target.action === 'pay') void onUpdated?.();
    } catch (error) {
      if (!identity?.valid || session.current !== identity) return;
      setActionError(error.message); setRevision(value => value + 1); onError(error);
    } finally { locked.current = false; setBusy(null); }
  }
  return {
    waitingPayments: result.key === key ? result.payments : [],
    waitingLoading: active && result.key !== key, waitingError: result.key === key ? result.error : '',
    waitingPage: page, setWaitingPage: setPage, waitingHasMore: result.key === key && result.hasMore,
    waitingPending: pending, waitingConfirmation: target, waitingActionError: actionError,
    requestWaitingPaymentAction: select, confirmWaitingPaymentAction: confirm,
    cancelWaitingPaymentAction: () => { if (!locked.current) { setConfirmation(null); setActionError(''); } },
    refreshWaitingPayments: () => { if (!locked.current) setRevision(value => value + 1); }
  };
}
