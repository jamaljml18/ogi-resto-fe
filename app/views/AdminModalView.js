'use client';

import React from 'react';
import {
  DAYS_LIST,
  getMenuIcon,
  formatRupiah,
  PRESET_COMPANIES,
  PRESET_DIVISIONS,
  PRESET_LOCATIONS
} from '../models/initialData';

export default function AdminModalView({
  isOpen,
  onClose,
  isAdminLoggedIn,
  clockTime,
  todayName,
  adminLoginForm,
  setAdminLoginForm,
  adminLoginError,
  showAdminPassword,
  setShowAdminPassword,
  onAdminLogin,
  onAdminLogout,
  adminActiveTab,
  setAdminActiveTab,
  adminScheduleDay,
  setAdminScheduleDay,
  adminScheduleSearch,
  setAdminScheduleSearch,
  adminScheduleCategory,
  setAdminScheduleCategory,
  categories,
  filteredAdminMenus,
  adminAllMenus,
  adminSchedules,
  activeCountForDay,
  isSavingSchedule,
  onSaveSchedules,
  onToggleMenuDayAvailability,
  onBulkToggleDay,
  // Add menu
  showAddMenuModal,
  setShowAddMenuModal,
  newMenuForm,
  setNewMenuForm,
  onAddNewMenu,
  // Edit menu
  showEditMenuModal,
  setShowEditMenuModal,
  editingMenuForm,
  setEditingMenuForm,
  onOpenEditModal,
  onSaveEditedMenu,
  // Delete menu
  onDeleteMenu,
  // Orders tab
  ordersSummary,
  totalPortionsSold,
  ordersHistory,
  adminOrdersFilter,
  setAdminOrdersFilter,
  adminOrdersSearch,
  setAdminOrdersSearch,
  onResetOrdersFilter,
  onExportCsv,
  userDailyTotals,
  userDailyOrderCounts,
  todayIsoDate,
  // Kasbon tab
  kasbonMonth,
  setKasbonMonth,
  kasbonYear,
  setKasbonYear,
  kasbonCompany,
  setKasbonCompany,
  kasbonDivision,
  setKasbonDivision,
  availableDivisions,
  availableCompanies,
  availableLocations,
  monthlyKasbonMatrix,
  onExportKasbonCsv,
  adminToast
}) {
  if (!isOpen) return null;

  return (
    <>
      {/* Toast Notification */}
      {adminToast && <div className="admin-toast-banner">{adminToast}</div>}

      {/* LOGIN MODAL (JIKA BELUM LOGIN) */}
      {!isAdminLoggedIn ? (
        <div className="admin-login-backdrop">
          <div className="admin-login-card">
            <button className="admin-login-close" onClick={onClose} type="button">
              ✕
            </button>
            <div className="admin-shield-icon">🔐</div>
            <h2 className="admin-login-title">Autentikasi Panel Admin</h2>
            <p className="admin-login-subtitle">
              Akses khusus pengelola Ogi Resto melalui rute rahasia <code>/ogi</code>.
            </p>

            <div
              className="demo-hint-pill"
              onClick={() =>
                setAdminLoginForm({ username: 'admin', password: 'admin123' })
              }
              title="Klik untuk mengisi data uji coba secara cepat"
            >
              <span>💡</span>
              <span><strong>Demo Akun:</strong> admin / admin123 (Klik di sini)</span>
            </div>

            <form onSubmit={onAdminLogin} style={{ textAlign: 'left' }}>
              {adminLoginError && (
                <div className="admin-login-alert" style={{ background: '#fff1f2', border: '1px solid #fecdd3', color: '#e11d48', padding: '10px 14px', borderRadius: 10, fontSize: 13, marginBottom: 14 }}>
                  <span>⚠️</span> {adminLoginError}
                </div>
              )}

              <div className="form-group">
                <label className="form-label">Username Admin</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  placeholder="Masukkan username (admin)"
                  value={adminLoginForm.username}
                  onChange={(e) =>
                    setAdminLoginForm({ ...adminLoginForm, username: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label className="form-label">Password Admin</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showAdminPassword ? 'text' : 'password'}
                    required
                    className="form-input"
                    placeholder="Masukkan password (admin123)"
                    value={adminLoginForm.password}
                    onChange={(e) =>
                      setAdminLoginForm({ ...adminLoginForm, password: e.target.value })
                    }
                  />
                  <button
                    type="button"
                    style={{
                      position: 'absolute',
                      right: 12,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: 14,
                      color: '#64748b'
                    }}
                    onClick={() => setShowAdminPassword(!showAdminPassword)}
                  >
                    {showAdminPassword ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={onClose}
                  style={{ flex: 1, padding: '12px 16px' }}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  style={{ flex: 2, padding: '12px 20px', fontSize: 14 }}
                >
                  Masuk ke Panel Admin ➔
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        /* WORKSPACE PANEL ADMIN (JIKA SUDAH LOGIN) */
        <div className="admin-portal-overlay">
          <div className="admin-portal-window">
            {/* EXECUTIVE TOP NAVIGATION HEADER */}
            <div className="admin-top-header">
              <div className="admin-brand-group">
                <div className="admin-brand-icon">🍽️</div>
                <div className="admin-brand-text">
                  <h2>
                    Ogi Resto <span className="admin-role-badge">Admin</span>
                  </h2>
                  <div className="admin-status-indicator">
                    <span className="admin-status-dot"></span>
                    <span>Online</span>
                  </div>
                </div>
              </div>

              <div className="admin-center-widget">
                <span>🕒</span>
                <span>{clockTime}</span>
              </div>

              <div className="admin-top-actions">
                <button
                  type="button"
                  className="admin-btn-preview"
                  onClick={onClose}
                  title="Tinjau tampilan menu yang dilihat pelanggan"
                >
                  <span>👁️</span>
                  <span className="btn-label-text">Menu Pelanggan</span>
                </button>
                <button
                  type="button"
                  className="admin-btn-logout"
                  onClick={onAdminLogout}
                  title="Keluar dari akun admin"
                >
                  <span>🚪</span>
                  <span className="btn-label-text">Keluar</span>
                </button>
                <button
                  type="button"
                  className="admin-btn-close"
                  onClick={onClose}
                  title="Tutup Panel Admin"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* SECONDARY NAVIGATION & TAB CONTROLS */}
            <div className="admin-tab-nav">
              <div className="admin-pill-tabs">
                <button
                  type="button"
                  className={`admin-pill-tab ${adminActiveTab === 'schedule' ? 'active' : ''}`}
                  onClick={() => setAdminActiveTab('schedule')}
                >
                  <span>📅 Manajemen Menu & Jadwal Mingguan</span>
                  <span className="admin-tab-count">{adminAllMenus.length}</span>
                </button>
                <button
                  type="button"
                  className={`admin-pill-tab ${adminActiveTab === 'orders' ? 'active' : ''}`}
                  onClick={() => setAdminActiveTab('orders')}
                >
                  <span>📊 Riwayat Pesanan & Laporan CSV</span>
                  <span className="admin-tab-count" style={{ background: '#ecfdf5', color: '#059669' }}>
                    {ordersHistory.length}
                  </span>
                </button>
                <button
                  type="button"
                  className={`admin-pill-tab ${adminActiveTab === 'kasbon' ? 'active' : ''}`}
                  onClick={() => setAdminActiveTab('kasbon')}
                >
                  <span>💳 Rekap Kasbon Bulanan</span>
                  <span className="admin-tab-count" style={{ background: '#fffbeb', color: '#b45309' }}>
                    {monthlyKasbonMatrix?.usersWithKasbonCount || 0}
                  </span>
                </button>
              </div>
            </div>

            {/* SCROLLABLE WORKSPACE AREA */}
            <div className="admin-workspace-area">
              {/* TAB 1: MANAJEMEN MENU & JADWAL MINGGUAN */}
              {adminActiveTab === 'schedule' && (
                <div>
                  <div className="schedule-hero-banner">
                    <div className="schedule-hero-title">
                      <h3>📅 Pengaturan Ketersediaan Menu Harian</h3>
                      <p>
                        Pilih hari di bawah untuk mengaktifkan atau menonaktifkan menu yang tersedia bagi pelanggan.
                      </p>
                    </div>
                    <div className="schedule-hero-actions">
                      <button
                        type="button"
                        className="btn-secondary"
                        onClick={() => setShowAddMenuModal(true)}
                      >
                        + Tambah Menu Baru
                      </button>
                      <button
                        type="button"
                        className="btn-success"
                        onClick={onSaveSchedules}
                        disabled={isSavingSchedule}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '9px 18px' }}
                      >
                        <span>💾</span> {isSavingSchedule ? 'Menyimpan...' : 'Simpan Jadwal'}
                      </button>
                    </div>
                  </div>

                {/* 7-DAY SEGMENTED CONTROL */}
                <div className="admin-days-segmented-bar">
                  {DAYS_LIST.map((day) => {
                    const isToday = day === todayName;
                    const isActive = adminScheduleDay === day;
                    return (
                      <button
                        key={day}
                        type="button"
                        className={`admin-day-tab-btn ${isActive ? 'active' : ''}`}
                        onClick={() => setAdminScheduleDay(day)}
                      >
                        {isToday && <span className="today-indicator-dot" title="Hari Ini"></span>}
                        <span>{day}</span>
                        {isToday && <span style={{ fontSize: 10, opacity: 0.8 }}>(Hari Ini)</span>}
                      </button>
                    );
                  })}
                </div>

                {/* SEARCH, CATEGORY, BULK CONTROLS */}
                <div className="schedule-controls-card">
                  <div className="schedule-search-wrap">
                    <input
                      type="text"
                      className="schedule-search-input"
                      placeholder="🔍 Cari nama menu di jadwal..."
                      value={adminScheduleSearch}
                      onChange={(e) => setAdminScheduleSearch(e.target.value)}
                    />
                  </div>

                  <div className="schedule-cat-pills">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        className={`cat-filter-btn ${adminScheduleCategory === cat ? 'active' : ''}`}
                        onClick={() => setAdminScheduleCategory(cat)}
                      >
                        {cat === 'Semua' ? 'Semua Kategori' : `${getMenuIcon(cat)} ${cat}`}
                      </button>
                    ))}
                  </div>

                  <div className="schedule-bulk-actions">
                    <button
                      type="button"
                      className="bulk-btn"
                      onClick={() => onBulkToggleDay(true)}
                      title={`Aktifkan semua menu untuk hari ${adminScheduleDay}`}
                    >
                      ⚡ Aktifkan Semua ({adminScheduleDay})
                    </button>
                    <button
                      type="button"
                      className="bulk-btn"
                      onClick={() => onBulkToggleDay(false)}
                      title={`Nonaktifkan semua menu untuk hari ${adminScheduleDay}`}
                    >
                      ⚪ Nonaktifkan Semua ({adminScheduleDay})
                    </button>
                  </div>
                </div>

                {/* SUMMARY COUNTER */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, padding: '0 4px', fontSize: 12.5, color: '#64748b', fontWeight: 600 }}>
                  <span>
                    Menampilkan <strong>{filteredAdminMenus.length}</strong> dari {adminAllMenus.length} menu •{' '}
                    <strong style={{ color: '#059669' }}>{activeCountForDay} menu aktif</strong> pada hari {adminScheduleDay}
                  </span>
                  {adminScheduleSearch && (
                    <button
                      style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: 12, fontWeight: 700 }}
                      onClick={() => setAdminScheduleSearch('')}
                      type="button"
                    >
                      Bersihkan Pencarian ✕
                    </button>
                  )}
                </div>

                {/* SCHEDULE TABLE */}
                <div className="admin-table-container">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th style={{ width: 130 }}>Status ({adminScheduleDay})</th>
                        <th>Nama Menu Makanan</th>
                        <th>Kategori</th>
                        <th>Harga Satuan</th>
                        <th>Ketersediaan Seminggu</th>
                        <th style={{ width: 140, textAlign: 'center' }}>Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredAdminMenus.map((m) => {
                        const isAvailable = adminSchedules[m.id]
                          ? adminSchedules[m.id][adminScheduleDay] !== false
                          : true;

                        let catBadgeClass = 'cat-badge-alat-makan';
                        if (m.category === 'Karbohidrat') catBadgeClass = 'cat-badge-karbohidrat';
                        else if (m.category === 'Sayur') catBadgeClass = 'cat-badge-sayur';
                        else if (m.category === 'Lauk') catBadgeClass = 'cat-badge-lauk';

                        return (
                          <tr key={m.id}>
                            <td>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <label className="modern-toggle">
                                  <input
                                    type="checkbox"
                                    checked={isAvailable}
                                    onChange={() => onToggleMenuDayAvailability(m.id, adminScheduleDay)}
                                  />
                                  <span className="toggle-slider"></span>
                                </label>
                                <span className={`status-pill ${isAvailable ? 'status-pill-active' : 'status-pill-inactive'}`}>
                                  {isAvailable ? '🟢 Aktif' : '⚪ Libur'}
                                </span>
                              </div>
                            </td>
                            <td>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <span style={{ fontSize: 22, width: 36, height: 36, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', borderRadius: 10, border: '1px solid #e2e8f0' }}>
                                  {getMenuIcon(m.category)}
                                </span>
                                <div>
                                  <strong style={{ fontSize: 13.5, color: '#0f172a' }}>{m.name}</strong>
                                  <div style={{ fontSize: 11, color: '#94a3b8', fontFamily: 'monospace' }}>
                                    ID: {m.id}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td>
                              <span className={`cat-badge ${catBadgeClass}`}>
                                {m.category}
                              </span>
                            </td>
                            <td>
                              <strong style={{ fontFamily: 'Outfit, sans-serif', fontSize: 14, color: 'var(--text-main)' }}>
                                {formatRupiah(m.price, true)}
                              </strong>
                            </td>
                            <td>
                              <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                                {DAYS_LIST.map((d) => {
                                  const dayAvailable = adminSchedules[m.id]
                                    ? adminSchedules[m.id][d] !== false
                                    : true;
                                  return (
                                    <span
                                      key={d}
                                      style={{
                                        fontSize: 10,
                                        fontWeight: 700,
                                        padding: '2px 5px',
                                        borderRadius: 4,
                                        background: dayAvailable ? '#ecfdf5' : '#f1f5f9',
                                        color: dayAvailable ? '#059669' : '#94a3b8',
                                        border: dayAvailable ? '1px solid #a7f3d0' : '1px solid #e2e8f0'
                                      }}
                                      title={`${d}: ${dayAvailable ? 'Tersedia' : 'Libur'}`}
                                    >
                                      {d.slice(0, 3)}
                                    </span>
                                  );
                                })}
                              </div>
                            </td>
                            <td>
                              <div className="admin-action-group" style={{ justifyContent: 'center' }}>
                                <button
                                  type="button"
                                  className="btn-action-edit"
                                  onClick={() => onOpenEditModal(m)}
                                  title={`Edit data menu ${m.name}`}
                                >
                                  ✏️ Edit
                                </button>
                                <button
                                  type="button"
                                  className="btn-action-delete"
                                  onClick={() => onDeleteMenu(m)}
                                  title={`Hapus menu ${m.name}`}
                                >
                                  🗑️ Hapus
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 2: RIWAYAT PESANAN PENGGUNA & FILTER & CSV */}
            {adminActiveTab === 'orders' && (
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
                      <label className="filter-label">Cari Nama / No. Order</label>
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
                          const userKey = `${(ord.user_name || ord.userName || '').trim().toLowerCase()}___${ord.order_date || (ord.created_at ? ord.created_at.split('T')[0] : '')}`;
                          const dailyTotal = (userDailyTotals && userDailyTotals[userKey]) || (ord.total_price || ord.totalPrice);
                          const orderCount = (userDailyOrderCounts && userDailyOrderCounts[userKey]) || 1;

                          return (
                            <tr key={ord.id}>
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
                                    ord.items.map((it, idx) => (
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
                                    💵 Cash / QRIS
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
            )}

            {/* TAB 3: REKAP KASBON BULANAN */}
            {adminActiveTab === 'kasbon' && (
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
                      <span className="stat-label">TOTAL CASH / QRIS</span>
                      <div className="stat-val" style={{ color: '#059669' }}>
                        {formatRupiah(monthlyKasbonMatrix?.totalCashAmount || 0)}
                      </div>
                      <div className="stat-subtext">Sudah dibayar / lunas</div>
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

                {/* MATRIX TABLE */}
                <div className="admin-table-container" style={{ overflowX: 'auto', maxHeight: '600px' }}>
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
                          {Array.from({ length: monthlyKasbonMatrix.daysInMonth }, (_, i) => i + 1).map((d) => (
                            <th key={d} style={{ textAlign: 'center', minWidth: 54, padding: '8px 4px' }}>
                              <div style={{ fontSize: 11, fontWeight: 700 }}>Tgl {d}</div>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {monthlyKasbonMatrix.rows.map((row, idx) => (
                          <tr key={idx} style={{ background: row.totalKasbon > 0 ? '#fffdfa' : '#ffffff' }}>
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
                                  Rp 0 (Lunas)
                                </div>
                              )}
                            </td>
                            <td>
                              <span className="cat-badge cat-badge-karbohidrat" style={{ fontSize: 11, maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'inline-block' }}>
                                🏢 {row.company}
                              </span>
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
                </div>
              </div>
            )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL EDIT MENU */}
      {showEditMenuModal && editingMenuForm && (
        <div className="modal-overlay" style={{ zIndex: 1100 }}>
          <div className="modal-sheet" style={{ maxWidth: 520 }}>
            <div className="modal-header">
              <h2 className="modal-title">✏️ Edit Menu: {editingMenuForm.name}</h2>
              <button
                className="modal-close"
                onClick={() => setShowEditMenuModal(false)}
                type="button"
              >
                ✕
              </button>
            </div>
            <form onSubmit={onSaveEditedMenu} style={{ padding: '20px 24px' }}>
              <div className="form-group">
                <label className="form-label">Nama Menu</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  value={editingMenuForm.name}
                  onChange={(e) =>
                    setEditingMenuForm({ ...editingMenuForm, name: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label className="form-label">Harga Satuan (Rp)</label>
                <input
                  type="number"
                  min="0"
                  step="500"
                  required
                  className="form-input"
                  value={editingMenuForm.price}
                  onChange={(e) =>
                    setEditingMenuForm({ ...editingMenuForm, price: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label className="form-label">Kategori</label>
                <select
                  className="form-input"
                  value={editingMenuForm.category}
                  onChange={(e) =>
                    setEditingMenuForm({ ...editingMenuForm, category: e.target.value })
                  }
                >
                  <option value="Karbohidrat">🥢 Karbohidrat</option>
                  <option value="Sayur">🥗 Sayur</option>
                  <option value="Lauk">🥟 Lauk</option>
                  <option value="Alat Makan">🥄 Alat Makan</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Ketersediaan Hari (Senin – Minggu):</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginTop: 6 }}>
                  {DAYS_LIST.map((d) => (
                    <label key={d} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={editingMenuForm.days[d] !== false}
                        onChange={(e) =>
                          setEditingMenuForm({
                            ...editingMenuForm,
                            days: { ...editingMenuForm.days, [d]: e.target.checked }
                          })
                        }
                      />
                      <span>{d}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
                <button
                  type="button"
                  className="btn-modal-cancel"
                  onClick={() => setShowEditMenuModal(false)}
                >
                  Batal
                </button>
                <button type="submit" className="btn-primary" style={{ flex: 1 }}>
                  Simpan Perubahan Menu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL TAMBAH MENU BARU */}
      {showAddMenuModal && (
        <div className="modal-overlay" style={{ zIndex: 1100 }}>
          <div className="modal-sheet" style={{ maxWidth: 520 }}>
            <div className="modal-header">
              <h2 className="modal-title">+ Tambah Menu Makanan Baru</h2>
              <button
                className="modal-close"
                onClick={() => setShowAddMenuModal(false)}
                type="button"
              >
                ✕
              </button>
            </div>
            <form onSubmit={onAddNewMenu} style={{ padding: '20px 24px' }}>
              <div className="form-group">
                <label className="form-label">Nama Menu</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  placeholder="Contoh: Soto Ayam Lamongan"
                  value={newMenuForm.name}
                  onChange={(e) => setNewMenuForm({ ...newMenuForm, name: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Harga Satuan (Rp)</label>
                <input
                  type="number"
                  min="0"
                  step="500"
                  required
                  className="form-input"
                  placeholder="Contoh: 5000"
                  value={newMenuForm.price}
                  onChange={(e) => setNewMenuForm({ ...newMenuForm, price: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Kategori</label>
                <select
                  className="form-input"
                  value={newMenuForm.category}
                  onChange={(e) => setNewMenuForm({ ...newMenuForm, category: e.target.value })}
                >
                  <option value="Karbohidrat">🥢 Karbohidrat</option>
                  <option value="Sayur">🥗 Sayur</option>
                  <option value="Lauk">🥟 Lauk</option>
                  <option value="Alat Makan">🥄 Alat Makan</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Ketersediaan Hari:</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginTop: 6 }}>
                  {DAYS_LIST.map((d) => (
                    <label key={d} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={newMenuForm.days[d]}
                        onChange={(e) =>
                          setNewMenuForm({
                            ...newMenuForm,
                            days: { ...newMenuForm.days, [d]: e.target.checked }
                          })
                        }
                      />
                      <span>{d}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
                <button
                  type="button"
                  className="btn-modal-cancel"
                  onClick={() => setShowAddMenuModal(false)}
                >
                  Batal
                </button>
                <button type="submit" className="btn-primary" style={{ flex: 1 }}>
                  Tambahkan ke Katalog
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
