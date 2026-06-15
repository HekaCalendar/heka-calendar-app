/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * SHOWCASE SCALER — Responsive wrapper for fixed-pixel tutorial visuals
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * The tutorial "showcase" components were authored at a fixed 480×N design size
 * with absolute positioning. This wrapper scales them down when the viewport is
 * too short or too narrow (e.g. Samsung Z Fold 7 cover screen, small foldables,
 * iPhone SE) while keeping them crisp at 1× on larger screens.
 */

import React, { useEffect, useState } from 'react';

interface ShowcaseScalerProps {
  children: React.ReactNode;
  designWidth?: number;
  designHeight: number;
  marginTop?: number;
}

const MIN_VISUAL_HEIGHT = 180;
const VERTICAL_RESERVE = 420; // space for title/subtitle/body + bottom UI
const HORIZONTAL_MARGIN = 32;

export const ShowcaseScaler: React.FC<ShowcaseScalerProps> = ({
  children,
  designWidth = 480,
  designHeight,
  marginTop = 16,
}) => {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const compute = () => {
      const vh = window.innerHeight || 800;
      const vw = window.innerWidth || 400;

      const maxVisualHeight = Math.max(MIN_VISUAL_HEIGHT, vh - VERTICAL_RESERVE);
      const scaleH = maxVisualHeight / designHeight;

      const maxVisualWidth = Math.max(designWidth * 0.65, vw - HORIZONTAL_MARGIN);
      const scaleW = maxVisualWidth / designWidth;

      setScale(Math.min(1, scaleH, scaleW));
    };

    compute();
    window.addEventListener('resize', compute);
    window.addEventListener('orientationchange', () => {
      setTimeout(compute, 200);
    });

    return () => {
      window.removeEventListener('resize', compute);
      window.removeEventListener('orientationchange', compute);
    };
  }, [designWidth, designHeight]);

  const scaledHeight = designHeight * scale;

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: designWidth,
        height: scaledHeight,
        marginTop,
        marginLeft: 'auto',
        marginRight: 'auto',
        overflow: 'visible',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          width: designWidth,
          height: designHeight,
          transform: `translateX(-50%) scale(${scale})`,
          transformOrigin: 'top center',
          pointerEvents: 'none',
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default ShowcaseScaler;
