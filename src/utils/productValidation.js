// Validación reutilizada por el formulario de registro y el modal de edición.
export function validateProduct(form, products, currentId = null) {
  const name = String(form.name ?? '').trim();
  const brand = String(form.brand ?? '').trim();
  const type = String(form.type ?? '').trim();
  const sku = String(form.sku ?? '').trim().toUpperCase();
  const category = String(form.category ?? '').trim();
  const supplier = String(form.supplier ?? '').trim();
  const price = Number(form.price);
  const stock = Number(form.stock);
  const minStock = Number(form.minStock);

  if (!name || !brand || !type || !sku || !category || !supplier) {
    return { error: 'Completa el nombre, marca, tipo, SKU, categoría y proveedor del artículo.' };
  }
  if (products.some((item) => item.sku?.toUpperCase() === sku && item.id !== currentId)) {
    return { error: 'Ya existe un artículo con ese código SKU. Ingresa uno diferente.' };
  }
  if (form.price === '' || !Number.isSafeInteger(price) || price < 0) {
    return { error: 'El precio debe ser un número entero mayor o igual a cero.' };
  }
  if (form.stock === '' || !Number.isSafeInteger(stock) || stock < 0 ||
      form.minStock === '' || !Number.isSafeInteger(minStock) || minStock < 0) {
    return { error: 'El stock y el stock mínimo deben ser números enteros no negativos.' };
  }

  return {
    product: {
      name, brand, type, sku, category, supplier, price, stock, minStock,
    },
  };
}

export function createProductId() {
  return globalThis.crypto?.randomUUID?.() ?? `prod-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}
