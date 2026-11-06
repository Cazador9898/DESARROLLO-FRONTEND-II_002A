import { NavLink, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { Boxes, CircleHelp, ClipboardList, Headphones, PackagePlus, ShoppingBasket, ShoppingCart, Sparkles } from 'lucide-react';
import Dashboard from './pages/Dashboard.jsx';
import About from './pages/About.jsx';
import Contact from './pages/Contact.jsx';
import NewArticle from './pages/NewArticle.jsx';
import ArticlesList from './pages/ArticlesList.jsx';
import ArticleDetail from './pages/ArticleDetail.jsx';
import ShoppingCart from './pages/ShoppingCart.jsx';
import { useInventory } from './context/InventoryContext.jsx';

const navigation = [
  { to: '/', label: 'Inventario', icon: Boxes, end: true },
  { to: '/quienes-somos', label: 'Quiénes somos', icon: CircleHelp },
  { to: '/contacto', label: 'Contacto', icon: Headphones },
];

const managementNavigation = [
  { to: '/articulos/nuevo', label: 'Ingresar artículo', icon: PackagePlus },
  { to: '/articulos/listado', label: 'Listado de artículos', icon: ClipboardList },
  { to: '/carrito', label: 'Carrito', icon: ShoppingCart },
];

function Header() {
  const { pathname } = useLocation();
  const current = [...navigation, ...managementNavigation].find(({ to }) => to === pathname);
  const currentLabel = current?.label ?? (pathname.startsWith('/articulos/') ? 'Detalle de artículo' : 'Inventario');

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
          <span className="header-current"><Sparkles size={15} /> {currentLabel}</span>
        </div>
      </div>
    </header>
  );
}

// Menú de gestión ampliado en Semana 3. Se conserva el menú principal inferior.
function ArticlesNav() {
  const { cartCount } = useInventory();
  return (
    <div className="border-b border-emerald-100 bg-white/90" >
      <nav aria-label="Menú de gestión de artículos" className="page-shell flex flex-wrap items-center gap-2 py-3 sm:gap-3">
        <span className="mr-2 hidden text-xs font-extrabold uppercase tracking-wider text-emerald-950 md:inline">Gestión de artículos</span>
        {managementNavigation.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to} className={({ isActive }) => `inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-extrabold transition-colors ${isActive ? 'border-emerald-800 bg-emerald-900 text-white' : 'border-emerald-100 bg-emerald-50 text-emerald-900 hover:border-emerald-400 hover:bg-emerald-100'}`}>
            <Icon size={17} aria-hidden="true" /> {label} {to === '/carrito' && <span aria-label={`${cartCount} unidades en el carrito`} className="rounded-full bg-lime-200 px-2 py-0.5 text-[11px] font-extrabold text-emerald-950">{cartCount}</span>}
          </NavLink>
        ))}
      </nav>
    </div>
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
      <ArticlesNav />
      <main id="contenido" className="page-shell main-content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/quienes-somos" element={<About />} />
          <Route path="/contacto" element={<Contact />} />
          <Route path="/articulos/nuevo" element={<NewArticle />} />
          <Route path="/articulos/listado" element={<ArticlesList />} />
          <Route path="/articulos/:id" element={<ArticleDetail />} />
          <Route path="/carrito" element={<ShoppingCart />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <BottomNav />
    </div>
  );
}
