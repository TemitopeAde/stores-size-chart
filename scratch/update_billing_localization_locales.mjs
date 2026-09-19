import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const localesDir = path.resolve(__dirname, '../src/i18n/locales');

const translations = {
  en: {
    settings: {
      langChanged: "Language set to {{lang}}",
      dashboardLangDesc: "Select the active language for the merchant dashboard.",
      visitorLangDesc: "The storefront Size Guide automatically displays in the visitor's Wix site language with full fallback to English.",
      resolutionTitle: "Automatic Storefront Resolution:",
      resStep1: "1. Requested Wix Visitor Site Locale (e.g. Spanish, German, French, Arabic)",
      resStep2: "2. Merchant custom translations (if provided)",
      resStep3: "3. Canonical application fallback"
    },
    billing: {
      managedThroughWix: "Managed through Wix App Market",
      proPlanDesc: "Unlimited size charts, category assignments, Smart Fit Finder, and 20 languages.",
      starterPlanDesc: "Up to 5 size charts, product page site plugin, and CM/IN conversion.",
      manageSubscriptionBtn: "Manage Subscription",
      starterSubtitle: "Basic chart tables",
      featureUpTo5: "Up to 5 Size Charts",
      featureSitePlugin: "Product Page Site Plugin",
      featureUnitConversion: "CM / IN Conversion",
      proPlanTitle: "Pro Plan (All Features)",
      recommendedBadge: "Recommended",
      proSubtitle: "Full conversion suite",
      featureUnlimitedCharts: "Unlimited Size Charts & Measurements",
      featureCategoryRules: "Category & Advanced Rule Assignments",
      featureFitFinder: "Smart Fit Finder (Deterministic recommendations)",
      featureVariantHighlight: "Realtime Variant-Aware Highlighting",
      feature20Languages: "20 Languages + Full RTL Support"
    }
  },
  es: {
    settings: {
      langChanged: "Idioma establecido en {{lang}}",
      dashboardLangDesc: "Selecciona el idioma activo para el panel de control.",
      visitorLangDesc: "La Guía de Tallas de la tienda se muestra automáticamente en el idioma del visitante del sitio Wix con respaldo en inglés.",
      resolutionTitle: "Resolución Automática en la Tienda:",
      resStep1: "1. Idioma del visitante en el sitio Wix (ej. español, alemán, francés, árabe)",
      resStep2: "2. Traducciones personalizadas del comerciante (si están disponibles)",
      resStep3: "3. Idioma predeterminado canónico de la aplicación"
    },
    billing: {
      managedThroughWix: "Administrado a través de Wix App Market",
      proPlanDesc: "Tablas de tallas ilimitadas, asignaciones por categoría, recomendador inteligente y 20 idiomas.",
      starterPlanDesc: "Hasta 5 tablas de tallas, plugin de página de producto y conversión CM / IN.",
      manageSubscriptionBtn: "Gestionar Suscripción",
      starterSubtitle: "Tablas de medidas básicas",
      featureUpTo5: "Hasta 5 Tablas de Tallas",
      featureSitePlugin: "Plugin en Página de Producto",
      featureUnitConversion: "Conversión CM / IN",
      proPlanTitle: "Plan Pro (Todas las Funciones)",
      recommendedBadge: "Recomendado",
      proSubtitle: "Paquete completo de conversión",
      featureUnlimitedCharts: "Tablas de Tallas y Medidas Ilimitadas",
      featureCategoryRules: "Asignación por Categorías y Reglas Avanzadas",
      featureFitFinder: "Recomendador Inteligente de Tallas (Fit Finder)",
      featureVariantHighlight: "Resaltado en Tiempo Real según Variante",
      feature20Languages: "20 Idiomas + Compatibilidad Total RTL"
    }
  },
  fr: {
    settings: {
      langChanged: "Langue définie sur {{lang}}",
      dashboardLangDesc: "Sélectionnez la langue active pour le tableau de bord marchand.",
      visitorLangDesc: "Le guide des tailles s'affiche automatiquement dans la langue du visiteur du site Wix avec secours en anglais.",
      resolutionTitle: "Résolution Automatique sur la Boutique :",
      resStep1: "1. Langue demandée par le visiteur Wix (ex. français, espagnol, allemand, arabe)",
      resStep2: "2. Traductions personnalisées du marchand (si renseignées)",
      resStep3: "3. Repli automatique sur la langue canonique"
    },
    billing: {
      managedThroughWix: "Géré via le Wix App Market",
      proPlanDesc: "Guides des tailles illimités, règles par catégorie, Smart Fit Finder et 20 langues.",
      starterPlanDesc: "Jusqu'à 5 guides des tailles, plugin de page produit et conversion CM / IN.",
      manageSubscriptionBtn: "Gérer l'Abonnement",
      starterSubtitle: "Tableaux de mesures basiques",
      featureUpTo5: "Jusqu'à 5 Guides des Tailles",
      featureSitePlugin: "Plugin de Page Produit",
      featureUnitConversion: "Conversion CM / IN",
      proPlanTitle: "Plan Pro (Toutes les fonctionnalités)",
      recommendedBadge: "Recommandé",
      proSubtitle: "Suite complète de conversion",
      featureUnlimitedCharts: "Guides des Tailles & Mesures Illimités",
      featureCategoryRules: "Règles Avancées & Assignations par Catégorie",
      featureFitFinder: "Smart Fit Finder (Recommandations précises)",
      featureVariantHighlight: "Mise en avant dynamique selon la variante",
      feature20Languages: "20 Langues + Prise en charge RTL complète"
    }
  },
  de: {
    settings: {
      langChanged: "Sprache auf {{lang}} eingestellt",
      dashboardLangDesc: "Wählen Sie die aktive Sprache für das Händler-Dashboard aus.",
      visitorLangDesc: "Der Größenguide im Storefront wird automatisch in der Sprache des Besuchers angezeigt (mit englischem Fallback).",
      resolutionTitle: "Automatische Storefront-Auflösung:",
      resStep1: "1. Sprache des Wix-Website-Besuchers (z. B. Deutsch, Spanisch, Französisch, Arabisch)",
      resStep2: "2. Benutzerdefinierte Händlerübersetzungen (falls vorhanden)",
      resStep3: "3. Standardmäßiger Anwendungs-Fallback"
    },
    billing: {
      managedThroughWix: "Verwaltet über den Wix App Market",
      proPlanDesc: "Unbegrenzte Größentabellen, Kategorie-Zuweisungen, Smart Fit Finder und 20 Sprachen.",
      starterPlanDesc: "Bis zu 5 Größentabellen, Produktseiten-Plugin und CM/IN-Umrechnung.",
      manageSubscriptionBtn: "Abonnement Verwalten",
      starterSubtitle: "Grundlegende Größentabellen",
      featureUpTo5: "Bis zu 5 Größentabellen",
      featureSitePlugin: "Produktseiten-Site-Plugin",
      featureUnitConversion: "CM / IN Umrechnung",
      proPlanTitle: "Pro Plan (Alle Funktionen)",
      recommendedBadge: "Empfohlen",
      proSubtitle: "Komplette Conversion-Suite",
      featureUnlimitedCharts: "Unbegrenzte Größentabellen & Maße",
      featureCategoryRules: "Kategorie- & Erweiterte Regelzuweisungen",
      featureFitFinder: "Smart Fit Finder (Präzise Größenempfehlungen)",
      featureVariantHighlight: "Echtzeit-Hervorhebung nach Varianten",
      feature20Languages: "20 Sprachen + Vollständige RTL-Unterstützung"
    }
  },
  it: {
    settings: {
      langChanged: "Lingua impostata su {{lang}}",
      dashboardLangDesc: "Seleziona la lingua attiva per la dashboard del venditore.",
      visitorLangDesc: "La Guida alle Taglie si visualizza automaticamente nella lingua del visitatore del sito Wix con fallback in inglese.",
      resolutionTitle: "Risoluzione Automatica nel Negozio:",
      resStep1: "1. Lingua del visitatore del sito Wix (es. italiano, spagnolo, francese, arabo)",
      resStep2: "2. Traduzioni personalizzate del venditore (se fornite)",
      resStep3: "3. Lingua canonica predefinita dell'applicazione"
    },
    billing: {
      managedThroughWix: "Gestito tramite Wix App Market",
      proPlanDesc: "Tabelle delle taglie illimitate, assegnazioni di categoria, Smart Fit Finder e 20 lingue.",
      starterPlanDesc: "Fino a 5 tabelle di taglie, plugin per la pagina del prodotto e conversione CM/IN.",
      manageSubscriptionBtn: "Gestisci Abbonamento",
      starterSubtitle: "Tabelle di misura di base",
      featureUpTo5: "Fino a 5 Tabelle Taglie",
      featureSitePlugin: "Plugin Pagina Prodotto",
      featureUnitConversion: "Conversione CM / IN",
      proPlanTitle: "Piano Pro (Tutte le Funzionalità)",
      recommendedBadge: "Consigliato",
      proSubtitle: "Suite completa per le conversioni",
      featureUnlimitedCharts: "Tabelle Taglie e Misure Illimitate",
      featureCategoryRules: "Regole Avanzate e Assegnazioni per Categoria",
      featureFitFinder: "Smart Fit Finder (Raccomandazioni deterministiche)",
      featureVariantHighlight: "Evidenziazione dinamica della variante",
      feature20Languages: "20 Lingue + Supporto RTL completo"
    }
  },
  pt: {
    settings: {
      langChanged: "Idioma definido como {{lang}}",
      dashboardLangDesc: "Selecione o idioma ativo para o painel do lojista.",
      visitorLangDesc: "O Guia de Tamanhos é exibido automaticamente no idioma do visitante do site Wix com fallback para o inglês.",
      resolutionTitle: "Resolução Automática na Loja Virtual:",
      resStep1: "1. Idioma do visitante no site Wix (ex: português, espanhol, francês, árabe)",
      resStep2: "2. Traduções personalizadas do lojista (se fornecidas)",
      resStep3: "3. Idioma padrão canônico do aplicativo"
    },
    billing: {
      managedThroughWix: "Gerenciado pelo Wix App Market",
      proPlanDesc: "Tabelas de medidas ilimitadas, atribuições por categoria, Smart Fit Finder e 20 idiomas.",
      starterPlanDesc: "Até 5 tabelas de medidas, plugin de página de produto e conversão CM / IN.",
      manageSubscriptionBtn: "Gerenciar Assinatura",
      starterSubtitle: "Tabelas de medidas básicas",
      featureUpTo5: "Até 5 Tabelas de Medidas",
      featureSitePlugin: "Plugin da Página de Produto",
      featureUnitConversion: "Conversão CM / IN",
      proPlanTitle: "Plano Pro (Todos os Recursos)",
      recommendedBadge: "Recomendado",
      proSubtitle: "Pacote completo de conversão",
      featureUnlimitedCharts: "Tabelas de Medidas Ilimitadas",
      featureCategoryRules: "Atribuição por Categoria e Regras Avançadas",
      featureFitFinder: "Smart Fit Finder (Recomendações precisas)",
      featureVariantHighlight: "Destaque em Tempo Real por Variante",
      feature20Languages: "20 Idiomas + Suporte RTL Completo"
    }
  },
  nl: {
    settings: {
      langChanged: "Taal ingesteld op {{lang}}",
      dashboardLangDesc: "Selecteer de actieve taal voor het winkeliersdashboard.",
      visitorLangDesc: "De maattabel wordt automatisch weergegeven in de taal van de Wix-sitebezoeker met Engelse fallback.",
      resolutionTitle: "Automatische Storefront-Resolutie:",
      resStep1: "1. Gevraagde Wix-sitebezoekerstaal (bijv. Nederlands, Spaans, Duits, Arabisch)",
      resStep2: "2. Aangepaste vertalingen van de winkelier (indien opgegeven)",
      resStep3: "3. Standaard app-fallback"
    },
    billing: {
      managedThroughWix: "Beheerd via Wix App Market",
      proPlanDesc: "Onbeperkt aantal maattabellen, categorietoewijzingen, Smart Fit Finder en 20 talen.",
      starterPlanDesc: "Tot 5 maattabellen, productpagina-siteplugin en CM/IN-conversie.",
      manageSubscriptionBtn: "Abonnement Beheren",
      starterSubtitle: "Eenvoudige maattabellen",
      featureUpTo5: "Tot 5 Maattabellen",
      featureSitePlugin: "Productpagina Site-Plugin",
      featureUnitConversion: "CM / IN Conversie",
      proPlanTitle: "Pro Plan (Alle Functies)",
      recommendedBadge: "Aanbevolen",
      proSubtitle: "Volledige conversiesuite",
      featureUnlimitedCharts: "Onbeperkte Maattabellen & Maten",
      featureCategoryRules: "Categorieën & Geavanceerde Regels",
      featureFitFinder: "Smart Fit Finder (Nauwkeurige aanbevelingen)",
      featureVariantHighlight: "Realtime variant-specifieke markering",
      feature20Languages: "20 Talen + Volledige RTL-ondersteuning"
    }
  },
  ja: {
    settings: {
      langChanged: "言語が {{lang}} に設定されました",
      dashboardLangDesc: "マーチャントダッシュボードのアクティブ言語を選択します。",
      visitorLangDesc: "ストアフロントのサイズガイドは、訪問者のWixサイト言語で自動表示されます（英語へのフォールバックあり）。",
      resolutionTitle: "ストアフロントでの自動解決順序:",
      resStep1: "1. 訪問者のWixサイト言語（日本語、英語、スペイン語、アラビア語など）",
      resStep2: "2. ショップオーナーによるカスタム翻訳（設定されている場合）",
      resStep3: "3. アプリケーションの標準フォールバック言語"
    },
    billing: {
      managedThroughWix: "Wix App Market 経由で管理",
      proPlanDesc: "無制限のサイズ表、カテゴリ割り当て、スマートフィットファインダー、20言語対応。",
      starterPlanDesc: "最大5個のサイズ表、商品ページプラグイン、CM/IN単位変換。",
      manageSubscriptionBtn: "プランの管理",
      starterSubtitle: "基本的なサイズ表",
      featureUpTo5: "最大5個のサイズ表",
      featureSitePlugin: "商品ページ用サイトプラグイン",
      featureUnitConversion: "CM / IN 単位変換",
      proPlanTitle: "Pro プラン (全機能)",
      recommendedBadge: "おすすめ",
      proSubtitle: "完全なコンバージョン向上スイート",
      featureUnlimitedCharts: "サイズ表・測定値の無制限作成",
      featureCategoryRules: "カテゴリ・高度なルール自動割り当て",
      featureFitFinder: "スマートフィットファインダー（高精度サイズ推薦）",
      featureVariantHighlight: "バリアント選択に応じたリアルタイム強調表示",
      feature20Languages: "20言語対応 ＋ 完全なRTL（右横書き）サポート"
    }
  },
  ko: {
    settings: {
      langChanged: "언어가 {{lang}}(으)로 설정되었습니다",
      dashboardLangDesc: "관리자 대시보드의 활성 언어를 선택합니다.",
      visitorLangDesc: "스토어프론트 사이즈 가이드는 방문자의 Wix 사이트 언어로 자동 표시됩니다 (영어 대체 지원).",
      resolutionTitle: "스토어프론트 자동 언어 결정:",
      resStep1: "1. 방문자의 Wix 사이트 언어 (예: 한국어, 영어, 스페인어, 아랍어)",
      resStep2: "2. 상점 운영자 맞춤 번역 (입력된 경우)",
      resStep3: "3. 표준 애플리케이션 기본값"
    },
    billing: {
      managedThroughWix: "Wix App Market을 통해 관리됨",
      proPlanDesc: "무제한 사이즈표, 카테고리 지정, 스마트 핏 파인더 및 20개 언어 지원.",
      starterPlanDesc: "최대 5개의 사이즈표, 상품 페이지 플러그인 및 CM/IN 변환 지원.",
      manageSubscriptionBtn: "구독 관리",
      starterSubtitle: "기본 사이즈표",
      featureUpTo5: "최대 5개 사이즈표",
      featureSitePlugin: "상품 페이지 사이트 플러그인",
      featureUnitConversion: "CM / IN 변환",
      proPlanTitle: "Pro 플랜 (모든 기능)",
      recommendedBadge: "추천",
      proSubtitle: "완벽한 전환 최적화 패키지",
      featureUnlimitedCharts: "무제한 사이즈표 및 측정 항목",
      featureCategoryRules: "카테고리 및 고급 조건 규칙 자동 할당",
      featureFitFinder: "스마트 핏 파인더 (정밀 사이즈 추천 엔진)",
      featureVariantHighlight: "옵션 선택 시 실시간 하이라이트",
      feature20Languages: "20개 언어 지원 + 완전한 RTL 지원"
    }
  },
  "zh-CN": {
    settings: {
      langChanged: "语言已设置为 {{lang}}",
      dashboardLangDesc: "选择商家管理后台的当前显示语言。",
      visitorLangDesc: "店铺前台的尺码指南会自动以访客的 Wix 网站语言显示，并支持英文后备方案。",
      resolutionTitle: "店铺前台语言自动解析规则：",
      resStep1: "1. 访客请求的 Wix 网站语言（如简体中文、西班牙语、德语、阿拉伯语等）",
      resStep2: "2. 商家自定义翻译（如已配置）",
      resStep3: "3. 应用程序标准回退语言"
    },
    billing: {
      managedThroughWix: "通过 Wix App Market 管理",
      proPlanDesc: "无限数量尺码表、品类规则关联、智能测码助手及 20 种语言支持。",
      starterPlanDesc: "最多 5 个尺码表、商品详情页插件及 CM / IN 单位转换。",
      manageSubscriptionBtn: "管理订阅",
      starterSubtitle: "基础尺码表",
      featureUpTo5: "最多 5 个尺码表",
      featureSitePlugin: "商品详情页插件",
      featureUnitConversion: "CM / IN 单位换算",
      proPlanTitle: "Pro 专业版（完整功能）",
      recommendedBadge: "推荐",
      proSubtitle: "全功能销售转化套件",
      featureUnlimitedCharts: "无限尺码表与测量维度",
      featureCategoryRules: "品类与高级条件匹配规则",
      featureFitFinder: "智能测码助手（精准尺码推荐）",
      featureVariantHighlight: "根据所选变体实时高亮",
      feature20Languages: "20 种语言支持 + 完整 RTL 布局适配"
    }
  },
  "zh-TW": {
    settings: {
      langChanged: "語言已設定為 {{lang}}",
      dashboardLangDesc: "選擇商家管理後台的當前顯示語言。",
      visitorLangDesc: "商店前台的尺碼指南會自動以訪客的 Wix 網站語言顯示，並支援英文備用方案。",
      resolutionTitle: "商店前台語言自動解析規則：",
      resStep1: "1. 訪客請求的 Wix 網站語言（如繁體中文、西班牙語、德語、阿拉伯語等）",
      resStep2: "2. 商家自訂翻譯（如有設定）",
      resStep3: "3. 應用程式標準回退語言"
    },
    billing: {
      managedThroughWix: "透過 Wix App Market 管理",
      proPlanDesc: "無限數量尺碼表、分類規則關聯、智能測碼助手及 20 種語言支援。",
      starterPlanDesc: "最多 5 個尺碼表、商品詳情頁外掛程式及 CM / IN 單位轉換。",
      manageSubscriptionBtn: "管理訂閱",
      starterSubtitle: "基礎尺碼表",
      featureUpTo5: "最多 5 個尺碼表",
      featureSitePlugin: "商品詳情頁外掛程式",
      featureUnitConversion: "CM / IN 單位轉換",
      proPlanTitle: "Pro 專業版（完整功能）",
      recommendedBadge: "推薦",
      proSubtitle: "全功能銷售轉換套件",
      featureUnlimitedCharts: "無限尺碼表與測量維度",
      featureCategoryRules: "分類與進階條件匹配規則",
      featureFitFinder: "智能測碼助手（精準尺碼推薦）",
      featureVariantHighlight: "根據所選規格即時反白標記",
      feature20Languages: "20 種語言支援 + 完整 RTL 版面適配"
    }
  },
  pl: {
    settings: {
      langChanged: "Język ustawiony na {{lang}}",
      dashboardLangDesc: "Wybierz aktywny język panelu administracyjnego.",
      visitorLangDesc: "Przewodnik po rozmiarach w sklepie wyświetla się automatycznie w języku strony Wix odwiedzającego.",
      resolutionTitle: "Automatyczne rozpoznawanie języka w sklepie:",
      resStep1: "1. Język odwiedzającego witrynę Wix (np. polski, hiszpański, niemiecki, arabski)",
      resStep2: "2. Niestandardowe tłumaczenia sprzedawcy (jeśli podano)",
      resStep3: "3. Domyślny język aplikacji"
    },
    billing: {
      managedThroughWix: "Zarządzane przez Wix App Market",
      proPlanDesc: "Nielimitowane tabele rozmiarów, przypisania kategorii, Smart Fit Finder i 20 języków.",
      starterPlanDesc: "Do 5 tabel rozmiarów, wtyczka do strony produktu i konwersja CM / IN.",
      manageSubscriptionBtn: "Zarządzaj Subskrypcją",
      starterSubtitle: "Podstawowe tabele rozmiarów",
      featureUpTo5: "Do 5 Tabel Rozmiarów",
      featureSitePlugin: "Wtyczka do Strony Produktu",
      featureUnitConversion: "Konwersja CM / IN",
      proPlanTitle: "Plan Pro (Wszystkie Funkcje)",
      recommendedBadge: "Polecany",
      proSubtitle: "Kompletny pakiet konwersji",
      featureUnlimitedCharts: "Nielimitowane Tabele Rozmiarów i Wymiary",
      featureCategoryRules: "Zaawansowane Reguły i Przypisania do Kategorii",
      featureFitFinder: "Smart Fit Finder (Precyzyjne rekomendacje rozmiaru)",
      featureVariantHighlight: "Podświetlanie wariantu w czasie rzeczywistym",
      feature20Languages: "20 Języków + Pełna obsługa RTL"
    }
  },
  sv: {
    settings: {
      langChanged: "Språk ändrat till {{lang}}",
      dashboardLangDesc: "Välj aktivt språk för administratörspanelen.",
      visitorLangDesc: "Storleksguiden i butiken visas automatiskt på Wix-webbplatsens besökarspråk med engelsk fallback.",
      resolutionTitle: "Automatisk Språkidentifiering:",
      resStep1: "1. Wix-webbplatsens besökarspråk (t.ex. svenska, spanska, tyska, arabiska)",
      resStep2: "2. Butiksägarens anpassade översättningar (om tillgängliga)",
      resStep3: "3. Applikationens standard fallback"
    },
    billing: {
      managedThroughWix: "Hanteras via Wix App Market",
      proPlanDesc: "Obegränsat antal storlekstabeller, kategorikopplingar, Smart Fit Finder och 20 språk.",
      starterPlanDesc: "Upp till 5 storlekstabeller, produktsides-plugin och CM/IN-omvandling.",
      manageSubscriptionBtn: "Hantera Prenumeration",
      starterSubtitle: "Enkla storlekstabeller",
      featureUpTo5: "Upp till 5 Storlekstabeller",
      featureSitePlugin: "Produktsides-plugin",
      featureUnitConversion: "CM / IN Omvandling",
      proPlanTitle: "Pro Plan (Alla Funktioner)",
      recommendedBadge: "Rekommenderad",
      proSubtitle: "Komplett konverteringspaket",
      featureUnlimitedCharts: "Obegränsade Storlekstabeller & Mått",
      featureCategoryRules: "Kategori- & Avancerade Villkorsregler",
      featureFitFinder: "Smart Fit Finder (Exakta storleksrekommendationer)",
      featureVariantHighlight: "Realtidsmarkering efter vald variant",
      feature20Languages: "20 Språk + Fullt RTL-stöd"
    }
  },
  da: {
    settings: {
      langChanged: "Sprog sat til {{lang}}",
      dashboardLangDesc: "Vælg det aktive sprog for forhandlerens betjeningspanel.",
      visitorLangDesc: "Størrelsesguiden i butikken vises automatisk på den besøgendes Wix-webstedssprog med engelsk fallback.",
      resolutionTitle: "Automatisk Sprogvalg i Butikken:",
      resStep1: "1. Wix-webstedets besøgssprog (f.eks. dansk, spansk, tysk, arabisk)",
      resStep2: "2. Forhandlerens tilpassede oversættelser (hvis angivet)",
      resStep3: "3. Standard program-fallback"
    },
    billing: {
      managedThroughWix: "Administreres via Wix App Market",
      proPlanDesc: "Ubegrænsede størrelsesskemaer, kategoritildelinger, Smart Fit Finder og 20 sprog.",
      starterPlanDesc: "Op til 5 størrelsesskemaer, produktside-plugin og CM/IN-konvertering.",
      manageSubscriptionBtn: "Administrer Abonnement",
      starterSubtitle: "Grundlæggende størrelsestabeller",
      featureUpTo5: "Op til 5 Størrelsesskemaer",
      featureSitePlugin: "Produktside Site-Plugin",
      featureUnitConversion: "CM / IN Konvertering",
      proPlanTitle: "Pro Plan (Alle Funktioner)",
      recommendedBadge: "Anbefalet",
      proSubtitle: "Komplet konverteringspakke",
      featureUnlimitedCharts: "Ubegrænsede Størrelsesskemaer & Mål",
      featureCategoryRules: "Kategori- & Avancerede Regeltildelinger",
      featureFitFinder: "Smart Fit Finder (Præcise størrelsesanbefalinger)",
      featureVariantHighlight: "Realtidsfremhævning af variant",
      feature20Languages: "20 Sprog + Fuld RTL-understøttelse"
    }
  },
  fi: {
    settings: {
      langChanged: "Kieleksi asetettu {{lang}}",
      dashboardLangDesc: "Valitse kauppiaan hallintapaneelin aktiivinen kieli.",
      visitorLangDesc: "Kaupan koko-opas näkyy automaattisesti Wix-sivuston vierailijan kielellä (englanninkielisellä varavalinnalla).",
      resolutionTitle: "Automaattinen kielen valinta kaupassa:",
      resStep1: "1. Wix-sivuston vierailijan kieli (esim. suomi, espanja, saksa, arabia)",
      resStep2: "2. Kauppiaan omat käännökset (jos määritetty)",
      resStep3: "3. Sovelluksen oletusvarakieli"
    },
    billing: {
      managedThroughWix: "Hallinnoidaan Wix App Marketin kautta",
      proPlanDesc: "Rajoittamattomat kokotaulukot, kategoriajaot, Smart Fit Finder ja 20 kieltä.",
      starterPlanDesc: "Jopa 5 kokotaulukkoa, tuotesivun lisäosa ja CM/IN-muunnos.",
      manageSubscriptionBtn: "Hallinnoi Tilausta",
      starterSubtitle: "Peruskokotaulukot",
      featureUpTo5: "Jopa 5 Kokotaulukkoa",
      featureSitePlugin: "Tuotesivun Sivustolisäosa",
      featureUnitConversion: "CM / IN Muunnos",
      proPlanTitle: "Pro-sopimus (Kaikki Ominaisuudet)",
      recommendedBadge: "Suositeltu",
      proSubtitle: "Täysi konversiopaketti",
      featureUnlimitedCharts: "Rajoittamattomat Kokotaulukot & Mitat",
      featureCategoryRules: "Kategoria- & Edistyneet Sääntömääritykset",
      featureFitFinder: "Smart Fit Finder (Tarkat kokosuositukset)",
      featureVariantHighlight: "Reaaliaikainen variantin korostus",
      feature20Languages: "20 Kieltä + Täysi RTL-tuki"
    }
  },
  no: {
    settings: {
      langChanged: "Språk satt til {{lang}}",
      dashboardLangDesc: "Velg aktivt språk for kontrollpanelet.",
      visitorLangDesc: "Størrelsesguiden i butikken vises automatisk på besøkerens Wix-nettstedspråk med engelsk reserve.",
      resolutionTitle: "Automatisk Språkhåndtering i Butikken:",
      resStep1: "1. Besøkendes språk på Wix-nettstedet (f.eks. norsk, spansk, tysk, arabisk)",
      resStep2: "2. Butikkeiers egne oversettelser (hvis oppgitt)",
      resStep3: "3. Standard applikasjonsreserve"
    },
    billing: {
      managedThroughWix: "Administreres via Wix App Market",
      proPlanDesc: "Ubegrensede størrelsestabeller, kategoritilordninger, Smart Fit Finder og 20 språk.",
      starterPlanDesc: "Opptil 5 størrelsestabeller, produktside-plugin og CM/IN-konvertering.",
      manageSubscriptionBtn: "Administrer Abonnement",
      starterSubtitle: "Enkle størrelsestabeller",
      featureUpTo5: "Opptil 5 Størrelsestabeller",
      featureSitePlugin: "Produktside Site-Plugin",
      featureUnitConversion: "CM / IN Konvertering",
      proPlanTitle: "Pro Plan (Alle Funksjoner)",
      recommendedBadge: "Anbefalt",
      proSubtitle: "Komplett konverteringspakke",
      featureUnlimitedCharts: "Ubegrensede Størrelsestabeller & Mål",
      featureCategoryRules: "Kategori- & Avanserte Regeltilordninger",
      featureFitFinder: "Smart Fit Finder (Nøyaktige størrelsesanbefalinger)",
      featureVariantHighlight: "Sanntids fremheving av valgt variant",
      feature20Languages: "20 Språk + Full RTL-støtte"
    }
  },
  tr: {
    settings: {
      langChanged: "Dil {{lang}} olarak ayarlandı",
      dashboardLangDesc: "Satıcı kontrol paneli için aktif dili seçin.",
      visitorLangDesc: "Mağaza Beden Rehberi, ziyaretçinin Wix site dilinde otomatik olarak görüntülenir.",
      resolutionTitle: "Mağazada Otomatik Dil Belirleme:",
      resStep1: "1. İstenen Wix Ziyaretçi Sitesi Dili (örn. Türkçe, İspanyolca, Almanca, Arapça)",
      resStep2: "2. Satıcı özel çevirileri (varsa)",
      resStep3: "3. Uygulama standart geri dönüş dili"
    },
    billing: {
      managedThroughWix: "Wix App Market üzerinden yönetilir",
      proPlanDesc: "Sınırsız beden tablosu, kategori eşleme, Akıllı Beden Bulucu ve 20 dil.",
      starterPlanDesc: "5 adede kadar beden tablosu, ürün sayfası eklentisi ve CM/IN birim dönüştürme.",
      manageSubscriptionBtn: "Aboneliği Yönet",
      starterSubtitle: "Temel beden tabloları",
      featureUpTo5: "5 Adede Kadar Beden Tablosu",
      featureSitePlugin: "Ürün Sayfası Eklentisi",
      featureUnitConversion: "CM / IN Dönüştürme",
      proPlanTitle: "Pro Plan (Tüm Özellikler)",
      recommendedBadge: "Önerilen",
      proSubtitle: "Eksiksiz dönüşüm paketi",
      featureUnlimitedCharts: "Sınırsız Beden Tablosu ve Ölçüm",
      featureCategoryRules: "Kategori ve Gelişmiş Kural Eşleme",
      featureFitFinder: "Akıllı Beden Bulucu (Hassas beden önerileri)",
      featureVariantHighlight: "Varyanta göre gerçek zamanlı vurgulama",
      feature20Languages: "20 Dil + Tam RTL Desteği"
    }
  },
  id: {
    settings: {
      langChanged: "Bahasa diubah ke {{lang}}",
      dashboardLangDesc: "Pilih bahasa aktif untuk dasbor pedagang.",
      visitorLangDesc: "Panduan Ukuran toko secara otomatis ditampilkan dalam bahasa situs Wix pengunjung dengan fallback bahasa Inggris.",
      resolutionTitle: "Resolusi Bahasa Otomatis di Toko:",
      resStep1: "1. Bahasa situs Wix pengunjung (mis. bahasa Indonesia, Spanyol, Jerman, Arab)",
      resStep2: "2. Terjemahan khusus penjual (jika disediakan)",
      resStep3: "3. Bahasa cadangan standar aplikasi"
    },
    billing: {
      managedThroughWix: "Dikelola melalui Wix App Market",
      proPlanDesc: "Bagan ukuran tak terbatas, pemetaan kategori, Pencari Ukuran Pintar, dan 20 bahasa.",
      starterPlanDesc: "Hingga 5 bagan ukuran, plugin halaman produk, dan konversi CM/IN.",
      manageSubscriptionBtn: "Kelola Langganan",
      starterSubtitle: "Bagan ukuran dasar",
      featureUpTo5: "Hingga 5 Bagan Ukuran",
      featureSitePlugin: "Plugin Halaman Produk",
      featureUnitConversion: "Konversi CM / IN",
      proPlanTitle: "Paket Pro (Semua Fitur)",
      recommendedBadge: "Direkomendasikan",
      proSubtitle: "Paket konversi lengkap",
      featureUnlimitedCharts: "Bagan Ukuran & Pengukuran Tanpa Batas",
      featureCategoryRules: "Pemetaan Kategori & Aturan Lanjutan",
      featureFitFinder: "Pencari Ukuran Pintar (Rekomendasi akurat)",
      featureVariantHighlight: "Penyorotan Varian Real-time",
      feature20Languages: "20 Bahasa + Dukungan RTL Penuh"
    }
  },
  hi: {
    settings: {
      langChanged: "भाषा {{lang}} पर सेट की गई",
      dashboardLangDesc: "व्यापारी डैशबोर्ड के लिए सक्रिय भाषा चुनें।",
      visitorLangDesc: "स्टोरफ्रंट साइज़ गाइड आगंतुक की Wix साइट भाषा में स्वचालित रूप से प्रदर्शित होता है।",
      resolutionTitle: "स्वचालित स्टोरफ्रंट भाषा निर्धारण:",
      resStep1: "1. आगंतुक Wix साइट भाषा (जैसे हिंदी, स्पैनिश, जर्मन, अरबी)",
      resStep2: "2. व्यापारी द्वारा कस्टम अनुवाद (यदि उपलब्ध हो)",
      resStep3: "3. एप्लिकेशन डिफ़ॉल्ट भाषा"
    },
    billing: {
      managedThroughWix: "Wix App Market के माध्यम से प्रबंधित",
      proPlanDesc: "असीमित साइज़ चार्ट, श्रेणी असाइनमेंट, स्मार्ट फिट फाइंडर और 20 भाषाएं।",
      starterPlanDesc: "5 साइज़ चार्ट तक, उत्पाद पृष्ठ साइट प्लगइन और CM/IN रूपांतरण।",
      manageSubscriptionBtn: "सदस्यता प्रबंधित करें",
      starterSubtitle: "बुनियादी साइज़ टेबल",
      featureUpTo5: "5 साइज़ चार्ट तक",
      featureSitePlugin: "उत्पाद पृष्ठ साइट प्लगइन",
      featureUnitConversion: "CM / IN रूपांतरण",
      proPlanTitle: "Pro प्लान (सभी सुविधाएं)",
      recommendedBadge: "अनुशंसित",
      proSubtitle: "पूर्ण रूपांतरण सुइट",
      featureUnlimitedCharts: "असीमित साइज़ चार्ट और माप",
      featureCategoryRules: "श्रेणी और उन्नत नियम असाइनमेंट",
      featureFitFinder: "स्मार्ट फिट फाइंडर (सटीक आकार सिफारिशें)",
      featureVariantHighlight: "वैरिएंट चयन अनुसार रीयलटाइम हाइलाइट",
      feature20Languages: "20 भाषाएं + पूर्ण RTL समर्थन"
    }
  },
  ar: {
    settings: {
      langChanged: "تم تعيين اللغة إلى {{lang}}",
      dashboardLangDesc: "حدد اللغة النشطة للوحة تحكم التاجر.",
      visitorLangDesc: "يتم عرض دليل المقاسات في المتجر تلقائيًا بلغة موقع Wix للزائر مع الاحتياط باللغة الإنجليزية.",
      resolutionTitle: "تحديد لغة المتجر التلقائي:",
      resStep1: "1. لغة زائر موقع Wix (مثل العربية، الإسبانية، الألمانية، الفرنسية)",
      resStep2: "2. ترجمات التاجر المخصصة (إذا تم إدخالها)",
      resStep3: "3. اللغة الاحتياطية القياسية للتطبيق"
    },
    billing: {
      managedThroughWix: "تتم الإدارة عبر Wix App Market",
      proPlanDesc: "جداول مقاسات غير محدودة، تعيينات الفئات، محدد المقاس الذكي، و20 لغة.",
      starterPlanDesc: "حتى 5 جداول مقاسات، ملحق صفحة المنتج، وتحويل سم / بوصة.",
      manageSubscriptionBtn: "إدارة الاشتراك",
      starterSubtitle: "جداول قياس أساسية",
      featureUpTo5: "حتى 5 جداول مقاسات",
      featureSitePlugin: "ملحق صفحة المنتج",
      featureUnitConversion: "تحويل سم / بوصة",
      proPlanTitle: "خطة Pro (جميع الميزات)",
      recommendedBadge: "موصى به",
      proSubtitle: "حزمة التحويل والمبيعات الكاملة",
      featureUnlimitedCharts: "جداول وقياسات غير محدودة",
      featureCategoryRules: "تعيينات الفئات والقواعد المتقدمة",
      featureFitFinder: "محدد المقاس الذكي (توصيات دقيقة للمقاس)",
      featureVariantHighlight: "تمييز مباشر بناءً على الخيار المحدد",
      feature20Languages: "20 لغة + دعم كامل للغة العربية (RTL)"
    }
  }
};

const files = fs.readdirSync(localesDir).filter(f => f.endsWith('.json'));

for (const file of files) {
  const lang = file.replace('.json', '');
  const filePath = path.join(localesDir, file);
  const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

  const langData = translations[lang] || translations.en;
  content.settings = {
    ...(content.settings || {}),
    ...(langData.settings || {})
  };
  content.billing = {
    ...(content.billing || {}),
    ...(langData.billing || {})
  };

  fs.writeFileSync(filePath, JSON.stringify(content, null, 2) + '\n');
  console.log(`Updated settings and billing in ${file}`);
}

