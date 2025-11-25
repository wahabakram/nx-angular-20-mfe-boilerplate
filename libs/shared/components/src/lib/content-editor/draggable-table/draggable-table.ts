import {
  Component,
  ElementRef,
  Renderer2,
  OnInit,
  OnDestroy,
  AfterViewInit,
  NgZone,
  ChangeDetectionStrategy,
  inject,
  HostBinding, output, input, booleanAttribute, PLATFORM_ID,
} from '@angular/core';
import { isPlatformServer } from '@angular/common';

const HIDE_DELAY_MS = 300;

interface ColumnInfo {
  index: number;
  left: number;
  width: number;
  center: number;
}

interface RowInfo {
  index: number;
  element: HTMLTableRowElement;
  top: number;
  height: number;
  center: number;
}

@Component({
  selector: 'mf-draggable-table',
  exportAs: 'mfDraggableTable',
  imports: [],
  templateUrl: './draggable-table.html',
  styleUrl: './draggable-table.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.disabled]': 'disabled() || null'
  }
})
export class DraggableTable implements OnInit, AfterViewInit, OnDestroy {
  private _platformId = inject(PLATFORM_ID);
  // --- Сервисы и ссылки ---
  private elRef = inject(ElementRef<HTMLElement>);
  private renderer = inject(Renderer2);
  private ngZone = inject(NgZone);
  private table: HTMLTableElement | null = null;
  private columnHandler!: HTMLElement;
  private rowHandler!: HTMLElement;
  private dropIndicator!: HTMLElement; // Индикатор линии

  // --- Состояние ---
  private hoveredCell: HTMLElement | null = null;
  private hoveredColumnIndex: number = -1;
  private hoveredRowIndex: number = -1; // Индекс строки в tbody
  private isDragging = false;
  private dragMode: 'row' | 'column' | null = null;
  private startX = 0;
  private startY = 0;
  private handlerStartY = 0; // Начальная Y хендлера строки
  private draggedElement: HTMLElement | null = null; // Активный хендлер
  private draggedElementSource: HTMLElement | null = null; // Оригинальный TR или null
  private startElementIndex = -1; // Индекс НАЧАЛА перетаскивания (строки или колонки)
  private currentDropIndex = -1; // Индекс, куда предположительно сбросим
  private hideTimeoutId: any = null;

  // --- Состояния для логики перетаскивания ---
  private columnInfo: ColumnInfo[] = []; // Текущая геометрия колонок
  private rowInfo: RowInfo[] = [];       // Текущая геометрия строк tbody (видимых)

  // --- Слушатели и обработчики ---
  private listeners: { name: string; type: 'element' | 'document'; target?: () => EventTarget | null; event: string; handler: (event: any) => void; cleanup?: () => void }[] = [];
  private boundOnDrag: (event: MouseEvent) => void;
  private boundEndDrag: (event: MouseEvent) => void;

  // --- Конфигурация ---
  private handlerSize = 18;
  private handlerOffset = -9;
  private indicatorThickness = 3; // Толщина линии индикатора
  @HostBinding('class.draggable-table-host') hostClass = true;

  disabled = input(false, {
    transform: booleanAttribute
  });

  readonly columnMoved = output<{ startElementIndex: number, finalTargetIndex: number }>();
  readonly rowMoved = output<{ startElementIndex: number, finalTargetIndex: number }>();
  readonly moveStart = output<void>();
  readonly moveEnd = output<void>();

  constructor() {
    this.boundOnDrag = this.onDrag.bind(this);
    this.boundEndDrag = this.endDrag.bind(this);
  }

  // --- Методы жизненного цикла Angular ---

  ngOnInit(): void {
    if (isPlatformServer(this._platformId)) {
      return;
    }

    this.createHandlers();
    this.createDropIndicator();
    this.prepareListeners();
  }

  ngAfterViewInit(): void {
    this.table = this.elRef.nativeElement.querySelector('table');

    if (!this.table) {
      console.error('DraggableTableComponent: No <table> found.');
      return;
    }

    if (getComputedStyle(this.table).position === 'static') {
      this.renderer.setStyle(this.table, 'position', 'relative');
    }

    this.renderer.appendChild(this.table, this.columnHandler);
    this.renderer.appendChild(this.table, this.rowHandler);
    this.renderer.appendChild(this.table, this.dropIndicator);
    this.attachListeners('element');
  }

  ngOnDestroy(): void {
    this.detachListeners('all');
    this.cancelHideTimer();
    if (this.dropIndicator?.parentNode) { this.renderer.removeChild(this.dropIndicator.parentNode, this.dropIndicator); }
    if (this.columnHandler?.parentNode) { this.renderer.removeChild(this.columnHandler.parentNode, this.columnHandler); }
    if (this.rowHandler?.parentNode) { this.renderer.removeChild(this.rowHandler.parentNode, this.rowHandler); }
    if (this.table) {
      this.renderer.removeClass(this.table, 'dragging-column');
      this.renderer.removeClass(this.table, 'dragging-row');
      this.table.querySelectorAll('.dragging-source').forEach(el => this.renderer.removeClass(el, 'dragging-source'));
      this.table.querySelectorAll('.col-highlight').forEach(el => this.renderer.removeClass(el, 'col-highlight'));
      // Убираем подсветку строк (больше не нужна)
      // this.table.querySelectorAll('.drop-target-row-before, .drop-target-row-after').forEach(el => el.classList.remove('drop-target-row-before', 'drop-target-row-after'));
    }
    document.body.style.cursor = '';
    this.columnInfo = [];
    this.rowInfo = [];
    this.currentDropIndex = -1;
  }

  // --- Управление слушателями событий ---

  private prepareListeners(): void {
    this.listeners = [
      { name: 'tableMouseOver', type: 'element', target: () => this.table, event: 'mouseover', handler: this.onTableMouseOver.bind(this) },
      { name: 'tableMouseLeave', type: 'element', target: () => this.table, event: 'mouseleave', handler: this.onTableMouseLeave.bind(this) },
      { name: 'colHandlerMouseDown', type: 'element', target: () => this.columnHandler, event: 'mousedown', handler: (e) => this.startDrag(e, 'column') },
      { name: 'colHandlerMouseEnter', type: 'element', target: () => this.columnHandler, event: 'mouseenter', handler: this.onHandlerMouseEnter.bind(this) },
      { name: 'colHandlerMouseLeave', type: 'element', target: () => this.columnHandler, event: 'mouseleave', handler: this.onHandlerMouseLeave.bind(this) },
      { name: 'rowHandlerMouseDown', type: 'element', target: () => this.rowHandler, event: 'mousedown', handler: (e) => this.startDrag(e, 'row') },
      { name: 'rowHandlerMouseEnter', type: 'element', target: () => this.rowHandler, event: 'mouseenter', handler: this.onHandlerMouseEnter.bind(this) },
      { name: 'rowHandlerMouseLeave', type: 'element', target: () => this.rowHandler, event: 'mouseleave', handler: this.onHandlerMouseLeave.bind(this) },
      { name: 'docMouseMove', type: 'document', target: () => document, event: 'mousemove', handler: this.boundOnDrag },
      { name: 'docMouseUp', type: 'document', target: () => document, event: 'mouseup', handler: this.boundEndDrag },
    ];
  }

  private attachListeners(type: 'element' | 'document' | 'all' = 'element'): void {
    this.ngZone.runOutsideAngular(() => {
      this.listeners.forEach(listener => {
        if (listener.type === 'document' && type !== 'document' && type !== 'all') return;
        if (listener.type === 'element' && type === 'document') return;
        if (listener.cleanup || !listener.target) return;
        const targetElement = listener.target();
        if (!targetElement) return;
        listener.cleanup = this.renderer.listen(targetElement, listener.event, listener.handler);
      });
    });
  }

  private detachListeners(type: 'element' | 'document' | 'all' = 'all'): void {
    this.listeners.forEach(listener => {
      if (listener.type === 'document' && type !== 'document' && type !== 'all') return;
      if (listener.type === 'element' && type === 'document') return;
      if (listener.cleanup) { listener.cleanup(); listener.cleanup = undefined; }
    });
  }

  // --- Обработчики событий мыши ---

  private onTableMouseOver(event: MouseEvent): void {
    this.cancelHideTimer();
    if (!this.table || this.isDragging) return;
    const target = event.target as HTMLElement;
    const cell = target.closest('td, th') as HTMLTableCellElement | null;
    if (cell && this.table.contains(cell)) {
      const currentColumnIndex = cell.cellIndex;
      const currentRow = cell.closest('tr');
      const currentRowIndex = currentRow?.parentElement?.tagName === 'TBODY' ? Array.from(currentRow.parentElement.children).indexOf(currentRow) : -1;
      this.hoveredCell = cell;
      if (currentColumnIndex !== this.hoveredColumnIndex || this.columnHandler.style.visibility === 'hidden') {
        this.hoveredColumnIndex = currentColumnIndex;
        this.positionColumnHandler(cell);
        this.renderer.setStyle(this.columnHandler, 'visibility', 'visible');
      }
      if (currentRowIndex !== -1) {
        if (currentRowIndex !== this.hoveredRowIndex || this.rowHandler.style.visibility === 'hidden') {
          this.hoveredRowIndex = currentRowIndex;
          this.positionRowHandler(cell);
          this.renderer.setStyle(this.rowHandler, 'visibility', 'visible');
        }
      } else if (this.hoveredRowIndex !== -1) {
        this.renderer.setStyle(this.rowHandler, 'visibility', 'hidden');
        this.hoveredRowIndex = -1;
      }
    }
  }

  private onTableMouseLeave(event: MouseEvent): void {
    if (this.isDragging) return;
    const relatedTarget = event.relatedTarget as Node;
    if (relatedTarget !== this.columnHandler && relatedTarget !== this.rowHandler) { this.scheduleHideHandlers(); }
  }

  private onHandlerMouseEnter(): void { this.cancelHideTimer(); }

  private onHandlerMouseLeave(event: MouseEvent): void {
    if (this.isDragging) return;
    const relatedTarget = event.relatedTarget as Node;
    const isOverTable = relatedTarget && this.table && this.table.contains(relatedTarget);
    const isOverOtherHandler = (event.target === this.columnHandler && relatedTarget === this.rowHandler) || (event.target === this.rowHandler && relatedTarget === this.columnHandler);
    if (!isOverTable && !isOverOtherHandler) { this.scheduleHideHandlers(); }
  }

  private createHandlers(): void {
    this.columnHandler = this.renderer.createElement('div');
    this.renderer.addClass(this.columnHandler, 'drag-handler');
    this.renderer.addClass(this.columnHandler, 'column-handler');
    this.renderer.setStyle(this.columnHandler, 'position', 'fixed');
    this.renderer.setStyle(this.columnHandler, 'visibility', 'hidden');
    this.renderer.setStyle(this.columnHandler, 'z-index', '1000');
    this.rowHandler = this.renderer.createElement('div');
    this.renderer.addClass(this.rowHandler, 'drag-handler');
    this.renderer.addClass(this.rowHandler, 'row-handler');
    this.renderer.setStyle(this.rowHandler, 'position', 'fixed');
    this.renderer.setStyle(this.rowHandler, 'visibility', 'hidden');
    this.renderer.setStyle(this.rowHandler, 'z-index', '1000');
  }

  private createDropIndicator(): void {
    this.dropIndicator = this.renderer.createElement('div');
    this.renderer.addClass(this.dropIndicator, 'drop-indicator');
  }

  private positionColumnHandler(cellOrIndex: HTMLElement | number): void {
    if (!this.table) {
      return;
    }

    let targetCell: HTMLElement | null = null;

    if (typeof cellOrIndex === 'number') {
      targetCell = this.findFirstVisibleCellInColumn(cellOrIndex);
      if (!targetCell) return;
    } else {
      targetCell = cellOrIndex;
    }

    const tableRect = this.table.getBoundingClientRect();
    const cellRect = targetCell.getBoundingClientRect();
    const colHandlerLeft = cellRect.left + (cellRect.width / 2) - (this.handlerSize / 2);
    const colHandlerTop = tableRect.top - this.handlerSize - this.handlerOffset;
    this.renderer.setStyle(this.columnHandler, 'top', `${colHandlerTop}px`);
    this.renderer.setStyle(this.columnHandler, 'left', `${colHandlerLeft}px`);
  }

  private positionRowHandler(cell: HTMLElement): void {
    if (!this.table || this.isDragging) return;
    const tableRect = this.table.getBoundingClientRect();
    const cellRect = cell.getBoundingClientRect();
    const rowHandlerTop = cellRect.top + (cellRect.height / 2) - (this.handlerSize / 2);
    const rowHandlerLeft = tableRect.left - this.handlerSize - this.handlerOffset;
    this.renderer.setStyle(this.rowHandler, 'top', `${rowHandlerTop}px`);
    this.renderer.setStyle(this.rowHandler, 'left', `${rowHandlerLeft}px`);
  }

  private scheduleHideHandlers(): void {
    this.cancelHideTimer();
    this.hideTimeoutId = setTimeout(() => {
      this.hideHandlers();
      this.hideTimeoutId = null;
    }, HIDE_DELAY_MS);
  }

  private cancelHideTimer(): void {
    if (this.hideTimeoutId) {
      clearTimeout(this.hideTimeoutId);
      this.hideTimeoutId = null;
    }
  }

  private hideHandlers(): void {
    if (!this.isDragging) {
      this.renderer.setStyle(this.columnHandler, 'visibility', 'hidden');
      this.renderer.setStyle(this.rowHandler, 'visibility', 'hidden');
      this.renderer.setStyle(this.dropIndicator, 'visibility', 'hidden');
      this.hoveredCell = null; this.hoveredColumnIndex = -1; this.hoveredRowIndex = -1;
    }
  }

  private startDrag(event: MouseEvent, mode: 'row' | 'column'): void {
    this.cancelHideTimer();
    const sourceRow = mode === 'row' ? this.hoveredCell?.closest('tr') : null;
    if (!this.table || (mode === 'row' && this.hoveredRowIndex < 0) || (mode === 'column' && this.hoveredColumnIndex < 0) || (mode === 'row' && sourceRow?.parentElement?.tagName !== 'TBODY')) { return; }

    event.preventDefault();
    this.isDragging = true;
    this.dragMode = mode;
    this.startX = event.clientX;
    this.startY = event.clientY;
    this.currentDropIndex = -1;

    if (mode === 'column') {
      this.startElementIndex = this.hoveredColumnIndex;
      this.currentDropIndex = this.startElementIndex;
      this.draggedElement = this.columnHandler;
      this.draggedElementSource = null;
      this.renderer.addClass(this.table, 'dragging-column');
      this.styleColumnAsSource(this.startElementIndex, true); // Стиль источника
      this.calculateColumnInfo(); // Расчет геометрии
      this.updateColumnHandlerPositionOnDrag(event.clientX); // Позиционируем хендлер
      this.renderer.setStyle(this.columnHandler, 'visibility', 'visible');
      this.renderer.setStyle(this.rowHandler, 'visibility', 'hidden');
      this.renderer.setStyle(this.dropIndicator, 'visibility', 'hidden'); // Скрываем индикатор в начале
    } else { // mode === 'row'
      this.startElementIndex = this.hoveredRowIndex;
      this.currentDropIndex = this.startElementIndex;
      this.draggedElement = this.rowHandler;
      this.draggedElementSource = sourceRow!;
      this.renderer.addClass(this.draggedElementSource, 'dragging-source');
      this.renderer.addClass(this.table, 'dragging-row');
      this.calculateRowInfo(); // Вычисляем геометрию строк
      this.handlerStartY = parseFloat(this.rowHandler.style.top || '0');
      this.updateRowHandlerPositionOnDrag(event.clientY); // Позиционируем хендлер
      this.renderer.setStyle(this.rowHandler, 'visibility', 'visible');
      this.renderer.setStyle(this.columnHandler, 'visibility', 'hidden');
      this.renderer.setStyle(this.dropIndicator, 'visibility', 'hidden');
    }

    if (this.draggedElement) { this.renderer.addClass(this.draggedElement, 'dragging-active-handler'); }
    this.attachListeners('document');
  }

  private onDrag(event: MouseEvent): void {
    if (!this.isDragging || !this.draggedElement || !this.table) return;
    event.preventDefault();
    this.moveStart.emit();

    const currentX = event.clientX;
    const currentY = event.clientY;
    document.body.style.cursor = 'grabbing';

    // --- Обновление для строк ---
    if (this.dragMode === 'row') {
      // 1. Обновляем позицию ХЕНДЛЕРА строки
      this.updateRowHandlerPositionOnDrag(currentY);
      const currentHandlerCenterY = parseFloat(this.rowHandler.style.top || '0') + this.handlerSize / 2;

      // 2. Определяем ВИЗУАЛЬНУЮ целевую позицию строки
      const newVisualTargetIndex = this.getVisualTargetRowIndex(currentHandlerCenterY);

      // 3. Обновляем ИНДИКАТОР и currentDropIndex
      if (newVisualTargetIndex !== -1) {
        this.updateDropIndicator(newVisualTargetIndex, 'row');
        this.currentDropIndex = newVisualTargetIndex; // Сохраняем цель для endDrag
      } else {
        this.renderer.setStyle(this.dropIndicator, 'visibility', 'hidden');
        this.currentDropIndex = -1;
      }
      this.clearDropHighlights(); // Не используется
    }
    // --- Логика для колонок ---
    else if (this.dragMode === 'column') {
      // 1. Обновляем позицию ХЕНДЛЕРА
      this.updateColumnHandlerPositionOnDrag(currentX);
      const currentHandlerCenterX = parseFloat(this.columnHandler.style.left || '0') + this.handlerSize / 2;

      // 2. Определяем ВИЗУАЛЬНУЮ целевую позицию колонки
      const newVisualTargetIndex = this.getVisualTargetColumnIndex(currentHandlerCenterX);

      // 3. Обновляем ИНДИКАТОР и currentDropIndex
      if (newVisualTargetIndex !== -1) {
        this.updateDropIndicator(newVisualTargetIndex, 'column');
        this.currentDropIndex = newVisualTargetIndex; // Сохраняем цель для endDrag
      } else {
        this.renderer.setStyle(this.dropIndicator, 'visibility', 'hidden');
        this.currentDropIndex = -1;
      }

      // 4. Не перемещаем DOM здесь
      this.clearDropHighlights(); // Не используется
    }
  }

  // Определяет ВИЗУАЛЬНЫЙ индекс колонки, где должен быть индикатор
  private getVisualTargetColumnIndex(currentHandlerCenterX: number): number {
    if (this.startElementIndex < 0 || !this.columnInfo?.length) return -1;
    let potentialTargetIndex = this.startElementIndex;
    const currentGeometry = this.columnInfo; // Используем геометрию на момент старта
    for (const targetColumn of currentGeometry) {
      if (targetColumn.index === this.startElementIndex) continue;
      const targetCenter = targetColumn.center;
      const threshold = targetColumn.width * 0.5;
      if (targetColumn.index > this.startElementIndex && currentHandlerCenterX > targetCenter - threshold) {
        potentialTargetIndex = Math.max(potentialTargetIndex, targetColumn.index);
      } else if (targetColumn.index < this.startElementIndex && currentHandlerCenterX < targetCenter + threshold) {
        potentialTargetIndex = (potentialTargetIndex === this.startElementIndex) ? targetColumn.index : Math.min(potentialTargetIndex, targetColumn.index);
      }
    }
    return potentialTargetIndex;
  }

  // Определяет ВИЗУАЛЬНЫЙ индекс строки tbody, где должен быть индикатор
  private getVisualTargetRowIndex(currentHandlerCenterY: number): number {
    if (this.startElementIndex < 0 || !this.table?.tBodies[0] || !this.rowInfo?.length) return -1;
    let potentialTargetIndex = this.startElementIndex;
    const currentGeometry = this.rowInfo; // Используем геометрию строк
    for (const targetRow of currentGeometry) {
      if (targetRow.index === this.startElementIndex) continue; // Пропускаем исходную
      const targetCenter = targetRow.center;
      const threshold = targetRow.height * 0.5;
      if (targetRow.index > this.startElementIndex && currentHandlerCenterY > targetCenter - threshold) {
        potentialTargetIndex = Math.max(potentialTargetIndex, targetRow.index);
      } else if (targetRow.index < this.startElementIndex && currentHandlerCenterY < targetCenter + threshold) {
        potentialTargetIndex = (potentialTargetIndex === this.startElementIndex) ? targetRow.index : Math.min(potentialTargetIndex, targetRow.index);
      }
    }
    return potentialTargetIndex;
  }


  // Хелпер для получения элемента под курсором
  private getElementUnderMouse(clientX: number, clientY: number): Element | null {
    const originalColVisibility = this.columnHandler.style.visibility;
    const originalRowVisibility = this.rowHandler.style.visibility;

    this.renderer.setStyle(this.columnHandler, 'visibility', 'hidden');
    this.renderer.setStyle(this.rowHandler, 'visibility', 'hidden');

    const element = document.elementFromPoint(clientX, clientY);

    if (this.dragMode === 'column' && originalColVisibility === 'visible') { this.renderer.setStyle(this.columnHandler, 'visibility', 'visible'); }
    if (this.dragMode === 'row' && originalRowVisibility === 'visible') { this.renderer.setStyle(this.rowHandler, 'visibility', 'visible'); }

    return element;
  }

  // Обновляет ТОЛЬКО горизонтальную позицию хендлера колонки во время drag
  private updateColumnHandlerPositionOnDrag(currentX: number): void {
    if (!this.table || !this.columnHandler) return;
    const handlerLeft = currentX - (this.handlerSize / 2); // Центрируем хендлер под курсором
    this.renderer.setStyle(this.columnHandler, 'left', `${handlerLeft}px`);
  }

  // Обновляет ТОЛЬКО вертикальную позицию хендлера строки во время drag
  private updateRowHandlerPositionOnDrag(currentY: number): void {
    if (!this.table || !this.rowHandler) return;
    const deltaY = currentY - this.startY;
    const handlerTop = this.handlerStartY + deltaY;
    this.renderer.setStyle(this.rowHandler, 'top', `${handlerTop}px`);
  }

  private endDrag(event: MouseEvent): void {
    if (!this.isDragging) return; // Предохранитель

    this.detachListeners('document'); // Удаляем слушатели с документа НЕМЕДЛЕННО
    event.preventDefault();

    // Удаляем временные визуальные элементы
    this.renderer.setStyle(this.dropIndicator, 'visibility', 'hidden'); // Скрываем индикатор

    if (!this.table) {
      this.cleanupDragState(); // Очищаем, если таблицы нет
      return;
    }

    const finalTargetIndex = this.currentDropIndex;

    if (this.startElementIndex !== -1 && finalTargetIndex !== -1 && finalTargetIndex !== this.startElementIndex) {
      if (this.dragMode === 'column') {
        this.moveColumn(this.startElementIndex, finalTargetIndex);
        this.columnMoved.emit({
          startElementIndex: this.startElementIndex,
          finalTargetIndex
        });
      } else if (this.dragMode === 'row') {
        this.moveRow(this.startElementIndex, finalTargetIndex);
        this.rowMoved.emit({
          startElementIndex: this.startElementIndex,
          finalTargetIndex
        });
      }
    }

    // --- Полная очистка состояния ---
    this.cleanupDragState();
    this.moveEnd.emit();
    this.table
      .querySelectorAll('td.dragging-source, th.dragging-source')
      .forEach(cell => {
        this.renderer.removeClass(cell, 'dragging-source');
      });
  }

  // Очищает все состояния, связанные с перетаскиванием
  private cleanupDragState(): void {
    const draggedMode = this.dragMode;
    const startIndex = this.startElementIndex;
    const sourceElement = this.draggedElementSource;
    const activeHandler = this.draggedElement;

    // Удаляем визуалку
    this.renderer.setStyle(this.dropIndicator, 'visibility', 'hidden');

    // Сбрасываем флаги и переменные состояния
    this.isDragging = false;
    this.dragMode = null;
    this.startElementIndex = -1;
    this.draggedElement = null;
    this.draggedElementSource = null;
    this.columnInfo = [];
    this.rowInfo = [];
    this.currentDropIndex = -1;
    this.handlerStartY = 0;

    this.clearDropHighlights(); // Убираем подсветку строк

    if (this.table) {
      if (draggedMode === 'column') {
        this.renderer.removeClass(this.table, 'dragging-column');
        // Снимаем стиль источника с колонки по НАЧАЛЬНОМУ индексу
        if (startIndex >= 0) {
          this.styleColumnAsSource(startIndex, false);
          this.highlightColumn(startIndex, false); // Убираем подсветку
        } else {
          this.table.querySelectorAll('td.dragging-source, th.dragging-source').forEach(cell => this.renderer.removeClass(cell, 'dragging-source'));
          this.table.querySelectorAll('.col-highlight').forEach(cell => this.renderer.removeClass(cell, 'col-highlight'));
        }
      } else if (draggedMode === 'row') {
        this.renderer.removeClass(this.table, 'dragging-row');
        if (sourceElement) this.renderer.removeClass(sourceElement, 'dragging-source');
      }
    }
    if (activeHandler) { this.renderer.removeClass(activeHandler, 'dragging-active-handler'); }
    document.body.style.cursor = '';
    this.hideHandlers();
    this.cancelHideTimer();
  }

  private moveRow(fromIndex: number, toIndex: number): void {
    if (!this.table) { console.error("[moveRow] Table not found"); return; }
    const tbody = this.table.tBodies[0];
    if (!tbody) { console.warn("[moveRow] No TBODY found."); return; }

    // fromIndex и toIndex относятся к ВИДИМЫМ строкам (не source)
    const visibleRows = Array.from(tbody.rows).filter(r => !r.classList.contains('dragging-source'));
    if (fromIndex < 0 || fromIndex >= visibleRows.length || toIndex < 0 || toIndex > visibleRows.length || fromIndex === toIndex) {
      // console.error("[moveRow] Invalid visible row indices", { from: fromIndex, to: toIndex, visibleRows: visibleRows.length });
      // Пробуем найти индексы в общем списке, если fromIndex соответствует DOM-индексу
      const allRows = Array.from(tbody.rows);
      if (fromIndex < 0 || fromIndex >= allRows.length || toIndex < 0 || toIndex > allRows.length || fromIndex === toIndex) {
        console.error("[moveRow] Invalid absolute row indices", { from: fromIndex, to: toIndex, allRows: allRows.length });
        return;
      }
      console.warn("[moveRow] Index mismatch, attempting move with absolute indices.");
    }

    // Находим реальный DOM-элемент для перемещения (он один - source)
    const rowToMove = tbody.querySelector('tr.dragging-source') as HTMLTableRowElement | null;
    if (!rowToMove) { console.error("[moveRow] Source row not found"); return; }
    const actualFromIndex = Array.from(tbody.rows).indexOf(rowToMove);

    // Находим referenceNode относительно ВСЕХ строк в tbody
    const allRows = Array.from(tbody.rows);
    let referenceNode: Node | null = null;

    // Корректный toIndex для allRows может отличаться от toIndex для видимых строк
    let currentVisibleIndex = 0;
    let actualInsertIndex = -1; // Индекс в allRows, перед которым вставлять
    for (let i = 0; i < allRows.length; i++) {
      if (!allRows[i].classList.contains('dragging-source')) {
        if (currentVisibleIndex === toIndex) {
          actualInsertIndex = i;
          break;
        }
        currentVisibleIndex++;
      }
    }
    // Если toIndex равен количеству видимых строк, вставляем в конец
    if (actualInsertIndex === -1 && toIndex === visibleRows.length) {
      actualInsertIndex = allRows.length; // Индекс для вставки в конец
    }

    if (actualInsertIndex !== -1) {
      if (actualFromIndex < actualInsertIndex) { // Двигаем вниз
        // Если actualInsertIndex указывает на последнюю строку, referenceNode будет null
        referenceNode = allRows[actualInsertIndex] ?? null;
      } else { // Двигаем вверх
        referenceNode = allRows[actualInsertIndex];
      }
    } else {
      console.error("[moveRow] Could not determine reference node for target index", toIndex);
      return;
    }


    try {
      this.renderer.insertBefore(tbody, rowToMove, referenceNode);
    } catch (error) {
      console.error("[moveRow] Error:", error);
    }
    this.hoveredRowIndex = -1; // Сбрасываем
  }


  private moveColumn(fromIndex: number, toIndex: number): void {
    if (!this.table || fromIndex === toIndex || fromIndex < 0 || toIndex < 0) {
      console.error("[moveColumn] Invalid indices", { from: fromIndex, to: toIndex }); return;
    }
    let moved = false;
    for (let i = 0; i < this.table.rows.length; i++) {
      const row = this.table.rows[i];
      const cells = Array.from(row.cells); // Используем текущий DOM
      if (fromIndex >= cells.length || toIndex > cells.length) { continue; }

      const cellToMove = cells[fromIndex] as HTMLElement | undefined;
      let referenceNode: Node | null = null;
      if (fromIndex < toIndex) { referenceNode = cells[toIndex + 1] ?? null; }
      else { referenceNode = cells[toIndex]; }

      if (cellToMove) {
        try { this.renderer.insertBefore(row, cellToMove, referenceNode); moved = true; }
        catch (error) { console.error(`[moveColumn] Error row ${i}:`, error); }
      }
    }
  }

  // Добавляет/убирает стиль источника для всей колонки
  private styleColumnAsSource(columnIndex: number, add: boolean): void {
    if (!this.table || columnIndex < 0) return;
    for (let i = 0; i < this.table.rows.length; i++) {
      const row = this.table.rows[i];
      if (columnIndex < row.cells.length) {
        const cell = row.cells[columnIndex];
        if (cell) {
          if (add) { this.renderer.addClass(cell, 'dragging-source'); }
          else { this.renderer.removeClass(cell, 'dragging-source'); }
        }
      }
    }
  }

  // Расчет геометрии колонок
  private calculateColumnInfo(): void {
    this.columnInfo = [];
    if (!this.table || this.table.rows.length === 0) return;
    const referenceRow = this.table.tHead?.rows[0] ?? this.table.rows[0];
    if (!referenceRow) return;
    for (let i = 0; i < referenceRow.cells.length; i++) {
      const cell = referenceRow.cells[i] as HTMLElement;
      const rect = cell.getBoundingClientRect();
      this.columnInfo.push({ index: i, left: rect.left, width: rect.width, center: rect.left + rect.width / 2 });
    }
  }

  // Расчет геометрии строк tbody (только видимых)
  private calculateRowInfo(): void {
    this.rowInfo = [];
    if (!this.table || !this.table.tBodies[0]) return;
    const tbody = this.table.tBodies[0];
    let visibleIndex = 0;
    for (let i = 0; i < tbody.rows.length; i++) {
      const row = tbody.rows[i] as HTMLTableRowElement;
      const rect = row.getBoundingClientRect();
      this.rowInfo.push({ index: visibleIndex, element: row, top: rect.top, height: rect.height, center: rect.top + rect.height / 2 });
      visibleIndex++;
    }
  }

  // Находит первую видимую ячейку в колонке
  private findFirstVisibleCellInColumn(columnIndex: number): HTMLElement | null {
    if (!this.table || columnIndex < 0) return null;
    for (let i = 0; i < this.table.rows.length; i++) {
      const row = this.table.rows[i];
      if (columnIndex < row.cells.length) {
        const c = row.cells[columnIndex] as HTMLElement;
        if (c && c.offsetParent !== null) { return c; }
      }
    }
    return null;
  }

  // Обновляет позицию и видимость индикатора
  private updateDropIndicator(targetVisualIndex: number, mode: 'row' | 'column'): void {
    if (!this.table || targetVisualIndex < 0 || this.startElementIndex < 0) {
      this.renderer.setStyle(this.dropIndicator, 'visibility', 'hidden');
      return;
    }

    // Определяем реальный индекс вставки (куда элемент встанет)
    const insertBeforeIndex = (targetVisualIndex <= this.startElementIndex) ? targetVisualIndex : targetVisualIndex + 1;

    // Не показываем индикатор, если вставляем на место или рядом с исходной позицией
    if (insertBeforeIndex === this.startElementIndex || insertBeforeIndex === this.startElementIndex + 1) {
      this.renderer.setStyle(this.dropIndicator, 'visibility', 'hidden');
      return;
    }

    const tableRect = this.table.getBoundingClientRect();

    if (mode === 'column') {
      // Находим колонку, ПЕРЕД которой будет вставка, используя columnInfo
      const referenceColumnInfo = this.columnInfo.find(c => c.index === insertBeforeIndex);
      let indicatorLeftTable = 0;

      if (referenceColumnInfo) {
        indicatorLeftTable = referenceColumnInfo.left - tableRect.left;
      } else { // Вставка в конец
        const lastColInfo = this.columnInfo[this.columnInfo.length - 1];
        indicatorLeftTable = lastColInfo ? (lastColInfo.left - tableRect.left + lastColInfo.width) : this.table.offsetWidth;
      }
      indicatorLeftTable -= Math.floor(this.indicatorThickness / 2); // Центрируем

      // Стили для вертикальной линии
      this.renderer.setStyle(this.dropIndicator, 'left', `${indicatorLeftTable}px`);
      this.renderer.setStyle(this.dropIndicator, 'top', `0px`);
      this.renderer.setStyle(this.dropIndicator, 'height', `${this.table.offsetHeight}px`);
      this.renderer.setStyle(this.dropIndicator, 'width', `${this.indicatorThickness}px`);
      // Сбрасываем стили строки
      this.renderer.removeStyle(this.dropIndicator, 'right');
      this.renderer.removeStyle(this.dropIndicator, 'bottom');


    } else { // mode === 'row'
      // Находим строку, ПЕРЕД которой будет вставка, используя rowInfo
      const referenceRowInfo = this.rowInfo.find(r => r.index === insertBeforeIndex);
      let indicatorTopTable = 0;

      if (referenceRowInfo) {
        indicatorTopTable = referenceRowInfo.top - tableRect.top;
      } else { // Вставка в конец
        const lastRowInfo = this.rowInfo[this.rowInfo.length - 1];
        indicatorTopTable = lastRowInfo
          ? (lastRowInfo.top - tableRect.top + lastRowInfo.height)
          : (this.table.tBodies[0]?.offsetHeight ?? this.table.offsetHeight);
      }
      indicatorTopTable -= Math.floor(this.indicatorThickness / 2); // Центрируем

      // Стили для горизонтальной линии
      this.renderer.setStyle(this.dropIndicator, 'top', `${indicatorTopTable}px`);
      this.renderer.setStyle(this.dropIndicator, 'left', `0px`);
      this.renderer.setStyle(this.dropIndicator, 'width', `${this.table.offsetWidth}px`); // Ширина таблицы
      this.renderer.setStyle(this.dropIndicator, 'height', `${this.indicatorThickness}px`);
      // Сбрасываем стили колонки
      this.renderer.removeStyle(this.dropIndicator, 'bottom');
      this.renderer.removeStyle(this.dropIndicator, 'right');
    }

    this.renderer.setStyle(this.dropIndicator, 'visibility', 'visible');
  }

  private highlightColumn(index: number, add: boolean): void {

  }

  private clearDropHighlights(): void {

  }

}
