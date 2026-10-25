'use client';

import { useId } from 'react';

export default function PaymentHistoryFilters({
  filters, setFilters, onApply, onReset, error, pending, availableCompanies, availableDivisions
}) {
  const base = useId();
  const change = field => event => setFilters(previous => ({ ...previous, [field]: event.target.value }));
  return (
    <form className="filter-card-panel payment-history-filters" onSubmit={onApply}>
      <div className="filter-card-header">
        <div>
          <h4 className="filter-card-title">🔍 Filter &amp; Pencarian Riwayat Pembayaran</h4>
          <p className="payment-history-filter-note">Cari pembayaran berdasarkan nama, perusahaan, divisi, dan tanggal pembayaran.</p>
        </div>
        <button type="button" className="btn-outline-admin" onClick={onReset} disabled={pending}>Reset Filter</button>
      </div>
      <fieldset disabled={pending}>
        <div className="filter-date-row payment-history-date-filters">
          <label className="filter-field">
            <span className="filter-label">📅 Filter Tanggal / Periode</span>
            <select className="form-input" value={filters.dateFilterType} onChange={change('dateFilterType')}>
              <option value="all">Semua Waktu</option>
              <option value="today">Hari Ini</option>
              <option value="single">Pilih Tanggal Tertentu</option>
              <option value="range">Rentang Tanggal</option>
              <option value="month_year">Bulan &amp; Tahun</option>
            </select>
          </label>
          {filters.dateFilterType === 'today' && <p className="payment-history-date-hint">Pembayaran hari ini (WIB)</p>}
          {filters.dateFilterType === 'single' && <label className="filter-field">
            <span className="filter-label">Pilih Tanggal</span>
            <input type="date" className="form-input" min="0001-01-01" max="9999-12-31"
              value={filters.singleDate} onChange={change('singleDate')} required />
          </label>}
          {filters.dateFilterType === 'range' && <>
            <label className="filter-field">
              <span className="filter-label">Dari Tanggal</span>
              <input type="date" className="form-input" min="0001-01-01" max={filters.endDate || '9999-12-31'}
                value={filters.startDate} onChange={change('startDate')} required />
            </label>
            <label className="filter-field">
              <span className="filter-label">Sampai Tanggal</span>
              <input type="date" className="form-input" min={filters.startDate || '0001-01-01'} max="9999-12-31"
                value={filters.endDate} onChange={change('endDate')} required />
            </label>
          </>}
          {filters.dateFilterType === 'month_year' && <label className="filter-field">
            <span className="filter-label">Pilih Bulan &amp; Tahun</span>
            <input type="month" className="form-input" min="1000-01" max="9999-12"
              value={filters.periodMonth} onChange={change('periodMonth')} required />
          </label>}
        </div>
        <div className="filter-grid payment-history-filter-grid">
          <label className="filter-field">
            <span className="filter-label">Cari Nama</span>
            <input type="search" className="form-input" maxLength={255} placeholder="Ketik nama..."
              value={filters.search} onChange={change('search')} />
          </label>
          <label className="filter-field">
            <span className="filter-label">Perusahaan</span>
            <input className="form-input" list={base + '-companies'} maxLength={255} placeholder="Semua perusahaan"
              value={filters.company} onChange={change('company')} />
          </label>
          <label className="filter-field">
            <span className="filter-label">Divisi / Departemen</span>
            <input className="form-input" list={base + '-divisions'} maxLength={255} placeholder="Semua divisi"
              value={filters.division} onChange={change('division')} />
          </label>
          <button type="submit" className="btn-primary payment-history-apply-filter">Terapkan Filter</button>
        </div>
      </fieldset>
      <datalist id={base + '-companies'}>{availableCompanies.map(value => <option key={value} value={value} />)}</datalist>
      <datalist id={base + '-divisions'}>{availableDivisions.map(value => <option key={value} value={value} />)}</datalist>
      {error && <p role="alert" className="payment-history-error">{error}</p>}
    </form>
  );
}
