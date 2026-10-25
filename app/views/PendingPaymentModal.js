'use client';

import { useEffect, useRef } from 'react';
import BankAccountDetails from './BankAccountDetails';
import WhatsappPaymentConfirmation from './WhatsappPaymentConfirmation';
import { formatRupiah } from '../models/initialData';

export default function PendingPaymentModal({ order, isOpen, status, error, onRetry, onCancelled }) {
  const dialog = useRef(null);
  useEffect(() => {
    if (!isOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const node = dialog.current;
    node?.focus();
    const trap = event => {
      if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); }
      if (event.key !== 'Tab' || !node) return;
      const items = [...node.querySelectorAll('a[href],button:not([disabled]),textarea,input')];
      if (!items.length) { event.preventDefault(); return; }
      const first = items[0], last = items[items.length - 1];
      if (event.shiftKey && (document.activeElement === first || document.activeElement === node)) {
        event.preventDefault(); last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault(); first.focus();
      }
    };
    node?.addEventListener('keydown', trap);
    return () => {
      document.body.style.overflow = previous;
      node?.removeEventListener('keydown', trap);
    };
  }, [isOpen, status]);
  if (!isOpen || !order) return null;
  const cancelled = status === 'deleted';
  return (
    <div className="modal-overlay pending-payment-overlay">
      <section ref={dialog} tabIndex={-1} className="pending-payment-dialog" role="dialog" aria-modal="true"
        aria-labelledby="pending-payment-title" aria-describedby="pending-payment-description">
        <header className="pending-payment-header">
          <div className="pending-payment-heading">
            <span className="pending-payment-icon" aria-hidden="true">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                <circle cx="12" cy="12" r="9" />
                {cancelled ? <path d="M12 7v6m0 3v1" /> : <path d="M12 7v5l3 2" />}
              </svg>
            </span>
            <div>
              <p className="pending-payment-eyebrow">Ogi Resto</p>
              <h2 id="pending-payment-title">{cancelled ? 'Pesanan Dibatalkan' : 'Selesaikan Pembayaran'}</h2>
            </div>
          </div>
          <p id="pending-payment-description">{cancelled
            ? 'Pesanan ini telah dihapus oleh admin. Hubungi admin jika pembayaran sudah dilakukan.'
            : 'Satu langkah lagi sebelum pesanan Anda disiapkan. Lakukan pembayaran, lalu kirim bukti ke grup Ogi Resto.'}</p>
        </header>

        <div className="pending-payment-content">
          <div className="pending-payment-summary">
            <div className="pending-payment-total">
              <span>Total pembayaran</span>
              <strong>{formatRupiah(order.total_price)}</strong>
            </div>
            <div className="pending-payment-reference">
              <span>No. pesanan</span>
              <span>{order.order_number}</span>
            </div>
          </div>
          {cancelled ? <button type="button" className="btn-primary pending-payment-return" onClick={onCancelled}>Kembali ke Menu</button> : <>
            <section className="pending-payment-step" aria-labelledby="pending-transfer-title">
              <div className="pending-payment-step-heading">
                <span className="pending-payment-step-number" aria-hidden="true">1</span>
                <div>
                  <h3 id="pending-transfer-title">Transfer pembayaran</h3>
                  <p>Transfer sesuai total ke rekening berikut.</p>
                </div>
              </div>
              <BankAccountDetails />
              <p className="pending-payment-cash-note">Bayar tunai? Pembayaran Anda dapat dikonfirmasi langsung oleh admin.</p>
            </section>

            <section className="pending-payment-step" aria-labelledby="pending-proof-title">
              <div className="pending-payment-step-heading">
                <span className="pending-payment-step-number" aria-hidden="true">2</span>
                <div>
                  <h3 id="pending-proof-title">Kirim bukti ke grup</h3>
                  <p>Lampirkan foto bukti transfer dan tempel format ini sebagai caption pada foto yang sama.</p>
                </div>
              </div>
              <WhatsappPaymentConfirmation order={order} />
            </section>

            <footer className="pending-payment-footer">
              <div className="pending-payment-status" role="status" aria-live="polite">
                <span className="pending-payment-status-dot" aria-hidden="true" />
                <div>
                  <strong>Menunggu konfirmasi pembayaran</strong>
                  <p>Jendela ini tertutup otomatis setelah pembayaran dikonfirmasi.</p>
                </div>
              </div>
              {error && <p role="alert" className="notice notice-error">{error}</p>}
              <button type="button" className="pending-payment-retry" onClick={onRetry}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                  <path d="M20 7v5h-5M4 17v-5h5" />
                  <path d="M6.2 7a7 7 0 0 1 11.5-1L20 9M4 15l2.3 3A7 7 0 0 0 17.8 17" />
                </svg>
                Periksa Status Lagi
              </button>
            </footer>
          </>}
        </div>
      </section>
    </div>
  );
}
