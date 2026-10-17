'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import BankAccountDetails from './BankAccountDetails';

export default function HeaderView({ searchQuery, setSearchQuery }) {
  const [showBankAccount, setShowBankAccount] = useState(false);

  useEffect(() => {
    if (!showBankAccount) return;
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setShowBankAccount(false);
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [showBankAccount]);

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
              className="btn-bank-header"
              onClick={() => setShowBankAccount(true)}
              aria-haspopup="dialog"
              aria-expanded={showBankAccount}
            >
              <span aria-hidden="true">🏦</span> Lihat No. Rek
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
      {showBankAccount && createPortal(
        <div className="bank-preview-overlay" onClick={() => setShowBankAccount(false)}>
          <div
            className="bank-preview-dialog"
            role="dialog"
            aria-modal="true"
            aria-label="Rekening pembayaran Ogi Resto"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="bank-preview-header">
              <strong>Rekening Pembayaran</strong>
              <button type="button" onClick={() => setShowBankAccount(false)} aria-label="Tutup rekening" autoFocus>×</button>
            </div>
            <BankAccountDetails />
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
