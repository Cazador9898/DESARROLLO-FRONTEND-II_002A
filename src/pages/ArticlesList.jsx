import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowDownToLine, ClipboardList, Edit3, Eye, Package, Plus, Search, Trash2 } from 'lucide-react';
import ProductModal from '../components/ProductModal.jsx';
import { categories } from '../data/products.js';
import { useInventory } from '../context/InventoryContext.jsx';
import { downloadCSV, formatCLP, getStatus } from '../utils/inventory.js';
import { filterProducts } from '../utils/inventoryReducer.js';

const filterStyles = 'w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100';

export default function ArticlesList() {
  const { products, updateProduct, deleteProduct } = useInventory();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Todas');
  const [editing, setEditing] = useState(null);
  const [notice, setNotice] = useState('');

  // Filtro derivado, no modifica ni reemplaza el inventario original.
  const filtered = useMemo(() => filterProducts(products, { search, category }), [products, search, category]);

  function remove(item) {
    if (!window.confirm(`¿Eliminar «${item.name}» del inventario? Si está en el carrito también se quitará de allí.`)) return;
    deleteProduct(item.id);
    setNotice(`Se eliminó «${item.name}» del inventario.`);
  }

  function save(updated) {
    updateProduct(updated);
    setEditing(null);
    setNotice(`Se actualizó «${updated.name}» correctamente.`);
  }

  return (
    <div className="page-enter">
      <div className="eyebrow-line"><span className="eyebrow-accent" /> GESTIÓN DE ARTÍCULOS <span className="eyebrow-separator">/</span> Listado</div>
      <section className="mb-7 flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="section-kicker">CONSULTA DE EXISTENCIAS</span>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-emerald-950 sm:text-4xl">Listado de artículos</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500">Filtra por categoría y haz clic en un artículo para ver su ficha y agregarlo al carrito. El inventario original se conserva.</p>
        </div>
        <Link to="/articulos/nuevo" className="button button-primary"><Plus size={18} /> Nuevo artículo</Link>
      </section>

      <div className="mb-5 grid gap-4 sm:grid-cols-3">
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><span className="text-xs font-bold uppercase tracking-wider text-slate-500">Artículos registrados</span><p className="mt-2 text-3xl font-extrabold text-emerald-900">{products.length}</p></article>
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><span className="text-xs font-bold uppercase tracking-wider text-slate-500">Unidades en inventario</span><p className="mt-2 text-3xl font-extrabold text-emerald-900">{products.reduce((total, p) => total + p.stock, 0).toLocaleString('es-CL')}</p></article>
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><span className="text-xs font-bold uppercase tracking-wider text-slate-500">Con alerta de stock</span><p className="mt-2 text-3xl font-extrabold text-amber-600">{products.filter((p) => getStatus(p).type !== 'ok').length}</p></article>
      </div>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm" aria-labelledby="articles-table-heading">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-6 sm:px-7">
          <div><h2 id="articles-table-heading" className="flex items-center gap-2 text-lg font-extrabold text-slate-800"><ClipboardList size={21} className="text-emerald-700" /> Catálogo completo</h2><p className="mt-1 text-xs text-slate-500">Selecciona un artículo para consultar su detalle y reservar unidades.</p></div>
          <button type="button" onClick={() => downloadCSV(filtered)} className="button button-outline"><ArrowDownToLine size={17} /> Exportar CSV</button>
        </div>
        {notice && <div role="status" className="mx-5 mt-4 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800 sm:mx-7">{notice}</div>}
        <div className="grid gap-3 p-5 sm:grid-cols-[minmax(0,1fr)_230px] sm:p-7">
          <label className="relative block"><span className="sr-only">Buscar artículos por nombre, marca, tipo o SKU</span><Search size={18} className="pointer-events-none absolute left-3 top-3.5 text-slate-400" /><input type="search" className={`${filterStyles} pl-10`} value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar nombre, marca, tipo o SKU..." /></label>
          <label><span className="sr-only">Filtrar artículos por categoría</span><select className={filterStyles} value={category} onChange={(e) => setCategory(e.target.value)}><option value="Todas">Todas las categorías</option>{categories.map((option) => <option key={option} value={option}>{option}</option>)}</select></label>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1050px] border-collapse text-left text-sm">
            <thead className="border-y border-slate-100 bg-slate-50 text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
              <tr><th scope="col" className="px-6 py-4">Artículo</th><th scope="col" className="px-4 py-4">Marca</th><th scope="col" className="px-4 py-4">Tipo</th><th scope="col" className="px-4 py-4">Categoría</th><th scope="col" className="px-4 py-4">Precio</th><th scope="col" className="px-4 py-4">Disponible</th><th scope="col" className="px-4 py-4">Estado</th><th scope="col" className="px-4 py-4">Acciones</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((item) => {
                const status = getStatus(item);
                return (
                  <tr key={item.id} className="hover:bg-emerald-50/50">
                    <td className="px-6 py-4"><div className="flex items-center gap-3"><span className="grid size-10 shrink-0 place-items-center rounded-xl bg-emerald-50 text-emerald-700"><Package size={20} /></span><span><Link to={`/articulos/${encodeURIComponent(item.id)}`} className="block font-extrabold text-slate-800 hover:text-emerald-700 hover:underline">{item.name}</Link><small className="text-xs text-slate-400">{item.sku}</small></span></div></td>
                    <td className="px-4 py-4 font-semibold text-slate-700">{item.brand}</td>
                    <td className="px-4 py-4 text-slate-600">{item.type}</td>
                    <td className="px-4 py-4 text-slate-600">{item.category}</td>
                    <td className="whitespace-nowrap px-4 py-4 font-bold text-slate-700">{formatCLP(item.price)}</td>
                    <td className="px-4 py-4 font-extrabold text-slate-800">{item.stock}</td>
                    <td className="px-4 py-4"><span className={`inline-flex whitespace-nowrap rounded-full px-3 py-1 text-xs font-bold ${status.type === 'ok' ? 'bg-emerald-100 text-emerald-800' : status.type === 'low' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'}`}>{status.label}</span></td>
                    <td className="px-4 py-4"><div className="flex items-center gap-2"><Link to={`/articulos/${encodeURIComponent(item.id)}`} title={`Ver detalle de ${item.name}`} aria-label={`Ver detalle de ${item.name}`} className="rounded-lg border border-slate-200 p-2 text-emerald-700 hover:bg-emerald-50"><Eye size={17} /></Link><button type="button" onClick={() => setEditing(item)} aria-label={`Editar ${item.name}`} className="rounded-lg border border-slate-200 p-2 text-emerald-700 hover:bg-emerald-50"><Edit3 size={17} /></button><button type="button" onClick={() => remove(item)} aria-label={`Eliminar ${item.name}`} className="rounded-lg border border-slate-200 p-2 text-red-600 hover:bg-red-50"><Trash2 size={17} /></button></div></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && <div className="flex flex-col items-center gap-3 px-5 py-14 text-center text-slate-500"><Search size={30} /><strong>No hay artículos que coincidan con tu búsqueda.</strong><button type="button" className="button button-outline" onClick={() => { setSearch(''); setCategory('Todas'); }}>Limpiar filtros</button></div>}
        </div>
        <div className="flex flex-wrap justify-between gap-2 border-t border-slate-100 px-6 py-4 text-xs text-slate-500"><span>Mostrando <strong>{filtered.length}</strong> de <strong>{products.length}</strong> artículos</span><span>El filtro no altera el inventario original</span></div>
      </section>
      {editing && <ProductModal product={editing} products={products} onSave={save} onClose={() => setEditing(null)} />}
    </div>
  );
}
