import { createContext, useCallback, useContext, useEffect, useMemo, useReducer } from 'react';
import { loadProducts, saveProducts, loadCart, saveCart } from '../utils/inventory.js';
import { inventoryReducer } from '../utils/inventoryReducer.js';

// Estado compartido por todas las páginas: inventario disponible + unidades reservadas.
const InventoryContext = createContext(null);

function initializeInventory() {
  const products = loadProducts();
  return { products, cart: loadCart(products) };
}

export function InventoryProvider({ children }) {
  const [state, dispatch] = useReducer(inventoryReducer, undefined, initializeInventory);

  useEffect(() => {
    saveProducts(state.products); // Misma clave de Semana 1 y 2: no borra el inventario previo.
    saveCart(state.cart);
  }, [state]);

  const addProduct = useCallback((product) => dispatch({ type: 'ADD_PRODUCT', product }), []);
  const updateProduct = useCallback((product) => dispatch({ type: 'UPDATE_PRODUCT', product }), []);
  const deleteProduct = useCallback((id) => dispatch({ type: 'DELETE_PRODUCT', id }), []);
  const adjustStock = useCallback((id, delta) => dispatch({ type: 'ADJUST_STOCK', id, delta }), []);
  const addToCart = useCallback((id, quantity = 1) => dispatch({ type: 'ADD_TO_CART', id, quantity }), []);
  const changeCartQuantity = useCallback((id, delta) => dispatch({ type: 'CHANGE_CART_QUANTITY', id, delta }), []);
  const removeFromCart = useCallback((id) => dispatch({ type: 'REMOVE_FROM_CART', id }), []);
  const clearCart = useCallback(() => dispatch({ type: 'CLEAR_CART' }), []);

  const cartItems = useMemo(() => state.cart.flatMap((line) => {
    const product = state.products.find((item) => item.id === line.id);
    return product ? [{ ...line, product }] : [];
  }), [state.cart, state.products]);
  const cartCount = useMemo(() => state.cart.reduce((sum, line) => sum + line.quantity, 0), [state.cart]);
  const cartTotal = useMemo(() => cartItems.reduce((sum, line) => sum + line.product.price * line.quantity, 0), [cartItems]);

  const value = useMemo(() => ({
    products: state.products, cart: state.cart, cartItems, cartCount, cartTotal,
    addProduct, updateProduct, deleteProduct, adjustStock,
    addToCart, changeCartQuantity, removeFromCart, clearCart,
  }), [state, cartItems, cartCount, cartTotal, addProduct, updateProduct, deleteProduct,
    adjustStock, addToCart, changeCartQuantity, removeFromCart, clearCart]);

  return <InventoryContext.Provider value={value}>{children}</InventoryContext.Provider>;
}

export function useInventory() {
  const context = useContext(InventoryContext);
  if (!context) throw new Error('useInventory debe utilizarse dentro de InventoryProvider.');
  return context;
}
