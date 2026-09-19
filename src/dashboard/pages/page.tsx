import React, { useState, useEffect } from 'react';
import '../../styles/globals.css';
import { I18nProvider, useTranslation } from '../../i18n';
import { dashboardApi } from '../../api/dashboard-client';
import { EntitlementInfo } from '../../types/billing';
import { SizeChart } from '../../types/charts';
import { BillingStatusBanner } from '../../components/billing/BillingStatusBanner';
import { OverviewView } from '../../components/dashboard/OverviewView';
import { ChartList } from '../../components/charts/ChartList';
import { ChartEditor } from '../../components/charts/ChartEditor';
import { AssignmentManager } from '../../components/assignments/AssignmentManager';
import { FitFinderConfigurator } from '../../components/fit-finder/FitFinderConfigurator';
import { AnalyticsDashboard } from '../../components/analytics/AnalyticsDashboard';
import { WidgetSettingsView } from '../../components/settings/WidgetSettingsView';
import { LocalizationSettingsView } from '../../components/settings/LocalizationSettingsView';
import { BillingSettingsView } from '../../components/settings/BillingSettingsView';
import { GeneralSettingsView } from '../../components/settings/GeneralSettingsView';
import { DataSettingsView } from '../../components/settings/DataSettingsView';
import { Toaster, toast } from 'sonner';
import {
  LayoutDashboard,
  FileSpreadsheet,
  Layers,
  Sparkles,
  BarChart2,
  Settings,
  Globe2,
  Palette,
  CreditCard,
  Database,
  HelpCircle,
  Menu,
  X,
  ChevronRight,
} from 'lucide-react';

const DashboardContent: React.FC = () => {
  const { t, locale, setLocale, dir } = useTranslation();

  const [activeTab, setActiveTab] = useState('overview');
  const [editingChart, setEditingChart] = useState<SizeChart | null>(null);
  const [isCreatingChart, setIsCreatingChart] = useState(false);
  const [entitlement, setEntitlement] = useState<EntitlementInfo>({
    state: 'TRIAL_ACTIVE',
    isEntitled: true,
    canManageCharts: true,
    canRenderChart: true,
    planTier: 'pro',
    daysRemaining: 14,
    isTrial: true,
    freeTrialAvailable: false,
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    async function loadEntitlement() {
      try {
        const ent = await dashboardApi.getEntitlement();
        setEntitlement(ent);
      } catch (e) {}
    }
    loadEntitlement();
  }, []);

  const handleCreateNewChart = () => {
    setEditingChart(null);
    setIsCreatingChart(true);
    setActiveTab('charts');
  };

  const handleEditChart = (chart: SizeChart) => {
    setEditingChart(chart);
    setIsCreatingChart(false);
    setActiveTab('charts');
  };

  const handleSaveChart = async (chartData: Partial<SizeChart>) => {
    if (editingChart) {
      await dashboardApi.updateChart(editingChart._id, chartData);
    } else {
      await dashboardApi.createChart(chartData);
    }
    setEditingChart(null);
    setIsCreatingChart(false);
  };

  const handleCancelChartEdit = () => {
    setEditingChart(null);
    setIsCreatingChart(false);
  };

  const navItems = [
    { id: 'overview', labelKey: 'navigation.overview', icon: LayoutDashboard },
    { id: 'charts', labelKey: 'navigation.charts', icon: FileSpreadsheet },
    { id: 'assignments', labelKey: 'navigation.assignments', icon: Layers },
    { id: 'fitFinder', labelKey: 'navigation.fitFinder', icon: Sparkles },
    { id: 'analytics', labelKey: 'navigation.analytics', icon: BarChart2 },
  ];

  const settingsItems = [
    { id: 'settings-general', labelKey: 'navigation.general', icon: Settings },
    { id: 'settings-widget', labelKey: 'navigation.widget', icon: Palette },
    { id: 'settings-localization', labelKey: 'navigation.localization', icon: Globe2 },
    { id: 'settings-billing', labelKey: 'navigation.billing', icon: CreditCard },
    { id: 'settings-data', labelKey: 'navigation.data', icon: Database },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col antialiased" dir={dir}>
      {/* Central Toaster */}
      <Toaster position="top-right" richColors />

      {/* Top Billing Alert Banner */}
      <BillingStatusBanner
        entitlement={entitlement}
        onUpgradeClick={() => setActiveTab('settings-billing')}
        onRefresh={async () => {
          const ent = await dashboardApi.getEntitlement();
          setEntitlement(ent);
        }}
      />

      {/* Main Layout: Sidebar + Content */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between p-4 border-b border-border bg-card">
          <div className="flex items-center gap-2">
            <span className="text-lg">📏</span>
            <span className="font-bold text-sm">{t('overview.title')}</span>
          </div>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded-md hover:bg-muted text-foreground"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Sidebar */}
        <aside
          className={`w-full md:w-64 border-r border-border bg-card/60 shrink-0 p-4 space-y-6 md:block ${
            mobileMenuOpen ? 'block' : 'hidden'
          }`}
        >
          {/* Brand Header */}
          <div className="hidden md:flex items-center gap-2.5 px-2 py-1">
            <div className="p-1.5 rounded-lg bg-primary/10 text-primary font-bold">
              📏
            </div>
            <div>
              <h1 className="font-bold text-sm leading-tight text-foreground">Stores Size Chart</h1>
              <span className="text-[11px] text-muted-foreground font-medium">&amp; Fit Guide</span>
            </div>
          </div>

          {/* Primary Navigation */}
          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setEditingChart(null);
                    setIsCreatingChart(false);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-primary text-primary-foreground font-semibold shadow-xs'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span>{t(item.labelKey)}</span>
                </button>
              );
            })}
          </div>

          {/* Settings Sub-Navigation */}
          <div className="space-y-1 pt-2 border-t border-border">
            <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              {t('navigation.settings')}
            </span>
            {settingsItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setEditingChart(null);
                    setIsCreatingChart(false);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-primary/10 text-primary font-semibold'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5 shrink-0" />
                  <span>{t(item.labelKey)}</span>
                </button>
              );
            })}
          </div>

          {/* Plan badge footer */}
          <div className="pt-4 border-t border-border px-2">
            <div className="p-2.5 rounded-lg border border-border bg-muted/30 text-xs">
              <span className="text-[10px] text-muted-foreground block">{t('navigation.currentPlan')}</span>
              <span className="font-bold text-foreground">
                {entitlement.planTier === 'pro' ? 'Pro Plan' : 'Starter Plan'}
              </span>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-4 md:p-8 max-w-7xl overflow-y-auto">
          {activeTab === 'overview' && (
            <OverviewView
              onNavigate={(tab) => setActiveTab(tab)}
              onCreateChart={handleCreateNewChart}
            />
          )}

          {activeTab === 'charts' && (
            <div>
              {isCreatingChart || editingChart ? (
                <ChartEditor
                  initialChart={editingChart}
                  onSave={handleSaveChart}
                  onCancel={handleCancelChartEdit}
                />
              ) : (
                <ChartList
                  onCreateClick={handleCreateNewChart}
                  onEditClick={handleEditChart}
                />
              )}
            </div>
          )}

          {activeTab === 'assignments' && <AssignmentManager />}
          {activeTab === 'fitFinder' && <FitFinderConfigurator />}
          {activeTab === 'analytics' && <AnalyticsDashboard />}
          {activeTab === 'settings-general' && <GeneralSettingsView />}
          {activeTab === 'settings-widget' && <WidgetSettingsView />}
          {activeTab === 'settings-localization' && <LocalizationSettingsView />}
          {activeTab === 'settings-billing' && (
            <BillingSettingsView
              entitlement={entitlement}
              onUpgradeClick={() => toast.info('Redirecting to Wix App Market checkout...')}
            />
          )}
          {activeTab === 'settings-data' && <DataSettingsView />}
        </main>
      </div>
    </div>
  );
};

export default function DashboardPage() {
  return (
    <I18nProvider>
      <DashboardContent />
    </I18nProvider>
  );
}

