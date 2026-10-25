'use client';

import React, { useId, useRef } from 'react';
import AdminScheduleView from './admin/AdminScheduleView';
import AdminOrdersView from './admin/AdminOrdersView';
import AdminOrderEditor from './admin/AdminOrderEditor';
import AdminWaitingPaymentsView from './admin/AdminWaitingPaymentsView';
import AdminPaymentHistoryView from './admin/AdminPaymentHistoryView';
import AdminKasbonView from './admin/AdminKasbonView';
import AdminLoginView from './admin/AdminLoginView';
import AdminEditMenuView from './admin/AdminEditMenuView';
import AdminAddMenuView from './admin/AdminAddMenuView';

export default function AdminModalView(props) {
  const {isOpen,onClose,isAdminLoggedIn,clockTime,onAdminLogout,adminActiveTab,setAdminActiveTab,adminAllMenus,showAddMenuModal,showEditMenuModal,editingMenuForm,ordersHistory,monthlyKasbonMatrix,adminToast} = props;
  const mobileNavigationId = useId();
  const portal = useRef(null);
  const workspace = useRef(null);
  function selectMobilePage(event) {
    setAdminActiveTab(event.target.value);
    if (portal.current) portal.current.scrollTop = 0;
    if (workspace.current) workspace.current.scrollTop = 0;
  }
  if (!isOpen) return null;

  return (
    <>
      {/* Toast Notification */}
      {adminToast && <div className="admin-toast-banner">{adminToast}</div>}

      {/* LOGIN MODAL (JIKA BELUM LOGIN) */}
      {!isAdminLoggedIn ? (
        <AdminLoginView {...props} />
      ) : (
        /* WORKSPACE PANEL ADMIN (JIKA SUDAH LOGIN) */
        <div className="admin-portal-overlay">
          <div ref={portal} className="admin-portal-window">
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
              <div className="admin-mobile-navigation">
                <label htmlFor={mobileNavigationId}>Halaman admin</label>
                <select id={mobileNavigationId} value={adminActiveTab} onChange={selectMobilePage}>
                  <option value="schedule">Menu &amp; Jadwal Mingguan ({adminAllMenus.length})</option>
                  <option value="orders">Riwayat Pesanan &amp; CSV ({ordersHistory.length})</option>
                  <option value="waiting">Menunggu Pembayaran</option>
                  <option value="kasbon">Kasbon Bulanan ({monthlyKasbonMatrix?.usersWithKasbonCount || 0})</option>
                  <option value="payments">Riwayat Pembayaran</option>
                </select>
              </div>
              <div className="admin-pill-tabs">
                <button
                  type="button"
                  className={`admin-pill-tab ${adminActiveTab === 'schedule' ? 'active' : ''}`}
                  aria-current={adminActiveTab === 'schedule' ? 'page' : undefined}
                  title="Manajemen Menu & Jadwal Mingguan"
                  onClick={() => setAdminActiveTab('schedule')}
                >
                  <span>📅 Menu & Jadwal</span>
                  <span className="admin-tab-count">{adminAllMenus.length}</span>
                </button>
                <button
                  type="button"
                  className={`admin-pill-tab ${adminActiveTab === 'orders' ? 'active' : ''}`}
                  aria-current={adminActiveTab === 'orders' ? 'page' : undefined}
                  title="Riwayat Pesanan & Laporan CSV"
                  onClick={() => setAdminActiveTab('orders')}
                >
                  <span>📊 Pesanan & CSV</span>
                  <span className="admin-tab-count" style={{ background: '#ecfdf5', color: '#059669' }}>
                    {ordersHistory.length}
                  </span>
                </button>
                <button type="button"
                  className={`admin-pill-tab ${adminActiveTab === 'waiting' ? 'active' : ''}`}
                  aria-current={adminActiveTab === 'waiting' ? 'page' : undefined}
                  title="Menunggu Pembayaran"
                  onClick={() => setAdminActiveTab('waiting')}>
                  <span>⏳ Menunggu Pembayaran</span>
                </button>
                <button
                  type="button"
                  className={`admin-pill-tab ${adminActiveTab === 'kasbon' ? 'active' : ''}`}
                  aria-current={adminActiveTab === 'kasbon' ? 'page' : undefined}
                  title="Rekap Kasbon Bulanan"
                  onClick={() => setAdminActiveTab('kasbon')}
                >
                  <span>💳 Kasbon Bulanan</span>
                  <span className="admin-tab-count" style={{ background: '#fffbeb', color: '#b45309' }}>
                    {monthlyKasbonMatrix?.usersWithKasbonCount || 0}
                  </span>
                </button>
                <button
                  type="button"
                  className={`admin-pill-tab ${adminActiveTab === 'payments' ? 'active' : ''}`}
                  aria-current={adminActiveTab === 'payments' ? 'page' : undefined}
                  title="Riwayat Pembayaran"
                  onClick={() => setAdminActiveTab('payments')}
                >
                  <span>🧾 Riwayat Pembayaran</span>
                </button>
              </div>
            </div>

            {/* SCROLLABLE WORKSPACE AREA */}
            <div ref={workspace} className="admin-workspace-area">
              {/* TAB 1: MANAJEMEN MENU & JADWAL MINGGUAN */}
              {adminActiveTab === 'schedule' && (
                <AdminScheduleView {...props} />
            )}

            {/* TAB 2: RIWAYAT PESANAN PENGGUNA & FILTER & CSV */}
            {adminActiveTab === 'orders' && (
                <AdminOrdersView {...props} />
            )}

            {adminActiveTab === 'payments' && <AdminPaymentHistoryView {...props} />}
            {adminActiveTab === 'waiting' && <AdminWaitingPaymentsView {...props} />}

            {/* TAB 3: REKAP KASBON BULANAN */}
            {adminActiveTab === 'kasbon' && (
                <AdminKasbonView {...props} />
            )}
            </div>
          </div>
        </div>
      )}

      {isAdminLoggedIn && props.orderEditor && <AdminOrderEditor {...props} />}

      {/* MODAL EDIT MENU */}
      {showEditMenuModal && editingMenuForm && (
        <AdminEditMenuView {...props} />
      )}

      {/* MODAL TAMBAH MENU BARU */}
      {showAddMenuModal && (
        <AdminAddMenuView {...props} />
      )}
    </>
  );
}
