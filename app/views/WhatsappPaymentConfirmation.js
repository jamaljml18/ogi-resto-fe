'use client';

import { useId, useRef, useState } from 'react';
import { WHATSAPP_GROUP_URL } from '../models/whatsappConfig';

export default function WhatsappPaymentConfirmation({ order }) {
  const inputId = useId();
  const [copyStatus, setCopyStatus] = useState('idle');
  const copying = useRef(false);
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
      setCopyStatus('error');
    } finally {
      copying.current = false;
    }
  }

  return (
    <div className="whatsapp-payment-confirmation">
      <label htmlFor={inputId}>Format laporan pembayaran</label>
      <textarea
        id={inputId}
        rows={4}
        value={message}
        readOnly
        spellCheck={false}
        onFocus={event => event.currentTarget.select()}
      />
      <button type="button" className="whatsapp-copy-format" onClick={copyMessage} disabled={copyStatus === 'copying'}>
        {copyStatus === 'copying' ? 'Menyalin...' : copyStatus === 'copied' ? 'Format Tersalin' : 'Salin Format /bayar'}
      </button>
      <p className="whatsapp-copy-status" role="status" aria-live="polite" aria-atomic="true">
        {copyStatus === 'copied' && 'Format berhasil disalin. Tempel sebagai caption foto bukti transfer di grup.'}
        {copyStatus === 'error' && 'Belum bisa disalin otomatis. Pilih teks format di atas, lalu salin manual.'}
      </p>
      <a href={WHATSAPP_GROUP_URL} target="_blank" rel="noopener noreferrer" className="btn-whatsapp-confirm whatsapp-open-group">
        <span aria-hidden="true">💬</span> Buka Grup WhatsApp
      </a>
      <p className="whatsapp-payment-hint">
        Setelah transfer, kirim foto bukti pembayaran ke grup dengan format di atas sebagai caption.
      </p>
    </div>
  );
}
