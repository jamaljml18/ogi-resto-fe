'use client';
import AdminTableViewport from './AdminTableViewport';

import { useEffect, useRef } from 'react';
import { formatRupiah } from '../../models/initialData';
import { dateLabel } from '../../models/dateModel';

export default function AdminWaitingPaymentsView({
  waitingPayments, waitingLoading, waitingError, waitingPage, setWaitingPage, waitingHasMore,
  waitingPending, waitingConfirmation, waitingActionError, requestWaitingPaymentAction,
  confirmWaitingPaymentAction, cancelWaitingPaymentAction, refreshWaitingPayments
}) {
  const confirmBox = useRef(null);
  useEffect(() => { if (waitingConfirmation) confirmBox.current?.focus(); }, [waitingConfirmation]);
  return (
    <section>
      <div className="schedule-hero-banner">
        <div className="schedule-hero-title">
          <h3>Menunggu Pembayaran</h3>
          <p>Pesanan Cash / Transfer masuk ke riwayat pesanan setelah tombol Bayar atau laporan pembayaran yang cocok dikonfirmasi.</p>
        </div>
        <button type="button" className="btn-outline-admin" onClick={refreshWaitingPayments} disabled={waitingPending}>Muat Ulang</button>
      </div>
      {waitingConfirmation && <div ref={confirmBox} tabIndex={-1}
        className={'waiting-payment-confirm' + (waitingConfirmation.action === 'delete' ? ' is-delete' : '')}>
        <div>
          <h4>{waitingConfirmation.action === 'pay' ? 'Konfirmasi pembayaran pesanan ini?' : 'Hapus pesanan menunggu ini?'}</h4>
          <p><strong>{waitingConfirmation.order.user_name}</strong> · {waitingConfirmation.order.order_number}</p>
          <p>{waitingConfirmation.action === 'pay'
            ? 'Pastikan pembayaran sudah diterima. Pesanan akan dipindahkan ke Riwayat Pesanan & Laporan CSV.'
            : 'Pesanan akan dihapus dari daftar menunggu dan tidak masuk ke riwayat pesanan.'}</p>
        </div>
        <div className="payment-history-row-actions">
          <button type="button" className="admin-row-action btn-outline-admin" onClick={cancelWaitingPaymentAction} disabled={waitingPending}>Batal</button>
          <button type="button" className={'admin-row-action ' + (waitingConfirmation.action === 'pay' ? 'admin-row-action-edit' : 'admin-row-action-delete')}
            onClick={confirmWaitingPaymentAction} disabled={waitingPending}>
            {waitingPending ? 'Memproses...' : waitingConfirmation.action === 'pay' ? 'Bayar' : 'Hapus'}
          </button>
        </div>
      </div>}
      {(waitingError || waitingActionError) && <p className="payment-history-error" role="alert">{waitingActionError || waitingError}</p>}
      <AdminTableViewport aria-busy={waitingLoading} label="Tabel menunggu pembayaran">
        <table className="admin-table waiting-payments-table">
          <thead><tr>{['No. Pesanan', 'Pemesan', 'Jadwal Pengantaran', 'Kantor & Lokasi', 'Menu & Catatan', 'Total', 'Aksi'].map(label => <th key={label}>{label}</th>)}</tr></thead>
          <tbody>
            {waitingLoading ? <tr><td colSpan={7}>Memuat pesanan menunggu...</td></tr> :
              !waitingPayments.length ? <tr><td colSpan={7}>Tidak ada pesanan yang menunggu pembayaran.</td></tr> :
                waitingPayments.map(order => <tr key={order.order_number}>
                  <td><strong className="order-reference">{order.order_number}</strong><span className="waiting-payment-badge">Menunggu pembayaran</span></td>
                  <td><strong>{order.user_name}</strong><div className="order-secondary-text">Divisi: {order.division}</div></td>
                  <td>{dateLabel(order.order_date, true)}<div className="order-secondary-text">{order.order_day}</div></td>
                  <td><span className="order-company-badge">{order.company}</span><div className="order-location">{order.location}</div></td>
                  <td><ul className="order-menu-list">{(order.items || []).filter(item => item && !item._meta).map((item, index) =>
                    <li key={index}><span>{item.name}</span><span className="order-menu-quantity">×{item.qty}</span></li>)}</ul>
                    {order.notes && <p className="waiting-payment-notes">Catatan: {order.notes}</p>}</td>
                  <td><strong className="order-amount">{formatRupiah(order.total_price)}</strong></td>
                  <td><div className="payment-history-row-actions waiting-payment-actions">
                    <button type="button" className="admin-row-action admin-row-action-edit" disabled={waitingPending}
                      onClick={() => requestWaitingPaymentAction(order, 'pay')} aria-label={'Bayar pesanan ' + order.user_name}>
                      <span className="admin-row-action-icon" aria-hidden="true">💵</span><span>Bayar</span>
                    </button>
                    <button type="button" className="admin-row-action admin-row-action-delete" disabled={waitingPending}
                      onClick={() => requestWaitingPaymentAction(order, 'delete')} aria-label={'Hapus pesanan ' + order.user_name}>
                      <span className="admin-row-action-icon" aria-hidden="true">🗑️</span><span>Hapus</span>
                    </button>
                  </div></td>
                </tr>)}
          </tbody>
        </table>
      </AdminTableViewport>
      <div className="payment-history-pagination">
        <button type="button" className="btn-outline-admin" disabled={waitingPage <= 1 || waitingLoading || waitingPending}
          onClick={() => setWaitingPage(page => page - 1)}>Sebelumnya</button>
        <span>Halaman {waitingPage}</span>
        <button type="button" className="btn-outline-admin" disabled={!waitingHasMore || waitingLoading || waitingPending}
          onClick={() => setWaitingPage(page => page + 1)}>Berikutnya</button>
      </div>
    </section>
  );
}
