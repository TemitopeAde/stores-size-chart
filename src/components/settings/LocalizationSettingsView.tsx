import React from 'react';
import { useTranslation } from '../../i18n';
import { SUPPORTED_LOCALES } from '../../i18n/config';
import { SupportedLocale } from '../../i18n/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Badge } from '../ui/badge';
import { Globe2, Languages, Check } from 'lucide-react';
import { toast } from 'sonner';

export const LocalizationSettingsView: React.FC = () => {
  const { t, locale, setLocale } = useTranslation();

  const handleLanguageChange = (code: SupportedLocale) => {
    setLocale(code);
    toast.success(t('settings.langChanged', { lang: SUPPORTED_LOCALES[code].name }));
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-8">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <Globe2 className="h-5 w-5 text-primary" />
          {t('settings.localizationTitle')}
        </h2>
        <p className="text-sm text-muted-foreground mt-0.5">{t('settings.localizationDesc')}</p>
      </div>

      {/* Dashboard Language Selector */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Languages className="h-4 w-4 text-primary" />
            {t('settings.appLanguage')}
          </CardTitle>
          <CardDescription>{t('settings.dashboardLangDesc')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
            {Object.values(SUPPORTED_LOCALES).map((item) => {
              const isSelected = locale === item.code;
              return (
                <button
                  key={item.code}
                  type="button"
                  onClick={() => handleLanguageChange(item.code)}
                  className={`p-3 rounded-lg border text-left flex items-center justify-between transition-colors ${
                    isSelected
                      ? 'border-primary bg-primary/10 text-primary font-semibold'
                      : 'border-border hover:bg-muted/40 text-foreground'
                  }`}
                >
                  <div>
                    <span className="text-xs block">{item.name}</span>
                    <span className="text-[11px] text-muted-foreground">{item.nativeName}</span>
                  </div>
                  {isSelected && <Check className="h-4 w-4 text-primary" />}
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Storefront Visitor Language Behavior */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">{t('settings.visitorLanguage')}</CardTitle>
          <CardDescription>
            {t('settings.visitorLangDesc')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-xs text-muted-foreground">
          <div className="p-3 rounded-lg border border-border bg-muted/20 space-y-1">
            <span className="font-semibold text-foreground block">{t('settings.resolutionTitle')}</span>
            <p>{t('settings.resStep1')}</p>
            <p>{t('settings.resStep2')}</p>
            <p>{t('settings.resStep3')}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

