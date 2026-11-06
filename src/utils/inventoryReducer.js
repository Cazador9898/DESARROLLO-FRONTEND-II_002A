// Reglas de inventario y carrito. Funciones puras para poder probarlas sin navegador.
// "stock" es la cantidad disponible para agregar al carrito, no la reservada.
export function filterProducts(products, { search = '', category = 'Todas', status = 'Todos' } = {}) {
  const query = search.trim().toLocaleLowerCase('es');
  return products.filter((product) => {
    const textMatches = [product.name, product.sku, product.brand, product.type, product.supplier]
      .some((field) => String(field ?? '').toLocaleLowerCase('es').includes(query));
    const categoryMatches = category === 'Todas' || product.category === category;
    const stockStatus = product.stock === 0 ? 'out' : product.stock <= product.minStock ? 'low' : 'ok';
    return textMatches && categoryMatches && (status === 'Todos' || status === stockStatus);
  });
}

export function inventoryReducer(state, action) {
  const { products, cart } = state;

  switch (action.type) {
    case 'ADD_PRODUCT': {
      if (!action.product || products.some((p) => p.id === action.product.id)) return state;
      return { ...state, products: [action.product, ...products] };
    }
    case 'UPDATE_PRODUCT': {
      if (!products.some((p) => p.id === action.product?.id)) return state;
      return { ...state, products: products.map((p) => p.id === action.product.id ? action.product : p) };
    }
    case 'DELETE_PRODUCT': {
      if (!products.some((p) => p.id === action.id)) return state;
      // Si el artículo se elimina, también se descarta su línea del carrito.
      // No hay stock que devolver porque el producto ya no existe.
      return {
        products: products.filter((p) => p.id !== action.id),
        cart: cart.filter((line) => line.id !== action.id),
      };
    }
    case 'ADJUST_STOCK': {
      const product = products.find((p) => p.id === action.id);
      if (!product || !Number.isSafeInteger(action.delta)) return state;
      const stock = product.stock + action.delta;
      if (!Number.isSafeInteger(stock) || stock < 0) return state;
      return { ...state, products: products.map((p) => p.id === action.id ? { ...p, stock } : p) };
    }
    case 'ADD_TO_CART': {
      const product = products.find((p) => p.id === action.id);
      const quantity = action.quantity;
      const oldLine = cart.find((line) => line.id === action.id);
      if (!product || !Number.isSafeInteger(quantity) || quantity <= 0 || quantity > product.stock ||
          !Number.isSafeInteger((oldLine?.quantity ?? 0) + quantity)) return state;
      const nextCart = oldLine
        ? cart.map((line) => line.id === action.id ? { ...line, quantity: line.quantity + quantity } : line)
        : [...cart, { id: action.id, quantity }];
      return {
        products: products.map((p) => p.id === action.id ? { ...p, stock: p.stock - quantity } : p),
        cart: nextCart,
      };
    }
    case 'CHANGE_CART_QUANTITY': {
      const product = products.find((p) => p.id === action.id);
      const oldLine = cart.find((line) => line.id === action.id);
      if (!product || !oldLine || !Number.isSafeInteger(action.delta) || action.delta === 0) return state;
      const nextQuantity = oldLine.quantity + action.delta;
      if (!Number.isSafeInteger(nextQuantity) || nextQuantity < 0 || action.delta > product.stock) return state;
      return {
        products: products.map((p) => p.id === action.id ? { ...p, stock: p.stock - action.delta } : p),
        cart: nextQuantity === 0
          ? cart.filter((line) => line.id !== action.id)
          : cart.map((line) => line.id === action.id ? { ...line, quantity: nextQuantity } : line),
      };
    }
    case 'REMOVE_FROM_CART': {
      const line = cart.find((item) => item.id === action.id);
      if (!line) return state;
      return {
        products: products.map((p) => p.id === line.id ? { ...p, stock: p.stock + line.quantity } : p),
        cart: cart.filter((item) => item.id !== action.id),
      };
    }
    case 'CLEAR_CART': {
      if (cart.length === 0) return state;
      const restored = new Map(cart.map((line) => [line.id, line.quantity]));
      return {
        products: products.map((p) => ({ ...p, stock: p.stock + (restored.get(p.id) ?? 0) })),
        cart: [],
      };
    }
    default:
      return state;
  }
}
