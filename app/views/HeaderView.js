'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';

export default function HeaderView({ searchQuery, setSearchQuery }) {
  const [showQris, setShowQris] = useState(false);

  useEffect(() => {
    if (!showQris) return;
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setShowQris(false);
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [showQris]);

  return (
    <>
      <header className="top-header">
        <div className="header-top-row">
          <div className="brand-section">
            <div className="brand-icon">🍽️</div>
            <div>
              <h1 className="brand-title">Ogi Resto</h1>
              <span className="brand-badge">Menu Harian</span>
            </div>
          </div>

          <div className="header-actions">
            <a
              href="https://wa.me/6281312459274?text=Halo%20Ogi%20Resto%2C%20saya%20ingin%20bertanya%20seputar%20menu%20dan%20pesanan%20katering"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp-header"
              title="Hubungi Admin / CS via WhatsApp (+62 813-1245-9274)"
            >
              <span className="wa-icon">💬</span>
              <span className="wa-text">Chat WhatsApp</span>
            </a>
            <button
              type="button"
              className="btn-qris-header"
              onClick={() => setShowQris(true)}
              aria-haspopup="dialog"
              aria-expanded={showQris}
            >
              <span aria-hidden="true">▦</span> Lihat QRIS
            </button>
          </div>
        </div>

        <div className="filter-bar">
          <div className="search-input-wrap">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="search-input"
            placeholder="Cari menu..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              type="button"
              style={{
                position: 'absolute',
                right: 14,
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#94a3b8',
                fontSize: 14
              }}
              onClick={() => setSearchQuery('')}
              title="Bersihkan pencarian"
            >
              ✕
            </button>
          )}
          </div>
        </div>
      </header>
      {showQris && createPortal(
        <div className="qris-preview-overlay" onClick={() => setShowQris(false)}>
          <div
            className="qris-preview-dialog"
            role="dialog"
            aria-modal="true"
            aria-label="QRIS pembayaran Ogi Resto"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="qris-preview-header">
              <strong>QRIS Pembayaran</strong>
              <button type="button" onClick={() => setShowQris(false)} aria-label="Tutup QRIS" autoFocus>×</button>
            </div>
            <Image
              src="/qris.jpeg"
              alt="Kode QRIS pembayaran Ogi Resto"
              width={440}
              height={660}
              unoptimized
              className="qris-preview-image"
            />
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
