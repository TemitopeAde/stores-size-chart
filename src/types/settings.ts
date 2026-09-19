import { MeasurementUnit } from './charts';

export type TriggerStyle = 'button' | 'textLink' | 'underlinedLink' | 'iconText';
export type DisplayMode = 'modal' | 'drawer' | 'bottomSheet' | 'inline';

export interface TriggerSettings {
  text: string;
  style: TriggerStyle;
  iconVisible: boolean;
  iconPosition: 'left' | 'right';
  fontSize?: string;
  fontWeight?: string;
  textColor?: string;
  backgroundColor?: string;
  borderColor?: string;
  borderRadius?: string;
  padding?: string;
}

export interface ModalSettings {
  displayMode: DisplayMode;
  maxWidth: string; // e.g., '720px'
  borderRadius: string;
  backgroundColor: string;
  overlayColor: string;
  showCloseButton: boolean;
}

export interface TableSettings {
  fontFamily?: string;
  fontSize?: string;
  headerBackground: string;
  headerTextColor: string;
  rowBackground: string;
  alternateRowBackground: string;
  borderColor: string;
  cellPadding: string;
  highlightBackground: string;
  highlightTextColor: string;
  stickyHeader: boolean;
  stickyFirstColumn: boolean;
}

export interface MobileSettings {
  mobileDisplayMode: DisplayMode;
  fontSizeAdjustment: string;
  fullWidthTrigger: boolean;
  enableSwipeToClose: boolean;
}

export interface FitFinderSettings {
  accentColor: string;
  buttonColor: string;
  buttonTextColor: string;
  cardBackground: string;
  showProgressIndicator: boolean;
}

export interface WidgetSettings {
  _id?: string;
  instanceId?: string;
  defaultUnit: MeasurementUnit;
  displayMode: DisplayMode;
  syncWithSiteTheme: boolean;
  triggerSettings: TriggerSettings;
  modalSettings: ModalSettings;
  tableSettings: TableSettings;
  mobileSettings: MobileSettings;
  fitFinderSettings: FitFinderSettings;
  updatedDate?: string;
}

export const DEFAULT_WIDGET_SETTINGS: WidgetSettings = {
  defaultUnit: 'cm',
  displayMode: 'modal',
  syncWithSiteTheme: true,
  triggerSettings: {
    text: '📏 Size Guide',
    style: 'button',
    iconVisible: true,
    iconPosition: 'left',
    fontSize: '14px',
    fontWeight: '500',
    textColor: '#1e293b',
    backgroundColor: '#f1f5f9',
    borderColor: '#cbd5e1',
    borderRadius: '6px',
    padding: '8px 16px',
  },
  modalSettings: {
    displayMode: 'modal',
    maxWidth: '720px',
    borderRadius: '12px',
    backgroundColor: '#ffffff',
    overlayColor: 'rgba(0, 0, 0, 0.5)',
    showCloseButton: true,
  },
  tableSettings: {
    fontFamily: 'inherit',
    fontSize: '14px',
    headerBackground: '#f8fafc',
    headerTextColor: '#0f172a',
    rowBackground: '#ffffff',
    alternateRowBackground: '#f8fafc',
    borderColor: '#e2e8f0',
    cellPadding: '12px 16px',
    highlightBackground: '#eff6ff',
    highlightTextColor: '#1d4ed8',
    stickyHeader: true,
    stickyFirstColumn: true,
  },
  mobileSettings: {
    mobileDisplayMode: 'bottomSheet',
    fontSizeAdjustment: '13px',
    fullWidthTrigger: false,
    enableSwipeToClose: true,
  },
  fitFinderSettings: {
    accentColor: '#2563eb',
    buttonColor: '#2563eb',
    buttonTextColor: '#ffffff',
    cardBackground: '#f0f9ff',
    showProgressIndicator: true,
  },
};

