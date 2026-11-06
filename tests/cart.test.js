import test from 'node:test';
import assert from 'node:assert/strict';
import { inventoryReducer, filterProducts } from '../src/utils/inventoryReducer.js';
import { CART_KEY, INVENTORY_KEY, loadCart, loadProducts, saveCart, saveProducts } from '../src/utils/inventory.js';

function fixture() {
  return {
    products: [
      { id: 'a', name: 'Arroz', sku: 'ABA-1', brand: 'Tucapel', type: 'Grano', supplier: 'Distribuidor', category: 'Abarrotes', price: 1000, stock: 5, minStock: 2 },
      { id: 'b', name: 'Leche', sku: 'LAC-1', brand: 'Colun', type: 'Lácteo', supplier: 'Distribuidor', category: 'Lácteos', price: 1200, stock: 2, minStock: 1 },
      { id: 'c', name: 'Aceite', sku: 'ABA-2', brand: 'Chef', type: 'Aceite', supplier: 'Distribuidor', category: 'Abarrotes', price: 1500, stock: 0, minStock: 2 },
    ],
    cart: [],
  };
}

function memoryStorage(initial = {}) {
  const map = new Map(Object.entries(initial));
  globalThis.localStorage = {
    getItem: (key) => map.has(key) ? map.get(key) : null,
    setItem: (key, value) => map.set(key, value),
    removeItem: (key) => map.delete(key),
  };
  return map;
}

test('El filtro por categoría es dinámico y no modifica el inventario', () => {
  const state = fixture();
  const snapshot = JSON.stringify(state.products);
  const onlyGrocery = filterProducts(state.products, { category: 'Abarrotes' });
  assert.deepEqual(onlyGrocery.map((p) => p.id), ['a', 'c']);
  assert.equal(filterProducts(state.products, { category: 'Todas' }).length, 3);
  assert.equal(JSON.stringify(state.products), snapshot);
  const changed = inventoryReducer(state, { type: 'ADJUST_STOCK', id: 'a', delta: -4 });
  assert.deepEqual(filterProducts(changed.products, { category: 'Abarrotes', status: 'low' }).map((p) => p.id), ['a']);
  assert.equal(state.products[0].stock, 5);
});

test('Filtro por búsqueda, categoría y estado funciona a la vez', () => {
  const result = filterProducts(fixture().products, { search: 'colUN', category: 'Lácteos', status: 'ok' });
  assert.equal(result.length, 1);
  assert.equal(result[0].id, 'b');
  assert.equal(filterProducts(fixture().products, { category: 'Abarrotes', status: 'out' })[0].id, 'c');
});

test('Agregar al carrito descuenta exactamente las unidades disponibles', () => {
  const original = fixture();
  const next = inventoryReducer(original, { type: 'ADD_TO_CART', id: 'a', quantity: 2 });
  assert.equal(next.products[0].stock, 3);
  assert.deepEqual(next.cart, [{ id: 'a', quantity: 2 }]);
  assert.equal(original.products[0].stock, 5); // inmutabilidad
  assert.deepEqual(original.cart, []);
});

test('Agregar el mismo artículo acumula cantidades y no duplica líneas', () => {
  const first = inventoryReducer(fixture(), { type: 'ADD_TO_CART', id: 'b', quantity: 1 });
  const second = inventoryReducer(first, { type: 'ADD_TO_CART', id: 'b', quantity: 1 });
  assert.deepEqual(second.cart, [{ id: 'b', quantity: 2 }]);
  assert.equal(second.products[1].stock, 0);
});

test('Impide reservar productos agotados o más del stock disponible', () => {
  const state = fixture();
  assert.equal(inventoryReducer(state, { type: 'ADD_TO_CART', id: 'c', quantity: 1 }), state);
  assert.equal(inventoryReducer(state, { type: 'ADD_TO_CART', id: 'a', quantity: 6 }), state);
  assert.equal(inventoryReducer(state, { type: 'ADD_TO_CART', id: 'a', quantity: -1 }), state);
  assert.equal(inventoryReducer(state, { type: 'ADD_TO_CART', id: 'a', quantity: 1.5 }), state);
  assert.equal(inventoryReducer(state, { type: 'ADD_TO_CART', id: 'inexistente', quantity: 1 }), state);
});

test('Subir y bajar cantidades en carrito actualiza el inventario general', () => {
  let state = inventoryReducer(fixture(), { type: 'ADD_TO_CART', id: 'a', quantity: 2 });
  state = inventoryReducer(state, { type: 'CHANGE_CART_QUANTITY', id: 'a', delta: 1 });
  assert.equal(state.products[0].stock, 2);
  assert.equal(state.cart[0].quantity, 3);
  state = inventoryReducer(state, { type: 'CHANGE_CART_QUANTITY', id: 'a', delta: -1 });
  assert.equal(state.products[0].stock, 3);
  assert.equal(state.cart[0].quantity, 2);
});

test('No permite sobreventa al aumentar carrito', () => {
  const state = inventoryReducer(fixture(), { type: 'ADD_TO_CART', id: 'b', quantity: 2 });
  assert.equal(inventoryReducer(state, { type: 'CHANGE_CART_QUANTITY', id: 'b', delta: 1 }), state);
  assert.equal(state.products[1].stock, 0);
});

test('Reducir el carrito a cero elimina la línea y devuelve el stock', () => {
  const state = inventoryReducer(fixture(), { type: 'ADD_TO_CART', id: 'a', quantity: 1 });
  const restored = inventoryReducer(state, { type: 'CHANGE_CART_QUANTITY', id: 'a', delta: -1 });
  assert.equal(restored.products[0].stock, 5);
  assert.deepEqual(restored.cart, []);
  assert.equal(inventoryReducer(state, { type: 'CHANGE_CART_QUANTITY', id: 'a', delta: -2 }), state);
});

test('Quitar un artículo del carrito restaura todas sus unidades', () => {
  const state = inventoryReducer(fixture(), { type: 'ADD_TO_CART', id: 'a', quantity: 4 });
  const restored = inventoryReducer(state, { type: 'REMOVE_FROM_CART', id: 'a' });
  assert.equal(restored.products[0].stock, 5);
  assert.equal(restored.cart.length, 0);
});

test('Vaciar el carrito restaura varias reservas simultáneamente', () => {
  let state = inventoryReducer(fixture(), { type: 'ADD_TO_CART', id: 'a', quantity: 3 });
  state = inventoryReducer(state, { type: 'ADD_TO_CART', id: 'b', quantity: 2 });
  const cleared = inventoryReducer(state, { type: 'CLEAR_CART' });
  assert.deepEqual(cleared.products.map((p) => p.stock), [5, 2, 0]);
  assert.deepEqual(cleared.cart, []);
});

test('Actualizar un artículo conserva su reserva y el carrito utiliza sus datos actuales', () => {
  let state = inventoryReducer(fixture(), { type: 'ADD_TO_CART', id: 'a', quantity: 2 });
  const edited = { ...state.products[0], name: 'Arroz integral', price: 1900, stock: 6 };
  state = inventoryReducer(state, { type: 'UPDATE_PRODUCT', product: edited });
  assert.equal(state.products[0].stock, 6);
  assert.deepEqual(state.cart, [{ id: 'a', quantity: 2 }]);
  assert.equal(state.products[0].price * state.cart[0].quantity, 3800);
});

test('Eliminar un artículo también retira su reserva del carrito', () => {
  const state = inventoryReducer(fixture(), { type: 'ADD_TO_CART', id: 'a', quantity: 1 });
  const next = inventoryReducer(state, { type: 'DELETE_PRODUCT', id: 'a' });
  assert.equal(next.products.some((p) => p.id === 'a'), false);
  assert.equal(next.cart.some((p) => p.id === 'a'), false);
});

test('Persistencia conjunta: recarga no descuenta el stock por segunda vez', () => {
  memoryStorage();
  const reserved = inventoryReducer(fixture(), { type: 'ADD_TO_CART', id: 'a', quantity: 2 });
  saveProducts(reserved.products);
  saveCart(reserved.cart);
  const products = loadProducts();
  const cart = loadCart(products);
  assert.equal(products[0].stock, 3);
  assert.deepEqual(cart, [{ id: 'a', quantity: 2 }]);
  assert.equal(localStorage.getItem(INVENTORY_KEY) !== null, true);
  assert.equal(localStorage.getItem(CART_KEY) !== null, true);
});

test('Carrito dañado ignora productos inexistentes y cantidades inválidas', () => {
  memoryStorage({ [CART_KEY]: JSON.stringify([
    { id: 'a', quantity: 2 }, { id: 'a', quantity: 7 },
    { id: 'no-existe', quantity: 2 }, { id: 'b', quantity: -1 },
  ]) });
  assert.deepEqual(loadCart(fixture().products), [{ id: 'a', quantity: 2 }]);
  memoryStorage({ [CART_KEY]: 'no es json' });
  assert.deepEqual(loadCart(fixture().products), []);
});

test('El inventario existente de Semana 2 sigue cargándose intacto', () => {
  const initial = fixture().products;
  memoryStorage({ [INVENTORY_KEY]: JSON.stringify(initial) });
  assert.deepEqual(loadProducts(), initial);
  assert.deepEqual(loadCart(initial), []);
});
