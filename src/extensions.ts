import { app } from '@wix/astro/builders';
import dashboardPage from './extensions/dashboard/pages/my-page/my-page.extension.ts';
import sizeChartSitePlugin from './extensions/site-plugins/size-chart/size-chart.extension.ts';

export default app()
  .use(dashboardPage)
  .use(sizeChartSitePlugin);
