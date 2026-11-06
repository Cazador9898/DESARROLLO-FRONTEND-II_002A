import { initialProducts } from '../data/products.js';

// Conservamos la misma clave de Semana 1 para NO perder productos existentes.
export const INVENTORY_KEY = 'getiomark-inventory-v1';
export const MESSAGES_KEY = 'getiomark-messages-v1';
// Carrito creado en Semana 3. Cada cantidad aquí ya fue descontada del stock disponible.
export const CART_KEY = 'getiomark-cart-v1';

export const formatCLP = (value) => new Intl.NumberFormat('es-CL', {
  style: 'currency', currency: 'CLP', maximumFractionDigits: 0,
}).format(value);

export function getStatus(product) {
  if (product.stock === 0) return { label: 'Sin stock', type: 'out' };
  if (product.stock <= product.minStock) return { label: 'Stock bajo', type: 'low' };
  return { label: 'Disponible', type: 'ok' };
}

// Migra artículos guardados en Semana 1, cuando aún no existían marca y tipo.
export function normalizeProduct(product) {
  const sample = initialProducts.find((item) => item.sku === product.sku);
  return {
    ...product,
    brand: product.brand?.trim() || sample?.brand || 'Sin marca',
    type: product.type?.trim() || sample?.type || product.category || 'Sin clasificar',
  };
}

export function loadProducts() {
  try {
    const raw = localStorage.getItem(INVENTORY_KEY);
    if (!raw) return initialProducts.map((item) => ({ ...item }));
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.map(normalizeProduct) : initialProducts.map((item) => ({ ...item }));
  } catch {
    return initialProducts.map((item) => ({ ...item }));
  }
}

export function saveProducts(products) {
  try {
    localStorage.setItem(INVENTORY_KEY, JSON.stringify(products));
  } catch {
    // Se mantiene el estado React durante la sesión aunque localStorage esté bloqueado.
  }
}

export function loadCart(products) {
  try {
    const parsed = JSON.parse(localStorage.getItem(CART_KEY) ?? '[]');
    if (!Array.isArray(parsed)) return [];
    const knownIds = new Set(products.map((product) => product.id));
    const seen = new Set();
    return parsed.filter((line) => {
      if (!line || !knownIds.has(line.id) || seen.has(line.id) ||
          !Number.isSafeInteger(line.quantity) || line.quantity <= 0) return false;
      seen.add(line.id);
      return true;
    }).map(({ id, quantity }) => ({ id, quantity }));
  } catch {
    return [];
  }
}

export function saveCart(cart) {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  } catch {
    // El carrito sigue disponible mientras la pestaña permanezca abierta.
  }
}

export function downloadCSV(products) {
  const headers = ['SKU', 'Producto', 'Marca', 'Tipo', 'Categoría', 'Proveedor', 'Precio CLP', 'Stock', 'Stock mínimo', 'Estado'];
  const rows = products.map((p) => [p.sku, p.name, p.brand, p.type, p.category, p.supplier, p.price, p.stock, p.minStock, getStatus(p).label]);
  // Entrecomillado y escape para compatibilidad con Excel de Chile.
  const escapeCell = (value) => `"${String(value ?? '').replaceAll('"', '""')}"`;
  const csv = `\uFEFF${[headers, ...rows].map((row) => row.map(escapeCell).join(';')).join('\r\n')}`;
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'getiomark-inventario.csv';
  document.body.appendChild(a);
  a.click();
  a.remove();
  // La liberación se retrasa ligeramente para permitir comenzar la descarga.
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
