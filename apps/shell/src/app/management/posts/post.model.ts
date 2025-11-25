// Shared domain interfaces for Posts feature

export interface Topic {
  id: string;
  slug: string;
  name: string;
  logoUrl: string;
  description: string;
  publicationsCount: number;
  followersCount: number;
}

export interface Channel {
  id: string;
  name: string;
  slug?: string;
  avatarUrl?: string;
  description?: string;
}

export interface PublicationStatus {
  type: string; // e.g., 'draft' | 'published'
  // allow extra fields if backend provides them
  [key: string]: any;
}

export interface Publication {
  hash: string;
  title: string;
  content: any;
  author: { id: string | number; name?: string; avatarUrl?: string };
  licenseType: { id: string | number; name?: string; parentId?: string | number };
  channel?: Channel | null;
  metaTitle?: string;
  metaDescription?: string;
  topics: Topic[];
  canonicalUrl?: string | null;
  discussionEnabled: boolean;
  pinned: boolean;
  featuredImageUrl?: string | null;
  updatedAt?: string | Date | null;
  autoposted?: boolean;
  hasChanges?: boolean;
  status?: PublicationStatus | null;
}
