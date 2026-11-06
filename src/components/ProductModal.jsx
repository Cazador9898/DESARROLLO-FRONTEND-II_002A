import { useEffect, useState } from 'react';
import { PackagePlus, Save, X } from 'lucide-react';
import { categories, emptyProductForm } from '../data/products.js';
import { createProductId, validateProduct } from '../utils/productValidation.js';

export default function ProductModal({ product, products, onSave, onClose }) {
  const [form, setForm] = useState(product ? { ...product } : { ...emptyProductForm });
  const [error, setError] = useState('');

  useEffect(() => {
    function onKeyDown(event) { if (event.key === 'Escape') onClose(); }
    document.addEventListener('keydown', onKeyDown);
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKeyDown); document.body.style.overflow = oldOverflow; };
  }, [onClose]);

  function update(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setError('');
  }

  function submit(event) {
    event.preventDefault();
    const result = validateProduct(form, products, product?.id);
    if (result.error) {
      setError(result.error);
      return;
    }
    onSave({ id: product?.id ?? createProductId(), ...result.product });
  }

  return (
    <div className="modal-overlay" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div className="modal-heading">
          <div className="modal-icon"><PackagePlus size={23} /></div>
          <button onClick={onClose} type="button" className="icon-button close-button" aria-label="Cerrar formulario"><X size={20} /></button>
          <h2 id="modal-title">{product ? 'Editar producto' : 'Nuevo producto'}</h2>
          <p>Completa la información para mantener tu inventario actualizado.</p>
        </div>
        <form onSubmit={submit} className="modal-form">
          <div className="form-row">
            <label className="form-field">Nombre del producto <input autoFocus name="name" value={form.name} onChange={update} placeholder="Ej. Harina 1 kg" maxLength="100" required /></label>
            <label className="form-field">Código SKU <input name="sku" value={form.sku} onChange={update} placeholder="Ej. ABA-105" maxLength="32" required /></label>
          </div>
          <div className="form-row">
            <label className="form-field">Marca <input name="brand" value={form.brand} onChange={update} placeholder="Ej. Selecta" maxLength="80" required /></label>
            <label className="form-field">Tipo de producto <input name="type" value={form.type} onChange={update} placeholder="Ej. Harina" maxLength="80" required /></label>
          </div>
          <div className="form-row">
            <label className="form-field">Categoría
              <select name="category" value={form.category} onChange={update}>
                {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </label>
            <label className="form-field">Proveedor <input name="supplier" value={form.supplier} onChange={update} placeholder="Nombre del proveedor" maxLength="90" required /></label>
          </div>
          <div className="form-row triple">
            <label className="form-field">Precio (CLP) <input name="price" type="number" min="0" step="1" value={form.price} onChange={update} placeholder="1990" required /></label>
            <label className="form-field">Stock actual <input name="stock" type="number" min="0" step="1" value={form.stock} onChange={update} placeholder="20" required /></label>
            <label className="form-field">Stock mínimo <input name="minStock" type="number" min="0" step="1" value={form.minStock} onChange={update} required /></label>
          </div>
          {error && <p className="form-error" role="alert">{error}</p>}
          <div className="modal-actions">
            <button type="button" onClick={onClose} className="button button-secondary">Cancelar</button>
            <button type="submit" className="button button-primary"><Save size={17} /> {product ? 'Guardar cambios' : 'Agregar producto'}</button>
          </div>
        </form>
      </section>
    </div>
  );
}
