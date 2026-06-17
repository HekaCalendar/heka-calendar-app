/**
 * Minimal type declarations for pdfjs-dist.
 *
 * pdfjs-dist is treated as an optional, lazily-loaded dependency. These stubs
 * keep TypeScript happy when the package is not installed in the workspace.
 */

declare module 'pdfjs-dist' {
  export const GlobalWorkerOptions: {
    workerSrc: string;
  };

  export interface PDFDocumentProxy {
    numPages: number;
    getPage(pageNumber: number): Promise<PDFPageProxy>;
    destroy(): void;
  }

  export interface RenderTask {
    promise: Promise<void>;
    cancel(): void;
  }

  export interface PDFPageProxy {
    getViewport(options: { scale: number }): { width: number; height: number };
    render(options: {
      canvasContext: CanvasRenderingContext2D;
      viewport: { width: number; height: number };
    }): RenderTask;
    cleanup(): void;
  }

  export function getDocument(src: string | Uint8Array | ArrayBuffer | { data: Uint8Array | ArrayBuffer }): {
    promise: Promise<PDFDocumentProxy>;
  };
}
