import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatToolbar } from '@angular/material/toolbar';
import { MatIcon } from '@angular/material/icon';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatMenu, MatMenuTrigger, MatMenuItem } from '@angular/material/menu';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatSelect, MatOption } from '@angular/material/select';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatDialog } from '@angular/material/dialog';
import { HorizontalDivider } from '@ng-mf/components';
import { Product, ProductService, ProductStore } from '@samba/product-domain';
import {
  PaymentMethod,
  CreateSaleDto,
  CreateSaleItemDto,
  SaleService,
  SaleStore
} from '@samba/sale-domain';
import { AuthService, AuthStore } from '@samba/user-domain';

interface CartItem {
  product: Product;
  quantity: number;
  subtotal: number;
  discount: number;
}

@Component({
  selector: 'app-pos-interface',
  imports: [
    CommonModule,
    FormsModule,
    MatButton,
    MatIconButton,
    MatToolbar,
    MatIcon,
    MatCard,
    MatCardContent,
    MatMenu,
    MatMenuTrigger,
    MatMenuItem,
    HorizontalDivider,
    MatFormField,
    MatLabel,
    MatInput,
    MatSelect,
    MatOption,
    MatProgressSpinner,
  ],
  templateUrl: './pos-interface.html',
  styleUrl: './pos-interface.scss'
})
export class PosInterface implements OnInit {
  private authService = inject(AuthService);
  private authStore = inject(AuthStore);
  private productService = inject(ProductService);
  private productStore = inject(ProductStore);
  private saleService = inject(SaleService);
  saleStore = inject(SaleStore);
  private router = inject(Router);

  user = this.authStore.user;
  products = this.productStore.products;

  cart = signal<CartItem[]>([]);
  searchTerm = signal('');
  selectedPaymentMethod = signal<PaymentMethod>('cash');
  discountRate = signal(0);
  taxRate = signal(0.1); // 10% default tax
  customerNotes = signal('');
  isProcessing = signal(false);
  error = signal<string | null>(null);

  paymentMethods: { value: PaymentMethod; label: string }[] = [
    { value: 'cash', label: 'Cash' },
    { value: 'card', label: 'Card' },
    { value: 'bank-transfer', label: 'Bank Transfer' },
    { value: 'credit', label: 'Credit' },
  ];

  subtotal = signal(0);
  taxAmount = signal(0);
  discountAmount = signal(0);
  total = signal(0);

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getAll().subscribe({
      next: (products) => {
        this.productStore.setProducts(products);
      },
      error: (err) => {
        console.error('Failed to load products:', err);
      },
    });
  }

  searchProduct(barcode: string): void {
    if (!barcode.trim()) return;

    this.productService.searchByBarcode(barcode).subscribe({
      next: (product) => {
        if (product) {
          this.addToCart(product);
          this.searchTerm.set('');
        } else {
          this.error.set('Product not found');
          setTimeout(() => this.error.set(null), 3000);
        }
      },
      error: (err) => {
        this.error.set('Failed to search product');
        console.error(err);
      },
    });
  }

  addToCart(product: Product): void {
    // Check stock availability
    if (product.stockLevel <= 0) {
      this.error.set('Product is out of stock');
      setTimeout(() => this.error.set(null), 3000);
      return;
    }

    const currentCart = this.cart();
    const existingItem = currentCart.find((item) => item.product.id === product.id);

    if (existingItem) {
      // Check if adding one more exceeds stock
      if (existingItem.quantity + 1 > product.stockLevel) {
        this.error.set('Not enough stock available');
        setTimeout(() => this.error.set(null), 3000);
        return;
      }
      existingItem.quantity++;
      existingItem.subtotal = existingItem.quantity * existingItem.product.price;
      this.cart.set([...currentCart]);
    } else {
      this.cart.update((cart) => [
        ...cart,
        {
          product,
          quantity: 1,
          subtotal: product.price,
          discount: 0,
        },
      ]);
    }

    this.calculateTotals();
  }

  removeFromCart(productId: number): void {
    this.cart.update((cart) => cart.filter((item) => item.product.id !== productId));
    this.calculateTotals();
  }

  updateQuantity(productId: number, quantity: number): void {
    const currentCart = this.cart();
    const item = currentCart.find((i) => i.product.id === productId);

    if (!item) return;

    if (quantity <= 0) {
      this.removeFromCart(productId);
      return;
    }

    // Check stock availability
    if (quantity > item.product.stockLevel) {
      this.error.set('Not enough stock available');
      setTimeout(() => this.error.set(null), 3000);
      return;
    }

    item.quantity = quantity;
    item.subtotal = item.quantity * item.product.price;
    this.cart.set([...currentCart]);
    this.calculateTotals();
  }

  calculateTotals(): void {
    const cartItems = this.cart();
    const subtotal = cartItems.reduce((sum, item) => sum + item.subtotal, 0);
    const discountAmount = subtotal * (this.discountRate() / 100);
    const afterDiscount = subtotal - discountAmount;
    const taxAmount = afterDiscount * this.taxRate();
    const total = afterDiscount + taxAmount;

    this.subtotal.set(subtotal);
    this.discountAmount.set(discountAmount);
    this.taxAmount.set(taxAmount);
    this.total.set(total);
  }

  completeSale(): void {
    const currentCart = this.cart();
    if (currentCart.length === 0) {
      this.error.set('Cart is empty');
      setTimeout(() => this.error.set(null), 3000);
      return;
    }

    const user = this.user();
    if (!user) {
      this.error.set('User not authenticated');
      return;
    }

    this.isProcessing.set(true);
    this.error.set(null);

    const items: CreateSaleItemDto[] = currentCart.map((item) => ({
      productId: item.product.id,
      quantity: item.quantity,
      unitPrice: item.product.price,
      subtotal: item.subtotal,
      discount: item.discount,
    }));

    const saleDto: CreateSaleDto = {
      branchId: user.branchId || 1,
      userId: user.id,
      items,
      subtotal: this.subtotal(),
      tax: this.taxAmount(),
      taxRate: this.taxRate(),
      discount: this.discountAmount(),
      discountRate: this.discountRate(),
      total: this.total(),
      paymentMethod: this.selectedPaymentMethod(),
      paymentStatus: 'paid',
      notes: this.customerNotes() || undefined,
    };

    this.saleService.create(saleDto).subscribe({
      next: (sale) => {
        this.saleStore.addSale(sale);

        // Update stock levels for each product
        currentCart.forEach((item) => {
          this.productStore.updateStock(item.product.id, -item.quantity);
          this.productService
            .update({
              id: item.product.id,
              stockLevel: item.product.stockLevel - item.quantity,
            })
            .subscribe({
              error: (err) => console.error('Failed to update stock:', err),
            });
        });

        // Clear cart and reset
        this.cart.set([]);
        this.discountRate.set(0);
        this.customerNotes.set('');
        this.calculateTotals();
        this.isProcessing.set(false);

        alert(`Sale completed! Receipt #: ${sale.receiptNumber}`);
      },
      error: (err) => {
        this.error.set(err?.error?.message || 'Failed to complete sale');
        this.isProcessing.set(false);
      },
    });
  }

  clearCart(): void {
    this.cart.set([]);
    this.calculateTotals();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
