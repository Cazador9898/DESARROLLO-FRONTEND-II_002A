import test from 'node:test';
import assert from 'node:assert/strict';
import { initialProducts } from '../src/data/products.js';
import { validateProduct } from '../src/utils/productValidation.js';
import { INVENTORY_KEY, getStatus, loadProducts, normalizeProduct, saveProducts } from '../src/utils/inventory.js';

const example = {
  name: 'Galletas 100 g', brand: 'Costa', type: 'Galleta', sku: 'ABA-500',
  category: 'Abarrotes', supplier: 'Distribuidora Demo', price: '990', stock: '5', minStock: '10',
};

function mockStorage(start = {}) {
  const db = new Map(Object.entries(start));
  globalThis.localStorage = {
    getItem: (key) => db.get(key) ?? null,
    setItem: (key, value) => { db.set(key, value); },
    removeItem: (key) => db.delete(key),
  };
  return db;
}

test('El inventario comienza con 12 artículos demostrativos con marca y tipo', () => {
  mockStorage();
  const products = loadProducts();
  assert.equal(products.length, 12);
  assert.ok(products.every((item) => item.brand && item.type));
});

test('Migra productos existentes de Semana 1 sin perder información', () => {
  const old = { id: '1', name: 'Leche entera 1 L', sku: 'LAC-001', category: 'Lácteos', price: 1190, stock: 123, minStock: 10, supplier: 'Distribuidora Norte' };
  mockStorage({ [INVENTORY_KEY]: JSON.stringify([old]) });
  const [product] = loadProducts();
  assert.equal(product.brand, 'Colun');
  assert.equal(product.type, 'Leche');
  assert.equal(product.stock, 123);
  assert.equal(product.id, '1');
});

test('Productos anteriores agregados por el usuario obtienen valores de respaldo', () => {
  const result = normalizeProduct({ id: '40', sku: 'MIO-1', name: 'Otro', category: 'Bebidas', stock: 1, minStock: 0 });
  assert.equal(result.brand, 'Sin marca');
  assert.equal(result.type, 'Bebidas');
});

test('Permite ingresar un producto válido con los campos de Semana 2', () => {
  const result = validateProduct(example, initialProducts);
  assert.equal(result.error, undefined);
  assert.equal(result.product.brand, 'Costa');
  assert.equal(result.product.type, 'Galleta');
  assert.equal(result.product.price, 990);
  assert.equal(result.product.stock, 5);
});

test('Rechaza un SKU duplicado sin distinguir mayúsculas de minúsculas', () => {
  const result = validateProduct({ ...example, sku: 'lac-001' }, initialProducts);
  assert.match(result.error, /Ya existe/);
});

test('Permite editar sin que el SKU existente se considere duplicado', () => {
  const result = validateProduct({ ...example, sku: 'LAC-001' }, initialProducts, '1');
  assert.ok(result.product);
});

test('Exige marca y tipo y valida cantidades no negativas', () => {
  assert.match(validateProduct({ ...example, brand: '' }, []).error, /marca/);
  assert.match(validateProduct({ ...example, type: '' }, []).error, /tipo/);
  assert.match(validateProduct({ ...example, stock: '-1' }, []).error, /stock/);
  assert.match(validateProduct({ ...example, stock: '1.5' }, []).error, /stock/);
  assert.match(validateProduct({ ...example, price: '' }, []).error, /precio/);
});

test('Los datos se guardan y se vuelven a leer del navegador', () => {
  mockStorage();
  const product = { id: '55', ...validateProduct(example, []).product };
  saveProducts([product]);
  assert.deepEqual(loadProducts(), [product]);
});

test('Estados de stock: disponible, bajo y agotado', () => {
  assert.equal(getStatus({ stock: 15, minStock: 10 }).type, 'ok');
  assert.equal(getStatus({ stock: 7, minStock: 10 }).type, 'low');
  assert.equal(getStatus({ stock: 0, minStock: 10 }).type, 'out');
});
