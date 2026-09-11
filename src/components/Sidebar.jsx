import { NavLink } from 'react-router-dom';
import { NAV_GROUPS } from '../data/navConfig';
import './Sidebar.css';

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="brand">
        VE<span>LA</span>
      </div>
      <div className="brand-sub">Beauty &amp; Wellness Cloud POS</div>

      {NAV_GROUPS.map((group) => (
        <div key={group.label}>
          <div className="nav-group-label">{group.label}</div>
          {group.items.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                isActive ? 'nav-item active' : 'nav-item'
              }
              end={item.path === '/'}
            >
              <span className="dot" />
              {item.label}
            </NavLink>
          ))}
        </div>
      ))}

      <div className="sidebar-foot">VELA Cloud POS &middot; v0.1</div>
    </aside>
  );
}
