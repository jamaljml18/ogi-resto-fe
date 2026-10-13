'use client';

import React from 'react';
import { getMenuIcon, formatRupiah } from '../models/initialData';

export default function MenuCatalogView({
  categories,
  activeCategory,
  setActiveCategory,
  filteredMenus,
  catalogError,
  totalMenusCount,
  cart,
  onAddToCart,
  onRemoveFromCart,
  searchQuery,
  onResetSearch
}) {
  return (
    <>
      {/* Category Pills Navigation */}
      <nav className="category-nav">
        {categories.map((cat) => {
          const isActive = activeCategory === cat;
          return (
            <button
              key={cat}
              type="button"
              className={`category-pill ${isActive ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat !== 'Semua' && (
                <span>{getMenuIcon(cat)}</span>
              )}
              <span>{cat}</span>
            </button>
          );
        })}
      </nav>

      <div className="main-content">
        {catalogError && <p role="alert" className="notice notice-error">{catalogError}</p>}
        {/* Title & Count */}
        <div className="section-title">
          <h2 className="section-title-text">
            {activeCategory === 'Semua' ? 'Daftar Semua Menu' : `Menu Kategori ${activeCategory}`}
          </h2>
          <span className="menu-count">{filteredMenus.length} item</span>
        </div>

        {/* Empty State */}
        {filteredMenus.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🍽️</div>
            <h3 className="empty-title">Tidak Ada Menu Ditemukan</h3>
            <p className="empty-desc">
              {searchQuery
                ? `Tidak ditemukan menu dengan kata kunci "${searchQuery}".`
                : 'Tidak ada menu yang dijadwalkan aktif untuk hari ini.'}
            </p>
            {searchQuery && (
              <button
                type="button"
                className="btn-primary"
                style={{ marginTop: 12, padding: '8px 16px', fontSize: 13 }}
                onClick={onResetSearch}
              >
                Tampilkan Semua Menu
              </button>
            )}
          </div>
        ) : (
          /* Grid Menu Cards */
          <div className="menu-grid">
            {filteredMenus.map((item) => {
              const qty = cart[item.id] || 0;

              let thumbClass = 'thumb-alat-makan';
              if (item.category === 'Karbohidrat') thumbClass = 'thumb-karbohidrat';
              else if (item.category === 'Sayur') thumbClass = 'thumb-sayur';
              else if (item.category === 'Lauk') thumbClass = 'thumb-lauk';

              return (
                <div key={item.id} className="menu-card">
                  <div className="menu-card-top">
                    <div className={`menu-thumb ${thumbClass}`}>
                      {getMenuIcon(item.category)}
                    </div>
                    <div className="menu-info">
                      <span className="menu-tag">{item.category}</span>
                      <h3 className="menu-name">{item.name}</h3>
                      <div className="menu-price">
                        {formatRupiah(item.price, true)}
                      </div>
                    </div>
                  </div>

                  <div className="menu-card-action">
                    {qty > 0 ? (
                      <div className="stepper">
                        <button
                          type="button"
                          className="stepper-btn"
                          onClick={() => onRemoveFromCart(item.id)}
                          title="Kurangi porsi"
                        >
                          -
                        </button>
                        <span className="stepper-qty">{qty}</span>
                        <button
                          type="button"
                          className="stepper-btn"
                          onClick={() => onAddToCart(item.id)}
                          title="Tambah porsi"
                        >
                          +
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        className="add-btn"
                        onClick={() => onAddToCart(item.id)}
                      >
                        + Tambah
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
