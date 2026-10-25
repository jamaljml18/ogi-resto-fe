"use client";
import { useEffect, useRef } from 'react';
import { formatRupiah } from '../../models/initialData';

export default function AdminOrderEditor({orderEditor:editor,orderEditorSaving:saving,orderEditorLines:lines,
  orderEditorTotal:total,orderEditorValidation:validation,closeOrderEditor,reloadOrderEditor,
  updateOrderEditorLine,addOrderEditorLine,removeOrderEditorLine,saveOrderEditor}) {
  const dialog = useRef(null);
  useEffect(() => {
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden'; dialog.current?.focus();
    return () => { document.body.style.overflow = previousOverflow; previousFocus?.focus?.(); };
  }, []);
  function handleKeys(event) {
    if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); if (!saving) closeOrderEditor(); }
    if (event.key !== 'Tab') return;
    const elements = [...dialog.current.querySelectorAll('button:not([disabled]),select:not([disabled]),input:not([disabled])')];
    const first = elements[0], last = elements[elements.length - 1];
    if (!first) { event.preventDefault(); return; }
    if (event.shiftKey && (document.activeElement === first || document.activeElement === dialog.current)) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  }
  const difference = editor.order ? total - Number(editor.order.total_price) : 0;
  return (
    <div className="modal-overlay order-editor-overlay">
      <section ref={dialog} tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby="order-editor-heading"
        aria-describedby="order-editor-description" className="order-editor-dialog" onKeyDown={handleKeys}>
        <header className="order-editor-header">
          <div><p>Edit pesanan</p><h2 id="order-editor-heading">Ganti Menu Pesanan</h2></div>
          <button type="button" className="order-editor-close" disabled={saving} onClick={closeOrderEditor} aria-label="Tutup editor pesanan">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" /></svg>
          </button>
        </header>
        <form onSubmit={saveOrderEditor} className="order-editor-form">
          <div className="order-editor-body" aria-busy={editor.loading || saving}>
            <p id="order-editor-description">Pilih menu pengganti dan jumlahnya. Semua menu dihitung ulang menggunakan harga master terbaru.</p>
            {editor.loading && <p role="status" className="notice">Memuat pesanan dan harga menu...</p>}
            {editor.order && <>
              <div className="order-editor-customer"><strong>{editor.order.user_name}</strong>
                <span>{editor.order.company} / {editor.order.division}</span>
                <span className="order-editor-number">{editor.order.order_number}</span>
              </div>
              <fieldset disabled={saving} className="order-editor-items">
                {lines.map((line,index) => <div className="order-editor-item" key={line.key}>
                  <div className="order-editor-item-heading"><strong>Menu {index+1}</strong>
                    <button type="button" className="order-editor-remove" disabled={lines.length <= 1}
                      onClick={() => removeOrderEditorLine(line.key)} aria-label={'Hapus menu ' + (index+1)}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><path d="M3 6h18M9 6V3h6v3M5 6l1 15h12l1-15M10 10v7M14 10v7" /></svg> Hapus
                    </button>
                  </div>
                  {!line.id && line.originalName && <p className="order-editor-missing">Menu lama: {line.originalName}. Pilih menu yang tersedia sebagai pengganti.</p>}
                  <div className="order-editor-fields">
                    <label>Menu<select className="form-input" required value={line.id} onChange={event => updateOrderEditorLine(line.key,'id',event.target.value)}>
                      <option value="">Pilih menu</option>
                      {editor.menus.map(menu => <option key={menu.id} value={menu.id}>{menu.name} - {formatRupiah(menu.price)}</option>)}
                    </select></label>
                    <label>Jumlah<input className="form-input" type="number" inputMode="numeric" required min="1" max="999" step="1" value={editor.draft.find(value=>value.key===line.key)?.qty || ''}
                      onChange={event => updateOrderEditorLine(line.key,'qty',event.target.value)} /></label>
                  </div>
                  <div className="order-editor-line-total"><span>{line.menu ? formatRupiah(line.menu.price) + ' / porsi' : 'Harga mengikuti menu yang dipilih'}</span><strong>{formatRupiah(line.subtotal)}</strong></div>
                </div>)}
              </fieldset>
              <button type="button" className="btn-outline-admin order-editor-add" disabled={saving || lines.length >= 50} onClick={addOrderEditorLine}>+ Tambah Menu</button>
              {validation && <p className="order-editor-missing" role="status">{validation}</p>}
              {difference !== 0 && editor.order.payment_method !== 'Kasbon' && <p className="order-editor-payment-note">Total berubah {difference>0 ? '+' : ''}{formatRupiah(difference)}. Cocokkan selisih pembayaran dengan pelanggan; perubahan ini tidak melakukan transfer atau pengembalian dana.</p>}
            </>}
            {editor.error && <div className="order-editor-error" role="alert"><p>{editor.error}</p>
              <button type="button" className="btn-outline-admin" disabled={saving} onClick={reloadOrderEditor}>Muat Ulang Pesanan & Harga</button>
            </div>}
          </div>
          <footer className="order-editor-footer">
            <div className="order-editor-totals"><span>Total sebelumnya: {formatRupiah(editor.order?.total_price || 0)}</span>
              <div><span>Total baru</span><strong>{formatRupiah(total)}</strong></div>
            </div>
            <div className="order-editor-actions"><button type="button" className="btn-outline-admin" disabled={saving} onClick={closeOrderEditor}>Batal</button>
              <button type="submit" className="btn-primary" disabled={saving || editor.loading || !editor.order || Boolean(validation)}>{saving ? 'Menyimpan...' : 'Simpan Perubahan'}</button></div>
          </footer>
        </form>
      </section>
    </div>
  );
}
