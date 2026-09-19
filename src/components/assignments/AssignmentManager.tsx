import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from '../../i18n';
import { ChartAssignment, AssignmentType, AssignmentCondition } from '../../types/assignments';
import { SizeChart, PaginatedResponse } from '../../types/charts';
import { WixProductSummary, WixCategorySummary } from '../../types/products';
import { dashboardApi } from '../../api/dashboard-client';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';
import {
  Plus,
  Trash2,
  Tag,
  FolderTree,
  Sliders,
  CheckCircle,
  HelpCircle,
  Search,
  ChevronLeft,
  ChevronRight,
  Layers,
  Globe,
} from 'lucide-react';
import { toast } from 'sonner';

export const AssignmentManager: React.FC = () => {
  const { t, formatDate } = useTranslation();

  const [data, setData] = useState<PaginatedResponse<ChartAssignment>>({
    items: [],
    totalCount: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
    hasNext: false,
    hasPrev: false,
  });
  const [charts, setCharts] = useState<SizeChart[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  // New assignment modal
  const [showModal, setShowModal] = useState(false);
  const [selectedChartId, setSelectedChartId] = useState('');
  const [assignmentType, setAssignmentType] = useState<AssignmentType>('all');
  const [priority, setPriority] = useState(10);

  // Wix Stores Catalog state
  const [products, setProducts] = useState<WixProductSummary[]>([]);
  const [categories, setCategories] = useState<WixCategorySummary[]>([]);
  const [productSearch, setProductSearch] = useState('');
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);

  // Advanced Rule conditions
  const [conditions, setConditions] = useState<AssignmentCondition[]>([
    { field: 'name', operator: 'contains', value: '' },
  ]);

  const fetchAssignments = useCallback(async () => {
    setLoading(true);
    try {
      const [res, chartsRes] = await Promise.all([
        dashboardApi.getAssignments({ page, limit: 10 }),
        dashboardApi.getCharts({ limit: 100 }),
      ]);
      setData(res);
      setCharts(chartsRes.items);
      if (chartsRes.items.length > 0 && !selectedChartId) {
        setSelectedChartId(chartsRes.items[0]._id);
      }
    } catch (err: any) {
      toast.error(err.message || t('errors.loadFailed'));
    } finally {
      setLoading(false);
    }
  }, [page, selectedChartId, t]);

  useEffect(() => {
    fetchAssignments();
  }, [fetchAssignments]);

  // Fetch catalog when opening modal
  const handleOpenModal = async () => {
    setShowModal(true);
    try {
      const [prodRes, catRes] = await Promise.all([
        dashboardApi.getProducts({ search: productSearch || undefined, limit: 50 }),
        dashboardApi.getCategories(),
      ]);
      setProducts(prodRes.products);
      setCategories(catRes);
    } catch (e) {}
  };

  // Search products inside modal
  const handleProductSearch = async (query: string) => {
    setProductSearch(query);
    try {
      const res = await dashboardApi.getProducts({ search: query.trim() || undefined, limit: 50 });
      setProducts(res.products);
    } catch {}
  };

  const handleCreateAssignment = async () => {
    if (!selectedChartId) {
      toast.error(t('validation.chartRequired'));
      return;
    }

    try {
      await dashboardApi.createAssignment({
        chartId: selectedChartId,
        assignmentType,
        productIds: assignmentType === 'product' ? selectedProductIds : undefined,
        categoryIds: assignmentType === 'category' ? selectedCategoryIds : undefined,
        conditions: assignmentType === 'rule' ? conditions.filter((c) => c.value.trim().length > 0) : undefined,
        priority: assignmentType === 'all' ? (priority || 5) : priority,
        active: true,
      });

      toast.success(t('notifications.assignmentSaved'));
      setShowModal(false);
      setSelectedProductIds([]);
      setSelectedCategoryIds([]);
      fetchAssignments();
    } catch (err: any) {
      toast.error(err.message || t('errors.generalError'));
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await dashboardApi.deleteAssignment(id);
      toast.success(t('notifications.assignmentDeleted'));
      fetchAssignments();
    } catch (err: any) {
      toast.error(err.message || t('errors.generalError'));
    }
  };

  const getChartName = (chartId: string) => {
    return charts.find((c) => c._id === chartId)?.name || chartId;
  };

  return (
    <div className="space-y-4">
      {/* Priority Information Notice */}
      <div className="p-3.5 rounded-lg border border-blue-200 bg-blue-50/70 dark:bg-blue-950/30 dark:border-blue-900/50 text-xs text-blue-900 dark:text-blue-200 flex items-start gap-2.5">
        <HelpCircle className="h-4 w-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold">{t('assignments.ruleBuilderTitle')}</p>
          <p className="mt-0.5">{t('assignments.priorityNotice')}</p>
        </div>
      </div>

      {/* Header & Create Action */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-lg text-foreground">{t('assignments.title')}</h3>
          <p className="text-xs text-muted-foreground">{t('assignments.subtitle')}</p>
        </div>
        <Button size="sm" onClick={handleOpenModal} className="h-9 gap-1.5 text-xs">
          <Plus className="h-4 w-4" />
          {t('assignments.createAssignment')}
        </Button>
      </div>

      {/* Assignments List */}
      <Card>
        <CardContent className="p-0 overflow-x-auto">
          {loading ? (
            <div className="p-12 text-center text-sm text-muted-foreground">
              <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent mb-2" />
              <p>{t('common.loading')}</p>
            </div>
          ) : data.items.length === 0 ? (
            <div className="p-12 text-center">
              <Layers className="h-10 w-10 text-muted-foreground mx-auto mb-3 opacity-40" />
              <h4 className="font-semibold text-foreground">{t('assignments.emptyTitle')}</h4>
              <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
                {t('assignments.emptyDescription')}
              </p>
              <Button size="sm" onClick={handleOpenModal} className="mt-4 gap-1.5 text-xs">
                <Plus className="h-4 w-4" />
                {t('assignments.createAssignment')}
              </Button>
            </div>
          ) : (
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-muted/50 border-b border-border text-left">
                  <th className="p-3.5 font-semibold text-xs text-muted-foreground">{t('assignments.selectChart')}</th>
                  <th className="p-3.5 font-semibold text-xs text-muted-foreground">{t('assignments.assignmentType')}</th>
                  <th className="p-3.5 font-semibold text-xs text-muted-foreground">{t('assignments.targetDetails')}</th>
                  <th className="p-3.5 font-semibold text-xs text-muted-foreground">{t('assignments.priority')}</th>
                  <th className="p-3.5 font-semibold text-xs text-muted-foreground">{t('common.status')}</th>
                  <th className="p-3.5 font-semibold text-xs text-muted-foreground text-right">{t('common.actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {data.items.map((assign) => (
                  <tr key={assign._id} className="hover:bg-muted/30 transition-colors">
                    <td className="p-3.5 font-semibold text-foreground text-sm">
                      {getChartName(assign.chartId)}
                    </td>
                    <td className="p-3.5">
                      <Badge variant="outline" className="text-[10px] capitalize">
                        {assign.assignmentType === 'all' && (
                          <span className="flex items-center gap-1">
                            <Globe className="h-3 w-3 text-primary" />
                            {t('assignments.allProducts')}
                          </span>
                        )}
                        {assign.assignmentType === 'product' && t('assignments.productSpecific')}
                        {assign.assignmentType === 'category' && t('assignments.categorySpecific')}
                        {assign.assignmentType === 'rule' && t('assignments.advancedRule')}
                        {assign.assignmentType === 'default' && t('assignments.defaultFallback')}
                      </Badge>
                    </td>
                    <td className="p-3.5 text-xs text-muted-foreground">
                      {assign.assignmentType === 'all' && (
                        <span className="font-medium text-foreground">{t('assignments.allStoreProducts')}</span>
                      )}
                      {assign.assignmentType === 'product' && (
                        <span>{assign.productIds?.length ? t('common.productsCount', { count: assign.productIds.length }) : t('common.productsCount', { count: 1 })}</span>
                      )}
                      {assign.assignmentType === 'category' && (
                        <span>{assign.categoryId || (assign.categoryIds?.join(', ') || 'Category')}</span>
                      )}
                      {assign.assignmentType === 'rule' && (
                        <span>
                          {assign.conditions?.map((c) => `IF ${c.field} ${c.operator} "${c.value}"`).join(' AND ')}
                        </span>
                      )}
                      {assign.assignmentType === 'default' && (
                        <span className="italic">{t('assignments.defaultFallbackDesc')}</span>
                      )}
                    </td>
                    <td className="p-3.5 font-mono text-xs">{assign.priority}</td>
                    <td className="p-3.5">
                      <Badge variant={assign.active ? 'success' : 'secondary'} className="text-[10px]">
                        {assign.active ? t('common.active') : t('common.inactive')}
                      </Badge>
                    </td>
                    <td className="p-3.5 text-right">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(assign._id)}
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                        title={t('common.delete')}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* Pagination */}
          {data.totalPages > 1 && (
            <div className="flex items-center justify-between p-3 border-t border-border bg-muted/20 text-xs text-muted-foreground">
              <span>{t('common.items', { count: data.totalCount })}</span>
              <div className="flex items-center gap-1.5">
                <Button
                  size="sm"
                  variant="outline"
                  disabled={!data.hasPrev}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="h-7 px-2 text-xs gap-1"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                  {t('common.back')}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={!data.hasNext}
                  onClick={() => setPage((p) => p + 1)}
                  className="h-7 px-2 text-xs gap-1"
                >
                  {t('common.next')}
                  <ChevronRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Assignment Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent onClose={() => setShowModal(false)} className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{t('assignments.createAssignment')}</DialogTitle>
            <DialogDescription>{t('assignments.subtitle')}</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* Choose Chart */}
            <div>
              <label className="text-xs font-semibold text-foreground block mb-1.5">{t('assignments.selectChart')}</label>
              <select
                value={selectedChartId}
                onChange={(e) => setSelectedChartId(e.target.value)}
                className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-xs text-foreground focus:ring-1 focus:ring-primary"
              >
                {charts.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name} ({c.defaultUnit.toUpperCase()})
                  </option>
                ))}
              </select>
            </div>

            {/* Choose Assignment Type */}
            <div>
              <label className="text-xs font-semibold text-foreground block mb-1.5">{t('assignments.assignmentType')}</label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {[
                  { type: 'all', label: t('assignments.allProducts'), icon: Globe },
                  { type: 'product', label: t('assignments.productSpecific'), icon: Tag },
                  { type: 'category', label: t('assignments.categorySpecific'), icon: FolderTree },
                  { type: 'rule', label: t('assignments.advancedRule'), icon: Sliders },
                  { type: 'default', label: t('assignments.defaultFallback'), icon: CheckCircle },
                ].map((item) => {
                  const Icon = item.icon;
                  const isSelected = assignmentType === item.type;
                  return (
                    <button
                      key={item.type}
                      type="button"
                      onClick={() => setAssignmentType(item.type as any)}
                      className={`p-3 rounded-lg border text-left flex flex-col gap-1.5 transition-colors cursor-pointer ${
                        isSelected
                          ? 'border-primary bg-primary/5 text-primary'
                          : 'border-border hover:bg-muted/40 text-foreground'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="text-xs font-medium leading-tight">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Target 0: All Products (Storewide) */}
            {assignmentType === 'all' && (
              <div className="p-4 rounded-lg border border-primary/20 bg-primary/5 space-y-1.5">
                <div className="flex items-center gap-2 text-primary font-semibold text-xs">
                  <Globe className="h-4 w-4" />
                  <span>{t('assignments.allProducts')}</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {t('assignments.allProductsNotice')}
                </p>
              </div>
            )}

            {/* Target 1: Product Selector */}
            {assignmentType === 'product' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-foreground block">
                    {t('assignments.productSelectorTitle')} ({t('assignments.selectedCount', { count: selectedProductIds.length })})
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedProductIds(products.map((p) => p.id))}
                      className="text-[11px] font-medium text-primary hover:underline cursor-pointer"
                    >
                      {t('assignments.selectAll')}
                    </button>
                    <span className="text-muted-foreground text-[10px]">|</span>
                    <button
                      type="button"
                      onClick={() => setSelectedProductIds([])}
                      className="text-[11px] font-medium text-muted-foreground hover:underline cursor-pointer"
                    >
                      {t('assignments.deselectAll')}
                    </button>
                  </div>
                </div>

                <div className="relative">
                  <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-muted-foreground" />
                  <Input
                    value={productSearch}
                    onChange={(e) => handleProductSearch(e.target.value)}
                    placeholder={t('assignments.searchProducts')}
                    className="pl-8 h-8 text-xs"
                  />
                </div>
                <div className="border border-border rounded-md max-h-48 overflow-y-auto divide-y divide-border">
                  {products.map((p) => {
                    const isChecked = selectedProductIds.includes(p.id);
                    return (
                      <label key={p.id} className="p-2 flex items-center gap-2.5 hover:bg-muted/30 cursor-pointer text-xs">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            if (e.target.checked) setSelectedProductIds([...selectedProductIds, p.id]);
                            else setSelectedProductIds(selectedProductIds.filter((id) => id !== p.id));
                          }}
                          className="rounded border-input text-primary focus:ring-primary h-3.5 w-3.5"
                        />
                        <span className="font-medium text-foreground flex-1 truncate">{p.name}</span>
                        {p.sku && <span className="font-mono text-[10px] text-muted-foreground">{p.sku}</span>}
                      </label>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Target 2: Category Selector */}
            {assignmentType === 'category' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-foreground block">{t('assignments.categorySelectorTitle')}</label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedCategoryIds(categories.map((c) => c.id))}
                      className="text-[11px] font-medium text-primary hover:underline cursor-pointer"
                    >
                      {t('assignments.selectAll')}
                    </button>
                    <span className="text-muted-foreground text-[10px]">|</span>
                    <button
                      type="button"
                      onClick={() => setSelectedCategoryIds([])}
                      className="text-[11px] font-medium text-muted-foreground hover:underline cursor-pointer"
                    >
                      {t('assignments.deselectAll')}
                    </button>
                  </div>
                </div>

                <div className="border border-border rounded-md max-h-48 overflow-y-auto divide-y divide-border">
                  {categories.map((c) => {
                    const isChecked = selectedCategoryIds.includes(c.id);
                    return (
                      <label key={c.id} className="p-2.5 flex items-center gap-2.5 hover:bg-muted/30 cursor-pointer text-xs">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            if (e.target.checked) setSelectedCategoryIds([...selectedCategoryIds, c.id]);
                            else setSelectedCategoryIds(selectedCategoryIds.filter((id) => id !== c.id));
                          }}
                          className="rounded border-input text-primary focus:ring-primary h-3.5 w-3.5"
                        />
                        <span className="font-medium text-foreground flex-1">{c.name}</span>
                        {c.numberOfProducts !== undefined && (
                          <span className="text-[10px] text-muted-foreground">
                            {t('common.productsCount', { count: c.numberOfProducts })}
                          </span>
                        )}
                      </label>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Target 3: Advanced Condition Rule Builder */}
            {assignmentType === 'rule' && (
              <div className="space-y-2">
                <label className="text-xs font-semibold text-foreground block">{t('assignments.ruleBuilderTitle')}</label>
                {conditions.map((cond, cIdx) => (
                  <div key={cIdx} className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <select
                      value={cond.field}
                      onChange={(e) => {
                        const next = [...conditions];
                        next[cIdx].field = e.target.value as any;
                        setConditions(next);
                      }}
                      className="h-8 rounded-md border border-input bg-background px-2 text-xs"
                    >
                      <option value="name">{t('assignments.ruleFieldProductTitle')}</option>
                      <option value="sku">{t('assignments.ruleFieldSku')}</option>
                      <option value="category">{t('assignments.ruleFieldCategory')}</option>
                      <option value="price">{t('assignments.ruleFieldPrice')}</option>
                    </select>

                    <select
                      value={cond.operator}
                      onChange={(e) => {
                        const next = [...conditions];
                        next[cIdx].operator = e.target.value as any;
                        setConditions(next);
                      }}
                      className="h-8 rounded-md border border-input bg-background px-2 text-xs"
                    >
                      <option value="contains">{t('assignments.ruleOpContains')}</option>
                      <option value="equals">{t('assignments.ruleOpEquals')}</option>
                      <option value="startsWith">{t('assignments.ruleOpStartsWith')}</option>
                    </select>

                    <Input
                      value={cond.value}
                      onChange={(e) => {
                        const next = [...conditions];
                        next[cIdx].value = e.target.value;
                        setConditions(next);
                      }}
                      placeholder={t('assignments.ruleValuePlaceholder')}
                      className="h-8 text-xs"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowModal(false)}>
              {t('common.cancel')}
            </Button>
            <Button onClick={handleCreateAssignment}>
              {t('common.save')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
