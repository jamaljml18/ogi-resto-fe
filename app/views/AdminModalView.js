'use client';

import React from 'react';
import AdminScheduleView from './admin/AdminScheduleView';
import AdminOrdersView from './admin/AdminOrdersView';
import AdminPaymentHistoryView from './admin/AdminPaymentHistoryView';
import AdminKasbonView from './admin/AdminKasbonView';
import AdminLoginView from './admin/AdminLoginView';
import AdminEditMenuView from './admin/AdminEditMenuView';
import AdminAddMenuView from './admin/AdminAddMenuView';

export default function AdminModalView(props) {
  const {isOpen,onClose,isAdminLoggedIn,clockTime,onAdminLogout,adminActiveTab,setAdminActiveTab,adminAllMenus,showAddMenuModal,showEditMenuModal,editingMenuForm,ordersHistory,monthlyKasbonMatrix,adminToast} = props;
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
                <button
                  type="button"
                  className={`admin-pill-tab ${adminActiveTab === 'payments' ? 'active' : ''}`}
                  onClick={() => setAdminActiveTab('payments')}
                >
                  <span>🧾 Riwayat Pembayaran</span>
                </button>
              </div>
            </div>

            {/* SCROLLABLE WORKSPACE AREA */}
            <div className="admin-workspace-area">
              {/* TAB 1: MANAJEMEN MENU & JADWAL MINGGUAN */}
              {adminActiveTab === 'schedule' && (
                <AdminScheduleView {...props} />
            )}

            {/* TAB 2: RIWAYAT PESANAN PENGGUNA & FILTER & CSV */}
            {adminActiveTab === 'orders' && (
                <AdminOrdersView {...props} />
            )}

            {adminActiveTab === 'payments' && <AdminPaymentHistoryView {...props} />}

            {/* TAB 3: REKAP KASBON BULANAN */}
            {adminActiveTab === 'kasbon' && (
                <AdminKasbonView {...props} />
            )}
            </div>
          </div>
        </div>
      )}

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
