import { z } from 'zod';

export const ChartColumnSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  presetKey: z.string().optional(),
  isSizeColumn: z.boolean().optional(),
});

export const ChartRowSchema = z.object({
  id: z.string().min(1),
  size: z.string().min(1),
  values: z.record(z.string(), z.string()),
});

export const MeasurementInstructionSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  description: z.string(),
  imageUrl: z.string().url().optional().or(z.literal('')),
  visible: z.boolean().optional(),
});

export const FitFinderConfigSchema = z.object({
  enabled: z.boolean(),
  askHeight: z.boolean().optional(),
  askWeight: z.boolean().optional(),
  askChest: z.boolean().optional(),
  askWaist: z.boolean().optional(),
  askHip: z.boolean().optional(),
  askShoulder: z.boolean().optional(),
  askFootLength: z.boolean().optional(),
  askAge: z.boolean().optional(),
  allowFitPreferences: z.boolean().optional(),
  weights: z
    .array(
      z.object({
        measurement: z.enum(['chest', 'waist', 'hip', 'shoulder', 'footLength', 'height', 'weight']),
        weight: z.enum(['high', 'medium', 'low']),
      })
    )
    .optional(),
  aiEnabled: z.boolean().optional(),
  deepseekApiKey: z.string().optional(),
  aiModel: z.enum(['deepseek-chat', 'deepseek-reasoner']).optional(),
  aiCustomInstructions: z.string().optional(),
});

export const SizeChartPayloadSchema = z.object({
  _id: z.string().optional(),
  name: z.string().min(1, 'validation.nameRequired'),
  description: z.string().optional(),
  chartType: z.string().default('custom'),
  defaultUnit: z.enum(['cm', 'in']).default('cm'),
  columns: z.array(ChartColumnSchema).min(1, 'validation.atLeastOneColumn'),
  rows: z.array(ChartRowSchema).min(1, 'validation.atLeastOneRow'),
  measurementGuide: z.array(MeasurementInstructionSchema).optional(),
  fitFinderEnabled: z.boolean().default(false),
  fitFinderConfig: FitFinderConfigSchema.optional(),
  templateId: z.string().optional(),
  status: z.enum(['ACTIVE', 'ARCHIVED']).default('ACTIVE'),
});

export const AssignmentConditionSchema = z.object({
  field: z.enum(['name', 'category', 'sku', 'price']),
  operator: z.enum(['equals', 'contains', 'startsWith', 'endsWith', 'greaterThan', 'lessThan']),
  value: z.string(),
});

export const ChartAssignmentPayloadSchema = z.object({
  _id: z.string().optional(),
  chartId: z.string().min(1, 'validation.chartRequired'),
  assignmentType: z.enum(['all', 'product', 'category', 'rule', 'default']),
  productId: z.string().optional(),
  productIds: z.array(z.string()).optional(),
  categoryId: z.string().optional(),
  categoryIds: z.array(z.string()).optional(),
  conditions: z.array(AssignmentConditionSchema).optional(),
  priority: z.number().default(0),
  active: z.boolean().default(true),
});

export const CalculateFitRequestSchema = z.object({
  chartId: z.string().min(1),
  height: z.number().optional(),
  weight: z.number().optional(),
  chest: z.number().optional(),
  waist: z.number().optional(),
  hip: z.number().optional(),
  shoulder: z.number().optional(),
  footLength: z.number().optional(),
  age: z.number().optional(),
  preference: z.enum(['slim', 'regular', 'relaxed']).optional(),
  unit: z.enum(['cm', 'in']).default('cm'),
  useAi: z.boolean().optional(),
});

export const TestDeepSeekRequestSchema = z.object({
  apiKey: z.string().min(1, 'API key is required'),
  model: z.enum(['deepseek-chat', 'deepseek-reasoner']).default('deepseek-chat'),
});

export const TrackAnalyticsEventSchema = z.object({
  eventType: z.enum([
    'SIZE_GUIDE_OPENED',
    'SIZE_GUIDE_CLOSED',
    'CHART_VIEWED',
    'UNIT_CHANGED',
    'FIT_FINDER_OPENED',
    'FIT_FINDER_STARTED',
    'FIT_FINDER_COMPLETED',
    'SIZE_RECOMMENDED',
  ]),
  productId: z.string().optional(),
  chartId: z.string().optional(),
  size: z.string().optional(),
  unit: z.enum(['cm', 'in']).optional(),
  metadata: z.record(z.string(), z.any()).optional(),
});
