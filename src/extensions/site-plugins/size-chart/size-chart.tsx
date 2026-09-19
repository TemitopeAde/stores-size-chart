import { getProductChart, calculateFit, trackEvent } from '../../../api/widget-client';
import { SizeChart } from '../../../types/charts';
import { WidgetSettings, DEFAULT_WIDGET_SETTINGS } from '../../../types/settings';
import { convertMeasurementString } from '../../../lib/units';
import { translate } from '../../../i18n';
import { normalizeLocale } from '../../../i18n/config';
import { SupportedLocale } from '../../../i18n/types';

class SizeChartSitePluginElement extends HTMLElement {
  private chart: SizeChart | null = null;
  private settings: WidgetSettings = DEFAULT_WIDGET_SETTINGS;
  private activeUnit: 'cm' | 'in' = 'cm';
  private isOpen = false;
  private isFitFinderOpen = false;
  private fitStep = 1;
  private fitAnswers: {
    height?: number;
    weight?: number;
    chest?: number;
    waist?: number;
    preference?: 'slim' | 'regular' | 'relaxed';
  } = { preference: 'regular' };
  private fitRecommendation: any = null;
  private selectedSizeChoice: string | null = null;
  private currentLocale: SupportedLocale = 'en';

  static get observedAttributes() {
    return [
      'product-id',
      'selected-variant-id',
      'selected-choices',
      'trigger-text',
      'trigger-style',
      'accent-color',
      'default-unit',
      'locale',
    ];
  }

  constructor() {
    super();
  }

  connectedCallback() {
    this.currentLocale = normalizeLocale(this.getAttribute('locale') || (typeof document !== 'undefined' ? document.documentElement.lang : 'en'));
    this.loadChartData();
  }

  attributeChangedCallback(name: string, oldVal: string | null, newVal: string | null) {
    if (oldVal === newVal) return;

    if (name === 'product-id') {
      this.loadChartData();
    } else if (name === 'selected-choices') {
      this.parseSelectedChoices(newVal);
      this.render();
    } else {
      this.render();
    }
  }

  private parseSelectedChoices(choicesJson: string | null) {
    if (!choicesJson) return;
    try {
      const parsed = typeof choicesJson === 'string' ? JSON.parse(choicesJson) : choicesJson;
      for (const [key, val] of Object.entries(parsed)) {
        if (/size|talla|taille|größe|taglia|tamanho|talle|ukuran|beden/i.test(key)) {
          this.selectedSizeChoice = String(val);
          break;
        }
      }
    } catch {}
  }

  private async loadChartData() {
    const productId = this.getAttribute('product-id') || 'demo-product';

    try {
      const res = await getProductChart(productId);
      if (res && res.chart) {
        this.chart = res.chart;
        if (res.settings) this.settings = res.settings;
        this.activeUnit = res.chart.defaultUnit || this.settings.defaultUnit || 'cm';
        this.render();
      } else {
        this.innerHTML = '';
      }
    } catch (e) {
      this.innerHTML = '';
    }
  }

  private toggleModal(open: boolean) {
    this.isOpen = open;
    if (open) {
      trackEvent('SIZE_GUIDE_OPENED', {
        productId: this.getAttribute('product-id') || undefined,
        chartId: this.chart?._id,
      });
    } else {
      trackEvent('SIZE_GUIDE_CLOSED', {
        productId: this.getAttribute('product-id') || undefined,
        chartId: this.chart?._id,
      });
    }
    this.render();
  }

  private async submitFitCalculation() {
    if (!this.chart) return;
    try {
      const res = await calculateFit(this.chart._id, this.fitAnswers, this.activeUnit);
      this.fitRecommendation = res;
      this.fitStep = 4;
      trackEvent('FIT_FINDER_COMPLETED', {
        productId: this.getAttribute('product-id') || undefined,
        chartId: this.chart._id,
        size: res?.recommendedSize,
      });
      this.render();
    } catch {}
  }

  render() {
    if (!this.chart) {
      this.innerHTML = '';
      return;
    }

    const t = (k: string, p?: any) => translate(this.currentLocale, k, p);
    const triggerText = this.getAttribute('trigger-text') || this.settings.triggerSettings?.text || t('widget.triggerTextPlaceholder');
    const triggerStyle = this.getAttribute('trigger-style') || this.settings.triggerSettings?.style || 'button';
    const primaryColor = this.getAttribute('accent-color') || this.settings.triggerSettings?.backgroundColor || '#2563eb';
    const textColor = this.settings.triggerSettings?.textColor || '#ffffff';

    const modalMaxW = this.settings.modalSettings?.maxWidth || '680px';
    const tableHeaderBg = this.settings.tableSettings?.headerBackground || '#f8fafc';
    const highlightBg = this.settings.tableSettings?.highlightBackground || '#eff6ff';
    const highlightColor = this.settings.tableSettings?.highlightTextColor || '#1d4ed8';

    this.innerHTML = `
      <div class="stores-size-guide-root" style="font-family: system-ui, -apple-system, sans-serif; display: inline-block; margin: 8px 0;">
        <button
          type="button"
          id="sg-trigger-btn"
          style="
            ${triggerStyle === 'button' ? `background-color: ${primaryColor}; color: ${textColor}; padding: 8px 16px; border-radius: 6px; border: 1px solid rgba(0,0,0,0.1); font-weight: 600; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; font-size: 14px; box-shadow: 0 1px 2px rgba(0,0,0,0.05);` : ''}
            ${triggerStyle === 'textLink' ? `background: none; border: none; color: ${primaryColor}; font-weight: 500; text-decoration: none; cursor: pointer; font-size: 14px; padding: 4px 0;` : ''}
            ${triggerStyle === 'underlinedLink' ? `background: none; border: none; color: ${primaryColor}; font-weight: 500; text-decoration: underline; cursor: pointer; font-size: 14px; padding: 4px 0;` : ''}
          "
        >
          ${triggerText}
        </button>

        ${this.isOpen ? `
          <div id="sg-backdrop" style="position: fixed; inset: 0; z-index: 999999; background: rgba(0, 0, 0, 0.55); backdrop-filter: blur(2px); display: flex; align-items: center; justify-content: center; padding: 16px; box-sizing: border-box;">
            <div id="sg-dialog" style="background: #ffffff; color: #0f172a; width: 100%; max-width: ${modalMaxW}; max-height: 90vh; border-radius: 12px; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.2); display: flex; flex-direction: column; overflow: hidden;">
              <div style="padding: 16px 20px; border-bottom: 1px solid #e2e8f0; display: flex; align-items: center; justify-content: space-between;">
                <div>
                  <h3 style="margin: 0; font-size: 18px; font-weight: 700; color: #0f172a;">${this.chart.name}</h3>
                  ${this.chart.description ? `<p style="margin: 4px 0 0; font-size: 12px; color: #64748b;">${this.chart.description}</p>` : ''}
                </div>
                <div style="display: flex; align-items: center; gap: 12px;">
                  <div style="display: inline-flex; border: 1px solid #cbd5e1; border-radius: 6px; padding: 2px; background: #f1f5f9; font-size: 11px;">
                    <button id="sg-unit-cm" style="padding: 3px 8px; border: none; border-radius: 4px; font-weight: 700; cursor: pointer; ${this.activeUnit === 'cm' ? 'background: #ffffff; color: #0f172a; box-shadow: 0 1px 2px rgba(0,0,0,0.1);' : 'background: transparent; color: #64748b;'}">CM</button>
                    <button id="sg-unit-in" style="padding: 3px 8px; border: none; border-radius: 4px; font-weight: 700; cursor: pointer; ${this.activeUnit === 'in' ? 'background: #ffffff; color: #0f172a; box-shadow: 0 1px 2px rgba(0,0,0,0.1);' : 'background: transparent; color: #64748b;'}">IN</button>
                  </div>
                  <button id="sg-close-btn" style="background: none; border: none; font-size: 20px; color: #64748b; cursor: pointer; padding: 4px; line-height: 1;">&times;</button>
                </div>
              </div>

              <div style="padding: 20px; overflow-y: auto; flex: 1;">
                ${this.chart.fitFinderEnabled ? `
                  <div style="margin-bottom: 20px; padding: 14px; border-radius: 8px; background: #eff6ff; border: 1px solid #bfdbfe;">
                    ${!this.isFitFinderOpen ? `
                      <div style="display: flex; align-items: center; justify-content: space-between;">
                        <div style="display: flex; align-items: center; gap: 8px;">
                          <span style="font-size: 16px;">✨</span>
                          <span style="font-size: 13px; font-weight: 600; color: #1e40af;">${t('fitFinder.title')}</span>
                        </div>
                        <button id="sg-start-fit" style="background: #2563eb; color: #ffffff; border: none; padding: 6px 12px; border-radius: 5px; font-size: 12px; font-weight: 600; cursor: pointer;">
                          ${t('fitFinder.calculateBtn')}
                        </button>
                      </div>
                    ` : `
                      <div>
                        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
                          <span style="font-size: 12px; font-weight: 700; color: #1e40af;">${t('fitFinder.stepOf', { current: this.fitStep, total: 3 })}</span>
                          <button id="sg-close-fit" style="background: none; border: none; font-size: 11px; color: #64748b; cursor: pointer;">${t('common.cancel')}</button>
                        </div>

                        ${this.fitStep === 1 ? `
                          <div>
                            <label style="font-size: 12px; font-weight: 600; display: block; margin-bottom: 4px;">Height & Weight</label>
                            <div style="display: flex; gap: 8px; margin-bottom: 10px;">
                              <input id="fit-input-height" type="number" placeholder="Height (${this.activeUnit})" value="${this.fitAnswers.height || ''}" style="width: 50%; padding: 6px 10px; font-size: 12px; border: 1px solid #cbd5e1; border-radius: 6px;" />
                              <input id="fit-input-weight" type="number" placeholder="Weight (kg)" value="${this.fitAnswers.weight || ''}" style="width: 50%; padding: 6px 10px; font-size: 12px; border: 1px solid #cbd5e1; border-radius: 6px;" />
                            </div>
                            <button id="fit-next-1" style="background: #2563eb; color: #ffffff; border: none; padding: 6px 14px; border-radius: 5px; font-size: 12px; font-weight: 600; cursor: pointer;">${t('fitFinder.continueBtn')}</button>
                          </div>
                        ` : ''}

                        ${this.fitStep === 2 ? `
                          <div>
                            <label style="font-size: 12px; font-weight: 600; display: block; margin-bottom: 4px;">Chest & Waist</label>
                            <div style="display: flex; gap: 8px; margin-bottom: 10px;">
                              <input id="fit-input-chest" type="number" placeholder="Chest (${this.activeUnit})" value="${this.fitAnswers.chest || ''}" style="width: 50%; padding: 6px 10px; font-size: 12px; border: 1px solid #cbd5e1; border-radius: 6px;" />
                              <input id="fit-input-waist" type="number" placeholder="Waist (${this.activeUnit})" value="${this.fitAnswers.waist || ''}" style="width: 50%; padding: 6px 10px; font-size: 12px; border: 1px solid #cbd5e1; border-radius: 6px;" />
                            </div>
                            <div style="display: flex; gap: 6px;">
                              <button id="fit-back-2" style="background: #e2e8f0; color: #334155; border: none; padding: 6px 12px; border-radius: 5px; font-size: 12px; cursor: pointer;">${t('fitFinder.backBtn')}</button>
                              <button id="fit-next-2" style="background: #2563eb; color: #ffffff; border: none; padding: 6px 14px; border-radius: 5px; font-size: 12px; font-weight: 600; cursor: pointer;">${t('fitFinder.continueBtn')}</button>
                            </div>
                          </div>
                        ` : ''}

                        ${this.fitStep === 3 ? `
                          <div>
                            <label style="font-size: 12px; font-weight: 600; display: block; margin-bottom: 6px;">Fit Preference</label>
                            <div style="display: flex; gap: 8px; margin-bottom: 12px;">
                              ${['slim', 'regular', 'relaxed'].map((pref) => `
                                <button type="button" class="fit-pref-btn" data-pref="${pref}" style="flex: 1; padding: 8px; font-size: 11px; font-weight: 600; border-radius: 6px; border: 1px solid ${this.fitAnswers.preference === pref ? '#2563eb' : '#cbd5e1'}; background: ${this.fitAnswers.preference === pref ? '#dbeafe' : '#ffffff'}; color: ${this.fitAnswers.preference === pref ? '#1e40af' : '#334155'}; cursor: pointer;">
                                  ${pref.toUpperCase()}
                                </button>
                              `).join('')}
                            </div>
                            <div style="display: flex; gap: 6px;">
                              <button id="fit-back-3" style="background: #e2e8f0; color: #334155; border: none; padding: 6px 12px; border-radius: 5px; font-size: 12px; cursor: pointer;">${t('fitFinder.backBtn')}</button>
                              <button id="fit-calculate" style="background: #2563eb; color: #ffffff; border: none; padding: 6px 14px; border-radius: 5px; font-size: 12px; font-weight: 600; cursor: pointer;">${t('fitFinder.calculateBtn')}</button>
                            </div>
                          </div>
                        ` : ''}

                        ${this.fitStep === 4 && this.fitRecommendation ? `
                          <div style="text-align: center; padding: 8px 0;">
                            <span style="font-size: 11px; font-weight: bold; color: #16a34a; text-transform: uppercase;">${t('fitFinder.recommendedSizeTitle')}</span>
                            <div style="font-size: 32px; font-weight: 800; color: #1e40af; margin: 4px 0;">${this.fitRecommendation.recommendedSize}</div>
                            <p style="font-size: 12px; color: #475569; margin: 4px 0 12px;">
                              ${this.fitRecommendation.explanation?.fitNote || ''}
                            </p>
                            <button id="fit-restart" style="background: #e2e8f0; color: #334155; border: none; padding: 6px 12px; border-radius: 5px; font-size: 12px; cursor: pointer;">${t('fitFinder.startOverBtn')}</button>
                          </div>
                        ` : ''}
                      </div>
                    `}
                  </div>
                ` : ''}

                <div style="border: 1px solid #e2e8f0; border-radius: 8px; overflow-x: auto; margin-bottom: 20px;">
                  <table style="width: 100%; border-collapse: collapse; font-size: 13px; text-align: left;">
                    <thead>
                      <tr style="background: ${tableHeaderBg}; border-bottom: 1px solid #e2e8f0;">
                        ${this.chart.columns.map((c) => `
                          <th style="padding: 10px 14px; font-weight: 700; color: #0f172a;">${c.name}</th>
                        `).join('')}
                      </tr>
                    </thead>
                    <tbody>
                      ${this.chart.rows.map((r) => {
                        const isMatch = this.selectedSizeChoice && r.size.toLowerCase() === this.selectedSizeChoice.toLowerCase();
                        return `
                          <tr style="border-bottom: 1px solid #f1f5f9; ${isMatch ? `background-color: ${highlightBg}; color: ${highlightColor}; font-weight: 700;` : ''}">
                            ${this.chart!.columns.map((c) => {
                              if (c.isSizeColumn) {
                                return `<td style="padding: 10px 14px; font-weight: 700;">${r.size} ${isMatch ? `<span style="font-size: 10px; background: ${primaryColor}; color: #fff; padding: 2px 6px; border-radius: 4px; margin-left: 6px;">SELECTED</span>` : ''}</td>`;
                              }
                              const val = r.values[c.id] || '-';
                              const converted = convertMeasurementString(val, this.chart!.defaultUnit, this.activeUnit);
                              return `<td style="padding: 10px 14px; font-family: monospace;">${converted}</td>`;
                            }).join('')}
                          </tr>
                        `;
                      }).join('')}
                    </tbody>
                  </table>
                </div>

                ${this.chart.measurementGuide && this.chart.measurementGuide.length > 0 ? `
                  <div style="border-top: 1px solid #e2e8f0; padding-top: 16px;">
                    <h4 style="font-size: 14px; font-weight: 700; margin: 0 0 10px; color: #0f172a;">${t('builder.measurementGuideSection')}</h4>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px;">
                      ${this.chart.measurementGuide.map((m) => `
                        <div style="padding: 10px; border-radius: 6px; background: #f8fafc; border: 1px solid #e2e8f0;">
                          <div style="font-weight: 700; font-size: 12px; color: #0f172a; margin-bottom: 2px;">${m.title}</div>
                          <div style="font-size: 11px; color: #64748b; line-height: 1.4;">${m.description}</div>
                        </div>
                      `).join('')}
                    </div>
                  </div>
                ` : ''}
              </div>
            </div>
          </div>
        ` : ''}
      </div>
    `;

    this.attachEventListeners();
  }

  private attachEventListeners() {
    const triggerBtn = this.querySelector('#sg-trigger-btn');
    if (triggerBtn) triggerBtn.addEventListener('click', () => this.toggleModal(true));

    const closeBtn = this.querySelector('#sg-close-btn');
    if (closeBtn) closeBtn.addEventListener('click', () => this.toggleModal(false));

    const backdrop = this.querySelector('#sg-backdrop');
    if (backdrop) {
      backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) this.toggleModal(false);
      });
    }

    const cmBtn = this.querySelector('#sg-unit-cm');
    if (cmBtn) {
      cmBtn.addEventListener('click', () => {
        this.activeUnit = 'cm';
        trackEvent('UNIT_CHANGED', { unit: 'cm', chartId: this.chart?._id });
        this.render();
      });
    }

    const inBtn = this.querySelector('#sg-unit-in');
    if (inBtn) {
      inBtn.addEventListener('click', () => {
        this.activeUnit = 'in';
        trackEvent('UNIT_CHANGED', { unit: 'in', chartId: this.chart?._id });
        this.render();
      });
    }

    const startFitBtn = this.querySelector('#sg-start-fit');
    if (startFitBtn) {
      startFitBtn.addEventListener('click', () => {
        this.isFitFinderOpen = true;
        this.fitStep = 1;
        trackEvent('FIT_FINDER_STARTED', { chartId: this.chart?._id });
        this.render();
      });
    }

    const closeFitBtn = this.querySelector('#sg-close-fit');
    if (closeFitBtn) {
      closeFitBtn.addEventListener('click', () => {
        this.isFitFinderOpen = false;
        this.render();
      });
    }

    const next1 = this.querySelector('#fit-next-1');
    if (next1) {
      next1.addEventListener('click', () => {
        const hInput = this.querySelector('#fit-input-height') as HTMLInputElement;
        const wInput = this.querySelector('#fit-input-weight') as HTMLInputElement;
        if (hInput) this.fitAnswers.height = parseFloat(hInput.value) || undefined;
        if (wInput) this.fitAnswers.weight = parseFloat(wInput.value) || undefined;
        this.fitStep = 2;
        this.render();
      });
    }

    const next2 = this.querySelector('#fit-next-2');
    if (next2) {
      next2.addEventListener('click', () => {
        const cInput = this.querySelector('#fit-input-chest') as HTMLInputElement;
        const wInput = this.querySelector('#fit-input-waist') as HTMLInputElement;
        if (cInput) this.fitAnswers.chest = parseFloat(cInput.value) || undefined;
        if (wInput) this.fitAnswers.waist = parseFloat(wInput.value) || undefined;
        this.fitStep = 3;
        this.render();
      });
    }

    const back2 = this.querySelector('#fit-back-2');
    if (back2) back2.addEventListener('click', () => { this.fitStep = 1; this.render(); });

    const back3 = this.querySelector('#fit-back-3');
    if (back3) back3.addEventListener('click', () => { this.fitStep = 2; this.render(); });

    const prefBtns = this.querySelectorAll('.fit-pref-btn');
    prefBtns.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const pref = (e.currentTarget as HTMLElement).getAttribute('data-pref') as any;
        this.fitAnswers.preference = pref;
        this.render();
      });
    });

    const calcBtn = this.querySelector('#fit-calculate');
    if (calcBtn) {
      calcBtn.addEventListener('click', () => this.submitFitCalculation());
    }

    const restartBtn = this.querySelector('#fit-restart');
    if (restartBtn) {
      restartBtn.addEventListener('click', () => {
        this.fitStep = 1;
        this.fitRecommendation = null;
        this.render();
      });
    }
  }
}

export default SizeChartSitePluginElement;
