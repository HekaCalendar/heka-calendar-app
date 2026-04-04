/**
 * Font Selector Component - Compact Dropdown
 * Font theme selection with preview
 */

import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../store';
import { setFont } from '../store';
import { FONT_LIST, type FontId } from '../types/themes';

export const FontSelector: React.FC = () => {
  const dispatch = useDispatch();
  const currentFontId = useSelector((state: RootState) => state.calendar.font);
  const currentFont = FONT_LIST.find(f => f.id === currentFontId);

  const handleFontSelect = (fontId: FontId) => {
    dispatch(setFont(fontId));
  };

  return (
    <div className="font-selector-compact">
      <div className="font-selector__current">
        <select 
          value={currentFontId} 
          onChange={(e) => handleFontSelect(e.target.value as FontId)}
          className="font-selector__select"
        >
          {FONT_LIST.map((font) => (
            <option key={font.id} value={font.id}>
              {font.icon} {font.name}
            </option>
          ))}
        </select>
        <div 
          className="font-selector__preview-text"
          style={{ fontFamily: currentFont?.fonts.display }}
        >
          <span className="font-preview__display">HEKA</span>
          <span className="font-preview__body" style={{ fontFamily: currentFont?.fonts.body }}>
            {currentFont?.description}
          </span>
        </div>
      </div>
    </div>
  );
};

export default FontSelector;
