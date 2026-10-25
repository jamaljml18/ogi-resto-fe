'use client';

import { useRef, useState } from 'react';
import { BANK_ACCOUNT } from '../models/paymentInfo';

export default function BankAccountDetails() {
  const [copyStatus, setCopyStatus] = useState('idle');
  const copying = useRef(false);

  async function copyAccountNumber() {
    if (copying.current) return;
    copying.current = true;
    setCopyStatus('copying');
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(BANK_ACCOUNT.number);
      setCopyStatus('copied');
    } catch {
      setCopyStatus('error');
    } finally {
      copying.current = false;
    }
  }

  return (
    <div className="bank-account-details" aria-label="Rekening pembayaran Ogi Resto">
      <p className="bank-account-label">Nomor Rekening</p>
      <p className="bank-account-number">{BANK_ACCOUNT.number}</p>
      <button
        type="button"
        className="bank-account-copy"
        onClick={copyAccountNumber}
        disabled={copyStatus === 'copying'}
        aria-label="Salin nomor rekening BCA"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          <rect x="8" y="8" width="12" height="13" rx="2" />
          <path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3" />
        </svg>
        {copyStatus === 'copying' ? 'Menyalin...' : copyStatus === 'copied' ? 'Tersalin' : 'Salin No. Rek'}
      </button>
      <p className="bank-account-copy-status" role="status" aria-live="polite" aria-atomic="true">
        {copyStatus === 'copied' && 'Nomor rekening berhasil disalin.'}
        {copyStatus === 'error' && 'Belum bisa disalin otomatis. Tekan lama nomor atau blok nomornya untuk menyalin manual.'}
      </p>
      <p className="bank-account-bank">{BANK_ACCOUNT.bank}</p>
      <p className="bank-account-holder">A/n: {BANK_ACCOUNT.holder}</p>
    </div>
  );
}
