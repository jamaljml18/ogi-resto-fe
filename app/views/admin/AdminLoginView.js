'use client';

export default function AdminLoginView({onClose,adminLoginForm,setAdminLoginForm,adminLoginError,showAdminPassword,setShowAdminPassword,onAdminLogin}) {
  return (
        <div className="admin-login-backdrop">
          <div className="admin-login-card">
            <button className="admin-login-close" onClick={onClose} type="button">
              ✕
            </button>
            <div className="admin-shield-icon">🔐</div>
            <h2 className="admin-login-title">Autentikasi Panel Admin</h2>
            <p className="admin-login-subtitle">
              Masuk menggunakan akun pengelola Ogi Resto.
            </p>

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
                    placeholder="Masukkan password"
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
  );
}
