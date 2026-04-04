import type { PrintPlugin } from './printPlugin';

export class PrintPluginWeb implements PrintPlugin {
  async printHtml(options: { html: string; jobName?: string }): Promise<{ success: boolean }> {
    // Web fallback - use window.print
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(options.html);
      printWindow.document.close();
      printWindow.print();
      return { success: true };
    }
    throw new Error('Failed to open print window');
  }
}
