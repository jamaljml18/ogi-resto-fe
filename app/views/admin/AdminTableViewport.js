"use client";

import { useId, useRef, useState } from 'react';

export default function AdminTableViewport({ children, label, className = '', style, ...regionProps }) {
  const [scale, setScale] = useState(100);
  const pane = useRef(null);
  const hintId = useId();

  function changeScale(next) {
    const value = Math.max(60, Math.min(150, next));
    if (value === scale) return;
    const node = pane.current;
    const anchor = node ? node.scrollLeft / (scale / 100) : 0;
    setScale(value);
    requestAnimationFrame(() => {
      if (node && pane.current === node) node.scrollLeft = anchor * (value / 100);
    });
  }

  return (
    <section className="admin-table-view" aria-label={label}>
      <div className="admin-table-tools">
        <p id={hintId}>Geser tabel untuk melihat kolom lainnya.</p>
        <div className="admin-table-zoom" role="group" aria-label={'Ukuran ' + label.toLowerCase()}>
          <button type="button" onClick={() => changeScale(scale - 10)} disabled={scale <= 60}
            aria-label="Perkecil tabel" title="Perkecil tabel">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M5 12h14" /></svg>
          </button>
          <button type="button" className="admin-table-zoom-reset" onClick={() => changeScale(100)}
            aria-label="Kembalikan ukuran tabel ke 100 persen" title="Kembalikan ke 100%">
            <output aria-live="polite" aria-atomic="true">{scale}%</output>
          </button>
          <button type="button" onClick={() => changeScale(scale + 10)} disabled={scale >= 150}
            aria-label="Perbesar tabel" title="Perbesar tabel">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M5 12h14M12 5v14" /></svg>
          </button>
        </div>
      </div>
      <div {...regionProps} ref={pane} className={'admin-table-container ' + className}
        style={style} role="region" aria-label={label} aria-describedby={hintId} tabIndex={0}>
        <div className="admin-table-scale" style={{ zoom: scale / 100 }}>
          {children}
        </div>
      </div>
    </section>
  );
}
