import { describe, it, expect } from 'vitest';
import {
  getPrintDimensions,
  wrapPage,
  wrapPreviewPage,
  wrapPdfPage,
  PAPER_DIMENSIONS,
} from '../src/services/printEngine';

describe('printEngine', () => {
  describe('getPrintDimensions', () => {
    it('returns correct A4 dimensions in portrait', () => {
      const dims = getPrintDimensions('A4', false);
      expect(dims.width).toBe(PAPER_DIMENSIONS.A4.width);
      expect(dims.height).toBe(PAPER_DIMENSIONS.A4.height);
      expect(dims.pointsWidth).toBe(PAPER_DIMENSIONS.A4.pointsWidth);
      expect(dims.pointsHeight).toBe(PAPER_DIMENSIONS.A4.pointsHeight);
    });

    it('swaps width and height for A4 landscape', () => {
      const dims = getPrintDimensions('A4', true);
      expect(dims.width).toBe(PAPER_DIMENSIONS.A4.height);
      expect(dims.height).toBe(PAPER_DIMENSIONS.A4.width);
      expect(dims.pointsWidth).toBe(PAPER_DIMENSIONS.A4.pointsHeight);
      expect(dims.pointsHeight).toBe(PAPER_DIMENSIONS.A4.pointsWidth);
    });

    it('returns correct Letter dimensions in portrait', () => {
      const dims = getPrintDimensions('Letter', false);
      expect(dims.width).toBe(PAPER_DIMENSIONS.Letter.width);
      expect(dims.height).toBe(PAPER_DIMENSIONS.Letter.height);
      expect(dims.pointsWidth).toBe(PAPER_DIMENSIONS.Letter.pointsWidth);
      expect(dims.pointsHeight).toBe(PAPER_DIMENSIONS.Letter.pointsHeight);
    });

    it('falls back to A4 for unknown paper size', () => {
      const dims = getPrintDimensions('Unknown', false);
      expect(dims.width).toBe(PAPER_DIMENSIONS.A4.width);
      expect(dims.height).toBe(PAPER_DIMENSIONS.A4.height);
      expect(dims.pointsWidth).toBe(PAPER_DIMENSIONS.A4.pointsWidth);
      expect(dims.pointsHeight).toBe(PAPER_DIMENSIONS.A4.pointsHeight);
    });
  });

  describe('wrapPage', () => {
    it('produces HTML containing @page rule and content', () => {
      const content = '<div class="test-content">Hello</div>';
      const result = wrapPage(content, {
        paperSize: 'A4',
        orientation: 'portrait',
        title: 'Test Page',
      });

      expect(result).toContain('<!DOCTYPE html>');
      expect(result).toContain('@page');
      expect(result).toContain('size: A4 portrait');
      expect(result).toContain(content);
      expect(result).toContain('<title>Test Page</title>');
      expect(result).toContain('class="page-root"');
    });

    it('includes extra CSS when provided', () => {
      const extraCss = '.custom { color: red; }';
      const result = wrapPage('<div></div>', {
        paperSize: 'A4',
        orientation: 'portrait',
        extraCss,
      });

      expect(result).toContain(extraCss);
    });

    it('uses default title when none is provided', () => {
      const result = wrapPage('<div></div>', {
        paperSize: 'A4',
        orientation: 'portrait',
      });

      expect(result).toContain('<title>HEKA Calendar</title>');
    });

    it('sets correct dimensions for landscape orientation', () => {
      const result = wrapPage('<div></div>', {
        paperSize: 'A4',
        orientation: 'landscape',
      });

      expect(result).toContain('size: A4 landscape');
      expect(result).toContain(`width: ${PAPER_DIMENSIONS.A4.height}px`);
      expect(result).toContain(`height: ${PAPER_DIMENSIONS.A4.width}px`);
    });
  });

  describe('wrapPreviewPage', () => {
    it('sets preview flag (isPrintMode: false)', () => {
      const content = '<p>Preview</p>';
      const result = wrapPreviewPage(content, {
        paperSize: 'A4',
        orientation: 'portrait',
      });

      expect(result).toContain(content);
      expect(result).not.toContain('maximum-scale=1.0');
    });
  });

  describe('wrapPdfPage', () => {
    it('sets PDF flag (isPrintMode: true)', () => {
      const content = '<p>PDF</p>';
      const result = wrapPdfPage(content, {
        paperSize: 'A4',
        orientation: 'portrait',
      });

      expect(result).toContain(content);
      expect(result).toContain('maximum-scale=1.0');
      expect(result).toContain('user-scalable=no');
    });
  });
});
