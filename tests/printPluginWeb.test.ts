import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { PrintPluginWeb } from '../src/services/printPluginWeb';

describe('PrintPluginWeb', () => {
  let plugin: PrintPluginWeb;

  beforeEach(() => {
    plugin = new PrintPluginWeb();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('printHtml', () => {
    it('opens a window, writes HTML, calls print, and returns success', async () => {
      const mockWrite = vi.fn();
      const mockClose = vi.fn();
      const mockPrint = vi.fn();
      const mockFocus = vi.fn();

      const mockWindow = {
        document: {
          write: mockWrite,
          close: mockClose,
        },
        print: mockPrint,
        focus: mockFocus,
      } as unknown as Window;

      const openSpy = vi.spyOn(window, 'open').mockReturnValue(mockWindow);

      const html = '<html><body>Test</body></html>';
      const result = await plugin.printHtml({ html, jobName: 'test-job' });

      expect(openSpy).toHaveBeenCalledWith('', '_blank');
      expect(mockWrite).toHaveBeenCalledWith(html);
      expect(mockClose).toHaveBeenCalled();
      expect(mockPrint).toHaveBeenCalled();
      expect(result).toEqual({ success: true });
    });

    it('throws an error when window.open returns null', async () => {
      vi.spyOn(window, 'open').mockReturnValue(null);

      await expect(plugin.printHtml({ html: '<div>test</div>' })).rejects.toThrow(
        'Failed to open print window'
      );
    });

    it('passes the full HTML string to document.write', async () => {
      const mockWrite = vi.fn();
      const mockClose = vi.fn();
      const mockPrint = vi.fn();

      const mockWindow = {
        document: {
          write: mockWrite,
          close: mockClose,
        },
        print: mockPrint,
      } as unknown as Window;

      vi.spyOn(window, 'open').mockReturnValue(mockWindow);

      const html = `
        <!DOCTYPE html>
        <html>
          <head><title>Complex</title></head>
          <body><h1>Hello World</h1></body>
        </html>
      `;

      await plugin.printHtml({ html });
      expect(mockWrite).toHaveBeenCalledTimes(1);
      expect(mockWrite).toHaveBeenCalledWith(html);
    });
  });
});
