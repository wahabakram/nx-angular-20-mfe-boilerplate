import { Injectable, OnDestroy, signal } from '@angular/core';
import { fromEvent, Observable, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

export interface BarcodeScannedEvent {
  barcode: string;
  timestamp: Date;
  source: 'keyboard' | 'manual';
}

/**
 * Barcode Scanner
 *
 * Handles barcode scanning from USB barcode scanners that act as keyboards.
 * Most USB barcode scanners send the barcode followed by Enter key.
 *
 * Features:
 * - Listens for rapid keyboard input (typical scanner behavior)
 * - Filters out normal typing
 * - Emits barcode when Enter is pressed
 * - Works with most USB HID barcode scanners
 *
 * Usage:
 * ```typescript
 * barcodeScanner.startListening();
 * barcodeScanner.scannedBarcode$.subscribe(event => {
 *   console.log('Barcode scanned:', event.barcode);
 * });
 * ```
 */
@Injectable({ providedIn: 'root' })
export class BarcodeScanner implements OnDestroy {
  private destroy$ = new Subject<void>();
  private scannedBarcodeSubject = new Subject<BarcodeScannedEvent>();
  private barcodeBuffer = '';
  private lastKeyTime = 0;
  private readonly SCANNER_SPEED_MS = 50; // Max time between characters from scanner
  private readonly MIN_BARCODE_LENGTH = 3;

  isListening = signal(false);
  
  /**
   * Observable that emits barcode scanned events
   */
  scannedBarcode$: Observable<BarcodeScannedEvent> = this.scannedBarcodeSubject.asObservable();

  /**
   * Start listening for barcode scanner input
   */
  startListening(): void {
    if (this.isListening()) {
      return;
    }

    this.isListening.set(true);
    this.barcodeBuffer = '';

    // Listen to keydown events
    fromEvent<KeyboardEvent>(document, 'keydown')
      .pipe(
        takeUntil(this.destroy$),
        filter((event) => {
          // Ignore if user is typing in input fields (except when scanner is active)
          const target = event.target as HTMLElement;
          const isInputField = target.tagName === 'INPUT' || 
                               target.tagName === 'TEXTAREA' || 
                               target.isContentEditable;
          
          // Allow scanning in specific input fields with data-barcode-enabled
          const barcodeEnabled = target.getAttribute('data-barcode-enabled') === 'true';
          
          return !isInputField || barcodeEnabled;
        })
      )
      .subscribe((event: KeyboardEvent) => {
        this.handleKeyPress(event);
      });
  }

  /**
   * Stop listening for barcode scanner input
   */
  stopListening(): void {
    this.isListening.set(false);
    this.destroy$.next();
    this.barcodeBuffer = '';
  }

  /**
   * Manually emit a barcode (for testing or manual entry)
   */
  emitBarcode(barcode: string): void {
    this.scannedBarcodeSubject.next({
      barcode,
      timestamp: new Date(),
      source: 'manual',
    });
  }

  private handleKeyPress(event: KeyboardEvent): void {
    const currentTime = Date.now();
    const timeSinceLastKey = currentTime - this.lastKeyTime;

    // Enter key pressed - process the buffer
    if (event.key === 'Enter') {
      if (this.barcodeBuffer.length >= this.MIN_BARCODE_LENGTH) {
        event.preventDefault();
        event.stopPropagation();
        
        this.scannedBarcodeSubject.next({
          barcode: this.barcodeBuffer.trim(),
          timestamp: new Date(),
          source: 'keyboard',
        });
      }
      this.barcodeBuffer = '';
      this.lastKeyTime = 0;
      return;
    }

    // If typing is too slow, it's probably human typing - reset buffer
    if (timeSinceLastKey > this.SCANNER_SPEED_MS && this.barcodeBuffer.length > 0) {
      this.barcodeBuffer = '';
    }

    // Only add printable characters
    if (event.key.length === 1 && !event.ctrlKey && !event.altKey && !event.metaKey) {
      // Prevent default to avoid typing in focused inputs
      if (this.barcodeBuffer.length === 0 || timeSinceLastKey < this.SCANNER_SPEED_MS) {
        event.preventDefault();
        event.stopPropagation();
      }
      
      this.barcodeBuffer += event.key;
      this.lastKeyTime = currentTime;
    }
  }

  /**
   * Check if a string looks like a valid barcode
   */
  isValidBarcode(barcode: string): boolean {
    // Basic validation - adjust based on your barcode format
    return barcode.length >= this.MIN_BARCODE_LENGTH && /^[0-9A-Za-z-]+$/.test(barcode);
  }

  /**
   * Cleanup when service is destroyed
   */
  ngOnDestroy(): void {
    this.stopListening();
  }
}
