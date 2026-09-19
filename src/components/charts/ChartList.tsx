import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from '../../i18n';
import { SizeChart, SizeChartFilter, PaginatedResponse } from '../../types/charts';
import { dashboardApi } from '../../api/dashboard-client';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Card, CardContent } from '../ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';
import {
  Plus,
  Search,
  ArrowUpDown,
  Edit2,
  Copy,
  Trash2,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  FileSpreadsheet,
} from 'lucide-react';
import { toast } from 'sonner';

export interface ChartListProps {
  onCreateClick: () => void;
  onEditClick: (chart: SizeChart) => void;
}

export const ChartList: React.FC<ChartListProps> = ({ onCreateClick, onEditClick }) => {
  const { t, formatDate } = useTranslation();

  const [data, setData] = useState<PaginatedResponse<SizeChart>>({
    items: [],
    totalCount: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
    hasNext: false,
    hasPrev: false,
  });
  const [loading, setLoading] = useState(true);

  // Filter & Sort State (sent to backend)
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ACTIVE' | 'ARCHIVED' | 'ALL'>('ALL');
  const [sortBy, setSortBy] = useState<'updatedDate' | 'name'>('updatedDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(1);

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState<SizeChart | null>(null);

  const fetchCharts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await dashboardApi.getCharts({
        search: search.trim() || undefined,
        status: statusFilter,
        sortBy,
        sortOrder,
        page,
        limit: 10,
      });
      setData(res);
    } catch (err: any) {
      toast.error(err.message || t('errors.loadFailed'));
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, sortBy, sortOrder, page, t]);

  useEffect(() => {
    fetchCharts();
  }, [fetchCharts]);

  const handleDuplicate = async (chart: SizeChart) => {
    try {
      await dashboardApi.duplicateChart(chart._id);
      toast.success(t('notifications.chartCreated'));
      fetchCharts();
    } catch (err: any) {
      toast.error(err.message || t('errors.generalError'));
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      await dashboardApi.deleteChart(deleteTarget._id);
      toast.success(t('notifications.chartDeleted'));
      setDeleteTarget(null);
      fetchCharts();
    } catch (err: any) {
      toast.error(err.message || t('errors.generalError'));
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Controls: Search, Filters, Sort, Create */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex flex-1 items-center gap-2 max-w-md">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1); // Reset to page 1 on search
              }}
              placeholder={t('charts.searchPlaceholder')}
              className="pl-9 h-9 text-xs"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value as any);
              setPage(1);
            }}
            className="h-9 rounded-md border border-input bg-background px-3 py-1 text-xs text-foreground focus:ring-1 focus:ring-primary"
          >
            <option value="ALL">{t('charts.allStatuses')}</option>
            <option value="ACTIVE">{t('common.active')}</option>
            <option value="ARCHIVED">{t('common.archive')}</option>
          </select>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
              setPage(1);
            }}
            className="h-9 gap-1.5 text-xs"
          >
            <ArrowUpDown className="h-3.5 w-3.5" />
            {sortBy === 'updatedDate' ? t('charts.tableHeaderUpdated') : t('charts.tableHeaderName')} (
            {sortOrder === 'asc' ? '↑' : '↓'})
          </Button>

          <Button size="sm" onClick={onCreateClick} className="h-9 gap-1.5 text-xs">
            <Plus className="h-4 w-4" />
            {t('charts.create')}
          </Button>
        </div>
      </div>

      {/* Main Table / Cards */}
      <Card>
        <CardContent className="p-0 overflow-x-auto">
          {loading ? (
            <div className="p-12 text-center text-sm text-muted-foreground">
              <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent mb-2" />
              <p>{t('common.loading')}</p>
            </div>
          ) : data.items.length === 0 ? (
            <div className="p-12 text-center">
              <FileSpreadsheet className="h-10 w-10 text-muted-foreground mx-auto mb-3 opacity-40" />
              <h3 className="font-semibold text-foreground">{t('charts.emptyTitle')}</h3>
              <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
                {t('charts.emptyDescription')}
              </p>
              <Button size="sm" onClick={onCreateClick} className="mt-4 gap-1.5 text-xs">
                <Plus className="h-4 w-4" />
                {t('charts.create')}
              </Button>
            </div>
          ) : (
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-muted/50 border-b border-border text-left">
                  <th className="p-3.5 font-semibold text-xs text-muted-foreground">{t('charts.tableHeaderName')}</th>
                  <th className="p-3.5 font-semibold text-xs text-muted-foreground">{t('charts.tableHeaderType')}</th>
                  <th className="p-3.5 font-semibold text-xs text-muted-foreground">{t('charts.tableHeaderUnit')}</th>
                  <th className="p-3.5 font-semibold text-xs text-muted-foreground">{t('charts.tableHeaderFitFinder')}</th>
                  <th className="p-3.5 font-semibold text-xs text-muted-foreground">{t('charts.tableHeaderStatus')}</th>
                  <th className="p-3.5 font-semibold text-xs text-muted-foreground">{t('charts.tableHeaderUpdated')}</th>
                  <th className="p-3.5 font-semibold text-xs text-muted-foreground text-right">{t('common.actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {data.items.map((chart) => (
                  <tr key={chart._id} className="hover:bg-muted/30 transition-colors">
                    <td className="p-3.5">
                      <div className="font-semibold text-foreground text-sm">{chart.name}</div>
                      {chart.description && (
                        <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{chart.description}</p>
                      )}
                    </td>
                    <td className="p-3.5 text-xs text-muted-foreground capitalize">
                      {chart.chartType.replace('-', ' ')}
                    </td>
                    <td className="p-3.5">
                      <Badge variant="outline" className="uppercase text-[10px] font-mono">
                        {chart.defaultUnit}
                      </Badge>
                    </td>
                    <td className="p-3.5">
                      {chart.fitFinderEnabled ? (
                        <Badge variant="success" className="gap-1 text-[10px]">
                          <Sparkles className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                          {t('common.active')}
                        </Badge>
                      ) : (
                        <span className="text-xs text-muted-foreground">&mdash;</span>
                      )}
                    </td>
                    <td className="p-3.5">
                      <Badge variant={chart.status === 'ACTIVE' ? 'default' : 'secondary'} className="text-[10px]">
                        {chart.status === 'ACTIVE' ? t('common.active') : t('common.archive')}
                      </Badge>
                    </td>
                    <td className="p-3.5 text-xs text-muted-foreground">
                      {formatDate(chart.updatedDate)}
                    </td>
                    <td className="p-3.5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onEditClick(chart)}
                          className="h-8 w-8 p-0"
                          title={t('common.edit')}
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDuplicate(chart)}
                          className="h-8 w-8 p-0"
                          title={t('common.duplicate')}
                        >
                          <Copy className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setDeleteTarget(chart)}
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                          title={t('common.delete')}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* Backend Pagination Bar */}
          {data.totalPages > 1 && (
            <div className="flex items-center justify-between p-3 border-t border-border bg-muted/20 text-xs text-muted-foreground">
              <span>
                {t('common.items', { count: data.totalCount })} &middot; Page {data.page} of {data.totalPages}
                {t('common.items', { count: data.totalCount })} &middot; {t('common.pageOf', { page: data.page, totalPages: data.totalPages })}
              </span>
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

      {/* Delete Confirmation Modal */}
      <Dialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <DialogContent onClose={() => setDeleteTarget(null)}>
          <DialogHeader>
            <DialogTitle>{t('charts.deleteConfirmTitle')}</DialogTitle>
            <DialogDescription>
              {t('charts.deleteConfirmDesc', { name: deleteTarget?.name || '' })}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>
              {t('common.cancel')}
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              {t('common.delete')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
