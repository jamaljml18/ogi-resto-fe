'use client';

import React from 'react';
import { formatRupiah } from '../models/initialData';

export default function CartFloatingBarView({ cartSummary, onOpenCheckout }) {
  if (cartSummary.totalItems === 0) return null;

  return (
    <div className="floating-cart-bar">
      <div className="cart-summary">
        <div className="cart-icon-wrap">
          <span>🛒</span>
          <span className="cart-badge">{cartSummary.totalItems}</span>
        </div>
        <div>
          <div className="cart-text-qty">{cartSummary.totalItems} Item Terpilih</div>
          <div className="cart-text-total">{formatRupiah(cartSummary.totalPrice)}</div>
        </div>
      </div>
      <button
        type="button"
        className="checkout-btn"
        onClick={onOpenCheckout}
      >
        <span>Lanjut ke Data Diri</span>
        <span>➔</span>
      </button>
    </div>
  );
}
