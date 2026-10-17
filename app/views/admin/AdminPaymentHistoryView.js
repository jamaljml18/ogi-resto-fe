'use client';

import { useEffect, useRef } from 'react';
import { dateLabel } from '../../models/dateModel';

export default function AdminPaymentHistoryView({
  paymentHistory, paymentHistoryLoading, historyError, historyMutationError,
  historyPage, setHistoryPage, historyHasMore, refreshPaymentHistory,
  paymentHistoryForm, setPaymentHistoryForm, editingPaymentHistoryId,
  paymentHistoryPending, paymentHistorySaving, paymentHistoryDeleting,
  handleSavePaymentHistory, startPaymentHistoryEdit, cancelPaymentHistoryEdit,
  paymentHistoryDeleteTarget, requestPaymentHistoryDelete, confirmPaymentHistoryDelete,
  cancelPaymentHistoryDelete, availableCompanies = [], availableDivisions = []
}) {
  const deleteConfirmation = useRef(null);
  useEffect(() => {
    if (paymentHistoryDeleteTarget) deleteConfirmation.current?.focus();
  }, [paymentHistoryDeleteTarget]);
  const disabled = paymentHistoryPending || paymentHistoryLoading;
  return (
    <section className="payment-history-panel">
      <div className="schedule-hero-banner">
        <div className="schedule-hero-title">
          <h3>Riwayat Pembayaran</h3>
          <p>Kelola catatan pembayaran manual dan pembayaran yang diterima dari WhatsApp.</p>
        </div>
        <button type="button" className="btn-outline-admin" disabled={disabled}
          onClick={refreshPaymentHistory}>Muat Ulang</button>
      </div>

      {historyMutationError && <p className="payment-history-error" role="alert">{historyMutationError}</p>}
      <form className="filter-card-panel payment-history-form" onSubmit={handleSavePaymentHistory}>
        <h4>{editingPaymentHistoryId ? 'Edit Riwayat Pembayaran' : 'Tambah Riwayat Pembayaran'}</h4>
        <p className="payment-history-form-note">Semua kolom wajib diisi. Gunakan tanggal pembayaran yang sesuai dengan bukti.</p>
        <fieldset disabled={paymentHistoryPending}>
          {[['user_name', 'Nama'], ['company', 'Perusahaan'], ['division', 'Divisi']].map(([field, label]) => (
            <label key={field} className="form-group">
              <span>{label}</span>
              <input id={'payment-history-' + field} className="form-input" required maxLength={255}
                list={field === 'company' ? 'payment-history-companies' : field === 'division' ? 'payment-history-divisions' : undefined}
                value={paymentHistoryForm[field]}
                onChange={event => setPaymentHistoryForm(previous => ({ ...previous, [field]: event.target.value }))} />
            </label>
          ))}
          <label className="form-group">
            <span>Tanggal Pembayaran</span>
            <input className="form-input" required type="date" min="0001-01-01" max="9999-12-31"
              value={paymentHistoryForm.payment_date}
              onChange={event => setPaymentHistoryForm(previous => ({ ...previous, payment_date: event.target.value }))} />
          </label>
          <div className="payment-history-form-actions">
            {editingPaymentHistoryId && <button type="button" className="btn-outline-admin"
              onClick={cancelPaymentHistoryEdit}>Batal Edit</button>}
            <button type="submit" className="btn-primary">
              {paymentHistorySaving ? 'Menyimpan...' : editingPaymentHistoryId ? 'Simpan Perubahan' : 'Tambah Pembayaran'}
            </button>
          </div>
        </fieldset>
        <datalist id="payment-history-companies">{availableCompanies.map(value => <option key={value} value={value} />)}</datalist>
        <datalist id="payment-history-divisions">{availableDivisions.map(value => <option key={value} value={value} />)}</datalist>
      </form>

      <details className="payment-history-help">
        <summary>Format pencatatan melalui WhatsApp</summary>
        <p>Kirim foto dengan caption berikut dalam satu pesan ke nomor penerima yang terhubung.</p>
        <pre>{'/bayar\nNama\nPerusahaan\nDivisi'}</pre>
        <p>Tanggal dari WhatsApp dicatat otomatis dalam WIB. Gunakan input manual jika pesan belum tercatat.</p>
      </details>

      {paymentHistoryDeleteTarget && <div ref={deleteConfirmation} tabIndex={-1} className="payment-history-delete-confirm" role="group" aria-labelledby="payment-delete-heading">
        <div>
          <h4 id="payment-delete-heading">Hapus riwayat pembayaran ini?</h4>
          <p><strong>{paymentHistoryDeleteTarget.user_name}</strong> · {paymentHistoryDeleteTarget.company} · {paymentHistoryDeleteTarget.division} · {dateLabel(paymentHistoryDeleteTarget.payment_date, true)}</p>
          <p>Catatan akan disembunyikan dari daftar riwayat.</p>
        </div>
        <div className="payment-history-row-actions">
          <button type="button" className="btn-outline-admin" disabled={paymentHistoryPending}
            onClick={cancelPaymentHistoryDelete}>Batal</button>
          <button type="button" className="payment-history-danger" disabled={paymentHistoryPending}
            onClick={confirmPaymentHistoryDelete}>{paymentHistoryDeleting ? 'Menghapus...' : 'Ya, Hapus'}</button>
        </div>
      </div>}

      {historyError && <p className="payment-history-error" role="alert">{historyError}</p>}
      <div className="admin-table-container" aria-busy={paymentHistoryLoading}>
        <table className="admin-table">
          <caption className="payment-history-caption">Riwayat pembayaran, diurutkan dari tanggal terbaru</caption>
          <thead><tr>{['No', 'Nama', 'Perusahaan', 'Divisi', 'Tanggal', 'Sumber', 'Aksi'].map(label => <th key={label} scope="col">{label}</th>)}</tr></thead>
          <tbody>
            {paymentHistoryLoading ? <tr><td colSpan={7}>Memuat riwayat pembayaran...</td></tr> :
              paymentHistory.length === 0 ? <tr><td colSpan={7}>{historyError ? 'Data belum dapat dimuat.' : 'Belum ada riwayat pembayaran.'}</td></tr> :
                paymentHistory.map((payment, index) => (
                  <tr key={payment.id} className={editingPaymentHistoryId === String(payment.id) ? 'payment-history-editing-row' : undefined}>
                    <td>{(historyPage - 1) * 50 + index + 1}</td>
                    <td>{payment.user_name}</td><td>{payment.company}</td><td>{payment.division}</td>
                    <td>{dateLabel(payment.payment_date, true)}</td>
                    <td><span className="payment-history-source">{payment.whatsapp_message_id ? 'WhatsApp' : 'Manual'}</span></td>
                    <td>
                      <div className="payment-history-row-actions payment-history-table-actions">
                        <button type="button" className="admin-row-action admin-row-action-edit" disabled={disabled}
                          aria-label={'Edit pembayaran ' + payment.user_name}
                          onClick={() => {
                            startPaymentHistoryEdit(payment);
                            document.getElementById('payment-history-user_name')?.focus();
                          }}><span className="admin-row-action-icon" aria-hidden="true">✏️</span><span>Edit</span></button>
                        <button type="button" className="admin-row-action admin-row-action-delete" disabled={disabled}
                          aria-label={'Hapus pembayaran ' + payment.user_name}
                          onClick={() => requestPaymentHistoryDelete(payment)}><span className="admin-row-action-icon" aria-hidden="true">🗑️</span><span>Hapus</span></button>
                      </div>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>
      <div className="payment-history-pagination">
        <button type="button" className="btn-outline-admin" disabled={historyPage <= 1 || disabled}
          onClick={() => setHistoryPage(page => page - 1)}>Sebelumnya</button>
        <span aria-live="polite">Halaman {historyPage}</span>
        <button type="button" className="btn-outline-admin" disabled={!historyHasMore || disabled}
          onClick={() => setHistoryPage(page => page + 1)}>Berikutnya</button>
      </div>
    </section>
  );
}
