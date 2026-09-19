export type MeasurementUnit = 'cm' | 'in';

export interface ChartColumn {
  id: string;
  name: string; // Key in row values or custom label
  presetKey?: string; // e.g., 'size', 'chest', 'waist', 'hip'
  isSizeColumn?: boolean;
}

export interface ChartRow {
  id: string;
  size: string; // The primary size label: 'S', 'M', 'L', 'XL', etc.
  values: Record<string, string>; // Column id -> measurement string (e.g. "91-97" or "68")
}

export interface MeasurementInstruction {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  visible?: boolean;
}

export interface FitFinderMeasurementWeight {
  measurement: 'chest' | 'waist' | 'hip' | 'shoulder' | 'footLength' | 'height' | 'weight';
  weight: 'high' | 'medium' | 'low';
}

export interface FitFinderConfig {
  enabled: boolean;
  askHeight?: boolean;
  askWeight?: boolean;
  askChest?: boolean;
  askWaist?: boolean;
  askHip?: boolean;
  askShoulder?: boolean;
  askFootLength?: boolean;
  askAge?: boolean;
  allowFitPreferences?: boolean; // Slim, Regular, Relaxed
  weights?: FitFinderMeasurementWeight[];
  aiEnabled?: boolean;
  deepseekApiKey?: string;
  aiModel?: 'deepseek-chat' | 'deepseek-reasoner';
  aiCustomInstructions?: string;
}

export interface SizeChart {
  _id: string;
  name: string;
  description?: string;
  chartType: string; // 'mens-tops', 'womens-bottoms', 'shoes', 'custom', etc.
  defaultUnit: MeasurementUnit;
  columns: ChartColumn[];
  rows: ChartRow[];
  measurementGuide?: MeasurementInstruction[];
  fitFinderEnabled: boolean;
  fitFinderConfig?: FitFinderConfig;
  templateId?: string;
  status: 'ACTIVE' | 'ARCHIVED';
  createdDate: string;
  updatedDate: string;
}

export interface SizeChartFilter {
  search?: string;
  chartType?: string;
  status?: 'ACTIVE' | 'ARCHIVED' | 'ALL';
  sortBy?: 'name' | 'updatedDate' | 'createdDate';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  totalCount: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

