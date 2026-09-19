import { SizeChart } from '../types/charts';

export interface TemplateDefinition {
  id: string;
  nameKey: string;
  category: string;
  defaultUnit: 'cm' | 'in';
  columns: Array<{ id: string; name: string; presetKey: string; isSizeColumn?: boolean }>;
  rows: Array<{ id: string; size: string; values: Record<string, string> }>;
  measurementGuide?: Array<{ id: string; title: string; description: string; imageUrl?: string }>;
  fitFinderConfig?: {
    enabled: boolean;
    askChest?: boolean;
    askWaist?: boolean;
    askHip?: boolean;
    askShoulder?: boolean;
    askHeight?: boolean;
    askWeight?: boolean;
    askFootLength?: boolean;
  };
}

export const TEMPLATES: TemplateDefinition[] = [
  {
    id: 'mens-tops',
    nameKey: 'templates.mensTops',
    category: 'mens',
    defaultUnit: 'cm',
    columns: [
      { id: 'col-size', name: 'Size', presetKey: 'size', isSizeColumn: true },
      { id: 'col-chest', name: 'Chest', presetKey: 'chest' },
      { id: 'col-waist', name: 'Waist', presetKey: 'waist' },
      { id: 'col-shoulder', name: 'Shoulder', presetKey: 'shoulder' },
      { id: 'col-length', name: 'Length', presetKey: 'length' },
    ],
    rows: [
      { id: 'r1', size: 'XS', values: { 'col-chest': '81-86', 'col-waist': '66-71', 'col-shoulder': '42', 'col-length': '66' } },
      { id: 'r2', size: 'S', values: { 'col-chest': '86-91', 'col-waist': '71-76', 'col-shoulder': '44', 'col-length': '68' } },
      { id: 'r3', size: 'M', values: { 'col-chest': '91-97', 'col-waist': '76-81', 'col-shoulder': '46', 'col-length': '70' } },
      { id: 'r4', size: 'L', values: { 'col-chest': '97-102', 'col-waist': '81-86', 'col-shoulder': '48', 'col-length': '72' } },
      { id: 'r5', size: 'XL', values: { 'col-chest': '102-107', 'col-waist': '86-91', 'col-shoulder': '50', 'col-length': '74' } },
      { id: 'r6', size: '2XL', values: { 'col-chest': '107-112', 'col-waist': '91-97', 'col-shoulder': '52', 'col-length': '76' } },
    ],
    measurementGuide: [
      { id: 'm1', title: 'Chest', description: 'Measure around the fullest part of your chest, keeping the tape horizontal.' },
      { id: 'm2', title: 'Waist', description: 'Measure around your natural waistline, where your trousers usually sit.' },
      { id: 'm3', title: 'Shoulder', description: 'Measure across the back from the tip of one shoulder to the other.' },
    ],
    fitFinderConfig: {
      enabled: true,
      askChest: true,
      askWaist: true,
      askShoulder: true,
      askHeight: true,
      askWeight: true,
    },
  },
  {
    id: 'mens-bottoms',
    nameKey: 'templates.mensBottoms',
    category: 'mens',
    defaultUnit: 'cm',
    columns: [
      { id: 'col-size', name: 'Size', presetKey: 'size', isSizeColumn: true },
      { id: 'col-waist', name: 'Waist', presetKey: 'waist' },
      { id: 'col-hip', name: 'Hip', presetKey: 'hip' },
      { id: 'col-inseam', name: 'Inseam', presetKey: 'inseam' },
    ],
    rows: [
      { id: 'r1', size: '28', values: { 'col-waist': '71-74', 'col-hip': '86-89', 'col-inseam': '76' } },
      { id: 'r2', size: '30', values: { 'col-waist': '76-79', 'col-hip': '91-94', 'col-inseam': '78' } },
      { id: 'r3', size: '32', values: { 'col-waist': '81-84', 'col-hip': '96-99', 'col-inseam': '81' } },
      { id: 'r4', size: '34', values: { 'col-waist': '86-89', 'col-hip': '101-104', 'col-inseam': '81' } },
      { id: 'r5', size: '36', values: { 'col-waist': '91-94', 'col-hip': '106-109', 'col-inseam': '83' } },
    ],
    measurementGuide: [
      { id: 'm1', title: 'Waist', description: 'Measure around the narrowest part of your waistline.' },
      { id: 'm2', title: 'Inseam', description: 'Measure from the crotch down to the ankle bone.' },
    ],
    fitFinderConfig: {
      enabled: true,
      askWaist: true,
      askHip: true,
      askHeight: true,
    },
  },
  {
    id: 'womens-tops',
    nameKey: 'templates.womensTops',
    category: 'womens',
    defaultUnit: 'cm',
    columns: [
      { id: 'col-size', name: 'Size', presetKey: 'size', isSizeColumn: true },
      { id: 'col-bust', name: 'Bust', presetKey: 'bust' },
      { id: 'col-waist', name: 'Waist', presetKey: 'waist' },
      { id: 'col-hip', name: 'Hip', presetKey: 'hip' },
      { id: 'col-eu', name: 'EU Size', presetKey: 'eu' },
      { id: 'col-us', name: 'US Size', presetKey: 'us' },
    ],
    rows: [
      { id: 'r1', size: 'XS', values: { 'col-bust': '78-82', 'col-waist': '60-64', 'col-hip': '86-90', 'col-eu': '34', 'col-us': '2' } },
      { id: 'r2', size: 'S', values: { 'col-bust': '83-87', 'col-waist': '65-69', 'col-hip': '91-95', 'col-eu': '36', 'col-us': '4' } },
      { id: 'r3', size: 'M', values: { 'col-bust': '88-92', 'col-waist': '70-74', 'col-hip': '96-100', 'col-eu': '38', 'col-us': '6' } },
      { id: 'r4', size: 'L', values: { 'col-bust': '93-97', 'col-waist': '75-79', 'col-hip': '101-105', 'col-eu': '40', 'col-us': '8' } },
      { id: 'r5', size: 'XL', values: { 'col-bust': '98-103', 'col-waist': '80-85', 'col-hip': '106-110', 'col-eu': '42', 'col-us': '10' } },
    ],
    measurementGuide: [
      { id: 'm1', title: 'Bust', description: 'Measure across the fullest part of your bust.' },
      { id: 'm2', title: 'Waist', description: 'Measure around the natural crease of your waist.' },
      { id: 'm3', title: 'Hips', description: 'Measure around the fullest part of your hips and rear.' },
    ],
    fitFinderConfig: {
      enabled: true,
      askChest: true,
      askWaist: true,
      askHip: true,
    },
  },
  {
    id: 'womens-bottoms',
    nameKey: 'templates.womensBottoms',
    category: 'womens',
    defaultUnit: 'cm',
    columns: [
      { id: 'col-size', name: 'Size', presetKey: 'size', isSizeColumn: true },
      { id: 'col-waist', name: 'Waist', presetKey: 'waist' },
      { id: 'col-hip', name: 'Hip', presetKey: 'hip' },
      { id: 'col-length', name: 'Length', presetKey: 'length' },
    ],
    rows: [
      { id: 'r1', size: 'XS', values: { 'col-waist': '60-64', 'col-hip': '86-90', 'col-length': '96' } },
      { id: 'r2', size: 'S', values: { 'col-waist': '65-69', 'col-hip': '91-95', 'col-length': '98' } },
      { id: 'r3', size: 'M', values: { 'col-waist': '70-74', 'col-hip': '96-100', 'col-length': '100' } },
      { id: 'r4', size: 'L', values: { 'col-waist': '75-79', 'col-hip': '101-105', 'col-length': '102' } },
      { id: 'r5', size: 'XL', values: { 'col-waist': '80-85', 'col-hip': '106-110', 'col-length': '104' } },
    ],
    fitFinderConfig: { enabled: true, askWaist: true, askHip: true },
  },
  {
    id: 'dresses',
    nameKey: 'templates.dresses',
    category: 'womens',
    defaultUnit: 'cm',
    columns: [
      { id: 'col-size', name: 'Size', presetKey: 'size', isSizeColumn: true },
      { id: 'col-bust', name: 'Bust', presetKey: 'bust' },
      { id: 'col-waist', name: 'Waist', presetKey: 'waist' },
      { id: 'col-hip', name: 'Hip', presetKey: 'hip' },
      { id: 'col-length', name: 'Total Length', presetKey: 'length' },
    ],
    rows: [
      { id: 'r1', size: 'S', values: { 'col-bust': '82-86', 'col-waist': '64-68', 'col-hip': '90-94', 'col-length': '110' } },
      { id: 'r2', size: 'M', values: { 'col-bust': '87-91', 'col-waist': '69-73', 'col-hip': '95-99', 'col-length': '112' } },
      { id: 'r3', size: 'L', values: { 'col-bust': '92-96', 'col-waist': '74-78', 'col-hip': '100-104', 'col-length': '114' } },
      { id: 'r4', size: 'XL', values: { 'col-bust': '97-101', 'col-waist': '79-83', 'col-hip': '105-109', 'col-length': '116' } },
    ],
    fitFinderConfig: { enabled: true, askChest: true, askWaist: true, askHip: true },
  },
  {
    id: 'shoes',
    nameKey: 'templates.shoes',
    category: 'footwear',
    defaultUnit: 'cm',
    columns: [
      { id: 'col-eu', name: 'EU Size', presetKey: 'eu', isSizeColumn: true },
      { id: 'col-us', name: 'US Size', presetKey: 'us' },
      { id: 'col-uk', name: 'UK Size', presetKey: 'uk' },
      { id: 'col-foot', name: 'Foot Length', presetKey: 'footLength' },
    ],
    rows: [
      { id: 'r1', size: '36', values: { 'col-us': '5.5', 'col-uk': '3.5', 'col-foot': '22.5' } },
      { id: 'r2', size: '37', values: { 'col-us': '6', 'col-uk': '4', 'col-foot': '23.0' } },
      { id: 'r3', size: '38', values: { 'col-us': '7', 'col-uk': '5', 'col-foot': '24.0' } },
      { id: 'r4', size: '39', values: { 'col-us': '7.5', 'col-uk': '5.5', 'col-foot': '24.5' } },
      { id: 'r5', size: '40', values: { 'col-us': '8.5', 'col-uk': '6.5', 'col-foot': '25.0' } },
      { id: 'r6', size: '41', values: { 'col-us': '9', 'col-uk': '7', 'col-foot': '26.0' } },
      { id: 'r7', size: '42', values: { 'col-us': '10', 'col-uk': '8', 'col-foot': '26.5' } },
      { id: 'r8', size: '43', values: { 'col-us': '10.5', 'col-uk': '8.5', 'col-foot': '27.5' } },
      { id: 'r9', size: '44', values: { 'col-us': '11.5', 'col-uk': '9.5', 'col-foot': '28.0' } },
    ],
    measurementGuide: [
      { id: 'm1', title: 'Foot Length', description: 'Stand straight on a sheet of paper and mark the tip of your longest toe and heel. Measure the distance in cm.' },
    ],
    fitFinderConfig: {
      enabled: true,
      askFootLength: true,
    },
  },
  {
    id: 'children',
    nameKey: 'templates.children',
    category: 'kids',
    defaultUnit: 'cm',
    columns: [
      { id: 'col-size', name: 'Age / Size', presetKey: 'size', isSizeColumn: true },
      { id: 'col-height', name: 'Height', presetKey: 'height' },
      { id: 'col-chest', name: 'Chest', presetKey: 'chest' },
      { id: 'col-waist', name: 'Waist', presetKey: 'waist' },
    ],
    rows: [
      { id: 'r1', size: '3-4 Y', values: { 'col-height': '98-104', 'col-chest': '55-57', 'col-waist': '52-54' } },
      { id: 'r2', size: '5-6 Y', values: { 'col-height': '110-116', 'col-chest': '58-61', 'col-waist': '55-57' } },
      { id: 'r3', size: '7-8 Y', values: { 'col-height': '122-128', 'col-chest': '62-66', 'col-waist': '58-60' } },
      { id: 'r4', size: '9-10 Y', values: { 'col-height': '134-140', 'col-chest': '67-71', 'col-waist': '61-63' } },
    ],
    fitFinderConfig: { enabled: true, askHeight: true, askWeight: true },
  },
  {
    id: 'baby',
    nameKey: 'templates.baby',
    category: 'kids',
    defaultUnit: 'cm',
    columns: [
      { id: 'col-size', name: 'Age Size', presetKey: 'size', isSizeColumn: true },
      { id: 'col-height', name: 'Height', presetKey: 'height' },
      { id: 'col-weight', name: 'Weight (kg)', presetKey: 'weight' },
    ],
    rows: [
      { id: 'r1', size: '0-3 M', values: { 'col-height': '56-62', 'col-weight': '3.5-5.5' } },
      { id: 'r2', size: '3-6 M', values: { 'col-height': '62-68', 'col-weight': '5.5-7.5' } },
      { id: 'r3', size: '6-9 M', values: { 'col-height': '68-74', 'col-weight': '7.5-9.0' } },
      { id: 'r4', size: '9-12 M', values: { 'col-height': '74-80', 'col-weight': '9.0-11.0' } },
      { id: 'r5', size: '12-18 M', values: { 'col-height': '80-86', 'col-weight': '11.0-12.5' } },
    ],
  },
  {
    id: 'bras',
    nameKey: 'templates.bras',
    category: 'lingerie',
    defaultUnit: 'cm',
    columns: [
      { id: 'col-size', name: 'Band / Cup', presetKey: 'size', isSizeColumn: true },
      { id: 'col-underbust', name: 'Underbust', presetKey: 'waist' },
      { id: 'col-overbust', name: 'Overbust', presetKey: 'chest' },
    ],
    rows: [
      { id: 'r1', size: '32A (70A)', values: { 'col-underbust': '68-72', 'col-overbust': '82-84' } },
      { id: 'r2', size: '32B (70B)', values: { 'col-underbust': '68-72', 'col-overbust': '84-86' } },
      { id: 'r3', size: '34A (75A)', values: { 'col-underbust': '73-77', 'col-overbust': '87-89' } },
      { id: 'r4', size: '34B (75B)', values: { 'col-underbust': '73-77', 'col-overbust': '89-91' } },
      { id: 'r5', size: '36B (80B)', values: { 'col-underbust': '78-82', 'col-overbust': '94-96' } },
      { id: 'r6', size: '36C (80C)', values: { 'col-underbust': '78-82', 'col-overbust': '96-98' } },
    ],
  },
  {
    id: 'rings',
    nameKey: 'templates.rings',
    category: 'jewelry',
    defaultUnit: 'cm',
    columns: [
      { id: 'col-size', name: 'Ring Size', presetKey: 'size', isSizeColumn: true },
      { id: 'col-circumference', name: 'Finger Circumference (mm)', presetKey: 'waist' },
      { id: 'col-diameter', name: 'Inside Diameter (mm)', presetKey: 'length' },
    ],
    rows: [
      { id: 'r1', size: '5 (US)', values: { 'col-circumference': '49.3', 'col-diameter': '15.7' } },
      { id: 'r2', size: '6 (US)', values: { 'col-circumference': '51.9', 'col-diameter': '16.5' } },
      { id: 'r3', size: '7 (US)', values: { 'col-circumference': '54.4', 'col-diameter': '17.3' } },
      { id: 'r4', size: '8 (US)', values: { 'col-circumference': '57.0', 'col-diameter': '18.1' } },
      { id: 'r5', size: '9 (US)', values: { 'col-circumference': '59.5', 'col-diameter': '19.0' } },
    ],
  },
  {
    id: 'hats',
    nameKey: 'templates.hats',
    category: 'accessories',
    defaultUnit: 'cm',
    columns: [
      { id: 'col-size', name: 'Size', presetKey: 'size', isSizeColumn: true },
      { id: 'col-head', name: 'Head Circumference', presetKey: 'waist' },
      { id: 'col-us', name: 'US Hat Size', presetKey: 'us' },
    ],
    rows: [
      { id: 'r1', size: 'S', values: { 'col-head': '54-55', 'col-us': '6 3/4' } },
      { id: 'r2', size: 'M', values: { 'col-head': '56-57', 'col-us': '7' } },
      { id: 'r3', size: 'L', values: { 'col-head': '58-59', 'col-us': '7 1/4' } },
      { id: 'r4', size: 'XL', values: { 'col-head': '60-61', 'col-us': '7 1/2' } },
    ],
  },
  {
    id: 'unisex',
    nameKey: 'templates.unisex',
    category: 'unisex',
    defaultUnit: 'cm',
    columns: [
      { id: 'col-size', name: 'Size', presetKey: 'size', isSizeColumn: true },
      { id: 'col-chest', name: 'Chest', presetKey: 'chest' },
      { id: 'col-waist', name: 'Waist', presetKey: 'waist' },
      { id: 'col-hip', name: 'Hip', presetKey: 'hip' },
    ],
    rows: [
      { id: 'r1', size: 'XS', values: { 'col-chest': '80-86', 'col-waist': '64-70', 'col-hip': '84-90' } },
      { id: 'r2', size: 'S', values: { 'col-chest': '86-92', 'col-waist': '70-76', 'col-hip': '90-96' } },
      { id: 'r3', size: 'M', values: { 'col-chest': '92-98', 'col-waist': '76-82', 'col-hip': '96-102' } },
      { id: 'r4', size: 'L', values: { 'col-chest': '98-106', 'col-waist': '82-90', 'col-hip': '102-110' } },
      { id: 'r5', size: 'XL', values: { 'col-chest': '106-114', 'col-waist': '90-98', 'col-hip': '110-118' } },
    ],
  },
  {
    id: 'custom',
    nameKey: 'templates.custom',
    category: 'custom',
    defaultUnit: 'cm',
    columns: [
      { id: 'col-size', name: 'Size', presetKey: 'size', isSizeColumn: true },
      { id: 'col-m1', name: 'Chest', presetKey: 'chest' },
      { id: 'col-m2', name: 'Waist', presetKey: 'waist' },
    ],
    rows: [
      { id: 'r1', size: 'S', values: { 'col-m1': '86-91', 'col-m2': '71-76' } },
      { id: 'r2', size: 'M', values: { 'col-m1': '91-97', 'col-m2': '76-81' } },
      { id: 'r3', size: 'L', values: { 'col-m1': '97-102', 'col-m2': '81-86' } },
    ],
  },
];

export function createChartFromTemplate(templateId: string, customName?: string): Partial<SizeChart> {
  const template = TEMPLATES.find((t) => t.id === templateId) || TEMPLATES[0];
  return {
    name: customName || `New ${template.id} Chart`,
    chartType: template.id,
    defaultUnit: template.defaultUnit,
    columns: JSON.parse(JSON.stringify(template.columns)),
    rows: JSON.parse(JSON.stringify(template.rows)),
    measurementGuide: template.measurementGuide ? JSON.parse(JSON.stringify(template.measurementGuide)) : [],
    fitFinderEnabled: !!template.fitFinderConfig?.enabled,
    fitFinderConfig: template.fitFinderConfig ? { ...template.fitFinderConfig, enabled: !!template.fitFinderConfig.enabled } : { enabled: false },
    templateId: template.id,
    status: 'ACTIVE',
  };
}

