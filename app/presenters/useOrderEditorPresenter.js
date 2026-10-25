"use client";
import { useEffect, useRef, useState } from 'react';
import { orderModel } from '../models/orderModel';
import { createOrderEditDraft, calculateOrderEdit } from '../models/orderEditModel';

export function useOrderEditorPresenter({ token, active, onError, onSaved, showToast }) {
  const [editor, setEditor] = useState(null);
  const [saving, setSaving] = useState(false);
  const generation = useRef(0), controller = useRef(null), locked = useRef(false), nextKey = useRef(100);
  useEffect(() => () => { generation.current++; controller.current?.abort(); }, [token, active]);
  const visible = active && editor?.token === token ? editor : null;
  const calculated = calculateOrderEdit(visible?.draft || [], visible?.menus || []);

  async function openOrderEditor(number) {
    if (!active || !token || locked.current) return;
    const request = ++generation.current; controller.current?.abort();
    const abort = new AbortController(); controller.current = abort;
    setEditor({number,token,loading:true,order:null,menus:[],draft:[],error:''});
    try {
      const data = await orderModel.getOrderForEditing(number, token, abort.signal);
      if (request !== generation.current || abort.signal.aborted) return;
      if (!data.order || !Number.isSafeInteger(Number(data.order.revision)) || !Array.isArray(data.menus)) throw new Error('Data editor belum lengkap. Periksa migrasi 007 dan muat ulang.');
      nextKey.current = 100;
      setEditor({number,token,loading:false,order:data.order,menus:data.menus,
        draft:createOrderEditDraft(data.order,data.menus),error:''});
    } catch (error) {
      if (request !== generation.current || abort.signal.aborted) return;
      setEditor(previous => ({...previous,loading:false,error:error.message})); onError(error);
    }
  }
  function closeOrderEditor() {
    if (locked.current) return;
    generation.current++; controller.current?.abort(); setEditor(null);
  }
  function updateOrderEditorLine(key, field, value) {
    if (locked.current || !['id','qty'].includes(field)) return;
    setEditor(previous => previous ? {...previous,error:'',draft:previous.draft.map(line => line.key === key ? {...line,[field]:value} : line)} : previous);
  }
  function addOrderEditorLine() {
    if (locked.current) return;
    const key = ++nextKey.current;
    setEditor(previous => previous && previous.draft.length < 50 ? {...previous,error:'',draft:[...previous.draft,{key,id:'',qty:'1',originalName:''}]} : previous);
  }
  function removeOrderEditorLine(key) {
    if (locked.current) return;
    setEditor(previous => previous && previous.draft.length > 1 ? {...previous,error:'',draft:previous.draft.filter(line => line.key !== key)} : previous);
  }
  async function saveOrderEditor(event) {
    event?.preventDefault();
    if (!visible?.order || visible.loading || calculated.error || locked.current) return;
    locked.current = true; setSaving(true); const request = generation.current;
    setEditor(previous => ({...previous,error:''}));
    try {
      const result = await orderModel.editOrderItems(visible.number,{revision:Number(visible.order.revision),items:calculated.items},token);
      if (!result.success || !result.order) throw new Error('Perubahan belum dikonfirmasi server. Muat ulang riwayat sebelum mencoba lagi.');
      if (request !== generation.current) return;
      setEditor(null); showToast('Menu pesanan diperbarui. Total dihitung ulang oleh server.');
      await onSaved?.(result.order);
    } catch (error) {
      if (request !== generation.current) return;
      setEditor(previous => previous ? {...previous,error:error.message} : previous); onError(error);
    } finally { locked.current = false; setSaving(false); }
  }
  return { orderEditor:visible, orderEditorSaving:saving, orderEditorLines:calculated.lines,
    orderEditorTotal:calculated.total, orderEditorValidation:calculated.error,
    openOrderEditor,closeOrderEditor,updateOrderEditorLine,addOrderEditorLine,removeOrderEditorLine,
    saveOrderEditor,reloadOrderEditor:() => visible && openOrderEditor(visible.number) };
}
