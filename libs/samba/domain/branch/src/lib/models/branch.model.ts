export interface Branch {
  id: number;
  name: string;
  code: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  isMainBranch: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateBranchDto {
  name: string;
  code: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  isMainBranch: boolean;
  isActive: boolean;
}

export interface UpdateBranchDto extends Partial<CreateBranchDto> {
  id: number;
}
