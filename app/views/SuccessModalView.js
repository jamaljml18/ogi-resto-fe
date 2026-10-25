'use client';

import React, { useState } from 'react';
import BankAccountDetails from './BankAccountDetails';
import { formatRupiah } from '../models/initialData';

export default function SuccessModalView({
  isOpen,
  onClose,
  lastSubmittedOrder,
  paymentConfirmed = false
}) {
  const [showBankAccountModal, setShowBankAccountModal] = useState(false);

  if (!isOpen) return null;

  const isKasbon =
    lastSubmittedOrder &&
    (lastSubmittedOrder.payment_method === 'Kasbon' ||
      lastSubmittedOrder.paymentMethod === 'Kasbon');

  const awaitingPayment = !paymentConfirmed && lastSubmittedOrder?.payment_status === 'waiting';

  const notesText =
    lastSubmittedOrder && (lastSubmittedOrder.notes || '');

  return (
    <>
      <div className="modal-overlay">
        <div className="modal-sheet" style={{ maxWidth: 520, borderRadius: 24 }}>
          <div className="modal-body success-card" style={{ padding: '30px 24px' }}>
            <div className="success-icon-wrap">
              <span>✓</span>
            </div>
            <h2 className="success-title">{awaitingPayment ? 'Pesanan Menunggu Pembayaran' : 'Pesanan Berhasil Dikirim!'}</h2>
            <p className="success-desc">
              Terima kasih telah memesan makan siang di <strong>Ogi Resto</strong>.
              {awaitingPayment
                ? ' Silakan lakukan pembayaran dan kirim bukti ke grup untuk menyelesaikan transaksi.'
                : ' Pesanan Anda telah tercatat dan akan disiapkan oleh tim dapur.'}
            </p>

            {lastSubmittedOrder && (
              <div className="success-receipt-card">
                <div className="receipt-row">
                  <span className="receipt-label">No. Transaksi</span>
                  <span className="receipt-val">{lastSubmittedOrder.order_number || lastSubmittedOrder.id}</span>
                </div>
                <div className="receipt-row">
                  <span className="receipt-label">Nama Pemesan</span>
                  <span className="receipt-val">{lastSubmittedOrder.userName || lastSubmittedOrder.user_name}</span>
                </div>
                <div className="receipt-row">
                  <span className="receipt-label">Metode Pembayaran</span>
                  <span className="receipt-val">
                    {isKasbon ? (
                      <span
                        style={{
                          background: '#fef3c7',
                          color: '#b45309',
                          fontWeight: 800,
                          padding: '3px 10px',
                          borderRadius: 8,
                          fontSize: 12.5
                        }}
                      >
                        📝 Kasbon
                      </span>
                    ) : (
                      <span
                        style={{
                          background: '#dcfce7',
                          color: '#15803d',
                          fontWeight: 800,
                          padding: '3px 10px',
                          borderRadius: 8,
                          fontSize: 12.5
                        }}
                      >
                        💵 Cash / Transfer
                      </span>
                    )}
                  </span>
                </div>
                <div className="receipt-row">
                  <span className="receipt-label">Jadwal Pesanan</span>
                  <span className="receipt-val" style={{ color: 'var(--primary)', fontWeight: 800 }}>
                    {lastSubmittedOrder.orderDay || lastSubmittedOrder.order_day || 'Hari Ini'}
                  </span>
                </div>
                <div className="receipt-row">
                  <span className="receipt-label">Tujuan Pengantaran</span>
                  <span className="receipt-val">
                    {lastSubmittedOrder.location} ({lastSubmittedOrder.division})
                  </span>
                </div>
                <div className="receipt-row">
                  <span className="receipt-label">Perusahaan</span>
                  <span className="receipt-val">{lastSubmittedOrder.company}</span>
                </div>

                {notesText ? (
                  <div className="receipt-row" style={{ background: '#f8fafc', padding: '6px 10px', borderRadius: 8, marginTop: 4 }}>
                    <span className="receipt-label">📝 Catatan Khusus</span>
                    <span className="receipt-val" style={{ fontStyle: 'italic', color: '#334155', fontWeight: 600 }}>
                      &quot;{notesText}&quot;
                    </span>
                  </div>
                ) : null}

                <div className="receipt-divider"></div>

                <div style={{ fontSize: 12, fontWeight: 700, color: '#475569', marginBottom: 8 }}>
                  Rincian Menu:
                </div>
                {Array.isArray(lastSubmittedOrder.items) &&
                  lastSubmittedOrder.items
                    .filter((it) => it && !it._meta)
                    .map((item, idx) => (
                      <div key={idx} className="receipt-item-row">
                        <span>
                          {item.name} x{item.qty}
                        </span>
                        <span>{formatRupiah(item.subtotal || item.price * item.qty)}</span>
                      </div>
                    ))}

                <div className="receipt-divider"></div>

                <div className="receipt-row" style={{ fontSize: 15, fontWeight: 800 }}>
                  <span>Total Pembayaran</span>
                  <span style={{ color: 'var(--primary)' }}>
                    {formatRupiah(lastSubmittedOrder.totalPrice || lastSubmittedOrder.total_price)}
                  </span>
                </div>
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 20 }}>
              {/* JIKA CASH: TAMPILKAN TOMBOL PAY / BUKA REKENING */}
              {lastSubmittedOrder && !isKasbon && (
                <button
                  type="button"
                  onClick={() => setShowBankAccountModal(true)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 10,
                    background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                    color: '#ffffff',
                    border: 'none',
                    fontWeight: 800,
                    fontSize: 14.5,
                    padding: '13px 20px',
                    borderRadius: 'var(--radius-pill)',
                    boxShadow: '0 6px 18px rgba(2, 132, 199, 0.35)',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    width: '100%'
                  }}
                >
                  <span style={{ fontSize: 18 }}>💳</span>
                  <span>Lihat No. Rek</span>
                </button>
              )}

              {/* JIKA KASBON: TAMPILKAN INFO KASBON */}
              {lastSubmittedOrder && isKasbon && (
                <div
                  style={{
                    background: '#fffbeb',
                    border: '1px solid #fef3c7',
                    padding: '10px 14px',
                    borderRadius: 12,
                    fontSize: 12.5,
                    color: '#92400e',
                    textAlign: 'center',
                    fontWeight: 600
                  }}
                >
                  📝 Pesanan ini dicatat sebagai <strong>Kasbon</strong> dan akan direkap pada laporan bulanan.
                </div>
              )}

              <button
                type="button"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: '#f1f5f9',
                  color: '#475569',
                  border: '1.5px solid #cbd5e1',
                  borderRadius: 'var(--radius-pill)',
                  padding: '13px 20px',
                  fontWeight: 700,
                  fontSize: 14,
                  marginTop: 2,
                  width: '100%',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onClick={() => {setShowBankAccountModal(false);onClose();}}
              >
                {awaitingPayment ? 'Selesai — Lanjutkan Pembayaran' : 'Selesai & Pesan Lagi'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* POPUP MODAL REKENING PEMBAYARAN */}
      {showBankAccountModal && (
        <div
          className="modal-overlay"
          style={{ zIndex: 1200, background: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(6px)' }}
          onClick={() => setShowBankAccountModal(false)}
        >
          <div
            className="modal-sheet"
            style={{
              maxWidth: 420,
              borderRadius: 24,
              padding: 0,
              maxHeight: '92vh',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                color: '#ffffff',
                padding: '14px 18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexShrink: 0
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 22 }}>📱</span>
                <div>
                  <h3 style={{ margin: 0, fontSize: 15, fontWeight: 800 }}>Rekening Pembayaran</h3>
                  <p style={{ margin: '1px 0 0 0', fontSize: 11, opacity: 0.9 }}>Ogi Resto Catering</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowBankAccountModal(false)}
                style={{
                  background: 'rgba(255,255,255,0.2)',
                  border: 'none',
                  color: '#ffffff',
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  cursor: 'pointer',
                  fontSize: 15,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                ✕
              </button>
            </div>

            <div
              style={{
                padding: '14px 18px 20px',
                textAlign: 'center',
                overflowY: 'auto',
                flex: 1,
                WebkitOverflowScrolling: 'touch'
              }}
            >
              <div style={{ marginBottom: 10 }}>
                <div style={{ fontSize: 11.5, color: '#64748b', fontWeight: 600 }}>Total Pembayaran</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: '#e11d48', marginTop: 1 }}>
                  {formatRupiah(lastSubmittedOrder?.totalPrice || lastSubmittedOrder?.total_price || 0)}
                </div>
                <div style={{ fontSize: 10.5, color: '#94a3b8', marginTop: 1, fontFamily: 'monospace' }}>
                  No: {lastSubmittedOrder?.order_number || lastSubmittedOrder?.id}
                </div>
              </div>

              <BankAccountDetails />

              <p style={{ fontSize: 11.5, color: '#475569', lineHeight: 1.45, marginTop: 10, marginBottom: 12 }}>
                Transfer ke rekening BCA di atas melalui aplikasi perbankan Anda. Pastikan nama penerima sesuai sebelum mengirim pembayaran.
              </p>

              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  type="button"
                  onClick={() => setShowBankAccountModal(false)}
                  style={{
                    flex: 1,
                    background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                    color: '#ffffff',
                    border: 'none',
                    padding: '11px 14px',
                    borderRadius: 'var(--radius-pill)',
                    fontWeight: 700,
                    fontSize: 13,
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(2, 132, 199, 0.3)'
                  }}
                >
                  ✓ Selesai
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
