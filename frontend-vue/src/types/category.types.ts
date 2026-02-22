// Category types
export type CategoryType = 'INCOME' | 'EXPENSE';

export interface Category {
  id: string;
  name: string;
  type: CategoryType;
  userId: string;
}

export interface CreateCategoryDto {
  name: string;
  type: CategoryType;
}
