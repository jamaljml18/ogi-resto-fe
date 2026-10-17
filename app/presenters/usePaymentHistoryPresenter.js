'use client';

import { useEffect, useRef, useState } from 'react';
import { paymentHistoryModel } from '../models/paymentHistoryModel';
import { jakartaIsoDate } from '../models/dateModel';

const emptyForm = () => ({ user_name: '', company: '', division: '', payment_date: jakartaIsoDate() });

export function usePaymentHistoryPresenter({ token, active, onError, showToast }) {
  const [historyPage, setHistoryPage] = useState(1);
  const [revision, setRevision] = useState(0);
  const [result, setResult] = useState({ payments: [], hasMore: false, key: '', error: '' });
  const [editor, setEditor] = useState(() => ({ token, id: null, form: emptyForm() }));
  const [deletion, setDeletion] = useState(null);
  const [busy, setBusy] = useState(null);
  const [mutationError, setMutationError] = useState(null);
  const locked = useRef(false);
  const epoch = useRef(null);
  const identity = token + ':' + historyPage + ':' + revision;
  const currentEditor = editor.token === token ? editor : { token, id: null, form: emptyForm() };
  const deleteTarget = deletion?.token === token ? deletion.payment : null;
  const pending = busy?.token === token;

  useEffect(() => {
    const session = { valid: true };
    epoch.current = session;
    return () => { session.valid = false; };
  }, [token, active]);

  useEffect(() => {
    if (!active || !token) return;
    const controller = new AbortController();
    paymentHistoryModel.list(historyPage, token, controller.signal).then(data => {
      if (controller.signal.aborted) return;
      if (!data.payments.length && historyPage > 1) {
        setHistoryPage(page => page - 1);
        return;
      }
      setResult({ ...data, key: identity, error: '' });
    }).catch(error => {
      if (controller.signal.aborted) return;
      setResult({ payments: [], hasMore: false, key: identity, error: error.message });
      onError(error);
    });
    return () => controller.abort();
  }, [active, token, historyPage, identity, onError]);

  function setPaymentHistoryForm(value) {
    if (locked.current) return;
    setEditor(previous => {
      const current = previous.token === token ? previous : { token, id: null, form: emptyForm() };
      return { ...current, form: typeof value === 'function' ? value(current.form) : value };
    });
  }

  function cancelPaymentHistoryEdit() {
    if (locked.current) return;
    setEditor({ token, id: null, form: emptyForm() });
    setMutationError(null);
  }

  function startPaymentHistoryEdit(payment) {
    if (locked.current) return;
    setEditor({ token, id: String(payment.id), form: {
      user_name: payment.user_name, company: payment.company,
      division: payment.division, payment_date: payment.payment_date
    } });
    setDeletion(null);
    setMutationError(null);
  }

  function requestPaymentHistoryDelete(payment) {
    if (locked.current) return;
    setDeletion({ token, payment });
    setMutationError(null);
  }

  async function mutate(action, operation, onSuccess, message) {
    if (!active || !token || locked.current) return;
    const currentEpoch = epoch.current;
    locked.current = true;
    setBusy({ token, action });
    setMutationError(null);
    try {
      const response = await operation();
      if (!response?.success) throw new Error('Perubahan belum dikonfirmasi oleh server.');
      if (!currentEpoch.valid || epoch.current !== currentEpoch) return;
      onSuccess();
      setRevision(value => value + 1);
      showToast?.(message);
    } catch (error) {
      if (!currentEpoch.valid || epoch.current !== currentEpoch) return;
      setMutationError({ token, message: error.message });
      onError(error);
    } finally {
      locked.current = false;
      setBusy(null);
    }
  }

  async function handleSavePaymentHistory(event) {
    event.preventDefault();
    const { id, form } = currentEditor;
    return mutate('save',
      () => id ? paymentHistoryModel.update(id, form, token) : paymentHistoryModel.create(form, token),
      () => {
        setEditor({ token, id: null, form: emptyForm() });
        setHistoryPage(1);
      },
      id ? 'Riwayat pembayaran berhasil diperbarui.' : 'Riwayat pembayaran berhasil ditambahkan.');
  }

  async function confirmPaymentHistoryDelete() {
    if (!deleteTarget) return;
    const id = String(deleteTarget.id);
    return mutate('delete', () => paymentHistoryModel.remove(id, token), () => {
      setDeletion(null);
      if (currentEditor.id === id) setEditor({ token, id: null, form: emptyForm() });
    }, 'Riwayat pembayaran berhasil dihapus.');
  }

  return {
    historyPage, setHistoryPage,
    historyError: result.key === identity ? result.error : '',
    historyMutationError: mutationError?.token === token ? mutationError.message : '',
    paymentHistory: result.key === identity ? result.payments : [],
    historyHasMore: result.key === identity && result.hasMore,
    paymentHistoryLoading: active && result.key !== identity,
    paymentHistoryForm: currentEditor.form, setPaymentHistoryForm,
    editingPaymentHistoryId: currentEditor.id,
    paymentHistoryPending: pending,
    paymentHistorySaving: pending && busy.action === 'save',
    paymentHistoryDeleting: pending && busy.action === 'delete',
    handleSavePaymentHistory, startPaymentHistoryEdit, cancelPaymentHistoryEdit,
    paymentHistoryDeleteTarget: deleteTarget, requestPaymentHistoryDelete, confirmPaymentHistoryDelete,
    cancelPaymentHistoryDelete: () => { if (!locked.current) { setDeletion(null); setMutationError(null); } },
    refreshPaymentHistory: () => { if (!locked.current) setRevision(value => value + 1); }
  };
}
