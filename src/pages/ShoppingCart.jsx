import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Minus, Plus, ShoppingCart as CartIcon, Trash2, PackageCheck, RotateCcw } from 'lucide-react';
import { useInventory } from '../context/InventoryContext.jsx';
import { formatCLP } from '../utils/inventory.js';

export default function ShoppingCart() {
  const { cartItems, cartCount, cartTotal, changeCartQuantity, removeFromCart, clearCart } = useInventory();

  function emptyCart() {
    if (window.confirm('¿Vaciar el carrito y devolver todas las unidades al inventario?')) clearCart();
  }

  return (
    <div className="page-enter">
      <div className="eyebrow-line"><span className="eyebrow-accent" /> GESTIÓN DE ARTÍCULOS <span className="eyebrow-separator">/</span> Carrito</div>
      <section className="mb-7 flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="section-kicker">RESERVA DE PRODUCTOS</span>
          <h1 className="mt-2 flex items-center gap-3 text-3xl font-extrabold text-emerald-950 sm:text-4xl"><CartIcon size={32} /> Carrito de compras</h1>
          <p className="mt-3 text-sm leading-7 text-slate-500">Aumenta o disminuye cantidades. El inventario se actualiza automáticamente.</p>
        </div>
        <Link to="/articulos/listado" className="button button-outline"><ArrowLeft size={17} /> Seguir agregando artículos</Link>
      </section>

      {cartItems.length === 0 ? (
        <section className="rounded-3xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
          <div className="mx-auto grid size-20 place-items-center rounded-3xl bg-emerald-50 text-emerald-700"><CartIcon size={38} /></div>
          <h2 className="mt-5 text-2xl font-extrabold text-emerald-950">Tu carrito está vacío</h2>
          <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-slate-500">Explora el catálogo, abre la ficha de un artículo y agrégalo al carrito para reservar sus existencias.</p>
          <Link to="/articulos/listado" className="button button-primary mt-7">Ver artículos <ArrowRight size={17} /></Link>
        </section>
      ) : (
        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_315px]">
          <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm" aria-labelledby="cart-heading">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 p-5 sm:p-7">
              <div><h2 id="cart-heading" className="text-lg font-extrabold text-slate-800">Artículos reservados</h2><p className="mt-1 text-sm text-slate-500">{cartItems.length} productos distintos · {cartCount} unidades</p></div>
              <button type="button" onClick={emptyCart} className="inline-flex items-center gap-2 rounded-xl border border-red-100 px-4 py-2.5 text-sm font-bold text-red-700 hover:bg-red-50"><RotateCcw size={16} /> Vaciar carrito</button>
            </div>
            <div className="divide-y divide-slate-100">
              {cartItems.map(({ id, quantity, product }) => (
                <article key={id} className="flex flex-wrap items-center gap-5 p-5 sm:p-7">
                  <div className="grid size-14 shrink-0 place-items-center rounded-2xl bg-emerald-50 text-emerald-700"><PackageCheck size={28} /></div>
                  <div className="min-w-[165px] flex-1">
                    <Link to={`/articulos/${encodeURIComponent(id)}`} className="font-extrabold text-slate-800 hover:text-emerald-700 hover:underline">{product.name}</Link>
                    <p className="mt-1 text-xs text-slate-500">{product.brand} · {product.sku}</p>
                    <p className="mt-1 text-xs text-slate-500">Disponible fuera del carrito: <strong>{product.stock}</strong></p>
                    <p className="mt-2 text-sm font-bold text-slate-700">{formatCLP(product.price)} c/u</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="inline-flex items-center rounded-xl border border-slate-200" aria-label={`Cantidad de ${product.name}`}>
                      <button type="button" aria-label={`Quitar una unidad de ${product.name}`} onClick={() => changeCartQuantity(id, -1)} className="rounded-l-xl p-3 text-emerald-800 hover:bg-emerald-50"><Minus size={16} /></button>
                      <span className="min-w-10 text-center text-sm font-extrabold text-slate-800" aria-live="polite">{quantity}</span>
                      <button type="button" aria-label={`Agregar una unidad de ${product.name}`} disabled={product.stock === 0} onClick={() => changeCartQuantity(id, 1)} className="rounded-r-xl p-3 text-emerald-800 hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-30"><Plus size={16} /></button>
                    </div>
                    <button type="button" onClick={() => removeFromCart(id)} title={`Quitar ${product.name} del carrito`} aria-label={`Quitar ${product.name} del carrito`} className="rounded-xl border border-red-100 p-3 text-red-600 hover:bg-red-50"><Trash2 size={17} /></button>
                  </div>
                  <strong className="w-full text-right text-base text-emerald-950 sm:w-28">{formatCLP(product.price * quantity)}</strong>
                </article>
              ))}
            </div>
          </section>
          <aside className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm sm:p-7">
            <h2 className="text-lg font-extrabold text-slate-800">Resumen del carrito</h2>
            <div className="mt-6 space-y-4 border-b border-slate-100 pb-6 text-sm text-slate-600">
              <div className="flex justify-between gap-3"><span>Productos distintos</span><strong className="text-slate-800">{cartItems.length}</strong></div>
              <div className="flex justify-between gap-3"><span>Unidades reservadas</span><strong className="text-slate-800">{cartCount}</strong></div>
            </div>
            <div className="mt-5 flex items-center justify-between gap-3"><span className="font-bold text-slate-700">Total referencial</span><strong className="text-2xl font-extrabold text-emerald-950">{formatCLP(cartTotal)}</strong></div>
            <p className="mt-5 rounded-xl bg-emerald-50 p-4 text-xs leading-6 text-emerald-900">Este carrito es una demostración académica. No se realizan pagos ni compras reales. El stock se descuenta al reservar unidades y se restituye al retirarlas.</p>
            <Link to="/articulos/listado" className="button button-primary mt-6 w-full justify-center">Seguir explorando <ArrowRight size={17} /></Link>
          </aside>
        </div>
      )}
    </div>
  );
}
