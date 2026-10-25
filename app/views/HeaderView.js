'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import BankAccountDetails from './BankAccountDetails';
import { WHATSAPP_GROUP_URL } from '../models/whatsappConfig';

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
              href={WHATSAPP_GROUP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp-header"
              title="Buka grup WhatsApp Ogi Resto"
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                <path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8v.5Z" />
              </svg>
              <span className="wa-text">Buka Grup WhatsApp</span>
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
