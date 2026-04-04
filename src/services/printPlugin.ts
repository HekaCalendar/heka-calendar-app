import { registerPlugin } from '@capacitor/core';

export interface PrintPlugin {
  printHtml(options: { 
    html: string; 
    jobName?: string;
    totalPages?: number;
    isPdf?: boolean;
  }): Promise<{ success: boolean }>;
}

const PrintPlugin = registerPlugin<PrintPlugin>('PrintPlugin', {
  web: () => import('./printPluginWeb').then(m => new m.PrintPluginWeb()),
});

export default PrintPlugin;
