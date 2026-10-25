'use client';

import { useId, useRef, useState } from 'react';
import { WHATSAPP_GROUP_URL } from '../models/whatsappConfig';

export default function WhatsappPaymentConfirmation({ order }) {
  const inputId = useId();
  const [copyStatus, setCopyStatus] = useState('idle');
  const copying = useRef(false);
  const caption = useRef(null);
  const message = [
    '/bayar',
    order.userName || order.user_name || '',
    order.company || '',
    order.division || ''
  ].map(value => String(value).replace(/\s+/g, ' ').trim()).join('\n');

  async function copyMessage() {
    if (copying.current) return;
    copying.current = true;
    setCopyStatus('copying');
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(message);
      setCopyStatus('copied');
    } catch {
      // Keep a manual selection available when browser clipboard permission is denied.
      caption.current?.focus();
      caption.current?.select();
      let copied = false;
      try { copied = document.execCommand?.('copy') === true; } catch {}
      setCopyStatus(copied ? 'copied' : 'error');
    } finally {
      copying.current = false;
    }
  }

  return (
    <div className="whatsapp-payment-confirmation">
      <label htmlFor={inputId}>Format laporan pembayaran</label>
      <div className="whatsapp-caption-box">
        <textarea
          ref={caption}
          id={inputId}
          rows={4}
          value={message}
          readOnly
          spellCheck={false}
          onFocus={event => event.currentTarget.select()}
        />
        <button type="button" className="whatsapp-copy-format" onClick={copyMessage} disabled={copyStatus === 'copying'}
          aria-label={copyStatus === 'copied' ? 'Format laporan tersalin' : 'Salin format laporan pembayaran'}
          title={copyStatus === 'copied' ? 'Tersalin' : 'Salin format'}>
          {copyStatus === 'copied' ?
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="m5 12 4 4L19 6" />
            </svg> :
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <rect x="8" y="8" width="12" height="13" rx="2" />
              <path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3" />
            </svg>}
        </button>
      </div>
      <p className="whatsapp-copy-status" role="status" aria-live="polite" aria-atomic="true">
        {copyStatus === 'copied' && 'Format berhasil disalin. Tempel sebagai caption foto bukti transfer di grup.'}
        {copyStatus === 'error' && 'Belum bisa disalin otomatis. Pilih teks format di atas, lalu salin manual.'}
      </p>
      <a href={WHATSAPP_GROUP_URL} onClick={() => { void copyMessage(); }} target="_blank" rel="noopener noreferrer" className="btn-whatsapp-confirm whatsapp-open-group">
        <span aria-hidden="true">💬</span> Salin &amp; Buka Grup WhatsApp
      </a>
      <p className="whatsapp-payment-hint">
        Format disalin saat grup dibuka. Tempel pada caption foto sebelum mengirim.
      </p>
    </div>
  );
}
