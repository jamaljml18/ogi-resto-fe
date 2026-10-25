'use client';
import AdminTableViewport from './AdminTableViewport';
import { orderDailyIdentity } from '../../models/identityModel';
import {DAYS_LIST,formatRupiah,PRESET_COMPANIES,PRESET_DIVISIONS,PRESET_LOCATIONS} from '../../models/initialData';

export default function AdminOrdersView({refreshOrdersHistory,ordersHistoryError,ordersSummary,totalPortionsSold,ordersHistory,ordersGroupedHistory=[],ordersCompact=false,setOrdersCompact,adminOrdersFilter,setAdminOrdersFilter,adminOrdersSearch,setAdminOrdersSearch,onResetOrdersFilter,onExportCsv,userDailyTotals,userDailyOrderCounts,todayIsoDate,availableDivisions,availableCompanies,availableLocations,openOrderEditor}) {
  const visibleOrders = ordersCompact ? ordersGroupedHistory : ordersHistory;
  return (
              <div>
                <div className="schedule-hero-banner">
                  <div className="schedule-hero-title">
                    <h3>Riwayat Pesanan &amp; Laporan CSV</h3>
                    <p>Data diperbarui otomatis setiap 5 detik selama tab ini aktif, mengikuti filter yang dipilih.</p>
                  </div>
                  <button type="button" className="btn-outline-admin" onClick={refreshOrdersHistory}>Muat Ulang</button>
                </div>
                {ordersHistoryError && <p className="payment-history-error" role="status">{ordersHistoryError} Data terakhir tetap ditampilkan. Silakan muat ulang.</p>}
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

                <div className="orders-grouping-toolbar">
                  <div>
                    <strong>{ordersCompact ? 'Ringkasan per Pemesan' : 'Rincian per Pesanan'}</strong>
                    <p>{ordersCompact
                      ? 'Satu baris per nama, perusahaan, divisi, dan tanggal pengantaran. Menu dan total dijumlahkan.'
                      : 'Setiap nomor pesanan ditampilkan sebagai satu baris.'}</p>
                    <span>{visibleOrders.length} baris dari {ordersHistory.length} pesanan</span>
                  </div>
                  <button type="button" className="btn-outline-admin" aria-pressed={ordersCompact}
                    onClick={() => setOrdersCompact(previous => !previous)}>
                    {ordersCompact ? 'Tampilkan Semua Pesanan' : 'Ringkas per Pemesan'}
                  </button>
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
                        {ordersCompact ? '📥 Unduh CSV Ringkasan' : '📥 Unduh Laporan Excel / CSV'}
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
                                month: e.target.value,
                                year: e.target.value !== 'Semua' && (!adminOrdersFilter.year || adminOrdersFilter.year === 'Semua')
                                  ? (todayIsoDate?.slice(0, 4) || String(new Date().getFullYear()))
                                  : adminOrdersFilter.year
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
                                year: e.target.value,
                                month: e.target.value === 'Semua' ? 'Semua' : adminOrdersFilter.month
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
                <AdminTableViewport className="orders-history-table-container" label="Tabel riwayat pesanan">
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
                    <table className={'admin-table orders-history-table' + (ordersCompact ? ' orders-table-grouped' : '')}>
                      <colgroup>
                        <col className="order-col-reference" />
                        <col className="order-col-customer" />
                        <col className="order-col-menu" />
                        <col className="order-col-office" />
                        <col className="order-col-delivery" />
                        <col className="order-col-payment" />
                        <col className="order-col-total" />
                        <col className="order-col-daily" />
                        <col className="order-col-actions" />
                      </colgroup>
                      <thead>
                        <tr>
                          <th>Waktu & No. Order</th>
                          <th>Data Pemesan</th>
                          <th>Detail Menu & Catatan</th>
                          <th>Kantor & Lokasi</th>
                          <th>Jadwal Pengantaran</th>
                          <th>Metode Bayar</th>
                          <th style={{ textAlign: 'right' }}>{ordersCompact ? 'Total Gabungan' : 'Total Order'}</th>
                          <th style={{ textAlign: 'right' }}>Total Harian Pemesan</th>
                          <th>Aksi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {visibleOrders.map((ord) => {
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
                          const userKey = orderDailyIdentity(ord);
                          const dailyTotal = ordersCompact ? ord.total_price : (userDailyTotals && userDailyTotals[userKey]) || (ord.total_price || ord.totalPrice);
                          const orderCount = ordersCompact ? ord.order_count : (userDailyOrderCounts && userDailyOrderCounts[userKey]) || 1;

                          return (
                            <tr key={ord._group_key || ord.order_number || ord.id}>
                              <td>
                                <strong className={'order-reference' + (ordersCompact ? ' order-reference-grouped' : '')}>
                                  {ordersCompact ? ord.order_count + ' pesanan digabung' : ord.order_number || ord.id}
                                </strong>
                                {ordersCompact && <details className="order-group-numbers">
                                  <summary>Lihat nomor pesanan</summary>
                                  <div className="order-group-number-list">
                                    {ord.order_numbers.map((number, index) => <div key={number + '-' + index}>{number}</div>)}
                                  </div>
                                </details>}
                                <div className="order-row-time">🕒 {ordersCompact ? 'Terakhir: ' : ''}{dateFormatted}</div>
                              </td>
                              <td>
                                <strong className="order-customer-name">{ord.user_name || ord.userName}</strong>
                                <div className="order-secondary-text">Divisi: <strong>{ord.division}</strong></div>
                              </td>
                              <td>
                                <ul className="order-menu-list">
                                  {Array.isArray(ord.items) && ord.items.filter(item => item && !item._meta).map((item, index) => (
                                    <li key={index}>
                                      <span>{item.name}</span><span className="order-menu-quantity">×{item.qty}</span>
                                    </li>
                                  ))}
                                </ul>
                                {notes && (ordersCompact ? (
                                  <details className="order-notes">
                                    <summary>📝 Lihat catatan</summary>
                                    <p>{notes}</p>
                                  </details>
                                ) : (
                                  <div className="order-notes order-notes-visible">
                                    <strong>Catatan:</strong>
                                    <p>{notes}</p>
                                  </div>
                                ))}
                              </td>
                              <td>
                                <span className="order-company-badge">
                                  <span aria-hidden="true">🏢</span><span>{ord.company || '-'}</span>
                                </span>
                                <div className="order-location"><span aria-hidden="true">📍</span><span>{ord.location || '-'}</span></div>
                              </td>
                              <td>
                                <span className="order-delivery-day">📅 {ord.order_day || ord.orderDay || 'Hari Ini'}</span>
                                {ord.order_date && <div className="order-delivery-date">
                                  <span>Tgl Kirim:</span> <time dateTime={ord.order_date}>{ord.order_date}</time>
                                </div>}
                              </td>
                              <td>
                                {ord.payment_methods?.length > 1 ? (
                                  <div className="order-group-payment-methods">
                                    <span className="order-payment-badge order-payment-cash">Cash / Transfer</span>
                                    <span className="order-payment-subtotal">{formatRupiah(ord.cash_total)}</span>
                                    <span className="order-payment-badge order-payment-kasbon">Kasbon</span>
                                    <span className="order-payment-subtotal">{formatRupiah(ord.kasbon_total)}</span>
                                  </div>
                                ) : (
                                  <span className={'order-payment-badge ' + (isKasbon ? 'order-payment-kasbon' : 'order-payment-cash')}>
                                    <span aria-hidden="true">{isKasbon ? '📝' : '💵'}</span>
                                    <span>{isKasbon ? 'Kasbon' : 'Cash / Transfer'}</span>
                                  </span>
                                )}
                              </td>
                              <td className="order-amount-cell">
                                <strong className="order-amount">{formatRupiah(ord.total_price ?? ord.totalPrice)}</strong>
                              </td>
                              <td className="order-amount-cell">
                                <strong className={'order-amount' + (orderCount > 1 ? ' order-amount-accent' : '')}>{formatRupiah(dailyTotal)}</strong>
                                <span className={'order-daily-count' + (orderCount > 1 ? ' order-daily-count-accumulated' : '')}>
                                  {orderCount > 1 ? 'Akumulasi (' + orderCount + '× order)' : '1× order'}
                                </span>
                              </td>
                              <td>
                                {ordersCompact && ord.order_numbers?.length > 1 ? (
                                  <details className="order-edit-picker">
                                    <summary>Edit pesanan</summary>
                                    <div>{ord.order_numbers.map(number => <button key={number} type="button" onClick={() => openOrderEditor(number)}>Edit {number}</button>)}</div>
                                  </details>
                                ) : <button type="button" className="admin-row-action admin-row-action-edit" onClick={() => openOrderEditor(ord.order_numbers?.[0] || ord.order_number)} aria-label={'Edit pesanan ' + (ord.user_name || ord.userName)}>
                                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="m16 3 5 5-12 12H4v-5L16 3ZM14 5l5 5" /></svg><span>Edit</span>
                                </button>}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  )}
                </AdminTableViewport>
              </div>
  );
}
