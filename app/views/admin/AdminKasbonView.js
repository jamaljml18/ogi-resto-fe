'use client';
import AdminTableViewport from './AdminTableViewport';
import {formatRupiah,PRESET_COMPANIES,PRESET_DIVISIONS} from '../../models/initialData';

export default function AdminKasbonView({kasbonMonth,setKasbonMonth,kasbonYear,setKasbonYear,kasbonCompany,setKasbonCompany,kasbonDivision,setKasbonDivision,availableDivisions,availableCompanies,monthlyKasbonMatrix,onExportKasbonCsv,kasbonLoading,kasbonError,savingPayments,onToggleKasbonPayment}) {
  return (
              <div>
                {/* HERO BANNER & KPI CARDS */}
                <div className="schedule-hero-banner" style={{ marginBottom: 18 }}>
                  <div className="schedule-hero-title">
                    <h3>💳 Matriks & Rekap Kasbon Karyawan Bulanan</h3>
                    <p>
                      Pantau absensi konsumsi dan total tunggakan kasbon per orang selama satu bulan penuh.
                    </p>
                  </div>
                  <div className="schedule-hero-actions">
                    <button
                      type="button"
                      className="btn-success"
                      onClick={onExportKasbonCsv}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 18px', fontWeight: 700 }}
                      title="Unduh data matriks kasbon sebulan penuh dalam format Excel / CSV"
                    >
                      <span>📥</span> Unduh Rekap Kasbon Bulanan (CSV)
                    </button>
                  </div>
                </div>

                {/* KPI STATS CARDS */}
                <div className="stats-grid" style={{ marginBottom: 20 }}>
                  <div className="stat-card stat-rose">
                    <div className="stat-icon-wrap" style={{ color: '#dc2626', background: '#fef2f2', borderColor: '#fecaca' }}>
                      💳
                    </div>
                    <div className="stat-info">
                      <span className="stat-label">TOTAL TAGIHAN KASBON</span>
                      <div className="stat-val" style={{ color: '#dc2626' }}>
                        {formatRupiah(monthlyKasbonMatrix?.totalKasbonAmount || 0)}
                      </div>
                      <div className="stat-subtext">Periode {monthlyKasbonMatrix?.monthName} {kasbonYear}</div>
                    </div>
                  </div>

                  <div className="stat-card stat-amber">
                    <div className="stat-icon-wrap" style={{ color: '#d97706', background: '#fffbeb', borderColor: '#fde68a' }}>
                      👥
                    </div>
                    <div className="stat-info">
                      <span className="stat-label">KARYAWAN BERKASBON</span>
                      <div className="stat-val" style={{ color: '#d97706' }}>
                        {monthlyKasbonMatrix?.usersWithKasbonCount || 0}
                        <span style={{ fontSize: 13, fontWeight: 500, color: '#64748b', marginLeft: 4 }}>
                          / {monthlyKasbonMatrix?.totalUsersCount || 0} aktif
                        </span>
                      </div>
                      <div className="stat-subtext">Memiliki transaksi kasbon bulan ini</div>
                    </div>
                  </div>

                  <div className="stat-card stat-emerald">
                    <div className="stat-icon-wrap" style={{ color: '#059669', background: '#ecfdf5', borderColor: '#a7f3d0' }}>
                      💵
                    </div>
                    <div className="stat-info">
                      <span className="stat-label">TOTAL CASH / TRANSFER</span>
                      <div className="stat-val" style={{ color: '#059669' }}>
                        {formatRupiah(monthlyKasbonMatrix?.totalCashAmount || 0)}
                      </div>
                      <div className="stat-subtext">Transaksi dengan metode Cash / Transfer</div>
                    </div>
                  </div>

                  <div className="stat-card stat-purple">
                    <div className="stat-icon-wrap" style={{ color: '#7c3aed', background: '#f5f3ff', borderColor: '#ddd6fe' }}>
                      🗓️
                    </div>
                    <div className="stat-info">
                      <span className="stat-label">JUMLAH HARI KALENDER</span>
                      <div className="stat-val" style={{ color: '#7c3aed' }}>
                        {monthlyKasbonMatrix?.daysInMonth || 31} Hari
                      </div>
                      <div className="stat-subtext">{monthlyKasbonMatrix?.monthName} {kasbonYear}</div>
                    </div>
                  </div>
                </div>

                {/* FILTER PERIODE BULAN, TAHUN & PERUSAHAAN */}
                <div className="admin-orders-filter-box" style={{ marginBottom: 20 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, flexWrap: 'wrap', gap: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 16 }}>🗓️</span>
                      <strong style={{ fontSize: 14, color: '#0f172a' }}>Pilih Periode Rekapitulasi Kasbon:</strong>
                    </div>
                    <div style={{ display: 'flex', gap: 10, alignItems: 'center', fontSize: 12, color: '#64748b' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                        <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#ef4444', display: 'inline-block' }}></span>
                        Kasbon (KB)
                      </span>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                        <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#10b981', display: 'inline-block' }}></span>
                        Cash
                      </span>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                        <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#cbd5e1', display: 'inline-block' }}></span>
                        Tidak Ada Order
                      </span>
                    </div>
                  </div>

                  <div className="filter-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
                    <div className="filter-field">
                      <label className="filter-label">Bulan</label>
                      <select
                        className="form-input"
                        value={kasbonMonth}
                        onChange={(e) => setKasbonMonth(parseInt(e.target.value, 10))}
                      >
                        <option value="1">Januari (01)</option>
                        <option value="2">Februari (02)</option>
                        <option value="3">Maret (03)</option>
                        <option value="4">April (04)</option>
                        <option value="5">Mei (05)</option>
                        <option value="6">Juni (06)</option>
                        <option value="7">Juli (07)</option>
                        <option value="8">Agustus (08)</option>
                        <option value="9">September (09)</option>
                        <option value="10">Oktober (10)</option>
                        <option value="11">November (11)</option>
                        <option value="12">Desember (12)</option>
                      </select>
                    </div>

                    <div className="filter-field">
                      <label className="filter-label">Tahun</label>
                      <select
                        className="form-input"
                        value={kasbonYear}
                        onChange={(e) => setKasbonYear(parseInt(e.target.value, 10))}
                      >
                        <option value="2024">2024</option>
                        <option value="2025">2025</option>
                        <option value="2026">2026</option>
                        <option value="2027">2027</option>
                        <option value="2028">2028</option>
                        <option value="2029">2029</option>
                        <option value="2030">2030</option>
                      </select>
                    </div>

                    <div className="filter-field">
                      <label className="filter-label">Perusahaan</label>
                      <select
                        className="form-input"
                        value={kasbonCompany}
                        onChange={(e) => setKasbonCompany(e.target.value)}
                      >
                        <option value="Semua">Semua Perusahaan</option>
                        {(availableCompanies || PRESET_COMPANIES).map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="filter-field">
                      <label className="filter-label">Divisi / Departemen</label>
                      <select
                        className="form-input"
                        value={kasbonDivision || 'Semua'}
                        onChange={(e) => setKasbonDivision(e.target.value)}
                      >
                        <option value="Semua">Semua Divisi</option>
                        {(availableDivisions || PRESET_DIVISIONS).map((d) => (
                          <option key={d} value={d}>
                            {d}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* KASBON EXECUTIVE SUMMARY MINI CARDS */}
                {monthlyKasbonMatrix?.rows && monthlyKasbonMatrix.rows.length > 0 && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, marginBottom: 16 }}>
                    <div style={{ background: '#fff1f2', border: '1px solid #fecdd3', borderRadius: 14, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12, boxShadow: '0 2px 6px rgba(225, 29, 72, 0.05)' }}>
                      <div style={{ width: 42, height: 42, borderRadius: 12, background: 'linear-gradient(135deg, #e11d48, #be123c)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0, boxShadow: '0 4px 10px rgba(225, 29, 72, 0.25)' }}>
                        💳
                      </div>
                      <div>
                        <div style={{ fontSize: 11, fontWeight: 700, color: '#9f1239', textTransform: 'uppercase', letterSpacing: 0.3 }}>Total Tagihan Kasbon</div>
                        <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: 19, fontWeight: 800, color: '#e11d48', marginTop: 2 }}>
                          {formatRupiah(monthlyKasbonMatrix.totalKasbonAmount || 0)}
                        </div>
                      </div>
                    </div>
                    <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 14, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12, boxShadow: '0 2px 6px rgba(37, 99, 235, 0.05)' }}>
                      <div style={{ width: 42, height: 42, borderRadius: 12, background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0, boxShadow: '0 4px 10px rgba(37, 99, 235, 0.25)' }}>
                        👥
                      </div>
                      <div>
                        <div style={{ fontSize: 11, fontWeight: 700, color: '#1e40af', textTransform: 'uppercase', letterSpacing: 0.3 }}>Karyawan Berkasbon</div>
                        <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: 19, fontWeight: 800, color: '#1d4ed8', marginTop: 2 }}>
                          {monthlyKasbonMatrix.usersWithKasbonCount || 0} orang
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {kasbonLoading && <p role="status" className="notice">Memuat laporan kasbon...</p>}
                {kasbonError && <p role="alert" className="notice notice-error">{kasbonError}</p>}
                {/* MATRIX TABLE */}
                <AdminTableViewport className="kasbon-table-container" label="Tabel kasbon bulanan">
                  {!monthlyKasbonMatrix?.rows || monthlyKasbonMatrix.rows.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '50px 20px', color: '#64748b' }}>
                      <div style={{ fontSize: 36, marginBottom: 12 }}>💳</div>
                      <h4 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a' }}>
                        Belum Ada Data Transaksi untuk Periode Ini
                      </h4>
                      <p style={{ fontSize: 13, margin: '6px 0 0 0' }}>
                        Tidak ada pesanan tercatat di bulan {monthlyKasbonMatrix?.monthName} {kasbonYear}.
                      </p>
                    </div>
                  ) : (
                    <table className="admin-table kasbon-matrix-table" style={{ fontSize: 12, minWidth: 960 }}>
                      <thead>
                        <tr>
                          <th style={{ width: 44, textAlign: 'center' }}>No</th>
                          <th style={{ minWidth: 160 }}>Nama & Divisi</th>
                          <th style={{ minWidth: 140 }}>Total Kasbon</th>
                          <th style={{ minWidth: 140 }}>Perusahaan</th>
                          <th style={{ minWidth: 170 }}>Aksi / Pelunasan</th>
                          {Array.from({ length: monthlyKasbonMatrix.daysInMonth }, (_, i) => i + 1).map((d) => (
                            <th key={d} style={{ textAlign: 'center', minWidth: 54, padding: '8px 4px' }}>
                              <div style={{ fontSize: 11, fontWeight: 700 }}>Tgl {d}</div>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {monthlyKasbonMatrix.rows.map((row, idx) => (
                          <tr key={row.employeeKey} style={{ background: row.totalKasbon > 0 ? '#fffdfa' : '#ffffff' }}>
                            <td style={{ textAlign: 'center', fontWeight: 600, color: '#94a3b8' }}>
                              {idx + 1}
                            </td>
                            <td>
                              <strong style={{ fontSize: 13, color: '#0f172a', display: 'block' }}>
                                {row.userName}
                              </strong>
                              <span style={{ fontSize: 11, color: '#64748b' }}>
                                Divisi: {row.division || '-'}
                              </span>
                            </td>
                            <td>
                              {row.totalKasbon > 0 ? (
                                <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, padding: '4px 8px', display: 'inline-block' }}>
                                  <strong style={{ fontFamily: 'Outfit, sans-serif', fontSize: 13, color: '#dc2626', display: 'block' }}>
                                    {formatRupiah(row.totalKasbon)}
                                  </strong>
                                  <span style={{ fontSize: 9.5, color: '#b91c1c', fontWeight: 700 }}>
                                    Tagihan Kasbon
                                  </span>
                                </div>
                              ) : (
                                <div style={{ background: '#f1f5f9', borderRadius: 8, padding: '3px 8px', display: 'inline-block', color: '#64748b', fontSize: 11.5, fontWeight: 600 }}>
                                  Tidak ada kasbon
                                </div>
                              )}
                            </td>
                            <td>
                              <span className="cat-badge cat-badge-karbohidrat" style={{ fontSize: 11, maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'inline-block' }}>
                                🏢 {row.company}
                              </span>
                            </td>
                            <td>
                              {row.totalKasbon > 0 ? (
                                <div className="payment-status">
                                  <label className="modern-toggle">
                                    <input type="checkbox" role="switch"
                                      aria-label={'Sudah bayar kasbon ' + row.userName + ' periode ' + monthlyKasbonMatrix.monthName + ' ' + kasbonYear}
                                      checked={row.isPaid === true}
                                      disabled={kasbonLoading || Boolean(savingPayments[row.employeeKey])}
                                      onChange={event => onToggleKasbonPayment(row,event.target.checked)}
                                    />
                                    <span className="toggle-slider"></span>
                                  </label>
                                  <span>{savingPayments[row.employeeKey] ? 'Menyimpan...' : row.isPaid ? 'Sudah bayar' : 'Belum bayar'}</span>
                                  {row.isPaid && row.paidAt && <small>{new Date(row.paidAt).toLocaleDateString('id-ID',{timeZone:'Asia/Jakarta'})}</small>}
                                </div>
                              ) : <span className="text-muted">-</span>}
                            </td>
                            {Array.from({ length: monthlyKasbonMatrix.daysInMonth }, (_, i) => i + 1).map((d) => {
                              const dayData = row.days[d];
                              if (!dayData || (!dayData.hasKasbon && !dayData.hasCash)) {
                                return (
                                  <td key={d} style={{ textAlign: 'center', color: '#cbd5e1', padding: '6px 2px' }}>
                                    -
                                  </td>
                                );
                              }
                              return (
                                <td key={d} style={{ textAlign: 'center', padding: '6px 2px' }}>
                                  {dayData.hasKasbon && (
                                    <div
                                      style={{
                                        background: '#fee2e2',
                                        border: '1px solid #fca5a5',
                                        color: '#b91c1c',
                                        fontWeight: 700,
                                        fontSize: 10.5,
                                        padding: '2px 4px',
                                        borderRadius: 4,
                                        marginBottom: dayData.hasCash ? 3 : 0,
                                        whiteSpace: 'nowrap'
                                      }}
                                      title={`Kasbon: ${formatRupiah(dayData.kasbonAmount)} (${dayData.orderCount} order)`}
                                    >
                                      KB: {Math.round(dayData.kasbonAmount / 1000)}k
                                    </div>
                                  )}
                                  {dayData.hasCash && (
                                    <div
                                      style={{
                                        background: '#dcfce7',
                                        border: '1px solid #86efac',
                                        color: '#15803d',
                                        fontWeight: 700,
                                        fontSize: 10.5,
                                        padding: '2px 4px',
                                        borderRadius: 4,
                                        whiteSpace: 'nowrap'
                                      }}
                                      title={`Cash: ${formatRupiah(dayData.cashAmount)}`}
                                    >
                                      Cash
                                    </div>
                                  )}
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </AdminTableViewport>
              </div>
  );
}
