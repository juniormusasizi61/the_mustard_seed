import { NavLink } from 'react-router-dom';

export default function Footer() {
  return (
    <footer style={{ padding: '16px', textAlign: 'center', borderTop: '1px solid #eee', marginTop: '24px' }}>
      <NavLink to="/privacy" style={{ marginRight: 12 }}>Privacy</NavLink>
      <NavLink to="/terms">Terms</NavLink>
    </footer>
  );
}
