import React, { useEffect, useState, useCallback } from 'react';
import {
  WixDesignSystemProvider,
  SidePanel,
  FormField,
  Input,
  Dropdown,
  ToggleSwitch,
  Heading,
  Text,
  Divider,
  Tabs,
} from '@wix/design-system';
import '@wix/design-system/styles.global.css';
import { widget } from '@wix/editor';
import { WidgetSettings, DEFAULT_WIDGET_SETTINGS, TriggerStyle, DisplayMode } from '../../../types/settings';
import { MeasurementUnit } from '../../../types/charts';
import { updateWidgetSettings, getWidgetSettings } from '../../../api/dashboard-client';

export const SizeChartSettingsPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'display' | 'appearance' | 'fitFinder'>('display');
  const [settings, setSettings] = useState<WidgetSettings>(DEFAULT_WIDGET_SETTINGS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function initSettings() {
      try {
        let initialSettings = { ...DEFAULT_WIDGET_SETTINGS };
        if (widget && typeof widget.getProp === 'function') {
          const storedButtonText = await widget.getProp('trigger-text');
          const storedColor = await widget.getProp('accent-color');
          const storedDisplayMode = await widget.getProp('display-mode');
          const storedDefaultUnit = await widget.getProp('default-unit');
          
          if (storedButtonText) {
            initialSettings.triggerSettings = { ...initialSettings.triggerSettings, text: storedButtonText };
          }
          if (storedColor) {
            initialSettings.fitFinderSettings = { ...initialSettings.fitFinderSettings, accentColor: storedColor };
          }
          if (storedDisplayMode) {
            initialSettings.displayMode = storedDisplayMode as DisplayMode;
          }
          if (storedDefaultUnit) {
            initialSettings.defaultUnit = storedDefaultUnit as MeasurementUnit;
          }
        }

        try {
          const apiSettings = await getWidgetSettings();
          if (apiSettings) {
            initialSettings = { ...initialSettings, ...apiSettings };
          }
        } catch {}

        setSettings(initialSettings);
      } catch (err) {
        console.error('Failed to load widget settings:', err);
      } finally {
        setLoading(false);
      }
    }

    initSettings();
  }, []);

  const handleUpdate = async (patch: Partial<WidgetSettings>) => {
    const updated = { ...settings, ...patch };
    setSettings(updated);

    try {
      if (widget && typeof widget.setProp === 'function') {
        if (patch.triggerSettings?.text) await widget.setProp('trigger-text', patch.triggerSettings.text);
        if (patch.triggerSettings?.style) await widget.setProp('trigger-style', patch.triggerSettings.style);
        if (patch.fitFinderSettings?.accentColor) await widget.setProp('accent-color', patch.fitFinderSettings.accentColor);
        if (patch.displayMode) await widget.setProp('display-mode', patch.displayMode);
        if (patch.defaultUnit) await widget.setProp('default-unit', patch.defaultUnit);
      }
    } catch (err) {
      console.warn('Widget setProp warning:', err);
    }

    try {
      await updateWidgetSettings(patch);
    } catch (err) {
      console.warn('API updateWidgetSettings warning:', err);
    }
  };

  if (loading) {
    return (
      <WixDesignSystemProvider>
        <SidePanel width="320" height="100vh">
          <SidePanel.Content noPadding stretchVertically>
            <div style={{ padding: '24px', textAlign: 'center' }}>
              <Text size="medium">Loading settings...</Text>
            </div>
          </SidePanel.Content>
        </SidePanel>
      </WixDesignSystemProvider>
    );
  }

  return (
    <WixDesignSystemProvider>
      <SidePanel width="320" height="100vh">
        <SidePanel.Header
          title="Size Chart & Fit Guide"
          subtitle="Customize look and behavior on product pages"
        />
        <SidePanel.Content noPadding stretchVertically>
          <div style={{ padding: '16px' }}>
            <Tabs
              activeId={activeTab}
              onClick={(tab) => setActiveTab(tab.id as 'display' | 'appearance' | 'fitFinder')}
              items={[
                { id: 'display', title: 'Display' },
                { id: 'appearance', title: 'Appearance' },
                { id: 'fitFinder', title: 'Fit Finder' },
              ]}
            />

            <Divider />

            <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {activeTab === 'display' && (
                <>
                  <SidePanel.Field>
                    <FormField label="Display Mode">
                      <Dropdown
                        selectedId={settings.displayMode}
                        onSelect={(opt) => handleUpdate({ displayMode: (opt?.id as DisplayMode) || 'modal' })}
                        options={[
                          { id: 'modal', value: 'Popup Modal (Recommended)' },
                          { id: 'drawer', value: 'Slide-in Drawer' },
                          { id: 'bottomSheet', value: 'Bottom Sheet' },
                          { id: 'inline', value: 'Inline Accordion / Tab' },
                        ]}
                      />
                    </FormField>
                  </SidePanel.Field>

                  <SidePanel.Field>
                    <FormField label="Button / Link Text">
                      <Input
                        value={settings.triggerSettings?.text || '📏 Size Guide'}
                        onChange={(e) => handleUpdate({
                          triggerSettings: {
                            ...settings.triggerSettings,
                            text: e.target.value,
                          },
                        })}
                        placeholder="Size Guide"
                      />
                    </FormField>
                  </SidePanel.Field>

                  <SidePanel.Field>
                    <FormField label="Button Style">
                      <Dropdown
                        selectedId={settings.triggerSettings?.style || 'button'}
                        onSelect={(opt) => handleUpdate({
                          triggerSettings: {
                            ...settings.triggerSettings,
                            style: (opt?.id as TriggerStyle) || 'button',
                          },
                        })}
                        options={[
                          { id: 'button', value: 'Solid Button' },
                          { id: 'textLink', value: 'Text Link' },
                          { id: 'underlinedLink', value: 'Underlined Link' },
                          { id: 'iconText', value: 'Icon + Text' },
                        ]}
                      />
                    </FormField>
                  </SidePanel.Field>

                  <SidePanel.Field>
                    <FormField label="Default Measurement Unit">
                      <Dropdown
                        selectedId={settings.defaultUnit}
                        onSelect={(opt) => handleUpdate({ defaultUnit: (opt?.id as MeasurementUnit) || 'cm' })}
                        options={[
                          { id: 'cm', value: 'Centimeters (CM)' },
                          { id: 'in', value: 'Inches (IN)' },
                        ]}
                      />
                    </FormField>
                  </SidePanel.Field>
                </>
              )}

              {activeTab === 'appearance' && (
                <>
                  <SidePanel.Field>
                    <FormField label="Brand / Button Accent Color">
                      <Input
                        value={settings.fitFinderSettings?.accentColor || '#2563eb'}
                        onChange={(e) => handleUpdate({
                          fitFinderSettings: {
                            ...settings.fitFinderSettings,
                            accentColor: e.target.value,
                            buttonColor: e.target.value,
                          },
                        })}
                      />
                    </FormField>
                  </SidePanel.Field>

                  <SidePanel.Field>
                    <FormField label="Table Header Background">
                      <Input
                        value={settings.tableSettings?.headerBackground || '#f8fafc'}
                        onChange={(e) => handleUpdate({
                          tableSettings: {
                            ...settings.tableSettings,
                            headerBackground: e.target.value,
                          },
                        })}
                      />
                    </FormField>
                  </SidePanel.Field>

                  <SidePanel.Field>
                    <FormField label="Border Radius">
                      <Input
                        value={settings.modalSettings?.borderRadius || '12px'}
                        onChange={(e) => handleUpdate({
                          modalSettings: {
                            ...settings.modalSettings,
                            borderRadius: e.target.value,
                          },
                        })}
                      />
                    </FormField>
                  </SidePanel.Field>
                </>
              )}

              {activeTab === 'fitFinder' && (
                <>
                  <SidePanel.Field>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <Text weight="bold" size="small">Show Progress Indicator</Text>
                        <Text size="tiny" secondary>Step indicator in Fit Finder wizard</Text>
                      </div>
                      <ToggleSwitch
                        checked={settings.fitFinderSettings?.showProgressIndicator ?? true}
                        onChange={() => handleUpdate({
                          fitFinderSettings: {
                            ...settings.fitFinderSettings,
                            showProgressIndicator: !settings.fitFinderSettings?.showProgressIndicator,
                          },
                        })}
                      />
                    </div>
                  </SidePanel.Field>

                  <SidePanel.Field>
                    <FormField label="Fit Finder Card Background">
                      <Input
                        value={settings.fitFinderSettings?.cardBackground || '#f0f9ff'}
                        onChange={(e) => handleUpdate({
                          fitFinderSettings: {
                            ...settings.fitFinderSettings,
                            cardBackground: e.target.value,
                          },
                        })}
                      />
                    </FormField>
                  </SidePanel.Field>
                </>
              )}
            </div>
          </div>
        </SidePanel.Content>
      </SidePanel>
    </WixDesignSystemProvider>
  );
};

export default SizeChartSettingsPanel;
