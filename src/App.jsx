import { NavLink, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { Boxes, CircleHelp, Headphones, ShoppingBasket, Sparkles } from 'lucide-react';
import Dashboard from './pages/Dashboard.jsx';
import About from './pages/About.jsx';
import Contact from './pages/Contact.jsx';

const navigation = [
  { to: '/', label: 'Inventario', icon: Boxes, end: true },
  { to: '/quienes-somos', label: 'Quiénes somos', icon: CircleHelp },
  { to: '/contacto', label: 'Contacto', icon: Headphones },
];

function Header() {
  const location = useLocation();
  const current = navigation.find(({ to }) => to === location.pathname);

  return (
    <header className="site-header">
      <div className="page-shell header-inner">
        <NavLink to="/" className="brand" aria-label="getiomark, ir al inicio">
          <span className="brand-icon"><ShoppingBasket size={22} strokeWidth={2.3} /></span>
          <span>getio<span className="brand-highlight">mark</span><span className="brand-period">.</span></span>
        </NavLink>
        <div className="header-right">
          <span className="header-caption"><span className="live-dot" /> Sistema activo</span>
          <span className="header-divider" />
          <span className="header-current"><Sparkles size={15} /> {current?.label ?? 'Inventario'}</span>
        </div>
      </div>
    </header>
  );
}

function BottomNav() {
  return (
    <nav className="bottom-nav" aria-label="Navegación principal">
      {navigation.map(({ to, label, icon: Icon, end }) => (
        <NavLink key={to} to={to} end={end} className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
          <Icon size={20} strokeWidth={2} aria-hidden="true" />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}

export default function App() {
  return (
    <div className="app">
      <Header />
      <main id="contenido" className="page-shell main-content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/quienes-somos" element={<About />} />
          <Route path="/contacto" element={<Contact />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <BottomNav />
    </div>
  );
}
