'use client';
import {DAYS_LIST} from '../../models/initialData';

export default function AdminAddMenuView({setShowAddMenuModal,newMenuForm,setNewMenuForm,onAddNewMenu}) {
  return (
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
  );
}
