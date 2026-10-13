'use client';

import React from 'react';
import { formatRupiah, PRESET_COMPANIES, PRESET_DIVISIONS, PRESET_LOCATIONS } from '../models/initialData';

export default function CheckoutModalView({
  isOpen,
  onClose,
  orderMode,
  activeSelectedDay,
  todayDateStr,
  tomorrowDateStr,
  customDateStr,
  customDayName,
  cartSummary,
  formData,
  setFormData,
  onSubmitOrder,
  isSubmitting,
  checkoutError,
  availableCompanies,
  availableDivisions,
  availableLocations
}) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-sheet">
        <div className="modal-header">
          <h2 className="modal-title">Konfirmasi & Data Diri Pemesan</h2>
          <button className="modal-close" onClick={onClose} type="button">
            ✕
          </button>
        </div>

        <div className="modal-body">
          {checkoutError && <p role="alert" className="notice notice-error">{checkoutError}</p>}
          {/* Review Pesanan */}
          <div className="review-box">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10, fontSize: 13 }}>
              <span style={{ fontWeight: 700 }}>
                {orderMode === 'today'
                  ? '⚡ Pesan Hari Ini: '
                  : orderMode === 'tomorrow'
                  ? '📅 Pre-Order Besok: '
                  : '🗓️ Pre-Order Tanggal: '}
                <span style={{ color: 'var(--primary)' }}>{activeSelectedDay}</span>
              </span>
              <span style={{ fontSize: 11, background: 'var(--primary-light)', color: 'var(--primary)', fontWeight: 800, padding: '2px 8px', borderRadius: 9999 }}>
                {orderMode === 'today'
                  ? todayDateStr
                  : orderMode === 'tomorrow'
                  ? tomorrowDateStr
                  : customDateStr}
              </span>
            </div>
            {cartSummary.itemsList.map((item) => (
              <div key={item.id} className="review-item">
                <span>
                  {item.name} <strong style={{ color: 'var(--primary)' }}>x{item.qty}</strong>
                </span>
                <span>{formatRupiah(item.subtotal)}</span>
              </div>
            ))}
            <div className="review-total">
              <span>Total Tagihan:</span>
              <span style={{ color: 'var(--primary)' }}>{formatRupiah(cartSummary.totalPrice)}</span>
            </div>
          </div>

          {/* Form Data Diri */}
          <form id="orderForm" onSubmit={onSubmitOrder}>
            {/* 1. Nama Lengkap */}
            <div className="form-group">
              <label className="form-label">
                Nama Lengkap <span className="req">*</span>
              </label>
              <input
                type="text"
                required
                className="form-input"
                placeholder="Contoh: Budi Santoso"
                value={formData.userName}
                onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
              />
            </div>

            {/* 2. Perusahaan */}
            <div className="form-group">
              <label className="form-label">
                Perusahaan <span className="req">*</span>
              </label>
              <input
                type="text"
                required
                list="companyList"
                className="form-input"
                placeholder="Pilih dari daftar atau ketik nama perusahaan..."
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              />
              <datalist id="companyList">
                {(availableCompanies || PRESET_COMPANIES).map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
            </div>

            {/* 3. Divisi / Departemen */}
            <div className="form-group">
              <label className="form-label">
                Divisi / Departemen <span className="req">*</span>
              </label>
              <input
                type="text"
                required
                list="divisionList"
                className="form-input"
                placeholder="Pilih dari daftar atau ketik divisi..."
                value={formData.division}
                onChange={(e) => setFormData({ ...formData, division: e.target.value })}
              />
              <datalist id="divisionList">
                {(availableDivisions || PRESET_DIVISIONS).map((d) => (
                  <option key={d} value={d} />
                ))}
              </datalist>
            </div>

            {/* 4. Lokasi Makanan */}
            <div className="form-group">
              <label className="form-label">
                Lokasi Pengantaran Makanan <span className="req">*</span>
              </label>
              <input
                type="text"
                required
                list="locationList"
                className="form-input"
                placeholder="Pilih dari daftar atau ketik lokasi..."
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
              <datalist id="locationList">
                {(availableLocations || PRESET_LOCATIONS).map((loc) => (
                  <option key={loc} value={loc} />
                ))}
              </datalist>
            </div>

            {/* 5. Catatan / Request Khusus */}
            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span>📝 Catatan / Request Khusus</span>
                <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-muted)' }}>(Opsional)</span>
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="ayam bagian dada"
                value={formData.notes || ''}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </div>

            {/* 6. Metode Pembayaran: Cash / Kasbon */}
            <div className="form-group" style={{ marginTop: 14 }}>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <span>💳 Metode Pembayaran <span className="req">*</span></span>
                <span
                  style={{
                    fontSize: 11.5,
                    fontWeight: 700,
                    color: (formData.paymentMethod || 'Cash') === 'Cash' ? '#16a34a' : '#d97706'
                  }}
                >
                  {(formData.paymentMethod || 'Cash') === 'Cash' ? '✓ Bayar Cash / QRIS' : '✓ Dicatat Kasbon'}
                </span>
              </label>

              {/* Segmented Toggle Cash / Kasbon */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 10,
                  background: '#f1f5f9',
                  padding: 6,
                  borderRadius: 14
                }}
              >
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, paymentMethod: 'Cash' })}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    padding: '12px 14px',
                    borderRadius: 10,
                    border: 'none',
                    cursor: 'pointer',
                    fontWeight: 700,
                    fontSize: 13.5,
                    transition: 'all 0.2s',
                    background: (formData.paymentMethod || 'Cash') === 'Cash' ? '#ffffff' : 'transparent',
                    color: (formData.paymentMethod || 'Cash') === 'Cash' ? '#0f172a' : '#64748b',
                    boxShadow: (formData.paymentMethod || 'Cash') === 'Cash' ? '0 3px 10px rgba(0,0,0,0.08)' : 'none',
                    borderWidth: 2,
                    borderStyle: 'solid',
                    borderColor: (formData.paymentMethod || 'Cash') === 'Cash' ? '#22c55e' : 'transparent'
                  }}
                >
                  <span style={{ fontSize: 18 }}>💵</span>
                  <div style={{ textAlign: 'left', lineHeight: 1.2 }}>
                    <div>Cash / QRIS</div>
                    <small style={{ fontSize: 10.5, fontWeight: 500, color: (formData.paymentMethod || 'Cash') === 'Cash' ? '#16a34a' : '#94a3b8' }}>
                      Bayar Sekarang
                    </small>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, paymentMethod: 'Kasbon' })}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    padding: '12px 14px',
                    borderRadius: 10,
                    border: 'none',
                    cursor: 'pointer',
                    fontWeight: 700,
                    fontSize: 13.5,
                    transition: 'all 0.2s',
                    background: formData.paymentMethod === 'Kasbon' ? '#ffffff' : 'transparent',
                    color: formData.paymentMethod === 'Kasbon' ? '#0f172a' : '#64748b',
                    boxShadow: formData.paymentMethod === 'Kasbon' ? '0 3px 10px rgba(0,0,0,0.08)' : 'none',
                    borderWidth: 2,
                    borderStyle: 'solid',
                    borderColor: formData.paymentMethod === 'Kasbon' ? '#f59e0b' : 'transparent'
                  }}
                >
                  <span style={{ fontSize: 18 }}>📝</span>
                  <div style={{ textAlign: 'left', lineHeight: 1.2 }}>
                    <div>Kasbon</div>
                    <small style={{ fontSize: 10.5, fontWeight: 500, color: formData.paymentMethod === 'Kasbon' ? '#d97706' : '#94a3b8' }}>
                      Bayar Nanti
                    </small>
                  </div>
                </button>
              </div>

              {formData.paymentMethod === 'Kasbon' ? (
                <div style={{ marginTop: 8, fontSize: 11.5, color: '#b45309', background: '#fffbeb', padding: '8px 12px', borderRadius: 8, border: '1px solid #fef3c7' }}>
                  ℹ️ Pesanan ini akan dicatat ke tagihan kasbon bulanan karyawan Anda.
                </div>
              ) : (
                <div style={{ marginTop: 8, fontSize: 11.5, color: '#15803d', background: '#f0fdf4', padding: '8px 12px', borderRadius: 8, border: '1px solid #dcfce7' }}>
                  💡 Pada struk nanti akan tersedia tombol untuk membuka QRIS pembayaran.
                </div>
              )}
            </div>
          </form>
        </div>

        <div className="modal-footer">
          <button
            type="submit"
            form="orderForm"
            className="btn-primary"
            disabled={isSubmitting || cartSummary.totalItems === 0}
          >
            {isSubmitting ? 'Memproses Pesanan...' : '✓ Konfirmasi & Kirim Pesanan'}
          </button>
        </div>
      </div>
    </div>
  );
}
