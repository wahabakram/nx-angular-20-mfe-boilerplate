export interface DashboardMetrics {
  totalInvoices: number;
  paidInvoices: number;
  unpaidInvoices: number;
  overdueInvoices: number;
  draftInvoices: number;
  totalRevenue: number;
  paidRevenue: number;
  pendingRevenue: number;
  overdueRevenue: number;
  totalClients: number;
  activeClients: number;
  totalPayments: number;
  recentInvoices?: RecentInvoice[];
  recentPayments?: RecentPayment[];
}

export interface RecentInvoice {
  id: number;
  invoiceNumber: string;
  clientName: string;
  total: number;
  status: string;
  dueDate: string;
}

export interface RecentPayment {
  id: number;
  invoiceNumber: string;
  amount: number;
  paymentDate: string;
  paymentMethod: string;
}

export interface FinancialReport {
  period: string;
  totalRevenue: number;
  paidRevenue: number;
  pendingRevenue: number;
  totalExpenses: number;
  netIncome: number;
  invoicesByStatus: Record<string, number>;
  revenueByMonth: MonthlyRevenue[];
}

export interface MonthlyRevenue {
  month: string;
  revenue: number;
  invoices: number;
}

export interface RevenueReport {
  period: string;
  totalRevenue: number;
  revenueByClient: ClientRevenue[];
  revenueByMonth: MonthlyRevenue[];
  revenueByStatus: Record<string, number>;
}

export interface ClientRevenue {
  clientId: number;
  clientName: string;
  totalRevenue: number;
  invoiceCount: number;
  paidAmount: number;
  pendingAmount: number;
}

export interface ExportOptions {
  format: 'pdf' | 'excel' | 'csv';
  reportType: 'financial' | 'revenue' | 'invoices' | 'payments' | 'clients';
  startDate?: string;
  endDate?: string;
  filters?: Record<string, unknown>;
}
