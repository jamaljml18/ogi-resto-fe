'use client';
import {DAYS_LIST} from '../../models/initialData';

export default function AdminEditMenuView({setShowEditMenuModal,editingMenuForm,setEditingMenuForm,onSaveEditedMenu}) {
  return (
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
  );
}
