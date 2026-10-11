'use client';

import React from 'react';

export default function OrderModeView({
  orderMode,
  setOrderMode,
  todayName,
  tomorrowName,
  todayDateStr,
  tomorrowDateStr,
  tomorrowIsoDate,
  customDate,
  setCustomDate,
  customDayName,
  customDateStr,
  activeSelectedDay
}) {
  return (
    <div className="order-mode-container">
      <div className="order-mode-segmented">
        <button
          type="button"
          className={`order-mode-btn ${orderMode === 'today' ? 'active' : ''}`}
          onClick={() => setOrderMode('today')}
        >
          <span className="order-mode-icon">⚡</span>
          <div className="order-mode-info">
            <span className="order-mode-title">Pesan Hari Ini</span>
            <span className="order-mode-desc">
              {todayName}, {todayDateStr}
            </span>
          </div>
        </button>

        <button
          type="button"
          className={`order-mode-btn ${orderMode === 'tomorrow' ? 'active' : ''}`}
          onClick={() => setOrderMode('tomorrow')}
        >
          <span className="order-mode-icon">📅</span>
          <div className="order-mode-info">
            <span className="order-mode-title">Pre-Order Besok</span>
            <span className="order-mode-desc">
              {tomorrowName}, {tomorrowDateStr}
            </span>
          </div>
        </button>

        <button
          type="button"
          className={`order-mode-btn ${orderMode === 'custom' ? 'active' : ''}`}
          onClick={() => setOrderMode('custom')}
        >
          <span className="order-mode-icon">🗓️</span>
          <div className="order-mode-info">
            <span className="order-mode-title">Pre-Order Bebas</span>
            <span className="order-mode-desc">
              {orderMode === 'custom' && customDate ? `${customDayName}, ${customDateStr}` : 'Pilih Tanggal'}
            </span>
          </div>
        </button>
      </div>

      {orderMode === 'custom' && (
        <div className="custom-date-picker-box">
          <div className="custom-date-picker-content">
            <div className="custom-date-picker-label">
              <span className="custom-date-picker-title">🗓️ Tentukan Tanggal Pengantaran:</span>
              <span className="custom-date-picker-sub">Pilih tanggal di muka, menu otomatis mengikuti jadwal hari tersebut</span>
            </div>
            <div className="custom-date-picker-input-wrap">
              <input
                type="date"
                id="custom-order-date-input"
                className="custom-date-input"
                value={customDate || tomorrowIsoDate}
                min={tomorrowIsoDate}
                onChange={(e) => setCustomDate(e.target.value)}
              />
            </div>
          </div>
        </div>
      )}

      <div className="order-day-banner" style={{ margin: '10px 0 0' }}>
        <span>
          {orderMode === 'today'
            ? '⚡ Menampilkan menu siap saji hari ini: '
            : orderMode === 'tomorrow'
            ? '📅 Menampilkan menu pre-order untuk besok: '
            : `🗓️ Menampilkan menu pre-order untuk ${customDateStr}: `}
          <strong>{activeSelectedDay}</strong>
        </span>
        <span className="order-day-badge">
          {orderMode === 'today' ? 'Pesan Langsung' : orderMode === 'tomorrow' ? 'Booking Besok' : 'Pre-Order Khusus'}
        </span>
      </div>
    </div>
  );
}
