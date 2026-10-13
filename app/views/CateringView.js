'use client';

import React from 'react';
import HeaderView from './HeaderView';
import OrderModeView from './OrderModeView';
import MenuCatalogView from './MenuCatalogView';
import CartFloatingBarView from './CartFloatingBarView';
import CheckoutModalView from './CheckoutModalView';
import SuccessModalView from './SuccessModalView';
import AdminModalView from './AdminModalView';


export default function CateringView({presenter}) {
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
        catalogError={presenter.catalogError}
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
        checkoutError={presenter.checkoutError}
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
      <AdminModalView {...presenter}
        onClose={() => presenter.setShowAdminModal(false)} isOpen={presenter.showAdminModal}
        onAdminLogin={presenter.handleAdminLogin} onAdminLogout={presenter.handleAdminLogout}
        onSaveSchedules={presenter.handleSaveSchedules}
        onToggleMenuDayAvailability={presenter.toggleMenuDayAvailability}
        onBulkToggleDay={presenter.handleBulkToggleDay}
        onAddNewMenu={presenter.handleAddNewMenu} onOpenEditModal={presenter.handleOpenEditModal}
        onSaveEditedMenu={presenter.handleSaveEditedMenu} onDeleteMenu={presenter.handleDeleteMenu}
        onResetOrdersFilter={presenter.handleResetOrdersFilter} onExportCsv={presenter.handleExportCsv}
        onExportKasbonCsv={presenter.handleExportKasbonCsv} onToggleKasbonPayment={presenter.handleToggleKasbonPayment}
      />
    </div>
  );
}
