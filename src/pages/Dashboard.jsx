import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useInventory } from '../context/InventoryContext.jsx';
import {
  AlertCircle, ArrowDownToLine, ArrowRight, BadgeCheck, BarChart3, Box,
  Check, ChevronDown, CircleAlert, ClipboardList, Edit3, Minus,
  Package, PackagePlus, Plus, Search, ShieldAlert, ShoppingBasket,
  SlidersHorizontal, Trash2, TrendingUp, X,
} from 'lucide-react';
import ProductModal from '../components/ProductModal.jsx';
import { categories } from '../data/products.js';
import { downloadCSV, formatCLP, getStatus } from '../utils/inventory.js';
import { filterProducts } from '../utils/inventoryReducer.js';

function StatCard({ icon: Icon, label, value, detail, color }) {
  return (
    <article className="stat-card">
      <div className={`stat-icon ${color}`}><Icon size={21} /></div>
      <span className="stat-label">{label}</span>
      <strong className="stat-value">{value}</strong>
      <span className="stat-detail">{detail}</span>
    </article>
  );
}

function StockBadge({ product }) {
  const { label, type } = getStatus(product);
  return <span className={`stock-badge stock-${type}`}><span className="badge-dot" />{label}</span>;
}

export default function Dashboard() {
  const { products, updateProduct, deleteProduct, adjustStock } = useInventory();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Todas');
  const [status, setStatus] = useState('Todos');
  const [editing, setEditing] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [toast, setToast] = useState('');
  const toastTimer = useRef(null);

  useEffect(() => () => clearTimeout(toastTimer.current), []);

  function notify(message) {
    setToast(message);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(''), 3300);
  }

  const summary = useMemo(() => {
    const units = products.reduce((sum, product) => sum + product.stock, 0);
    const worth = products.reduce((sum, product) => sum + product.stock * product.price, 0);
    const low = products.filter((p) => p.stock > 0 && p.stock <= p.minStock);
    const out = products.filter((p) => p.stock === 0);
    const healthy = products.filter((p) => getStatus(p).type === 'ok').length;
    return { units, worth, low, out, healthy, attention: low.length + out.length };
  }, [products]);

  const filtered = useMemo(() => filterProducts(products, { search, category, status }), [products, search, category, status]);

  function openEdit(product) { setEditing(product); setModalOpen(true); }
  function closeModal() { setModalOpen(false); setEditing(null); }

  function save(product) {
    updateProduct(product);
    notify('Producto actualizado correctamente.');
    closeModal();
  }

  function remove(product) {
    if (!window.confirm(`¿Eliminar "${product.name}" del inventario? Si está en el carrito, también se quitará de allí. Esta acción no se puede deshacer.`)) return;
    deleteProduct(product.id);
    notify('Producto eliminado del inventario.');
  }

  function changeStock(product, delta) {
    if (delta < 0 && product.stock === 0) return;
    adjustStock(product.id, delta);
    notify(`Stock de ${product.name} actualizado.`);
  }

  function exportInventory() {
    downloadCSV(filtered);
    notify('Archivo CSV descargado correctamente.');
  }

  const date = new Intl.DateTimeFormat('es-CL', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date());
  const percentHealthy = products.length ? Math.round(summary.healthy / products.length * 100) : 0;

  return (
    <div className="page-enter">
      <div className="eyebrow-line"><span className="eyebrow-accent" /> PANEL DE CONTROL <span className="eyebrow-separator">/</span> {date}</div>
      <section className="hero">
        <div className="hero-orb hero-orb-one" /><div className="hero-orb hero-orb-two" />
        <div className="hero-copy">
          <span className="hero-kicker"><span className="kicker-point" /> TU INVENTARIO, BAJO CONTROL</span>
          <h1>Todo tu supermercado.<br /><em>En un solo lugar.</em></h1>
          <p>Organiza tus productos, supervisa existencias y toma mejores decisiones con getiomark.</p>
          <Link to="/articulos/nuevo" className="button button-lime"><Plus size={18} strokeWidth={2.5} /> Agregar producto <ArrowRight size={17} /></Link>
        </div>
        <div className="hero-widget" aria-label={`${percentHealthy}% de productos con stock suficiente`}>
          <div className="hero-widget-top"><span><BarChart3 size={17} /> Salud del inventario</span><span className="widget-live"><i /> ACTUALIZADO</span></div>
          <div className="hero-widget-number">{percentHealthy}<span>%</span><span className="hero-widget-pill">Stock suficiente</span></div>
          <div className="hero-progress"><div style={{ width: `${percentHealthy}%` }} /></div>
          <div className="hero-widget-foot"><span>{summary.healthy} productos al día</span><span>{summary.attention} requieren atención</span></div>
          <div className="mini-bars" aria-hidden="true">{[24, 36, 29, 47, 36, 66, 53, 75, 59, 81, 69, 91, 77, 100].map((height, idx) => <span key={idx} style={{ height: `${height}%` }} />)}</div>
        </div>
      </section>

      <div className="section-heading stats-title"><div><span className="section-kicker">VISTA GENERAL</span><h2>Resumen del inventario</h2></div><span className="soft-note"><span className="note-dot" /> Datos guardados en este dispositivo</span></div>
      <section className="stat-grid" aria-label="Estadísticas de inventario">
        <StatCard icon={Package} label="Productos registrados" value={products.length.toLocaleString('es-CL')} detail="Referencias diferentes" color="blue" />
        <StatCard icon={ShoppingBasket} label="Unidades disponibles" value={summary.units.toLocaleString('es-CL')} detail="Stock total en bodega" color="purple" />
        <StatCard icon={TrendingUp} label="Valor del inventario" value={formatCLP(summary.worth)} detail="Valor estimado en CLP" color="green" />
        <StatCard icon={ShieldAlert} label="Requieren atención" value={summary.attention.toLocaleString('es-CL')} detail={`${summary.low.length} stock bajo · ${summary.out.length} agotados`} color="orange" />
      </section>

      <section className="inventory-section" aria-labelledby="inventory-title">
        <div className="inventory-topline">
          <div><span className="section-kicker">CATÁLOGO DE PRODUCTOS</span><h2 id="inventory-title">Tu inventario <span className="count-tag">{products.length}</span></h2><p>Gestiona tus productos y mantén tus existencias al día.</p></div>
          <div className="toolbar-actions"><button className="button button-outline" onClick={exportInventory} type="button"><ArrowDownToLine size={17} /> Exportar CSV</button><Link className="button button-primary" to="/articulos/nuevo"><Plus size={18} /> Nuevo producto</Link></div>
        </div>
        <div className="filter-toolbar">
          <label className="search-box"><Search size={18} aria-hidden="true" /><span className="sr-only">Buscar productos</span><input type="search" placeholder="Buscar nombre, SKU, marca o tipo..." value={search} onChange={(event) => setSearch(event.target.value)} /></label>
          <div className="select-box"><SlidersHorizontal size={17} aria-hidden="true" /><label className="sr-only" htmlFor="category-select">Filtrar por categoría</label><select id="category-select" value={category} onChange={(event) => setCategory(event.target.value)}><option value="Todas">Todas las categorías</option>{categories.map((cat) => <option key={cat}>{cat}</option>)}</select><ChevronDown size={15} className="select-arrow" /></div>
          <div className="select-box status-select"><label className="sr-only" htmlFor="status-select">Filtrar por estado</label><select id="status-select" value={status} onChange={(event) => setStatus(event.target.value)}><option value="Todos">Todos los estados</option><option value="ok">Disponible</option><option value="low">Stock bajo</option><option value="out">Sin stock</option></select><ChevronDown size={15} className="select-arrow" /></div>
        </div>
        <div className="table-scroll">
          <table className="inventory-table"><thead><tr><th>PRODUCTO</th><th>CATEGORÍA</th><th>PRECIO UNIT.</th><th>STOCK</th><th>ESTADO</th><th className="actions-column">ACCIONES</th></tr></thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id}>
                  <td><div className="product-cell"><span className="product-avatar"><Box size={20} /></span><span><Link to={`/articulos/${encodeURIComponent(p.id)}`} className="font-extrabold text-slate-800 hover:text-emerald-700 hover:underline">{p.name}</Link><small>{p.sku} <span className="dot-sep">·</span> {p.brand} <span className="dot-sep">·</span> {p.type}</small></span></div></td>
                  <td><span className="category-chip">{p.category}</span></td>
                  <td className="money-cell">{formatCLP(p.price)}</td>
                  <td><div className="stock-adjust"><button type="button" title={`Restar una unidad a ${p.name}`} aria-label={`Restar una unidad a ${p.name}`} onClick={() => changeStock(p, -1)} disabled={p.stock === 0}><Minus size={14} /></button><strong>{p.stock}</strong><button type="button" title={`Sumar una unidad a ${p.name}`} aria-label={`Sumar una unidad a ${p.name}`} onClick={() => changeStock(p, 1)}><Plus size={14} /></button></div></td>
                  <td><StockBadge product={p} /></td>
                  <td><div className="row-actions"><button type="button" onClick={() => openEdit(p)} title={`Editar ${p.name}`} aria-label={`Editar ${p.name}`}><Edit3 size={17} /></button><button type="button" className="danger-action" onClick={() => remove(p)} title={`Eliminar ${p.name}`} aria-label={`Eliminar ${p.name}`}><Trash2 size={17} /></button></div></td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <div className="empty-state"><Search size={27} /><strong>No encontramos productos</strong><span>Prueba con otra búsqueda o cambia los filtros.</span><button type="button" onClick={() => { setSearch(''); setCategory('Todas'); setStatus('Todos'); }} className="button button-outline">Limpiar filtros</button></div>}
        </div>
        <div className="table-footer"><span>Mostrando <strong>{filtered.length}</strong> de <strong>{products.length}</strong> productos</span><span><Check size={15} /> Cambios guardados automáticamente</span></div>
      </section>

      <div className="bottom-cards">
        <section className="advice-card"><div className="advice-icon"><CircleAlert size={22} /></div><div><h3>Mantén tus productos abastecidos</h3><p>{summary.attention > 0 ? `Tienes ${summary.attention} producto${summary.attention !== 1 ? 's' : ''} con stock bajo o agotado. Usa el filtro “Stock bajo” o “Sin stock” para revisarlos.` : 'Todos tus productos tienen existencias suficientes. ¡Buen trabajo!'} </p></div><button className="advice-link" type="button" onClick={() => { setSearch(''); setCategory('Todas'); setStatus(summary.low.length ? 'low' : summary.out.length ? 'out' : 'Todos'); document.getElementById('inventory-title')?.scrollIntoView({ behavior: 'smooth' }); }}>{summary.attention ? 'Revisar stock' : 'Ver productos'} <ArrowRight size={16} /></button></section>
        <div className="tip-card"><span className="tip-icon"><BadgeCheck size={21} /></span><div><strong>¡Un dato útil!</strong><p>El stock mínimo te ayuda a identificar a tiempo cuándo reponer tus productos.</p></div></div>
      </div>

      {modalOpen && <ProductModal product={editing} products={products} onSave={save} onClose={closeModal} />}
      {toast && <div className="toast" role="status"><Check size={17} />{toast}<button type="button" onClick={() => setToast('')} aria-label="Cerrar notificación"><X size={15} /></button></div>}
    </div>
  );
}
