import React, { useState, useEffect } from 'react';
import { useTranslation } from '../../i18n';
import { SizeChart, ChartColumn, ChartRow, MeasurementInstruction, MeasurementUnit } from '../../types/charts';
import { TEMPLATES, createChartFromTemplate } from '../../lib/templates';
import { convertMeasurementString } from '../../lib/units';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Input } from '../ui/input';
import { Switch } from '../ui/switch';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';
import {
  Plus,
  Trash2,
  Copy,
  ArrowUp,
  ArrowDown,
  Download,
  Upload,
  Sparkles,
  Save,
  Eye,
  Layers,
  HelpCircle,
  FileSpreadsheet,
} from 'lucide-react';
import { toast } from 'sonner';

export interface ChartEditorProps {
  initialChart?: SizeChart | null;
  onSave: (chart: Partial<SizeChart>) => Promise<void>;
  onCancel: () => void;
  readOnly?: boolean;
}

export const ChartEditor: React.FC<ChartEditorProps> = ({
  initialChart,
  onSave,
  onCancel,
  readOnly = false,
}) => {
  const { t } = useTranslation();

  const [name, setName] = useState(initialChart?.name || '');
  const [description, setDescription] = useState(initialChart?.description || '');
  const [chartType, setChartType] = useState(initialChart?.chartType || 'mens-tops');
  const [unit, setUnit] = useState<MeasurementUnit>(initialChart?.defaultUnit || 'cm');
  const [columns, setColumns] = useState<ChartColumn[]>(
    initialChart?.columns || [
      { id: 'col-size', name: 'Size', presetKey: 'size', isSizeColumn: true },
      { id: 'col-chest', name: 'Chest', presetKey: 'chest' },
      { id: 'col-waist', name: 'Waist', presetKey: 'waist' },
      { id: 'col-length', name: 'Length', presetKey: 'length' },
    ]
  );
  const [rows, setRows] = useState<ChartRow[]>(
    initialChart?.rows || [
      { id: 'r1', size: 'S', values: { 'col-chest': '86-91', 'col-waist': '71-76', 'col-length': '68' } },
      { id: 'r2', size: 'M', values: { 'col-chest': '91-97', 'col-waist': '76-81', 'col-length': '70' } },
      { id: 'r3', size: 'L', values: { 'col-chest': '97-102', 'col-waist': '81-86', 'col-length': '72' } },
      { id: 'r4', size: 'XL', values: { 'col-chest': '102-107', 'col-waist': '86-91', 'col-length': '74' } },
    ]
  );
  const [instructions, setInstructions] = useState<MeasurementInstruction[]>(
    initialChart?.measurementGuide || [
      { id: 'm1', title: 'Chest', description: 'Measure around the fullest part of your chest with tape level.' },
      { id: 'm2', title: 'Waist', description: 'Measure around your natural waistline.' },
    ]
  );
  const [fitFinderEnabled, setFitFinderEnabled] = useState(initialChart?.fitFinderEnabled ?? true);
  const [saving, setSaving] = useState(false);
  const [showCsvModal, setShowCsvModal] = useState(false);
  const [csvText, setCsvText] = useState('');
  const [previewSize, setPreviewSize] = useState<string | null>(null);

  // Template loader
  const handleSelectTemplate = (templateId: string) => {
    if (!templateId) return;
    const templated = createChartFromTemplate(templateId, name || undefined);
    if (templated.columns) setColumns(templated.columns);
    if (templated.rows) setRows(templated.rows);
    if (templated.measurementGuide) setInstructions(templated.measurementGuide);
    if (templated.chartType) setChartType(templated.chartType);
    if (templated.defaultUnit) setUnit(templated.defaultUnit);
    toast.success(t('notifications.chartUpdated'));
  };

  // Switch display units and convert values
  const handleUnitToggle = (newUnit: MeasurementUnit) => {
    if (newUnit === unit) return;
    const oldUnit = unit;
    setUnit(newUnit);

    // Convert values in rows
    const updatedRows = rows.map((r) => {
      const newVals: Record<string, string> = {};
      Object.entries(r.values).forEach(([colId, val]) => {
        newVals[colId] = convertMeasurementString(val, oldUnit, newUnit);
      });
      return { ...r, values: newVals };
    });
    setRows(updatedRows);
  };

  // Row operations
  const handleAddRow = () => {
    const newId = `row-${Date.now()}`;
    const newSize = `Size ${rows.length + 1}`;
    const initialVals: Record<string, string> = {};
    columns.forEach((c) => {
      if (!c.isSizeColumn) initialVals[c.id] = '';
    });
    setRows([...rows, { id: newId, size: newSize, values: initialVals }]);
  };

  const handleDeleteRow = (index: number) => {
    if (rows.length <= 1) {
      toast.error(t('validation.atLeastOneRow'));
      return;
    }
    setRows(rows.filter((_, i) => i !== index));
  };

  const handleDuplicateRow = (index: number) => {
    const target = rows[index];
    const newRow: ChartRow = {
      id: `row-${Date.now()}`,
      size: `${target.size} (Copy)`,
      values: { ...target.values },
    };
    const nextRows = [...rows];
    nextRows.splice(index + 1, 0, newRow);
    setRows(nextRows);
  };

  const handleMoveRow = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === rows.length - 1) return;
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    const nextRows = [...rows];
    const temp = nextRows[index];
    nextRows[index] = nextRows[targetIdx];
    nextRows[targetIdx] = temp;
    setRows(nextRows);
  };

  // Column operations
  const handleAddColumn = (preset?: { name: string; presetKey: string }) => {
    const colId = `col-${Date.now()}`;
    const newCol: ChartColumn = {
      id: colId,
      name: preset ? preset.name : `Column ${columns.length + 1}`,
      presetKey: preset ? preset.presetKey : undefined,
    };
    setColumns([...columns, newCol]);
  };

  const handleDeleteColumn = (colId: string) => {
    if (columns.length <= 2) {
      toast.error(t('validation.atLeastOneColumn'));
      return;
    }
    setColumns(columns.filter((c) => c.id !== colId));
  };

  const handleRenameColumn = (colId: string, newName: string) => {
    setColumns(columns.map((c) => (c.id === colId ? { ...c, name: newName } : c)));
  };

  // Measurement Guide instructions
  const handleAddInstruction = () => {
    setInstructions([
      ...instructions,
      { id: `m-${Date.now()}`, title: 'New Measurement Area', description: 'Describe how to measure this area accurately.' },
    ]);
  };

  const handleRemoveInstruction = (id: string) => {
    setInstructions(instructions.filter((i) => i.id !== id));
  };

  // CSV Export
  const handleExportCsv = () => {
    const headers = columns.map((c) => `"${c.name}"`).join(',');
    const csvRows = rows.map((r) => {
      const vals = columns.map((c) => {
        if (c.isSizeColumn) return `"${r.size}"`;
        return `"${r.values[c.id] || ''}"`;
      });
      return vals.join(',');
    });
    const content = [headers, ...csvRows].join('\n');
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${name || 'size-chart'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // CSV Import
  const handleImportCsv = () => {
    if (!csvText.trim()) return;
    try {
      const lines = csvText.trim().split(/\r?\n/).filter((l) => l.trim().length > 0);
      if (lines.length < 2) {
        toast.error(t('csv.invalidFormat'));
        return;
      }

      const rawHeaders = lines[0].split(',').map((h) => h.replace(/^["']|["']$/g, '').trim());
      const newCols: ChartColumn[] = rawHeaders.map((header, idx) => ({
        id: `col-${idx}-${Date.now()}`,
        name: header,
        isSizeColumn: idx === 0,
      }));

      const newRows: ChartRow[] = [];
      for (let i = 1; i < lines.length; i++) {
        const rawVals = lines[i].split(',').map((v) => v.replace(/^["']|["']$/g, '').trim());
        const rowVals: Record<string, string> = {};
        newCols.forEach((col, cIdx) => {
          if (!col.isSizeColumn) {
            rowVals[col.id] = rawVals[cIdx] || '';
          }
        });
        newRows.push({
          id: `row-${i}-${Date.now()}`,
          size: rawVals[0] || `Size ${i}`,
          values: rowVals,
        });
      }

      setColumns(newCols);
      setRows(newRows);
      setShowCsvModal(false);
      setCsvText('');
      toast.success(t('notifications.csvImported'));
    } catch (e) {
      toast.error(t('csv.importError'));
    }
  };

  // Submit Save
  const handleSave = async () => {
    if (!name.trim()) {
      toast.error(t('validation.nameRequired'));
      return;
    }
    if (rows.length === 0) {
      toast.error(t('validation.atLeastOneRow'));
      return;
    }
    if (columns.length === 0) {
      toast.error(t('validation.atLeastOneColumn'));
      return;
    }

    setSaving(true);
    try {
      await onSave({
        _id: initialChart?._id,
        name: name.trim(),
        description: description.trim(),
        chartType,
        defaultUnit: unit,
        columns,
        rows,
        measurementGuide: instructions,
        fitFinderEnabled,
        fitFinderConfig: {
          enabled: fitFinderEnabled,
          askChest: columns.some((c) => (c.name || '').toLowerCase().includes('chest')),
          askWaist: columns.some((c) => (c.name || '').toLowerCase().includes('waist')),
          askHip: columns.some((c) => (c.name || '').toLowerCase().includes('hip')),
          askHeight: true,
          askWeight: true,
          allowFitPreferences: true,
        },
        status: 'ACTIVE',
      });
      toast.success(t('notifications.chartUpdated'));
    } catch (error: any) {
      toast.error(error.message || t('errors.saveFailed'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            {initialChart ? t('builder.titleEdit') : t('builder.titleCreate')}
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">{t('overview.subtitle')}</p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button variant="outline" onClick={onCancel} disabled={saving}>
            {t('common.cancel')}
          </Button>
          <Button onClick={handleSave} disabled={saving || readOnly} className="gap-1.5">
            <Save className="h-4 w-4" />
            {t('common.save')}
          </Button>
        </div>
      </div>

      {/* Basic Settings Card */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <CardTitle className="text-base font-semibold">{t('builder.basicInfo')}</CardTitle>
            {/* Templates Selector */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Sparkles className="h-4 w-4 text-primary shrink-0" />
              <select
                className="text-xs h-9 rounded-md border border-input bg-background px-3 py-1 text-foreground focus:ring-1 focus:ring-primary w-full sm:w-auto"
                onChange={(e) => handleSelectTemplate(e.target.value)}
                defaultValue=""
              >
                <option value="" disabled>
                  {t('builder.templatesSection')}
                </option>
                {TEMPLATES.map((tmpl) => (
                  <option key={tmpl.id} value={tmpl.id}>
                    {t(tmpl.nameKey)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-foreground block mb-1.5">{t('builder.chartName')}</label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t('builder.chartNamePlaceholder')}
                disabled={readOnly}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground block mb-1.5">{t('builder.defaultUnitLabel')}</label>
              <div className="inline-flex rounded-md border border-input p-0.5 bg-muted">
                <button
                  type="button"
                  onClick={() => handleUnitToggle('cm')}
                  className={`px-4 py-1.5 text-xs font-semibold rounded ${
                    unit === 'cm' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {t('common.cm')}
                </button>
                <button
                  type="button"
                  onClick={() => handleUnitToggle('in')}
                  className={`px-4 py-1.5 text-xs font-semibold rounded ${
                    unit === 'in' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {t('common.in')}
                </button>
              </div>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground block mb-1.5">{t('builder.description')}</label>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t('builder.descriptionPlaceholder')}
              disabled={readOnly}
            />
          </div>
        </CardContent>
      </Card>

      {/* Spreadsheet Size Table Editor */}
      <Card>
        <CardHeader className="pb-3 border-b border-border">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <FileSpreadsheet className="h-4 w-4 text-primary" />
                {t('builder.tableSection')}
              </CardTitle>
              <CardDescription>{t('presets.custom')}</CardDescription>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Button size="sm" variant="outline" onClick={() => setShowCsvModal(true)} className="h-8 gap-1 text-xs">
                <Upload className="h-3.5 w-3.5" />
                {t('builder.importCsv')}
              </Button>
              <Button size="sm" variant="outline" onClick={handleExportCsv} className="h-8 gap-1 text-xs">
                <Download className="h-3.5 w-3.5" />
                {t('builder.exportCsv')}
              </Button>
              <Button size="sm" variant="outline" onClick={() => handleAddColumn()} className="h-8 gap-1 text-xs">
                <Plus className="h-3.5 w-3.5" />
                {t('builder.addColumn')}
              </Button>
              <Button size="sm" onClick={handleAddRow} className="h-8 gap-1 text-xs">
                <Plus className="h-3.5 w-3.5" />
                {t('builder.addRow')}
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-muted/60 border-b border-border text-left">
                <th className="p-3 w-12 text-center text-xs font-semibold text-muted-foreground">#</th>
                {columns.map((col) => (
                  <th key={col.id} className="p-3 min-w-[140px] font-semibold text-foreground">
                    <div className="flex items-center justify-between gap-2">
                      {col.isSizeColumn ? (
                        <span className="font-bold text-primary">{t('presets.size')}</span>
                      ) : (
                        <input
                          type="text"
                          value={col.name}
                          onChange={(e) => handleRenameColumn(col.id, e.target.value)}
                          className="bg-transparent font-medium text-foreground focus:outline-none focus:border-b focus:border-primary w-full text-xs"
                          placeholder={t('builder.columnName')}
                          disabled={readOnly}
                        />
                      )}
                      {!col.isSizeColumn && !readOnly && (
                        <button
                          type="button"
                          onClick={() => handleDeleteColumn(col.id)}
                          className="text-muted-foreground hover:text-destructive transition-colors p-1"
                          title={t('builder.deleteColumn')}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </th>
                ))}
                {!readOnly && <th className="p-3 w-28 text-right font-semibold text-xs text-muted-foreground">{t('common.actions')}</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rows.map((row, rIdx) => (
                <tr
                  key={row.id}
                  className={`hover:bg-muted/30 transition-colors ${previewSize === row.size ? 'bg-primary/10' : ''}`}
                >
                  <td className="p-3 text-center text-xs text-muted-foreground font-mono">{rIdx + 1}</td>
                  {columns.map((col) => (
                    <td key={col.id} className="p-2.5">
                      {col.isSizeColumn ? (
                        <Input
                          value={row.size}
                          onChange={(e) => {
                            const next = [...rows];
                            next[rIdx].size = e.target.value;
                            setRows(next);
                          }}
                          placeholder="e.g. S, M, L"
                          className="h-8 font-semibold text-foreground text-xs"
                          disabled={readOnly}
                        />
                      ) : (
                        <Input
                          value={row.values[col.id] || ''}
                          onChange={(e) => {
                            const next = [...rows];
                            next[rIdx].values[col.id] = e.target.value;
                            setRows(next);
                          }}
                          placeholder={unit === 'cm' ? 'e.g. 91-97' : 'e.g. 36-38'}
                          className="h-8 text-xs font-mono"
                          disabled={readOnly}
                        />
                      )}
                    </td>
                  ))}
                  {!readOnly && (
                    <td className="p-2.5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => handleMoveRow(rIdx, 'up')}
                          disabled={rIdx === 0}
                          className="p-1 text-muted-foreground hover:text-foreground disabled:opacity-30"
                          title={t('common.moveUp')}
                        >
                          <ArrowUp className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMoveRow(rIdx, 'down')}
                          disabled={rIdx === rows.length - 1}
                          className="p-1 text-muted-foreground hover:text-foreground disabled:opacity-30"
                          title={t('common.moveDown')}
                        >
                          <ArrowDown className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDuplicateRow(rIdx)}
                          className="p-1 text-muted-foreground hover:text-foreground"
                          title={t('common.duplicate')}
                        >
                          <Copy className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteRow(rIdx)}
                          className="p-1 text-muted-foreground hover:text-destructive"
                          title={t('common.delete')}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Measurement Instructions Guide */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-semibold">{t('builder.measurementGuideSection')}</CardTitle>
              <CardDescription>{t('onboarding.step1Desc')}</CardDescription>
            </div>
            {!readOnly && (
              <Button size="sm" variant="outline" onClick={handleAddInstruction} className="gap-1 text-xs">
                <Plus className="h-3.5 w-3.5" />
                {t('builder.addInstruction')}
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {instructions.map((inst, idx) => (
            <div key={inst.id} className="p-3.5 rounded-lg border border-border bg-muted/20 flex items-start gap-3">
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1">
                    {t('builder.instructionTitle')}
                  </label>
                  <Input
                    value={inst.title}
                    onChange={(e) => {
                      const next = [...instructions];
                      next[idx].title = e.target.value;
                      setInstructions(next);
                    }}
                    placeholder="e.g. Chest"
                    className="h-8 text-xs"
                    disabled={readOnly}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs font-medium text-muted-foreground block mb-1">
                    {t('builder.instructionDesc')}
                  </label>
                  <Input
                    value={inst.description}
                    onChange={(e) => {
                      const next = [...instructions];
                      next[idx].description = e.target.value;
                      setInstructions(next);
                    }}
                    placeholder="e.g. Measure around the fullest part of your chest."
                    className="h-8 text-xs"
                    disabled={readOnly}
                  />
                </div>
              </div>
              {!readOnly && (
                <button
                  type="button"
                  onClick={() => handleRemoveInstruction(inst.id)}
                  className="mt-6 text-muted-foreground hover:text-destructive p-1"
                  title={t('builder.removeInstruction')}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Smart Fit Finder Feature Toggle */}
      <Card>
        <CardContent className="p-5 flex items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <Sparkles className="h-5 w-5 text-primary mt-0.5 shrink-0" />
            <div>
              <p className="font-semibold text-foreground text-sm">{t('fitFinder.title')}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{t('fitFinder.enableDescription')}</p>
            </div>
          </div>
          <Switch
            checked={fitFinderEnabled}
            onCheckedChange={setFitFinderEnabled}
            disabled={readOnly}
            aria-label={t('fitFinder.statusToggle')}
          />
        </CardContent>
      </Card>

      {/* CSV Import Modal */}
      <Dialog open={showCsvModal} onOpenChange={setShowCsvModal}>
        <DialogContent onClose={() => setShowCsvModal(false)}>
          <DialogHeader>
            <DialogTitle>{t('csv.uploadTitle')}</DialogTitle>
            <DialogDescription>{t('csv.uploadDesc')}</DialogDescription>
          </DialogHeader>
          <div className="py-3 space-y-3">
            <textarea
              className="w-full h-40 p-3 text-xs font-mono rounded-md border border-input bg-background focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder={`Size,Chest,Waist,Hip\nS,86-91,71-76,89-94\nM,91-97,76-81,94-99\nL,97-102,81-86,99-104`}
              value={csvText}
              onChange={(e) => setCsvText(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCsvModal(false)}>
              {t('common.cancel')}
            </Button>
            <Button onClick={handleImportCsv}>
              {t('csv.confirmImport')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

