export type AssignmentType = 'product' | 'category' | 'rule' | 'default';

export type RuleField = 'name' | 'category' | 'sku' | 'price';
export type RuleOperator = 'equals' | 'contains' | 'startsWith' | 'endsWith' | 'greaterThan' | 'lessThan';

export interface AssignmentCondition {
  field: RuleField;
  operator: RuleOperator;
  value: string;
}

export interface ChartAssignment {
  _id: string;
  chartId: string;
  assignmentType: AssignmentType;
  productId?: string;
  productIds?: string[];
  categoryId?: string;
  categoryIds?: string[];
  conditions?: AssignmentCondition[];
  priority: number; // Higher number = higher priority
  active: boolean;
  createdDate: string;
  updatedDate: string;
}

export interface AssignmentFilter {
  search?: string;
  assignmentType?: AssignmentType | 'all';
  chartId?: string;
  active?: boolean;
  sortBy?: 'priority' | 'updatedDate' | 'createdDate';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

