import { initialProducts } from '../data/products.js';

export const INVENTORY_KEY = 'getiomark-inventory-v1';
export const MESSAGES_KEY = 'getiomark-messages-v1';

export const formatCLP = (value) => new Intl.NumberFormat('es-CL', {
  style: 'currency',
  currency: 'CLP',
  maximumFractionDigits: 0,
}).format(value);

export function getStatus(product) {
  if (product.stock === 0) return { label: 'Sin stock', type: 'out' };
  if (product.stock <= product.minStock) return { label: 'Stock bajo', type: 'low' };
  return { label: 'Disponible', type: 'ok' };
}

export function loadProducts() {
  try {
    const raw = localStorage.getItem(INVENTORY_KEY);
    if (!raw) return initialProducts;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : initialProducts;
  } catch {
    return initialProducts;
  }
}

export function saveProducts(products) {
  try {
    localStorage.setItem(INVENTORY_KEY, JSON.stringify(products));
  } catch {
    // Modo privado o almacenamiento deshabilitado: seguirá funcionando durante la sesión.
  }
}

export function downloadCSV(products) {
  const headers = ['SKU', 'Producto', 'Categoría', 'Proveedor', 'Precio CLP', 'Stock', 'Stock mínimo', 'Estado'];
  const rows = products.map((p) => [p.sku, p.name, p.category, p.supplier, p.price, p.stock, p.minStock, getStatus(p).label]);
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
  URL.revokeObjectURL(url);
}
