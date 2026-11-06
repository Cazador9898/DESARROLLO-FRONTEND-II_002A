// Artículos de ejemplo. Incluyen marca y tipo para la actividad de Semana 2.
export const initialProducts = [
  { id: '1', name: 'Leche entera 1 L', brand: 'Colun', type: 'Leche', sku: 'LAC-001', category: 'Lácteos', price: 1190, stock: 48, minStock: 10, supplier: 'Distribuidora Norte' },
  { id: '2', name: 'Arroz grado 1 1 kg', brand: 'Tucapel', type: 'Arroz', sku: 'ABA-102', category: 'Abarrotes', price: 1790, stock: 32, minStock: 12, supplier: 'Alimentos del Sur' },
  { id: '3', name: 'Aceite vegetal 900 ml', brand: 'Chef', type: 'Aceite', sku: 'ABA-103', category: 'Abarrotes', price: 2490, stock: 6, minStock: 10, supplier: 'Alimentos del Sur' },
  { id: '4', name: 'Manzanas rojas 1 kg', brand: 'Huerta Central', type: 'Fruta', sku: 'FRU-201', category: 'Frutas y verduras', price: 1690, stock: 28, minStock: 8, supplier: 'Huerta Central' },
  { id: '5', name: 'Bebida cola 1,5 L', brand: 'Coca-Cola', type: 'Bebida gaseosa', sku: 'BEB-301', category: 'Bebidas', price: 1990, stock: 52, minStock: 15, supplier: 'Bebidas del Valle' },
  { id: '6', name: 'Detergente líquido 1 L', brand: 'Omo', type: 'Detergente', sku: 'LIM-401', category: 'Limpieza', price: 4590, stock: 9, minStock: 10, supplier: 'Aseo Hogar' },
  { id: '7', name: 'Pan de molde integral', brand: 'Ideal', type: 'Pan', sku: 'PAN-501', category: 'Panadería', price: 2390, stock: 0, minStock: 8, supplier: 'Panadería El Trigal' },
  { id: '8', name: 'Yogur natural 125 g', brand: 'Soprole', type: 'Yogur', sku: 'LAC-002', category: 'Lácteos', price: 690, stock: 74, minStock: 20, supplier: 'Distribuidora Norte' },
  { id: '9', name: 'Papas prefritas 1 kg', brand: 'McCain', type: 'Congelado', sku: 'CON-601', category: 'Congelados', price: 3790, stock: 18, minStock: 8, supplier: 'Frío Express' },
  { id: '10', name: 'Azúcar blanca 1 kg', brand: 'Iansa', type: 'Azúcar', sku: 'ABA-104', category: 'Abarrotes', price: 1390, stock: 38, minStock: 10, supplier: 'Alimentos del Sur' },
  { id: '11', name: 'Naranjas 1 kg', brand: 'Huerta Central', type: 'Fruta', sku: 'FRU-202', category: 'Frutas y verduras', price: 1490, stock: 7, minStock: 12, supplier: 'Huerta Central' },
  { id: '12', name: 'Agua mineral 1,5 L', brand: 'Cachantun', type: 'Agua mineral', sku: 'BEB-302', category: 'Bebidas', price: 890, stock: 90, minStock: 20, supplier: 'Bebidas del Valle' },
];

export const categories = [
  'Abarrotes', 'Bebidas', 'Congelados', 'Frutas y verduras',
  'Lácteos', 'Limpieza', 'Panadería',
];

export const emptyProductForm = {
  name: '', brand: '', type: '', sku: '', category: 'Abarrotes',
  supplier: '', price: '', stock: '', minStock: '10',
};
