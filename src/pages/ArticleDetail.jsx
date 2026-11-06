import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, BadgeCheck, Boxes, CheckCircle2, Minus, Package, Plus, ShoppingCart, Tag, Truck } from 'lucide-react';
import { useInventory } from '../context/InventoryContext.jsx';
import { formatCLP, getStatus } from '../utils/inventory.js';

const badgeStyles = {
  ok: 'bg-emerald-100 text-emerald-900',
  low: 'bg-amber-100 text-amber-900',
  out: 'bg-rose-100 text-rose-800',
};

export default function ArticleDetail() {
  const { id } = useParams();
  const { products, cart, addToCart } = useInventory();
  const product = products.find((item) => item.id === id);
  const inCart = cart.find((line) => line.id === id)?.quantity ?? 0;
  const [quantity, setQuantity] = useState(1);
  const [notice, setNotice] = useState('');

  useEffect(() => { setQuantity(1); setNotice(''); }, [id]);

  if (!product) {
    return (
      <section className="page-enter mx-auto max-w-2xl rounded-3xl border border-slate-200 bg-white px-7 py-16 text-center shadow-sm">
        <Package className="mx-auto text-slate-400" size={46} />
        <h1 className="mt-5 text-2xl font-extrabold text-emerald-950">Artículo no encontrado</h1>
        <p className="mt-3 text-slate-600">El artículo fue eliminado o el enlace no es válido.</p>
        <Link to="/articulos/listado" className="button button-primary mt-7"><ArrowLeft size={17} /> Volver al listado</Link>
      </section>
    );
  }

  const status = getStatus(product);
  const maxQuantity = product.stock;
  const selectedQuantity = Math.min(quantity, Math.max(1, maxQuantity));

  function addArticle() {
    if (!Number.isSafeInteger(selectedQuantity) || selectedQuantity <= 0 || selectedQuantity > product.stock) {
      setNotice('No hay suficientes unidades disponibles.');
      return;
    }
    addToCart(product.id, selectedQuantity);
    setQuantity(1);
    setNotice(`Se agregaron ${selectedQuantity} unidad${selectedQuantity !== 1 ? 'es' : ''} de «${product.name}» al carrito.`);
  }

  return (
    <div className="page-enter">
      <div className="eyebrow-line"><span className="eyebrow-accent" /> GESTIÓN DE ARTÍCULOS <span className="eyebrow-separator">/</span> Detalle</div>
      <Link to="/articulos/listado" className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-emerald-800 hover:underline"><ArrowLeft size={16} /> Volver al listado</Link>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_355px]">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-9">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="grid size-20 place-items-center rounded-3xl bg-emerald-50 text-emerald-700"><Boxes size={38} /></div>
            <span className={`rounded-full px-4 py-2 text-xs font-extrabold ${badgeStyles[status.type]}`}>{status.label}</span>
          </div>
          <span className="section-kicker mt-7 block">FICHA DEL PRODUCTO</span>
          <h1 className="mt-2 text-3xl font-extrabold leading-tight text-emerald-950 sm:text-4xl">{product.name}</h1>
          <p className="mt-3 text-sm text-slate-500">Código de referencia: <span className="font-bold text-slate-700">{product.sku}</span></p>
          <div className="mt-7 grid gap-4 border-t border-slate-100 pt-7 sm:grid-cols-2">
            {[
              { label: 'Marca', value: product.brand, icon: BadgeCheck },
              { label: 'Tipo de producto', value: product.type, icon: Tag },
              { label: 'Categoría', value: product.category, icon: Boxes },
              { label: 'Proveedor', value: product.supplier, icon: Truck },
            ].map(({ label, value, icon: Icon }) => (
              <div key={label} className="rounded-2xl bg-slate-50 p-4">
                <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500"><Icon size={15} /> {label}</span>
                <p className="mt-2 break-words text-base font-bold text-slate-800">{value}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap gap-4 rounded-2xl border border-emerald-100 bg-emerald-50 p-5">
            <div className="flex-1"><p className="text-xs font-bold text-emerald-800">Stock disponible</p><strong className="mt-1 block text-3xl text-emerald-950">{product.stock} <span className="text-sm font-medium">unidades</span></strong></div>
            <div className="flex-1"><p className="text-xs font-bold text-emerald-800">Stock mínimo</p><strong className="mt-1 block text-3xl text-emerald-950">{product.minStock} <span className="text-sm font-medium">unidades</span></strong></div>
          </div>
        </section>

        <aside className="h-fit rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm sm:p-8">
          <span className="section-kicker">AGREGAR AL CARRITO</span>
          <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-slate-500">Precio unitario</p>
          <p className="mt-1 text-4xl font-extrabold text-emerald-950">{formatCLP(product.price)}</p>
          <div className="mt-7 border-t border-slate-100 pt-6">
            <label htmlFor="quantity-detail" className="block text-sm font-bold text-slate-700">Cantidad a reservar</label>
            <div className="mt-3 flex w-fit items-center rounded-xl border border-slate-200">
              <button type="button" aria-label="Disminuir cantidad" disabled={maxQuantity === 0 || selectedQuantity <= 1} onClick={() => setQuantity((q) => Math.max(1, Math.min(q, maxQuantity) - 1))} className="rounded-l-xl p-3 text-emerald-800 hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-30"><Minus size={18} /></button>
              <input id="quantity-detail" type="number" min="1" max={Math.max(1, maxQuantity)} step="1" disabled={maxQuantity === 0} value={selectedQuantity} onChange={(event) => {
                const next = Number(event.target.value);
                if (Number.isSafeInteger(next)) setQuantity(Math.max(1, Math.min(maxQuantity, next)));
              }} className="w-20 border-x border-slate-200 bg-white py-2 text-center text-lg font-extrabold text-emerald-950 outline-none disabled:opacity-40" />
              <button type="button" aria-label="Aumentar cantidad" disabled={maxQuantity === 0 || selectedQuantity >= maxQuantity} onClick={() => setQuantity((q) => Math.min(maxQuantity, q + 1))} className="rounded-r-xl p-3 text-emerald-800 hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-30"><Plus size={18} /></button>
            </div>
            <p className="mt-3 text-sm text-slate-500">Total: <strong className="text-emerald-950">{formatCLP(product.price * (maxQuantity > 0 ? selectedQuantity : 0))}</strong></p>
            <button type="button" onClick={addArticle} disabled={maxQuantity === 0} className="button button-primary mt-6 w-full justify-center disabled:cursor-not-allowed disabled:opacity-50"><ShoppingCart size={19} /> {maxQuantity > 0 ? 'Agregar al carrito' : 'Producto agotado'}</button>
            {notice && <p role="status" className="mt-4 flex items-start gap-2 rounded-xl bg-emerald-50 p-3 text-sm font-semibold leading-6 text-emerald-800"><CheckCircle2 size={19} className="mt-0.5 shrink-0" /> {notice}</p>}
            <p className="mt-4 text-xs leading-6 text-slate-500">Al agregar un producto, sus unidades se descuentan del inventario disponible. Al retirarlo del carrito, se devuelven automáticamente.</p>
          </div>
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-5">
            <span className="text-sm text-slate-600">En tu carrito: <strong>{inCart}</strong></span>
            <Link to="/carrito" className="inline-flex items-center gap-2 text-sm font-extrabold text-emerald-800 hover:underline">Ver carrito <ArrowRight size={16} /></Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
