import { useState, useEffect } from 'react';
import './VersionSelector.css';

const DEFAULT_VERSIONS = [
  { id: 'kjv', label: 'King James Version (KJV)' },
  { id: 'asv', label: 'American Standard Version (ASV)' },
  { id: 'web', label: 'World English Bible (WEB)' },
  { id: 'niv', label: 'New International Version (NIV)' },
  { id: 'esv', label: 'English Standard Version (ESV)' },
  { id: 'nlt', label: 'New Living Translation (NLT)' },
  { id: 'rsv', label: 'Revised Standard Version (RSV)' },
];

export default function VersionSelector({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(value || (localStorage.getItem('bible_version') || 'kjv'));
  const [available, setAvailable] = useState(null); // null = unknown, [] = none

  useEffect(() => {
    let mounted = true;
    const check = async () => {
      // Try to fetch local JSON for each known version. Keep ones that exist.
      const found = [];
      for (const v of DEFAULT_VERSIONS) {
        try {
          const res = await fetch(`/offline/bibles/${v.id}.json`, { cache: 'no-store' });
          if (res && res.ok) {
            found.push({ ...v, offline: true });
            continue;
          }
        } catch (e) {
          void e;
        }
      }

      if (mounted) setAvailable(found.length ? found : DEFAULT_VERSIONS);
    };
    check();
    return () => { mounted = false; };
  }, []);

  const handleSelect = (id) => {
    setSelected(id);
    onChange?.(id);
    setOpen(false);
    try { localStorage.setItem('bible_version', id); } catch (e) { void e; }
  };

  const options = available || DEFAULT_VERSIONS;

  return (
    <div className="version-selector" style={{ position: 'relative', display: 'inline-block' }}>
      <button
        className="version-button version-button--filled"
        onClick={() => setOpen(o => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        Version: { (options.find(v => v.id === selected) || { id: selected }).id?.toUpperCase() } ▾
      </button>

      {open && (
        <ul className="version-menu" role="menu">
          {options.map(v => (
            <li key={v.id} role="menuitem" className="version-menu-item">
              <button
                onClick={() => handleSelect(v.id)}
                className="version-menu-btn"
              >
                <span className="version-menu-row">
                  <span className="version-menu-label">{v.label}</span>
                  {v.offline && (
                    <span className="offline-badge">Offline</span>
                  )}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
