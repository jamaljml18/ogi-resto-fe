'use client';
import AdminTableViewport from './AdminTableViewport';
import {DAYS_LIST,getMenuIcon,formatRupiah} from '../../models/initialData';

export default function AdminScheduleView({todayName,adminScheduleDay,setAdminScheduleDay,adminScheduleSearch,setAdminScheduleSearch,adminScheduleCategory,setAdminScheduleCategory,categories,filteredAdminMenus,adminAllMenus,adminSchedules,activeCountForDay,isSavingSchedule,onSaveSchedules,onToggleMenuDayAvailability,onBulkToggleDay,setShowAddMenuModal,onOpenEditModal,onDeleteMenu}) {
  return (
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
                        {cat !== 'Semua' && (
                          <span style={{ fontSize: '13px' }}>{getMenuIcon(cat)}</span>
                        )}
                        <span>{cat === 'Semua' ? 'Semua Kategori' : cat}</span>
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
                <AdminTableViewport label="Tabel menu dan jadwal">
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
                                  className="admin-row-action admin-row-action-edit"
                                  onClick={() => onOpenEditModal(m)}
                                  title={`Edit data menu ${m.name}`}
                                >
                                  <span className="admin-row-action-icon" aria-hidden="true">✏️</span><span>Edit</span>
                                </button>
                                <button
                                  type="button"
                                  className="admin-row-action admin-row-action-delete"
                                  onClick={() => onDeleteMenu(m)}
                                  title={`Hapus menu ${m.name}`}
                                >
                                  <span className="admin-row-action-icon" aria-hidden="true">🗑️</span><span>Hapus</span>
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </AdminTableViewport>
              </div>
  );
}
