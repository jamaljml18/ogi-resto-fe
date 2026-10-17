'use client';
import {DAYS_LIST,formatRupiah,PRESET_COMPANIES,PRESET_DIVISIONS,PRESET_LOCATIONS} from '../../models/initialData';

export default function AdminOrdersView({ordersSummary,totalPortionsSold,ordersHistory,adminOrdersFilter,setAdminOrdersFilter,adminOrdersSearch,setAdminOrdersSearch,onResetOrdersFilter,onExportCsv,userDailyTotals,userDailyOrderCounts,todayIsoDate,availableDivisions,availableCompanies,availableLocations}) {
  return (
              <div>
                {/* 4 EXECUTIVE KPI STATS CARDS */}
                <div className="stats-grid">
                  <div className="stat-card">
                    <div className="stat-icon-wrap">🛍️</div>
                    <div className="stat-info">
                      <span className="stat-label">Total Transaksi</span>
                      <div className="stat-val">{ordersSummary.totalTransactions} Pesanan</div>
                      <div className="stat-subtext">Pemesanan tercatat di sistem</div>
                    </div>
                  </div>

                  <div className="stat-card stat-green">
                    <div className="stat-icon-wrap" style={{ color: '#059669', background: '#ecfdf5', borderColor: '#a7f3d0' }}>
                      💰
                    </div>
                    <div className="stat-info">
                      <span className="stat-label">Total Omset Penjualan</span>
                      <div className="stat-val" style={{ color: '#059669' }}>
                        {formatRupiah(ordersSummary.totalRevenue, false)}
                      </div>
                      <div className="stat-subtext">Akumulasi pendapatan order</div>
                    </div>
                  </div>

                  <div className="stat-card stat-blue">
                    <div className="stat-icon-wrap" style={{ color: '#0284c7', background: '#f0f9ff', borderColor: '#bae6fd' }}>
                      📈
                    </div>
                    <div className="stat-info">
                      <span className="stat-label">Rata-rata Nilai Order</span>
                      <div className="stat-val" style={{ color: '#0284c7' }}>
                        {formatRupiah(ordersSummary.averageOrderValue, false)}
                      </div>
                      <div className="stat-subtext">Per struk pemesanan</div>
                    </div>
                  </div>

                  <div className="stat-card stat-purple">
                    <div className="stat-icon-wrap" style={{ color: '#7c3aed', background: '#f5f3ff', borderColor: '#ddd6fe' }}>
                      🍱
                    </div>
                    <div className="stat-info">
                      <span className="stat-label">Total Porsi Terjual</span>
                      <div className="stat-val" style={{ color: '#7c3aed' }}>
                        {totalPortionsSold} Porsi
                      </div>
                      <div className="stat-subtext">Seluruh menu makanan/minuman</div>
                    </div>
                  </div>
                </div>

                {/* TOOLBAR FILTER MULTI-DIMENSI & EXPORT */}
                <div className="filter-card-panel">
                  <div className="filter-card-header">
                    <div>
                      <h4 style={{ fontSize: 14.5, fontWeight: 800, color: '#0f172a', margin: 0 }}>
                        🔍 Filter & Pencarian Riwayat Pemesanan
                      </h4>
                      <p style={{ fontSize: 12, color: '#64748b', margin: '2px 0 0 0' }}>
                        Saring data berdasarkan nama, divisi, perusahaan, atau jadwal pengantaran.
                      </p>
                    </div>
                    <div>
                      <button
                        type="button"
                        className="btn-export-csv"
                        onClick={onExportCsv}
                        title="Unduh data pesanan ke dalam file Microsoft Excel / Spreadsheet CSV"
                      >
                        📥 Unduh Laporan Excel / CSV
                      </button>
                    </div>
                  </div>

                  {/* FILTER WAKTU (TANGGAL, BULAN, TAHUN, DAN RANGE) */}
                  <div
                    className="filter-date-row"
                    style={{
                      background: '#f8fafc',
                      padding: '12px 16px',
                      borderRadius: 12,
                      marginBottom: 12,
                      border: '1px solid #e2e8f0',
                      display: 'flex',
                      flexWrap: 'wrap',
                      alignItems: 'center',
                      gap: 12
                    }}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', minWidth: 170 }}>
                      <label className="filter-label" style={{ fontWeight: 700, color: '#334155' }}>
                        📅 Filter Tanggal / Periode
                      </label>
                      <select
                        className="form-input"
                        value={adminOrdersFilter.dateFilterType || 'all'}
                        onChange={(e) =>
                          setAdminOrdersFilter({
                            ...adminOrdersFilter,
                            dateFilterType: e.target.value
                          })
                        }
                      >
                        <option value="all">Semua Waktu</option>
                        <option value="today">⚡ Hari Ini</option>
                        <option value="single">Pilih Tanggal Tertentu</option>
                        <option value="range">Rentang Tanggal (Date Range)</option>
                        <option value="month_year">Bulan & Tahun</option>
                      </select>
                    </div>

                    {adminOrdersFilter.dateFilterType === 'today' && (
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 6,
                          background: '#f0f9ff',
                          border: '1px solid #bae6fd',
                          color: '#0369a1',
                          padding: '7px 12px',
                          borderRadius: 8,
                          fontSize: 12,
                          fontWeight: 700,
                          alignSelf: 'flex-end',
                          marginBottom: 1
                        }}
                      >
                        <span>🗓️</span>
                        <span>Pesanan Tanggal: <strong>{todayIsoDate || 'Hari Ini'}</strong></span>
                      </div>
                    )}

                    {adminOrdersFilter.dateFilterType === 'single' && (
                      <div style={{ display: 'flex', flexDirection: 'column', minWidth: 160 }}>
                        <label className="filter-label" style={{ fontWeight: 700, color: '#334155' }}>
                          Pilih Tanggal:
                        </label>
                        <input
                          type="date"
                          className="form-input"
                          value={adminOrdersFilter.singleDate || ''}
                          onChange={(e) =>
                            setAdminOrdersFilter({
                              ...adminOrdersFilter,
                              singleDate: e.target.value
                            })
                          }
                        />
                      </div>
                    )}

                    {adminOrdersFilter.dateFilterType === 'range' && (
                      <>
                        <div style={{ display: 'flex', flexDirection: 'column', minWidth: 150 }}>
                          <label className="filter-label" style={{ fontWeight: 700, color: '#334155' }}>
                            Dari Tanggal:
                          </label>
                          <input
                            type="date"
                            className="form-input"
                            value={adminOrdersFilter.startDate || ''}
                            onChange={(e) =>
                              setAdminOrdersFilter({
                                ...adminOrdersFilter,
                                startDate: e.target.value
                              })
                            }
                          />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', minWidth: 150 }}>
                          <label className="filter-label" style={{ fontWeight: 700, color: '#334155' }}>
                            Sampai Tanggal:
                          </label>
                          <input
                            type="date"
                            className="form-input"
                            value={adminOrdersFilter.endDate || ''}
                            onChange={(e) =>
                              setAdminOrdersFilter({
                                ...adminOrdersFilter,
                                endDate: e.target.value
                              })
                            }
                          />
                        </div>
                      </>
                    )}

                    {adminOrdersFilter.dateFilterType === 'month_year' && (
                      <>
                        <div style={{ display: 'flex', flexDirection: 'column', minWidth: 150 }}>
                          <label className="filter-label" style={{ fontWeight: 700, color: '#334155' }}>
                            Pilih Bulan:
                          </label>
                          <select
                            className="form-input"
                            value={adminOrdersFilter.month || 'Semua'}
                            onChange={(e) =>
                              setAdminOrdersFilter({
                                ...adminOrdersFilter,
                                month: e.target.value
                              })
                            }
                          >
                            <option value="Semua">Semua Bulan</option>
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
                        <div style={{ display: 'flex', flexDirection: 'column', minWidth: 130 }}>
                          <label className="filter-label" style={{ fontWeight: 700, color: '#334155' }}>
                            Pilih Tahun:
                          </label>
                          <select
                            className="form-input"
                            value={adminOrdersFilter.year || 'Semua'}
                            onChange={(e) =>
                              setAdminOrdersFilter({
                                ...adminOrdersFilter,
                                year: e.target.value
                              })
                            }
                          >
                            <option value="Semua">Semua Tahun</option>
                            <option value="2024">2024</option>
                            <option value="2025">2025</option>
                            <option value="2026">2026</option>
                            <option value="2027">2027</option>
                            <option value="2028">2028</option>
                            <option value="2029">2029</option>
                            <option value="2030">2030</option>
                          </select>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="filter-grid">
                    <div className="filter-field">
                      <label className="filter-label">Cari Nama Pemesan</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Ketik kata kunci..."
                        value={adminOrdersSearch}
                        onChange={(e) => setAdminOrdersSearch(e.target.value)}
                      />
                    </div>

                    <div className="filter-field">
                      <label className="filter-label">Perusahaan</label>
                      <select
                        className="form-input"
                        value={adminOrdersFilter.company}
                        onChange={(e) =>
                          setAdminOrdersFilter({ ...adminOrdersFilter, company: e.target.value })
                        }
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
                        value={adminOrdersFilter.division}
                        onChange={(e) =>
                          setAdminOrdersFilter({ ...adminOrdersFilter, division: e.target.value })
                        }
                      >
                        <option value="Semua">Semua Divisi</option>
                        {(availableDivisions || PRESET_DIVISIONS).map((d) => (
                          <option key={d} value={d}>
                            {d}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="filter-field">
                      <label className="filter-label">Lokasi Pengantaran</label>
                      <select
                        className="form-input"
                        value={adminOrdersFilter.location}
                        onChange={(e) =>
                          setAdminOrdersFilter({ ...adminOrdersFilter, location: e.target.value })
                        }
                      >
                        <option value="Semua">Semua Lokasi</option>
                        {(availableLocations || PRESET_LOCATIONS).map((loc) => (
                          <option key={loc} value={loc}>
                            {loc}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="filter-field">
                      <label className="filter-label">Jadwal Hari</label>
                      <select
                        className="form-input"
                        value={adminOrdersFilter.day}
                        onChange={(e) =>
                          setAdminOrdersFilter({ ...adminOrdersFilter, day: e.target.value })
                        }
                      >
                        <option value="Semua">Semua Hari</option>
                        {DAYS_LIST.map((d) => (
                          <option key={d} value={d}>
                            {d}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="filter-field" style={{ justifyContent: 'flex-end', display: 'flex', flexDirection: 'column' }}>
                      <button
                        type="button"
                        className="btn-reset-filters"
                        onClick={onResetOrdersFilter}
                      >
                        ↺ Bersihkan Semua Filter
                      </button>
                    </div>
                  </div>
                </div>

                {/* TABEL RIWAYAT PESANAN */}
                <div className="admin-table-container">
                  {ordersHistory.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '50px 20px', color: '#64748b' }}>
                      <div style={{ fontSize: 36, marginBottom: 12 }}>📭</div>
                      <h4 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a' }}>
                        Belum Ada Pesanan yang Sesuai
                      </h4>
                      <p style={{ fontSize: 13, margin: '6px 0 0 0' }}>
                        Tidak ada riwayat transaksi yang cocok dengan kriteria filter saat ini.
                      </p>
                    </div>
                  ) : (
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Waktu & No. Order</th>
                          <th>Data Pemesan</th>
                          <th>Kantor & Lokasi</th>
                          <th>Jadwal Pengantaran</th>
                          <th>Detail Menu & Catatan</th>
                          <th>Metode Bayar</th>
                          <th style={{ textAlign: 'right' }}>Total Order</th>
                          <th style={{ textAlign: 'right' }}>Total Harian Pemesan</th>
                        </tr>
                      </thead>
                      <tbody>
                        {ordersHistory.map((ord) => {
                          const dateFormatted = ord.created_at
                            ? new Date(ord.created_at).toLocaleString('id-ID', {
                                day: '2-digit',
                                month: 'short',
                                hour: '2-digit',
                                minute: '2-digit'
                              })
                            : '-';

                          const paymentMethod = ord.payment_method || ord.paymentMethod || 'Cash';
                          const isKasbon = paymentMethod === 'Kasbon';
                          const notes = ord.notes || '';
                          const userKey = JSON.stringify([
                            (ord.user_name || ord.userName || '').trim().toLowerCase(),
                            ord.company,ord.division,ord.order_date || (ord.created_at ? ord.created_at.split('T')[0] : '')
                          ]);
                          const dailyTotal = (userDailyTotals && userDailyTotals[userKey]) || (ord.total_price || ord.totalPrice);
                          const orderCount = (userDailyOrderCounts && userDailyOrderCounts[userKey]) || 1;

                          return (
                            <tr key={ord.order_number || ord.id}>
                              <td>
                                <strong style={{ fontSize: 13, color: 'var(--primary)', fontFamily: 'monospace' }}>
                                  {ord.order_number || ord.id}
                                </strong>
                                <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 3 }}>
                                  🕒 {dateFormatted}
                                </div>
                              </td>
                              <td>
                                <strong style={{ fontSize: 13.5, color: '#0f172a' }}>
                                  {ord.user_name || ord.userName}
                                </strong>
                                <div style={{ fontSize: 11.5, color: '#64748b' }}>
                                  Divisi: <strong style={{ color: '#334155' }}>{ord.division}</strong>
                                </div>
                              </td>
                              <td>
                                <span className="cat-badge cat-badge-karbohidrat" style={{ marginBottom: 4, display: 'inline-block' }}>
                                  🏢 {ord.company}
                                </span>
                                <div style={{ fontSize: 12, color: '#0f172a', fontWeight: 600 }}>
                                  📍 {ord.location}
                                </div>
                              </td>
                              <td>
                                <span className="order-day-pill">
                                  📅 {ord.order_day || ord.orderDay || 'Hari Ini'}
                                </span>
                                {ord.order_date && (
                                  <div style={{ fontSize: 11, color: '#64748b', marginTop: 4, fontWeight: 600 }}>
                                    🗓️ Tgl Kirim: {ord.order_date}
                                  </div>
                                )}
                              </td>
                              <td>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                  {Array.isArray(ord.items) &&
                                    ord.items.filter(it => it && !it._meta).map((it, idx) => (
                                      <div key={idx} style={{ fontSize: 12, color: '#334155' }}>
                                        • <strong>{it.name}</strong> <span style={{ color: 'var(--primary)', fontWeight: 700 }}>x{it.qty}</span>
                                      </div>
                                    ))}
                                </div>
                                {notes && (
                                  <div
                                    style={{
                                      marginTop: 6,
                                      padding: '4px 8px',
                                      background: '#fffbeb',
                                      border: '1px solid #fde68a',
                                      borderRadius: 6,
                                      fontSize: 11.5,
                                      color: '#92400e'
                                    }}
                                  >
                                    <strong>📝 Catatan:</strong> &quot;{notes}&quot;
                                  </div>
                                )}
                              </td>
                              <td>
                                {isKasbon ? (
                                  <span
                                    style={{
                                      background: '#fef3c7',
                                      color: '#b45309',
                                      padding: '4px 10px',
                                      borderRadius: 6,
                                      fontWeight: 700,
                                      fontSize: 12,
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: 4
                                    }}
                                  >
                                    📝 Kasbon
                                  </span>
                                ) : (
                                  <span
                                    style={{
                                      background: '#ecfdf5',
                                      color: '#047857',
                                      padding: '4px 10px',
                                      borderRadius: 6,
                                      fontWeight: 700,
                                      fontSize: 12,
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: 4
                                    }}
                                  >
                                    💵 Cash / Transfer
                                  </span>
                                )}
                              </td>
                              <td style={{ textAlign: 'right' }}>
                                <strong style={{ fontFamily: 'Outfit, sans-serif', fontSize: 14, color: '#334155' }}>
                                  {formatRupiah(ord.total_price || ord.totalPrice)}
                                </strong>
                              </td>
                              <td style={{ textAlign: 'right' }}>
                                {orderCount > 1 ? (
                                  <div>
                                    <strong style={{ fontFamily: 'Outfit, sans-serif', fontSize: 14.5, color: '#059669', display: 'block' }}>
                                      {formatRupiah(dailyTotal)}
                                    </strong>
                                    <span
                                      style={{
                                        display: 'inline-block',
                                        marginTop: 3,
                                        background: '#dcfce7',
                                        color: '#15803d',
                                        fontSize: 10.5,
                                        fontWeight: 700,
                                        padding: '2px 6px',
                                        borderRadius: 4
                                      }}
                                    >
                                      ⚡ Akumulasi ({orderCount}x order)
                                    </span>
                                  </div>
                                ) : (
                                  <div>
                                    <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: 13.5, color: '#64748b' }}>
                                      {formatRupiah(dailyTotal)}
                                    </span>
                                    <span style={{ display: 'block', fontSize: 10, color: '#94a3b8' }}>
                                      (1x order)
                                    </span>
                                  </div>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
  );
}
