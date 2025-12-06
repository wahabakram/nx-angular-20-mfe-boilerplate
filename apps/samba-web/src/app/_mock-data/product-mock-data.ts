import { CreateProductDto, ProductStatus } from '@samba/product-domain';

export const PRODUCT_CATEGORIES = [
  { id: 1, name: 'Electronics' },
  { id: 2, name: 'Beverages' },
  { id: 3, name: 'Snacks' },
  { id: 4, name: 'Dairy' },
  { id: 5, name: 'Bakery' },
  { id: 6, name: 'Household' },
  { id: 7, name: 'Personal Care' },
  { id: 8, name: 'Stationery' },
];

const PRODUCT_NAMES = {
  electronics: [
    'USB Flash Drive 32GB',
    'Wireless Mouse',
    'HDMI Cable 2m',
    'Phone Charger',
    'Earbuds',
    'Power Bank 10000mAh',
    'Keyboard USB',
    'Webcam HD',
  ],
  beverages: [
    'Coca Cola 500ml',
    'Pepsi 500ml',
    'Orange Juice 1L',
    'Bottled Water 500ml',
    'Energy Drink',
    'Green Tea',
    'Coffee Beans 250g',
    'Lemonade 1L',
  ],
  snacks: [
    'Potato Chips',
    'Chocolate Bar',
    'Cookies Pack',
    'Pretzels',
    'Popcorn',
    'Trail Mix',
    'Granola Bar',
    'Nuts Pack',
  ],
  dairy: [
    'Milk 1L',
    'Yogurt 500g',
    'Cheese Slices',
    'Butter 250g',
    'Cream Cheese',
    'Sour Cream',
    'Ice Cream Vanilla',
    'Whipped Cream',
  ],
  bakery: [
    'White Bread Loaf',
    'Whole Wheat Bread',
    'Croissant 6-pack',
    'Bagels 4-pack',
    'Muffins 6-pack',
    'Donuts 12-pack',
    'Dinner Rolls',
    'Baguette',
  ],
  household: [
    'Dish Soap',
    'Paper Towels',
    'Trash Bags',
    'Laundry Detergent',
    'All-Purpose Cleaner',
    'Sponges 3-pack',
    'Aluminum Foil',
    'Plastic Wrap',
  ],
  personalCare: [
    'Shampoo 400ml',
    'Body Wash',
    'Toothpaste',
    'Toothbrush',
    'Hand Soap',
    'Deodorant',
    'Facial Tissues',
    'Cotton Swabs',
  ],
  stationery: [
    'Pen Pack 10ct',
    'Notebook A4',
    'Sticky Notes',
    'Highlighters 4-pack',
    'Stapler',
    'Paper Clips',
    'Envelope Pack',
    'Correction Tape',
  ],
};

const PRODUCT_IMAGES = [
  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop',
  'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&h=200&fit=crop',
  'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=200&h=200&fit=crop',
  'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=200&h=200&fit=crop',
  'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=200&h=200&fit=crop',
];

function generateSKU(index: number): string {
  return `SKU-${String(index).padStart(5, '0')}`;
}

function generateBarcode(index: number): string {
  return `${Math.floor(Math.random() * 900000000) + 100000000}${String(index).padStart(4, '0')}`;
}

function randomPrice(min: number, max: number): number {
  return Math.round((Math.random() * (max - min) + min) * 100) / 100;
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

export function generateMockProducts(count: number = 50, branchId: number = 1): CreateProductDto[] {
  const products: CreateProductDto[] = [];
  let productIndex = 1;

  // Generate products for each category
  const categories = Object.entries(PRODUCT_NAMES);
  const productsPerCategory = Math.ceil(count / categories.length);

  categories.forEach(([categoryKey, productNames], catIndex) => {
    const categoryId = catIndex + 1;
    const namesToUse = productNames.slice(0, productsPerCategory);

    namesToUse.forEach((name) => {
      const costPrice = randomPrice(1, 50);
      const markup = randomPrice(1.2, 2.5);
      const price = Math.round(costPrice * markup * 100) / 100;
      const maxStock = randomInt(100, 500);
      const stockLevel = randomInt(0, maxStock);
      const lowThreshold = Math.floor(maxStock * 0.15);

      const statuses: ProductStatus[] = ['active', 'active', 'active', 'inactive'];
      const status = randomItem(statuses);

      products.push({
        name,
        sku: generateSKU(productIndex),
        barcode: generateBarcode(productIndex),
        price,
        costPrice,
        categoryId,
        status,
        stockLevel,
        lowStockThreshold: lowThreshold,
        reorderPoint: Math.floor(maxStock * 0.2),
        maxStockLevel: maxStock,
        unit: randomItem(['piece', 'box', 'pack', 'kg', 'liter']),
        description: `High quality ${name.toLowerCase()} for your daily needs`,
        imageUrl: randomItem(PRODUCT_IMAGES),
        branchId,
      });

      productIndex++;
      if (products.length >= count) return;
    });
  });

  return products.slice(0, count);
}
