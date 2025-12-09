import { Injectable } from '@angular/core';

/**
 * Sale item data structure for receipt printing
 */
export interface ReceiptSaleItem {
  productId: number;
  product?: {
    name: string;
  };
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

/**
 * Sale data structure for receipt printing
 * Note: This is a subset of the full Sale model to avoid circular dependencies
 */
export interface ReceiptSale {
  id?: number;
  receiptNumber: string;
  userId: number;
  items: ReceiptSaleItem[];
  subtotal: number;
  discount: number;
  discountRate: number;
  tax: number;
  taxRate: number;
  total: number;
  paymentMethod: string;
  notes?: string;
  createdAt: Date | string;
}

export interface ReceiptData {
  sale: ReceiptSale;
  storeName: string;
  storeAddress: string;
  storePhone: string;
  taxId?: string;
}

/**
 * Receipt Printer
 *
 * Handles receipt printing for POS transactions.
 * Supports both thermal printers (via ESC/POS commands) and standard printers (via browser print).
 *
 * Features:
 * - Generate HTML receipt for browser printing
 * - Generate ESC/POS commands for thermal printers
 * - Print receipt automatically after sale
 * - Preview receipt before printing
 *
 * Usage:
 * ```typescript
 * receiptPrinter.printReceipt(receiptData);
 * // or
 * receiptPrinter.previewReceipt(receiptData);
 * ```
 */
@Injectable({ providedIn: 'root' })
export class ReceiptPrinter {
  private readonly RECEIPT_WIDTH = 48; // Characters for 80mm thermal printer

  /**
   * Print receipt using browser print dialog
   */
  printReceipt(data: ReceiptData): void {
    const receiptHtml = this.generateReceiptHtml(data);
    this.printHtml(receiptHtml);
  }

  /**
   * Preview receipt in a new window
   */
  previewReceipt(data: ReceiptData): void {
    const receiptHtml = this.generateReceiptHtml(data);
    const previewWindow = window.open('', '_blank', 'width=400,height=600');
    
    if (previewWindow) {
      previewWindow.document.write(receiptHtml);
      previewWindow.document.close();
    }
  }

  /**
   * Generate receipt HTML for printing
   */
  private generateReceiptHtml(data: ReceiptData): string {
    const { sale, storeName, storeAddress, storePhone, taxId } = data;
    
    const items = sale.items.map(item => `
      <tr>
        <td style="padding: 4px 0; border-bottom: 1px dashed #ddd;">
          ${item.product?.name || `Product #${item.productId}`}
          <br/>
          <small style="color: #666;">${item.quantity} x ${this.formatCurrency(item.unitPrice)}</small>
        </td>
        <td style="padding: 4px 0; text-align: right; border-bottom: 1px dashed #ddd;">
          ${this.formatCurrency(item.subtotal)}
        </td>
      </tr>
    `).join('');

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Receipt - ${sale.receiptNumber}</title>
        <style>
          @media print {
            @page {
              size: 80mm auto;
              margin: 0;
            }
            body {
              margin: 0;
              padding: 10mm;
            }
            .no-print {
              display: none;
            }
          }
          
          body {
            font-family: 'Courier New', monospace;
            font-size: 12px;
            line-height: 1.4;
            max-width: 80mm;
            margin: 0 auto;
            padding: 10px;
            background: white;
          }
          
          .receipt {
            background: white;
          }
          
          .header {
            text-align: center;
            margin-bottom: 15px;
            border-bottom: 2px solid #000;
            padding-bottom: 10px;
          }
          
          .store-name {
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 5px;
          }
          
          .store-info {
            font-size: 11px;
            color: #333;
          }
          
          .section {
            margin: 10px 0;
          }
          
          .items-table {
            width: 100%;
            margin: 10px 0;
          }
          
          .totals {
            margin-top: 10px;
            padding-top: 10px;
            border-top: 1px solid #000;
          }
          
          .total-row {
            display: flex;
            justify-content: space-between;
            padding: 3px 0;
          }
          
          .total-row.grand-total {
            font-size: 14px;
            font-weight: bold;
            border-top: 2px solid #000;
            padding-top: 8px;
            margin-top: 8px;
          }
          
          .footer {
            text-align: center;
            margin-top: 20px;
            padding-top: 10px;
            border-top: 2px dashed #000;
            font-size: 11px;
          }
          
          .no-print {
            text-align: center;
            margin: 20px 0;
          }
          
          .print-button {
            background: #4CAF50;
            color: white;
            border: none;
            padding: 10px 30px;
            font-size: 14px;
            cursor: pointer;
            border-radius: 4px;
            margin: 0 5px;
          }
          
          .close-button {
            background: #f44336;
            color: white;
            border: none;
            padding: 10px 30px;
            font-size: 14px;
            cursor: pointer;
            border-radius: 4px;
            margin: 0 5px;
          }
        </style>
      </head>
      <body>
        <div class="receipt">
          <!-- Header -->
          <div class="header">
            <div class="store-name">${storeName}</div>
            <div class="store-info">
              ${storeAddress}<br/>
              Phone: ${storePhone}
              ${taxId ? `<br/>Tax ID: ${taxId}` : ''}
            </div>
          </div>
          
          <!-- Transaction Info -->
          <div class="section">
            <strong>Receipt #:</strong> ${sale.receiptNumber}<br/>
            <strong>Date:</strong> ${this.formatDate(sale.createdAt)}<br/>
            <strong>Cashier:</strong> User #${sale.userId}<br/>
            <strong>Payment:</strong> ${this.formatPaymentMethod(sale.paymentMethod)}
          </div>
          
          <!-- Items -->
          <table class="items-table">
            <thead>
              <tr style="border-bottom: 2px solid #000;">
                <th style="text-align: left; padding: 5px 0;">Item</th>
                <th style="text-align: right; padding: 5px 0;">Amount</th>
              </tr>
            </thead>
            <tbody>
              ${items}
            </tbody>
          </table>
          
          <!-- Totals -->
          <div class="totals">
            <div class="total-row">
              <span>Subtotal:</span>
              <span>${this.formatCurrency(sale.subtotal)}</span>
            </div>
            ${sale.discount > 0 ? `
              <div class="total-row">
                <span>Discount (${sale.discountRate}%):</span>
                <span>-${this.formatCurrency(sale.discount)}</span>
              </div>
            ` : ''}
            <div class="total-row">
              <span>Tax (${(sale.taxRate * 100).toFixed(0)}%):</span>
              <span>${this.formatCurrency(sale.tax)}</span>
            </div>
            <div class="total-row grand-total">
              <span>TOTAL:</span>
              <span>${this.formatCurrency(sale.total)}</span>
            </div>
          </div>
          
          ${sale.notes ? `
            <div class="section">
              <strong>Notes:</strong><br/>
              ${sale.notes}
            </div>
          ` : ''}
          
          <!-- Footer -->
          <div class="footer">
            Thank you for your purchase!<br/>
            Please visit again<br/>
            <small>Powered by SAMBA ERP</small>
          </div>
        </div>
        
        <!-- Print Buttons -->
        <div class="no-print">
          <button class="print-button" onclick="window.print()">
            Print Receipt
          </button>
          <button class="close-button" onclick="window.close()">
            Close
          </button>
        </div>
        
        <script>
          // Auto-print after 1 second
          setTimeout(() => {
            // Uncomment to enable auto-print
            // window.print();
          }, 1000);
        </script>
      </body>
      </html>
    `;
  }

  /**
   * Print HTML content
   */
  private printHtml(html: string): void {
    const printWindow = window.open('', '_blank', 'width=400,height=600');
    
    if (printWindow) {
      printWindow.document.write(html);
      printWindow.document.close();
      
      // Wait for content to load before printing
      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.focus();
          // Uncomment to auto-print
          // printWindow.print();
        }, 250);
      };
    } else {
      alert('Please allow popups for receipt printing');
    }
  }

  /**
   * Generate ESC/POS commands for thermal printer
   * This can be sent to a thermal printer via USB/Serial/Network
   */
  generateEscPosCommands(data: ReceiptData): Uint8Array {
    const { sale, storeName, storeAddress, storePhone } = data;
    const commands: number[] = [];

    // ESC/POS commands
    const ESC = 0x1B;
    const GS = 0x1D;
    
    // Initialize printer
    commands.push(ESC, 0x40);
    
    // Center align
    commands.push(ESC, 0x61, 0x01);
    
    // Bold on
    commands.push(ESC, 0x45, 0x01);
    this.addText(commands, storeName);
    this.addText(commands, '\n');
    
    // Bold off
    commands.push(ESC, 0x45, 0x00);
    this.addText(commands, storeAddress);
    this.addText(commands, '\n');
    this.addText(commands, storePhone);
    this.addText(commands, '\n\n');
    
    // Left align
    commands.push(ESC, 0x61, 0x00);
    
    // Receipt info
    this.addText(commands, `Receipt: ${sale.receiptNumber}\n`);
    this.addText(commands, `Date: ${this.formatDate(sale.createdAt)}\n`);
    this.addText(commands, `Payment: ${this.formatPaymentMethod(sale.paymentMethod)}\n`);
    this.addText(commands, this.repeatChar('-', this.RECEIPT_WIDTH));
    this.addText(commands, '\n');
    
    // Items
    sale.items.forEach(item => {
      const productName = item.product?.name || `Product #${item.productId}`;
      this.addText(commands, productName + '\n');
      
      const qtyPrice = `${item.quantity} x ${this.formatCurrency(item.unitPrice)}`;
      const total = this.formatCurrency(item.subtotal);
      const spacing = ' '.repeat(this.RECEIPT_WIDTH - qtyPrice.length - total.length);
      this.addText(commands, `${qtyPrice}${spacing}${total}\n`);
    });
    
    this.addText(commands, this.repeatChar('-', this.RECEIPT_WIDTH));
    this.addText(commands, '\n');
    
    // Totals
    this.addTotal(commands, 'Subtotal:', sale.subtotal);
    if (sale.discount > 0) {
      this.addTotal(commands, `Discount (${sale.discountRate}%):`, -sale.discount);
    }
    this.addTotal(commands, `Tax (${(sale.taxRate * 100).toFixed(0)}%):`, sale.tax);
    this.addText(commands, this.repeatChar('=', this.RECEIPT_WIDTH));
    this.addText(commands, '\n');
    
    // Bold on for total
    commands.push(ESC, 0x45, 0x01);
    this.addTotal(commands, 'TOTAL:', sale.total);
    commands.push(ESC, 0x45, 0x00);
    
    this.addText(commands, '\n\n');
    
    // Center align for footer
    commands.push(ESC, 0x61, 0x01);
    this.addText(commands, 'Thank you for your purchase!\n');
    this.addText(commands, 'Please visit again\n\n');
    
    // Cut paper
    commands.push(GS, 0x56, 0x00);
    
    return new Uint8Array(commands);
  }

  /**
   * Helper methods
   */
  private addText(commands: number[], text: string): void {
    for (let i = 0; i < text.length; i++) {
      commands.push(text.charCodeAt(i));
    }
  }

  private addTotal(commands: number[], label: string, amount: number): void {
    const amountStr = this.formatCurrency(amount);
    const spacing = ' '.repeat(this.RECEIPT_WIDTH - label.length - amountStr.length);
    this.addText(commands, `${label}${spacing}${amountStr}\n`);
  }

  private repeatChar(char: string, count: number): string {
    return char.repeat(count);
  }

  private formatCurrency(amount: number): string {
    return `Rs ${amount.toLocaleString('en-PK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  private formatDate(date: Date | string): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleString('en-PK', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  private formatPaymentMethod(method: string): string {
    const methods: Record<string, string> = {
      'cash': 'Cash',
      'card': 'Card',
      'bank-transfer': 'Bank Transfer',
      'credit': 'Credit',
    };
    return methods[method] || method;
  }

  /**
   * Download receipt as PDF (requires additional library like jsPDF)
   */
  downloadReceiptPdf(data: ReceiptData): void {
    // This would require jsPDF library
    // For now, we'll just print
    console.log('PDF download would require jsPDF library');
    this.printReceipt(data);
  }

  /**
   * Send receipt via email (requires backend API)
   */
  emailReceipt(data: ReceiptData, email: string): Promise<void> {
    // This would require backend API
    console.log(`Email receipt to ${email} - requires backend implementation`);
    return Promise.resolve();
  }
}
