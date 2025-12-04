# Component Library Catalog (@ng-mf/components)

Complete reference guide for all 70+ reusable UI components in the workspace.

**Library:** `@ng-mf/components`
**Technology Stack:** Angular 20.3+, Material 3, Tailwind CSS 4
**Architecture:** Standalone components

---

## Table of Contents

1. [Data Display Components](#1-data-display-components)
2. [Form Components](#2-form-components)
3. [Layout Components](#3-layout-components)
4. [Navigation Components](#4-navigation-components)
5. [Feedback Components](#5-feedback-components)
6. [Dialog Components](#6-dialog-components)
7. [Editor Components](#7-editor-components)
8. [Media Components](#8-media-components)
9. [Design System Components](#9-design-system-components)
10. [Business Components](#10-business-components)
11. [Utility Components](#11-utility-components)

---

## 1. Data Display Components

### 1.1 DataView (Material-based Table)

**Import:**
```typescript
import {
  DataView,
  DataViewColumnDef,
  DataViewActionBar,
  DataViewActionBarDirective,
  DataViewEmptyDataDirective,
  DataViewEmptyFilterResultsDirective,
  DataViewRowSelectionEvent,
  DataViewCellRenderer,
} from '@ng-mf/components';
```

**Features:**
- Row selection with checkboxes
- Client-side and server-side data models
- Sorting capabilities (client/server)
- Integrated pagination support
- Search/filtering with empty state templates
- Custom cell renderers
- Sticky headers
- Hover row effects
- Action bar support
- Loading states with skeleton loaders

**Usage Example:**
```typescript
@Component({
  selector: 'app-product-list',
  imports: [DataView, DataViewActionBar, ...],
  template: `
    <emr-data-view
      [columns]="columnDefs"
      [data]="products()"
      [loading]="isLoading()"
      (rowSelectionChange)="handleSelection($event)"
    >
      <emr-data-view-action-bar>
        <button mat-button (click)="deleteSelected()">Delete Selected</button>
      </emr-data-view-action-bar>
    </emr-data-view>
  `,
})
export class ProductList {
  columnDefs: DataViewColumnDef[] = [
    { name: 'SKU', dataField: 'sku', visible: true },
    { name: 'Name', dataField: 'name', visible: true },
    { name: 'Price', dataField: 'price', visible: true },
    { name: 'Stock', dataField: 'stockLevel', visible: true },
  ];
}
```

**Electric Store Use Cases:**
- Product lists in POS
- Inventory management tables
- Sales history
- Customer lists
- Quotation lists

---

### 1.2 Datatable (TanStack Table)

**Import:**
```typescript
import {
  Datatable,
  DatatableColumn,
  DatatableData,
} from '@ng-mf/components';
```

**Features:**
- Advanced sorting and filtering
- Row selection with callbacks
- Pagination built-in
- Compact mode
- Fixed table layout option
- Global filter support
- Column resizing
- Responsive with auto-height calculation
- Cell templates: Date cells, Selection cells
- Based on TanStack Angular Table (v8.21.3)

**Usage Example:**
```typescript
@Component({
  selector: 'app-inventory-table',
  imports: [Datatable],
  template: `
    <emr-datatable
      [columns]="columns"
      [data]="inventoryData()"
      [enableSorting]="true"
      [enableGlobalFilter]="true"
      (rowSelected)="handleRowSelect($event)"
    />
  `,
})
export class InventoryTable {
  columns = [
    { header: 'Product', accessorKey: 'name' },
    { header: 'Stock', accessorKey: 'stockLevel' },
    { header: 'Value', accessorKey: 'value' },
  ];
}
```

**Electric Store Use Cases:**
- Advanced inventory grids
- Complex data manipulation
- Stock management tables
- Reports with multiple columns

---

### 1.3 MicroChart

**Import:**
```typescript
import { MicroChart, MChartBar, MChartLine, MChartPie } from '@ng-mf/components';
```

**Features:**
- Bar charts (`mchart-bar`)
- Line charts (`mchart-line`)
- Pie charts (`mchart-pie`)
- Tooltip components
- Small, lightweight visualizations

**Usage Example:**
```typescript
@Component({
  template: `
    <mchart-line [data]="salesData()" [height]="50" />
  `,
})
export class SalesWidget {
  salesData = signal([10, 20, 15, 30, 25, 40]);
}
```

**Electric Store Use Cases:**
- Dashboard KPI sparklines
- Quick sales trends
- Inline stock level indicators

---

### 1.4 Charts (ECharts Integration)

**Import:**
```typescript
import { Charts } from '@ng-mf/components';
```

**Features:**
- Full ECharts integration (v6.0.0)
- Configurable chart widgets
- Support for all ECharts chart types

**Usage Example:**
```typescript
@Component({
  template: `
    <emr-charts
      [option]="chartOptions()"
      [style.height.px]="300"
    />
  `,
})
export class SalesDashboard {
  chartOptions = signal({
    xAxis: { type: 'category', data: ['Mon', 'Tue', 'Wed'] },
    yAxis: { type: 'value' },
    series: [{ type: 'bar', data: [120, 200, 150] }],
  });
}
```

**Electric Store Use Cases:**
- Sales analytics charts
- Revenue trends
- Branch performance comparison
- Inventory value charts

---

### 1.5 Gauge

**Import:**
```typescript
import { Gauge } from '@ng-mf/components';
```

**Features:**
- Progress/metric visualization
- Customizable colors
- Percentage display

**Usage Example:**
```typescript
@Component({
  template: `
    <emr-gauge
      [value]="revenueProgress()"
      [max]="100"
      [color]="'primary'"
    />
  `,
})
```

**Electric Store Use Cases:**
- Revenue target indicators
- Inventory capacity
- Sales quota tracking

---

### 1.6 Skeleton

**Import:**
```typescript
import { Skeleton, SkeletonBlock, SkeletonLine } from '@ng-mf/components';
```

**Features:**
- Loading states for better UX
- Block and Line variants
- Configurable shapes and sizes

**Electric Store Use Cases:**
- Loading product lists
- Loading dashboard widgets
- Placeholders for async data

---

### 1.7 Avatar

**Import:**
```typescript
import { Avatar } from '@ng-mf/components';
```

**Features:**
- User avatars with Dicebear integration
- Initials display
- Image support
- Size variants

**Electric Store Use Cases:**
- User profiles
- Cashier identification
- Customer avatars

---

### 1.8 Timeline

**Import:**
```typescript
import { Timeline, TimelineItem } from '@ng-mf/components';
```

**Features:**
- Event timeline visualization
- Customizable icons
- Date formatting

**Electric Store Use Cases:**
- Order history
- Transaction timeline
- Audit trails
- Stock adjustment history

---

### 1.9 Carousel

**Import:**
```typescript
import { Carousel } from '@ng-mf/components';
```

**Features:**
- Image/content carousel
- Navigation arrows
- Auto-play option

**Electric Store Use Cases:**
- Product showcases
- Featured items
- Promotional banners

---

### 1.10 Stepper

**Import:**
```typescript
import { Stepper, StepperStep } from '@ng-mf/components';
```

**Features:**
- Step-by-step wizard
- Progress indicator
- Validation support

**Electric Store Use Cases:**
- Multi-step checkout
- Product setup wizard
- Quotation creation flow

---

## 2. Form Components

### 2.1 FormRenderer (Dynamic Forms)

**Import:**
```typescript
import { FormRenderer } from '@ng-mf/components';
```

**Features:**
- Dynamic form generation
- Component registry for custom fields
- Validator registry
- Field types: Input, Textarea, Select, Checkbox, Radio, Toggle, Datepicker, Autocomplete
- Content types: Text, Image, Divider

**Usage Example:**
```typescript
@Component({
  template: `
    <emr-form-renderer
      [fields]="productFields()"
      [formGroup]="productForm"
    />
  `,
})
export class ProductForm {
  productFields = signal([
    { type: 'input', name: 'name', label: 'Product Name', required: true },
    { type: 'number', name: 'price', label: 'Price', required: true },
    { type: 'select', name: 'categoryId', label: 'Category', options: categories() },
  ]);
}
```

**Electric Store Use Cases:**
- Dynamic product forms
- Customizable settings forms
- User role management forms

---

### 2.2 NumberInput

**Import:**
```typescript
import { NumberInput } from '@ng-mf/components';
```

**Features:**
- Numeric input with formatting
- Min/max validation
- Step increment/decrement
- Decimal support

**Usage Example:**
```typescript
<emr-number-input
  [(ngModel)]="quantity"
  [min]="0"
  [max]="1000"
  [step]="1"
  placeholder="Quantity"
/>
```

**Electric Store Use Cases:**
- Quantity input in POS
- Stock level input
- Price input
- Discount percentage

---

### 2.3 CurrencySelect

**Import:**
```typescript
import { CurrencySelect } from '@ng-mf/components';
```

**Features:**
- Multi-currency support
- Currency symbols
- Searchable dropdown

**Electric Store Use Cases:**
- Multi-currency pricing
- Currency conversion settings
- Invoice currency selection

---

### 2.4 CountrySelect

**Import:**
```typescript
import { CountrySelect } from '@ng-mf/components';
```

**Features:**
- Country picker with flags
- Searchable
- ISO codes support

**Electric Store Use Cases:**
- Customer address forms
- Supplier location
- Branch location setup

---

### 2.5 PhoneInput

**Import:**
```typescript
import { PhoneInput } from '@ng-mf/components';
```

**Features:**
- International phone number input
- Country code selection
- Validation

**Electric Store Use Cases:**
- Customer contact information
- Supplier phone numbers
- User profiles

---

### 2.6 SignaturePad

**Import:**
```typescript
import { SignaturePad } from '@ng-mf/components';
```

**Features:**
- Digital signature capture
- Export as image
- Clear and save functionality

**Electric Store Use Cases:**
- Delivery confirmation
- Receipt signatures
- Contract signing

---

### 2.7 Segmented (iOS-style Toggle)

**Import:**
```typescript
import { Segmented, SegmentedButton } from '@ng-mf/components';
```

**Features:**
- iOS-style segmented buttons
- Single or multi-select
- Customizable styling

**Usage Example:**
```typescript
<emr-segmented [(ngModel)]="selectedPeriod">
  <emr-segmented-button value="day">Day</emr-segmented-button>
  <emr-segmented-button value="week">Week</emr-segmented-button>
  <emr-segmented-button value="month">Month</emr-segmented-button>
</emr-segmented>
```

**Electric Store Use Cases:**
- Time period selector (Day/Week/Month)
- Status filters
- Report type selection

---

### 2.8 RadioCard

**Import:**
```typescript
import { RadioCard } from '@ng-mf/components';
```

**Features:**
- Visual radio button cards
- Custom content support
- Grid layout support

**Electric Store Use Cases:**
- Payment method selection
- Shipping method selection
- Plan selection

---

### 2.9 DateFormatSelect

**Import:**
```typescript
import { DateFormatSelect } from '@ng-mf/components';
```

**Features:**
- Date formatting options
- Preview display

**Electric Store Use Cases:**
- Report date range selection
- Settings date format
- Invoice date configuration

---

### 2.10 PasswordStrength

**Import:**
```typescript
import {
  PasswordStrength,
  PasswordStrengthInfo,
  PassToggleVisibility,
  passwordStrengthValidator,
} from '@ng-mf/components';
```

**Features:**
- Password strength indicator
- Visibility toggle
- Custom validation rules

**Electric Store Use Cases:**
- User registration
- Password changes
- Admin user creation

---

### 2.11 InlineTextEdit

**Import:**
```typescript
import { InlineTextEdit } from '@ng-mf/components';
```

**Features:**
- Quick inline editing
- Click-to-edit functionality
- Auto-save option

**Electric Store Use Cases:**
- Quick product name edits
- Price adjustments
- Note editing

---

### 2.12 InputMask

**Import:**
```typescript
import { InputMask } from '@ng-mf/components';
```

**Features:**
- Masked input fields
- Custom patterns
- Format as you type

**Electric Store Use Cases:**
- SKU format enforcement
- Barcode input formatting
- Custom ID patterns

---

### 2.13 PinInput

**Import:**
```typescript
import { PinInput } from '@ng-mf/components';
```

**Features:**
- PIN/OTP entry
- Auto-focus next field
- Paste support

**Electric Store Use Cases:**
- Cashier PIN authentication
- Security verification
- Password reset OTP

---

## 3. Layout Components

### 3.1 Panel

**Import:**
```typescript
import { Panel, PanelHeader, PanelBody, PanelFooter } from '@ng-mf/components';
```

**Features:**
- Container with header/body/footer
- Collapsible option
- Custom styling support

**Usage Example:**
```typescript
<emr-panel>
  <emr-panel-header>
    <h2>Shopping Cart</h2>
  </emr-panel-header>
  <emr-panel-body>
    <!-- Cart items -->
  </emr-panel-body>
  <emr-panel-footer>
    <button>Checkout</button>
  </emr-panel-footer>
</emr-panel>
```

**Electric Store Use Cases:**
- Cart panel in POS
- Product details panel
- Summary panels
- Settings sections

---

### 3.2 Sidebar

**Import:**
```typescript
import { Sidebar, SidebarHeader, SidebarBody } from '@ng-mf/components';
```

**Features:**
- Collapsible sidebar navigation
- Persistent state
- Overlay mode

**Electric Store Use Cases:**
- Main navigation
- POS feature quick access
- Admin sidebar menu

---

### 3.3 Drawer

**Import:**
```typescript
import { Drawer } from '@ng-mf/components';
```

**Features:**
- Slide-out drawer panels
- Left/right positioning
- Backdrop support

**Electric Store Use Cases:**
- Payment panel (slide out)
- Product details drawer
- Filter drawer
- Customer info drawer

---

### 3.4 Layout

**Import:**
```typescript
import { Layout, LayoutSidebar, LayoutHeader, LayoutBody } from '@ng-mf/components';
```

**Features:**
- Main layout container
- Header/sidebar/body structure
- Responsive breakpoints

**Electric Store Use Cases:**
- Main app layout
- Dashboard layout
- POS layout

---

### 3.5 Dashboard

**Import:**
```typescript
import { Dashboard, DashboardWidget } from '@ng-mf/components';
```

**Features:**
- Pre-configured dashboard layout
- Grid-based widget placement
- Drag-and-drop support (optional)

**Electric Store Use Cases:**
- Admin dashboard
- Manager overview
- Branch performance dashboard

---

### 3.6 Breadcrumbs

**Import:**
```typescript
import { Breadcrumbs, Breadcrumb } from '@ng-mf/components';
```

**Features:**
- Navigation breadcrumbs
- Auto-generation from routes
- Custom separators

**Electric Store Use Cases:**
- Inventory > Categories > Electronics
- Settings > Users > Edit
- Reports > Sales > Monthly

---

## 4. Navigation Components

### 4.1 Navigation

**Import:**
```typescript
import {
  Navigation,
  NavigationItem,
  NavigationGroup,
  NavigationHeading,
  NavigationDivider,
} from '@ng-mf/components';
```

**Features:**
- Main navigation component
- Icons and badges support
- Collapsible groups
- Section headings

**Electric Store Use Cases:**
- Main sidebar navigation
- Feature modules menu
- Admin navigation

---

### 4.2 RailNav

**Import:**
```typescript
import { RailNav } from '@ng-mf/components';
```

**Features:**
- Minimal side rail navigation
- Icon-only with tooltips
- Expandable option

**Electric Store Use Cases:**
- Compact POS navigation
- Mobile navigation
- Space-saving admin nav

---

### 4.3 TabPanel

**Import:**
```typescript
import { TabPanel, TabPanelHeader, TabPanelBody, TabPanelFooter } from '@ng-mf/components';
```

**Features:**
- Tabbed interface
- Header/body/footer support
- Lazy loading tabs

**Electric Store Use Cases:**
- Product details tabs (Info, Stock, History)
- Settings tabs (General, Users, Branches)
- Reports tabs (Daily, Weekly, Monthly)

---

### 4.4 CommandBar

**Import:**
```typescript
import { CommandBar } from '@ng-mf/components';
```

**Features:**
- Quick command palette (Cmd+K style)
- Search functionality
- Keyboard shortcuts

**Electric Store Use Cases:**
- Quick product search
- Command shortcuts (New Invoice, Add Product)
- Global search

---

## 5. Feedback Components

### 5.1 Alert

**Import:**
```typescript
import { Alert } from '@ng-mf/components';
```

**Features:**
- Alert messages with variants
- Info, success, warning, error types
- Dismissible option

**Electric Store Use Cases:**
- Transaction success messages
- Error notifications
- Warning alerts (low stock)
- Info messages

---

### 5.2 Confirm

**Import:**
```typescript
import { ConfirmManager } from '@ng-mf/components';
```

**Features:**
- Confirmation dialogs
- Programmatic API
- Custom content support

**Usage Example:**
```typescript
export class ProductList {
  confirmManager = inject(ConfirmManager);

  deleteProduct(product: Product) {
    const ref = this.confirmManager.open({
      title: 'Delete Product',
      description: `Delete ${product.name}?`,
    });

    ref.confirmed.subscribe(() => {
      // Delete product
    });
  }
}
```

**Electric Store Use Cases:**
- Delete confirmations
- Payment confirmations
- Stock adjustment confirmations
- Critical action confirmations

---

### 5.3 BlockState

**Import:**
```typescript
import { BlockState, BlockStateIcon, BlockStateContent } from '@ng-mf/components';
```

**Features:**
- Empty/error states for content blocks
- Custom icons and messages
- Action buttons

**Electric Store Use Cases:**
- Empty cart state
- No products found
- Empty inventory
- Error states

---

### 5.4 BlockLoader

**Import:**
```typescript
import { BlockLoader } from '@ng-mf/components';
```

**Features:**
- Loading overlay for blocks
- Spinner animation
- Customizable message

**Electric Store Use Cases:**
- Loading product lists
- Processing payments
- Saving forms
- Syncing data

---

### 5.5 Announcement

**Import:**
```typescript
import { Announcement } from '@ng-mf/components';
```

**Features:**
- Announcement banners
- Dismissible
- Different styles

**Electric Store Use Cases:**
- System maintenance notices
- New feature announcements
- Important updates
- Promotional messages

---

### 5.6 ActionRequired

**Import:**
```typescript
import { ActionRequired } from '@ng-mf/components';
```

**Features:**
- Action prompt component
- Highlight urgent items
- Call-to-action buttons

**Electric Store Use Cases:**
- Low stock alerts requiring action
- Pending approvals
- Required system updates

---

### 5.7 Notifications

**Import:**
```typescript
import { Notifications, NotificationItem } from '@ng-mf/components';
```

**Features:**
- Notification list
- Notification items with actor/message/time
- Skeleton loaders
- Custom templates
- Avatar support

**Electric Store Use Cases:**
- System notifications
- Order updates
- Stock alerts
- User activity notifications

---

### 5.8 Popover

**Import:**
```typescript
import { Popover } from '@ng-mf/components';
```

**Features:**
- Tooltip/popover component
- Positioning options
- Trigger events

**Electric Store Use Cases:**
- Product info tooltips
- Help popovers
- Quick actions menu

---

### 5.9 SplashScreen

**Import:**
```typescript
import { SplashScreen, SplashScreenManager } from '@ng-mf/components';
```

**Features:**
- App loading screen
- State management
- Custom branding

**Electric Store Use Cases:**
- App initialization
- Branch data loading
- System startup

---

### 5.10 CookiePopup

**Import:**
```typescript
import { CookiePopup } from '@ng-mf/components';
```

**Features:**
- Cookie consent popup
- Compliance support
- Customizable message

**Electric Store Use Cases:**
- GDPR compliance
- Cookie consent management

---

## 6. Dialog Components

### 6.1 Dialog

**Import:**
```typescript
import { DialogLayout, DialogFooter } from '@ng-mf/components';
```

**Features:**
- Base dialog container
- Full-screen option
- Custom content

**Electric Store Use Cases:**
- Product forms
- Confirmation dialogs
- Settings dialogs

---

### 6.2 SidePanel

**Import:**
```typescript
import { SidePanel } from '@ng-mf/components';
```

**Features:**
- Slide-out side panel for forms/details
- Overlay support
- Responsive

**Electric Store Use Cases:**
- Quick product edit
- Customer details
- Order details
- Filter panel

---

## 7. Editor Components

### 7.1 TextEditor (TipTap)

**Import:**
```typescript
import { TextEditor } from '@ng-mf/components';
```

**Features:**
- TipTap-based rich text editor
- Formatting toolbar
- Customizable

**Electric Store Use Cases:**
- Product descriptions
- Notes
- Email templates

---

### 7.2 MarkdownEditor

**Import:**
```typescript
import { MarkdownEditor } from '@ng-mf/components';
```

**Features:**
- Markdown editing with preview
- Syntax highlighting
- Export support

**Electric Store Use Cases:**
- Documentation
- Product long descriptions
- Help content

---

### 7.3 CommentEditor

**Import:**
```typescript
import { CommentEditor } from '@ng-mf/components';
```

**Features:**
- Commenting interface
- Mentions support
- Rich formatting

**Electric Store Use Cases:**
- Order notes
- Product comments
- Internal communications

---

### 7.4 CodeHighlighter

**Import:**
```typescript
import { CodeHighlighter } from '@ng-mf/components';
```

**Features:**
- Syntax highlighting with Prism.js
- Multiple languages
- Copy button

**Electric Store Use Cases:**
- API documentation
- Integration guides
- Technical support

---

## 8. Media Components

### 8.1 ImageResizer

**Import:**
```typescript
import { ImageResizer } from '@ng-mf/components';
```

**Features:**
- Client-side image resizing
- Multiple size outputs
- Quality control

**Electric Store Use Cases:**
- Product image upload
- Optimize product photos
- Thumbnail generation

---

### 8.2 ImageViewer

**Import:**
```typescript
import { ImageViewer } from '@ng-mf/components';
```

**Features:**
- Image preview/gallery
- Zoom support
- Navigation controls

**Electric Store Use Cases:**
- Product image gallery
- Receipt image preview
- Invoice attachments

---

### 8.3 Upload

**Import:**
```typescript
import { Upload } from '@ng-mf/components';
```

**Features:**
- File upload component
- Drag-and-drop support
- Progress indicator
- Multiple files

**Electric Store Use Cases:**
- Product images
- Bulk import (CSV)
- Document uploads
- Invoice attachments

---

### 8.4 ComparisonSlider

**Import:**
```typescript
import { ComparisonSlider } from '@ng-mf/components';
```

**Features:**
- Before/after image slider
- Customizable handle

**Electric Store Use Cases:**
- Product condition before/after
- Store layout changes
- Inventory photos

---

### 8.5 ThumbnailMaker

**Import:**
```typescript
import { ThumbnailMaker } from '@ng-mf/components';
```

**Features:**
- Thumbnail generation
- Aspect ratio control

**Electric Store Use Cases:**
- Product thumbnails
- Image optimization
- Gallery previews

---

## 9. Design System Components

### 9.1 ColorPicker

**Import:**
```typescript
import { ColorPicker } from '@ng-mf/components';
```

**Features:**
- Color selection component
- Hex/RGB support
- Palette support

**Electric Store Use Cases:**
- Theme customization
- Branding colors
- Category colors

---

### 9.2 ColorScheme

**Import:**
```typescript
import { ColorScheme, ColorSchemeStore } from '@ng-mf/components';
```

**Features:**
- Theme color scheme switcher
- Light/dark mode
- Persistent selection

**Electric Store Use Cases:**
- Theme switching
- User preferences
- Branch-specific themes

---

### 9.3 BrandColors

**Import:**
```typescript
import { BrandColors } from '@ng-mf/components';
```

**Features:**
- Color palette management
- Brand color display

**Electric Store Use Cases:**
- Company branding
- Custom themes
- Marketing materials

---

### 9.4 Divider

**Import:**
```typescript
import { Divider, VerticalDivider } from '@ng-mf/components';
```

**Features:**
- Visual dividers
- Horizontal/vertical
- Text support

**Electric Store Use Cases:**
- Section separators
- Menu dividers
- Form section breaks

---

### 9.5 Icon

**Import:**
```typescript
import { Icon } from '@ng-mf/components';
```

**Features:**
- Icon wrapper component
- Material icons support
- Custom SVG support

**Electric Store Use Cases:**
- Navigation icons
- Action buttons
- Status indicators

---

### 9.6 Logo

**Import:**
```typescript
import { Logo } from '@ng-mf/components';
```

**Features:**
- Logo display component
- Responsive sizing
- Theme variants

**Electric Store Use Cases:**
- App header
- Login screen
- Receipts
- Invoices

---

### 9.7 Overlay

**Import:**
```typescript
import { Overlay } from '@ng-mf/components';
```

**Features:**
- Overlay component
- Custom backdrop
- Z-index management

**Electric Store Use Cases:**
- Modal backdrops
- Loading overlays
- Menu overlays

---

### 9.8 OverlayScrollbar

**Import:**
```typescript
import { OverlayScrollbar } from '@ng-mf/components';
```

**Features:**
- Custom styled scrollbars
- Smooth scrolling
- Theme support

**Electric Store Use Cases:**
- Product lists
- Long forms
- Data tables

---

### 9.9 Expand

**Import:**
```typescript
import { Expand } from '@ng-mf/components';
```

**Features:**
- Expandable content
- Smooth animations
- Toggle control

**Electric Store Use Cases:**
- Product details
- FAQ sections
- Settings groups

---

### 9.10 ContentFade

**Import:**
```typescript
import { ContentFade } from '@ng-mf/components';
```

**Features:**
- Fade effects for content
- Show more/less functionality

**Electric Store Use Cases:**
- Long product descriptions
- Review truncation
- Content previews

---

### 9.11 CardOverlay

**Import:**
```typescript
import { CardOverlay } from '@ng-mf/components';
```

**Features:**
- Overlay effects for cards
- Hover states

**Electric Store Use Cases:**
- Product cards
- Category cards
- Feature cards

---

## 10. Business Components

### 10.1 InvoiceBuilder

**Import:**
```typescript
import { InvoiceBuilder } from '@ng-mf/components';
```

**Features:**
- Complete invoice creation interface
- Line items management
- Tax calculation
- Customer selection
- PDF export ready

**Electric Store Use Cases:**
- Receipt generation in POS
- Quotation builder (adapt)
- Invoice creation
- Order confirmations

**Customization for Electric Store:**
- Rename to "Receipt Builder" for POS
- Fork as "Quotation Builder" for quotes
- Add barcode scanning integration
- Add payment method selection

---

### 10.2 FilterBuilder

**Import:**
```typescript
import { FilterBuilder } from '@ng-mf/components';
```

**Features:**
- Visual query builder
- Multiple data types support
- Logical operators (AND/OR)
- Filter operations per field
- Lookup data sources

**Electric Store Use Cases:**
- Advanced product search
- Inventory filtering
- Sales report filters
- Customer search
- Multi-criteria search

---

### 10.3 KanbanBoard

**Import:**
```typescript
import { KanbanBoard, KanbanColumn, KanbanItem } from '@ng-mf/components';
```

**Features:**
- Drag-and-drop columns
- Item transfer events
- Custom item templates
- Status management

**Electric Store Use Cases:**
- Order status tracking (New → Processing → Shipped → Delivered)
- Inventory workflow (To Order → Ordered → Received → Stocked)
- Task management
- Quotation pipeline

---

### 10.4 Notes

**Import:**
```typescript
import { Notes } from '@ng-mf/components';
```

**Features:**
- Note-taking functionality
- Rich text support
- Attachments

**Electric Store Use Cases:**
- Order notes
- Customer remarks
- Product notes
- Internal communications

---

### 10.5 CourseBuilder

**Import:**
```typescript
import { CourseBuilder } from '@ng-mf/components';
```

**Features:**
- Course/lesson builder
- Step-by-step content

**Electric Store Use Cases:**
- Staff training modules
- Setup wizards
- Onboarding flows

---

## 11. Utility Components

### 11.1 PageLoadingBar

**Import:**
```typescript
import { PageLoadingBar } from '@ng-mf/components';
```

**Features:**
- Top progress bar
- Route change indicator

**Electric Store Use Cases:**
- Route navigation feedback
- Page loading indicator

---

### 11.2 ScrollSpy

**Import:**
```typescript
import { ScrollSpy } from '@ng-mf/components';
```

**Features:**
- Scroll position tracking
- Navigation highlighting

**Electric Store Use Cases:**
- Long product descriptions
- Settings page navigation
- Documentation

---

### 11.3 ResizableContainer

**Import:**
```typescript
import { ResizableContainer } from '@ng-mf/components';
```

**Features:**
- Resizable panels
- Split view support

**Electric Store Use Cases:**
- POS split view (products | cart)
- Dashboard layout customization
- Report builder

---

### 11.4 Masonry

**Import:**
```typescript
import { Masonry } from '@ng-mf/components';
```

**Features:**
- Masonry grid layout
- Responsive columns

**Electric Store Use Cases:**
- Product gallery
- Category showcase
- Dashboard widgets

---

### 11.5 Marquee

**Import:**
```typescript
import { Marquee } from '@ng-mf/components';
```

**Features:**
- Scrolling text/content
- Configurable speed

**Electric Store Use Cases:**
- Announcements ticker
- Promotional messages
- Stock alerts

---

### 11.6 EmojiPicker

**Import:**
```typescript
import { EmojiPicker } from '@ng-mf/components';
```

**Features:**
- Emoji selection
- Categories support
- Search functionality

**Electric Store Use Cases:**
- Product reactions
- Customer feedback
- Internal messaging

---

### 11.7 Incidents

**Import:**
```typescript
import { Incidents, IncidentBar, IncidentList } from '@ng-mf/components';
```

**Features:**
- Incident tracking system
- Incident bar/list
- Status management

**Electric Store Use Cases:**
- System alerts
- Error tracking
- Maintenance notices

---

### 11.8 Suggestions

**Import:**
```typescript
import { Suggestions } from '@ng-mf/components';
```

**Features:**
- Auto-suggestion dropdown
- Keyboard navigation

**Electric Store Use Cases:**
- Product search autocomplete
- Customer search
- Tag suggestions

---

### 11.9 Selects

**Import:**
```typescript
import { Selects } from '@ng-mf/components';
```

**Features:**
- Enhanced select components
- Multi-select support
- Search functionality

**Electric Store Use Cases:**
- Category selection
- Multi-product selection
- Filter selections

---

## Component Usage Summary

### High Priority for Electric Store POS

1. **DataView / Datatable** - Product lists, inventory tables
2. **Panel** - Cart, summary panels
3. **Drawer** - Payment drawer, details drawer
4. **NumberInput** - Quantities, prices
5. **InvoiceBuilder** - Receipt/quotation builder
6. **FilterBuilder** - Advanced product search
7. **Confirm** - Transaction confirmations
8. **BlockState** - Empty states
9. **Charts** - Sales analytics
10. **Segmented** - Filters, time periods

### Medium Priority

1. **FormRenderer** - Dynamic forms
2. **ImageResizer/Viewer** - Product images
3. **Notifications** - System alerts
4. **Sidebar/Layout** - App structure
5. **Navigation** - Menu system
6. **Alert** - User feedback
7. **Skeleton** - Loading states
8. **Upload** - File uploads
9. **Timeline** - History views
10. **KanbanBoard** - Workflow management

### Nice to Have

1. **EmojiPicker** - Reactions
2. **Marquee** - Announcements
3. **Masonry** - Galleries
4. **CodeHighlighter** - Documentation
5. **ColorPicker** - Theming
6. **ResizableContainer** - Custom layouts
7. **ScrollSpy** - Long pages
8. **Comparison Slider** - Before/after
9. **Carousel** - Showcases
10. **CourseBuilder** - Training

---

**Total Components:** 70+
**Categories:** 11
**Technology:** Angular 20.3+, Material 3, Tailwind CSS 4
**Architecture:** Standalone components
**Last Updated:** 2025-12-02
