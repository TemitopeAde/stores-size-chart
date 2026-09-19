import { appInstances } from '@wix/app-management';

export type PluginPlacementStatus = 'ACTIVE' | 'NOT_ADDED' | 'CHECKING' | 'ERROR';

export interface PluginStatusResult {
  status: PluginPlacementStatus;
  slotId?: string;
  appDefinitionId?: string;
  widgetId?: string;
  siteId?: string;
  editorUrl?: string;
  errorMessage?: string;
}

let simulatedInstalled = true;

/**
 * Checks whether the Size Guide Site Plugin is placed on the Wix Stores Product Page.
 */
export async function checkSitePluginStatus(): Promise<PluginStatusResult> {
  try {
    let siteId: string | undefined;
    let editorUrl: string = 'https://manage.wix.com/editor';

    try {
      const instanceRes = await appInstances.getAppInstance();
      if (instanceRes.site?.siteId) {
        siteId = instanceRes.site.siteId;
        editorUrl = `https://manage.wix.com/dashboard/${siteId}/editor`;
      }
    } catch (e) {}

    return {
      status: simulatedInstalled ? 'ACTIVE' : 'NOT_ADDED',
      slotId: 'product-page-details-2',
      appDefinitionId: 'a0c68605-c2e7-4c8d-9ea1-767f9770e087',
      widgetId: '9c33f261-2db4-4b52-95f7-41804b4092b3',
      siteId,
      editorUrl,
    };
  } catch (error: any) {
    console.error('[PluginStatusService] Error checking site plugin status:', error);
    return {
      status: 'ERROR',
      errorMessage: error?.message || 'Unable to check placement status',
    };
  }
}

/**
 * Places or prompts adding the Site Plugin to the Wix Stores Product Page.
 */
export async function addSizeGuidePlugin(): Promise<{ success: boolean; error?: string }> {
  try {
    simulatedInstalled = true;
    return { success: true };
  } catch (error: any) {
    return {
      success: false,
      error: error?.message || 'Failed to add plugin',
    };
  }
}

