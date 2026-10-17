import { BANK_ACCOUNT } from '../models/paymentInfo';

export default function BankAccountDetails() {
  return (
    <div className="bank-account-details" aria-label="Rekening pembayaran Ogi Resto">
      <p className="bank-account-label">Nomor Rekening</p>
      <p className="bank-account-number">{BANK_ACCOUNT.number}</p>
      <p className="bank-account-bank">{BANK_ACCOUNT.bank}</p>
      <p className="bank-account-holder">A/n: {BANK_ACCOUNT.holder}</p>
    </div>
  );
}
