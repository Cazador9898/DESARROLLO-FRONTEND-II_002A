import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, CheckCircle2, ClipboardList, PackagePlus, RotateCcw, Save, ShieldCheck } from 'lucide-react';
import { categories, emptyProductForm } from '../data/products.js';
import { useInventory } from '../context/InventoryContext.jsx';
import { createProductId, validateProduct } from '../utils/productValidation.js';

const inputStyles = 'mt-2 block w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 shadow-sm outline-none transition focus:border-emerald-600 focus:bg-white focus:ring-4 focus:ring-emerald-100';
const labelStyles = 'block text-sm font-bold text-slate-700';

export default function NewArticle() {
  const { products, addProduct } = useInventory();
  const [form, setForm] = useState({ ...emptyProductForm });
  const [error, setError] = useState('');
  const [savedName, setSavedName] = useState('');

  function update(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setError('');
    setSavedName('');
  }

  function submit(event) {
    event.preventDefault();
    const result = validateProduct(form, products);
    if (result.error) {
      setError(result.error);
      return;
    }
    addProduct({ id: createProductId(), ...result.product });
    setSavedName(result.product.name);
    setForm({ ...emptyProductForm });
    setError('');
  }

  function reset() {
    setForm({ ...emptyProductForm });
    setError('');
    setSavedName('');
  }

  return (
    <div className="page-enter">
      <div className="eyebrow-line"><span className="eyebrow-accent" /> GESTIÓN DE ARTÍCULOS <span className="eyebrow-separator">/</span> Nuevo artículo</div>
      <section className="mb-7 flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="section-kicker">REGISTRO DE INVENTARIO</span>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-emerald-950 sm:text-4xl">Ingresar nuevo artículo</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500">Registra un producto en getiomark. Se agregará automáticamente al inventario compartido de todas las páginas.</p>
        </div>
        <Link to="/articulos/listado" className="button button-outline"><ClipboardList size={17} /> Ver listado <ArrowRight size={16} /></Link>
      </section>

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_280px]">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8" aria-labelledby="new-article-form-title">
          <div className="mb-7 flex items-center gap-4 border-b border-slate-100 pb-6">
            <div className="grid size-12 shrink-0 place-items-center rounded-2xl bg-emerald-100 text-emerald-700"><PackagePlus size={24} /></div>
            <div><h2 id="new-article-form-title" className="text-lg font-extrabold text-slate-800">Datos del artículo</h2><p className="mt-1 text-xs text-slate-500">Completa los campos para registrar el producto.</p></div>
          </div>

          {savedName && (
            <div role="status" className="mb-6 flex flex-wrap items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
              <CheckCircle2 className="shrink-0" size={20} />
              <span className="flex-1"><strong>¡Artículo registrado!</strong> «{savedName}» ya aparece en el inventario global.</span>
              <Link to="/articulos/listado" className="font-extrabold underline underline-offset-4">Ver en la tabla</Link>
            </div>
          )}
          {error && <p className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-800" role="alert">{error}</p>}

          <form onSubmit={submit} className="space-y-6">
            <div className="grid gap-5 sm:grid-cols-2">
              <label className={labelStyles}>Nombre del producto *
                <input className={inputStyles} name="name" value={form.name} onChange={update} placeholder="Ej. Harina de trigo 1 kg" maxLength={100} required />
              </label>
              <label className={labelStyles}>Marca *
                <input className={inputStyles} name="brand" value={form.brand} onChange={update} placeholder="Ej. Selecta" maxLength={80} required />
              </label>
              <label className={labelStyles}>Tipo de producto *
                <input className={inputStyles} name="type" value={form.type} onChange={update} placeholder="Ej. Harina" maxLength={80} required />
              </label>
              <label className={labelStyles}>Código SKU *
                <input className={inputStyles} name="sku" value={form.sku} onChange={update} placeholder="Ej. ABA-205" maxLength={32} required />
              </label>
              <label className={labelStyles}>Categoría *
                <select className={inputStyles} name="category" value={form.category} onChange={update} required>
                  {categories.map((category) => <option key={category} value={category}>{category}</option>)}
                </select>
              </label>
              <label className={labelStyles}>Proveedor *
                <input className={inputStyles} name="supplier" value={form.supplier} onChange={update} placeholder="Ej. Distribuidora Central" maxLength={90} required />
              </label>
            </div>
            <div className="border-t border-slate-100 pt-6">
              <h3 className="mb-4 text-sm font-extrabold text-slate-800">Precio y existencias</h3>
              <div className="grid gap-5 sm:grid-cols-3">
                <label className={labelStyles}>Precio unitario (CLP) *
                  <input className={inputStyles} type="number" name="price" value={form.price} onChange={update} min="0" step="1" placeholder="1990" required />
                </label>
                <label className={labelStyles}>Stock actual *
                  <input className={inputStyles} type="number" name="stock" value={form.stock} onChange={update} min="0" step="1" placeholder="20" required />
                </label>
                <label className={labelStyles}>Stock mínimo *
                  <input className={inputStyles} type="number" name="minStock" value={form.minStock} onChange={update} min="0" step="1" required />
                </label>
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-6">
              <span className="text-xs text-slate-400">* Campos obligatorios</span>
              <div className="flex flex-wrap gap-3">
                <button type="button" className="button button-secondary" onClick={reset}><RotateCcw size={16} /> Limpiar</button>
                <button type="submit" className="button button-primary"><Save size={17} /> Guardar artículo</button>
              </div>
            </div>
          </form>
        </section>

        <aside className="space-y-4">
          <div className="rounded-2xl bg-emerald-950 p-6 text-white shadow-sm">
            <div className="mb-5 grid size-11 place-items-center rounded-xl bg-emerald-800 text-lime-200"><ShieldCheck size={24} /></div>
            <h2 className="text-lg font-extrabold">Inventario sincronizado</h2>
            <p className="mt-3 text-sm leading-7 text-emerald-100">La información se administra con Context API y se comparte entre el panel, el formulario y la tabla.</p>
            <div className="mt-6 border-t border-emerald-700 pt-4"><span className="text-3xl font-extrabold text-lime-200">{products.length}</span><p className="mt-1 text-xs text-emerald-200">artículos registrados actualmente</p></div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="text-sm font-extrabold text-slate-800">Consejos para registrar</h2>
            <p className="mt-3 text-xs leading-6 text-slate-500">Usa un SKU único por producto. La marca identifica al fabricante y el tipo describe qué artículo es. El stock mínimo permite mostrar alertas de reposición.</p>
            <Link to="/" className="mt-5 inline-flex items-center gap-2 text-xs font-bold text-emerald-800 hover:underline"><ArrowLeft size={15} /> Volver al inicio</Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
