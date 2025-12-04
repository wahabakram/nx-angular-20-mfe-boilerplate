export interface Category {
  id: number;
  name: string;
  code: string;
  description?: string;
  parentId?: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCategoryDto {
  name: string;
  code: string;
  description?: string;
  parentId?: number;
  isActive: boolean;
}

export interface UpdateCategoryDto extends Partial<CreateCategoryDto> {
  id: number;
}
