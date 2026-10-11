'use client';

import React from 'react';
import { useCateringPresenter } from './presenters/useCateringPresenter';
import HeaderView from './views/HeaderView';
import OrderModeView from './views/OrderModeView';
import MenuCatalogView from './views/MenuCatalogView';
import CartFloatingBarView from './views/CartFloatingBarView';
import CheckoutModalView from './views/CheckoutModalView';
import SuccessModalView from './views/SuccessModalView';
import AdminModalView from './views/AdminModalView';

/**
 * Ogi Resto - Root Page (MVP Pattern Architecture)
 * 
 * - Model:     Data layer, API abstractions, and schemas (app/models/*)
 * - View:      Pure UI rendering components (app/views/*)
 * - Presenter: Business logic, state, and coordination (app/presenters/useCateringPresenter.js)
 * 
 * Keamanan:
 * Tombol Panel Admin tidak ditampilkan di halaman publik.
 * Panel Admin hanya dapat diakses melalui rute rahasia URL: /ogi
 */
export default function CateringApp() {
  const presenter = useCateringPresenter({ initialAdminOpen: false });

  return (
    <div className="app-wrapper">
      {/* VIEW: HEADER BRAND & PENCARIAN (Tanpa Tombol Admin) */}
      <HeaderView
        searchQuery={presenter.searchQuery}
        setSearchQuery={presenter.setSearchQuery}
      />

      {/* VIEW: MODE PESAN HARI INI, PRE-ORDER BESOK, & PRE-ORDER PILIH TANGGAL */}
      <OrderModeView
        orderMode={presenter.orderMode}
        setOrderMode={presenter.setOrderMode}
        todayName={presenter.todayName}
        tomorrowName={presenter.tomorrowName}
        todayDateStr={presenter.todayDateStr}
        tomorrowDateStr={presenter.tomorrowDateStr}
        tomorrowIsoDate={presenter.tomorrowIsoDate}
        customDate={presenter.customDate}
        setCustomDate={presenter.setCustomDate}
        customDayName={presenter.customDayName}
        customDateStr={presenter.customDateStr}
        activeSelectedDay={presenter.activeSelectedDay}
      />

      {/* VIEW: KATALOG MENU MAKANAN & KATEGORI */}
      <MenuCatalogView
        categories={presenter.categories}
        activeCategory={presenter.activeCategory}
        setActiveCategory={presenter.setActiveCategory}
        filteredMenus={presenter.filteredMenus}
        totalMenusCount={presenter.totalMenusCount}
        cart={presenter.cart}
        onAddToCart={presenter.handleAddToCart}
        onRemoveFromCart={presenter.handleRemoveFromCart}
        searchQuery={presenter.searchQuery}
        onResetSearch={() => presenter.setSearchQuery('')}
      />

      {/* VIEW: BAR KERANJANG MELAYANG */}
      <CartFloatingBarView
        cartSummary={presenter.cartSummary}
        onOpenCheckout={() => presenter.setShowCheckoutModal(true)}
      />

      {/* VIEW: MODAL CHECKOUT & DATA DIRI PEMESAN */}
      <CheckoutModalView
        isOpen={presenter.showCheckoutModal}
        onClose={() => presenter.setShowCheckoutModal(false)}
        orderMode={presenter.orderMode}
        activeSelectedDay={presenter.activeSelectedDay}
        todayDateStr={presenter.todayDateStr}
        tomorrowDateStr={presenter.tomorrowDateStr}
        customDateStr={presenter.customDateStr}
        customDayName={presenter.customDayName}
        cartSummary={presenter.cartSummary}
        formData={presenter.formData}
        setFormData={presenter.setFormData}
        onSubmitOrder={presenter.handleSubmitOrder}
        isSubmitting={presenter.isSubmitting}
        availableCompanies={presenter.availableCompanies}
        availableDivisions={presenter.availableDivisions}
        availableLocations={presenter.availableLocations}
      />

      {/* VIEW: MODAL BUKTI PEMESANAN SUKSES */}
      <SuccessModalView
        isOpen={presenter.showSuccessModal}
        onClose={() => presenter.setShowSuccessModal(false)}
        lastSubmittedOrder={presenter.lastSubmittedOrder}
      />

      {/* VIEW: MODAL PANEL ADMIN (Hanya terbuka jika diakses melalui rute /ogi) */}
      <AdminModalView
        isOpen={presenter.showAdminModal}
        onClose={() => presenter.setShowAdminModal(false)}
        isAdminLoggedIn={presenter.isAdminLoggedIn}
        clockTime={presenter.clockTime}
        todayName={presenter.todayName}
        adminLoginForm={presenter.adminLoginForm}
        setAdminLoginForm={presenter.setAdminLoginForm}
        adminLoginError={presenter.adminLoginError}
        showAdminPassword={presenter.showAdminPassword}
        setShowAdminPassword={presenter.setShowAdminPassword}
        onAdminLogin={presenter.handleAdminLogin}
        onAdminLogout={presenter.handleAdminLogout}
        adminActiveTab={presenter.adminActiveTab}
        setAdminActiveTab={presenter.setAdminActiveTab}
        adminScheduleDay={presenter.adminScheduleDay}
        setAdminScheduleDay={presenter.setAdminScheduleDay}
        adminScheduleSearch={presenter.adminScheduleSearch}
        setAdminScheduleSearch={presenter.setAdminScheduleSearch}
        adminScheduleCategory={presenter.adminScheduleCategory}
        setAdminScheduleCategory={presenter.setAdminScheduleCategory}
        categories={presenter.categories}
        filteredAdminMenus={presenter.filteredAdminMenus}
        adminAllMenus={presenter.adminAllMenus}
        adminSchedules={presenter.adminSchedules}
        activeCountForDay={presenter.activeCountForDay}
        isSavingSchedule={presenter.isSavingSchedule}
        onSaveSchedules={presenter.handleSaveSchedules}
        onToggleMenuDayAvailability={presenter.toggleMenuDayAvailability}
        onBulkToggleDay={presenter.handleBulkToggleDay}
        showAddMenuModal={presenter.showAddMenuModal}
        setShowAddMenuModal={presenter.setShowAddMenuModal}
        newMenuForm={presenter.newMenuForm}
        setNewMenuForm={presenter.setNewMenuForm}
        onAddNewMenu={presenter.handleAddNewMenu}
        showEditMenuModal={presenter.showEditMenuModal}
        setShowEditMenuModal={presenter.setShowEditMenuModal}
        editingMenuForm={presenter.editingMenuForm}
        setEditingMenuForm={presenter.setEditingMenuForm}
        onOpenEditModal={presenter.handleOpenEditModal}
        onSaveEditedMenu={presenter.handleSaveEditedMenu}
        onDeleteMenu={presenter.handleDeleteMenu}
        ordersSummary={presenter.ordersSummary}
        totalPortionsSold={presenter.totalPortionsSold}
        ordersHistory={presenter.ordersHistory}
        adminOrdersFilter={presenter.adminOrdersFilter}
        setAdminOrdersFilter={presenter.setAdminOrdersFilter}
        adminOrdersSearch={presenter.adminOrdersSearch}
        setAdminOrdersSearch={presenter.setAdminOrdersSearch}
        onResetOrdersFilter={presenter.handleResetOrdersFilter}
        onExportCsv={presenter.handleExportCsv}
        userDailyTotals={presenter.userDailyTotals}
        userDailyOrderCounts={presenter.userDailyOrderCounts}
        todayIsoDate={presenter.todayIsoDate}
        kasbonMonth={presenter.kasbonMonth}
        setKasbonMonth={presenter.setKasbonMonth}
        kasbonYear={presenter.kasbonYear}
        setKasbonYear={presenter.setKasbonYear}
        kasbonCompany={presenter.kasbonCompany}
        setKasbonCompany={presenter.setKasbonCompany}
        kasbonDivision={presenter.kasbonDivision}
        setKasbonDivision={presenter.setKasbonDivision}
        availableDivisions={presenter.availableDivisions}
        availableCompanies={presenter.availableCompanies}
        availableLocations={presenter.availableLocations}
        monthlyKasbonMatrix={presenter.monthlyKasbonMatrix}
        onExportKasbonCsv={presenter.handleExportKasbonCsv}
        adminToast={presenter.adminToast}
      />
    </div>
  );
}
