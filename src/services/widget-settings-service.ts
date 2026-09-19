import { WidgetSettings, DEFAULT_WIDGET_SETTINGS } from '../types/settings';

let memorySettings: WidgetSettings = {
  ...DEFAULT_WIDGET_SETTINGS,
  updatedDate: new Date().toISOString(),
};

export async function getWidgetSettings(): Promise<WidgetSettings> {
  return JSON.parse(JSON.stringify(memorySettings));
}

export async function updateWidgetSettings(updates: Partial<WidgetSettings>): Promise<WidgetSettings> {
  memorySettings = {
    ...memorySettings,
    ...updates,
    triggerSettings: {
      ...memorySettings.triggerSettings,
      ...(updates.triggerSettings || {}),
    },
    modalSettings: {
      ...memorySettings.modalSettings,
      ...(updates.modalSettings || {}),
    },
    tableSettings: {
      ...memorySettings.tableSettings,
      ...(updates.tableSettings || {}),
    },
    mobileSettings: {
      ...memorySettings.mobileSettings,
      ...(updates.mobileSettings || {}),
    },
    fitFinderSettings: {
      ...memorySettings.fitFinderSettings,
      ...(updates.fitFinderSettings || {}),
    },
    updatedDate: new Date().toISOString(),
  };

  return memorySettings;
}

