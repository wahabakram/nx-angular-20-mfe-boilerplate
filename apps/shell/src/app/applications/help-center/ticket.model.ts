export interface Ticket {
  subject: string;
  status: {
    type: 'open' | 'inProgress' | 'closed';
    name: string;
  };
  submissionDate: string;
  ticketId: string;
  priority: {
    name: string;
    type: 'high' | 'medium' | 'low'
  };
}
