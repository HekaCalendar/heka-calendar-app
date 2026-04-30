/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * LANGUAGE SELECTOR — Monumental first-boot language picker
 *
 * When list is open:  Floating search, tactile list, compact preview
 * When selected:      Cinematic hero — monumental flag, dramatic welcome,
 *                     animated quote, subtle change button
 *
 * Every pixel is intentional. Every animation is purposeful.
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { SUPPORTED_LANGUAGES, getWizardStrings } from '../../data/languages';
import type { Language } from '../../data/languages';

interface LanguageSelectorProps {
  selectedLanguage: string;
  onSelect: (code: string) => void;
  onNext: () => void;
}

function useDebouncedValue<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  selectedLanguage,
  onSelect,
  onNext,
}) => {
  const [isListOpen, setIsListOpen] = useState(true);
  const [search, setSearch] = useState('');
  const [typewriterText, setTypewriterText] = useState('');
  const debouncedSearch = useDebouncedValue(search, 150);
  const listRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
  const searchInputRef = useRef<HTMLInputElement>(null);

  const strings = useMemo(() => getWizardStrings(selectedLanguage), [selectedLanguage]);

  const filteredLanguages = useMemo(() => {
    const q = debouncedSearch.trim().toLowerCase();
    if (!q) return SUPPORTED_LANGUAGES;
    return SUPPORTED_LANGUAGES.filter(
      (l) =>
        l.name.toLowerCase().includes(q) ||
        l.nativeName.toLowerCase().includes(q) ||
        l.code.toLowerCase().includes(q)
    );
  }, [debouncedSearch]);

  const selectedLang = useMemo(
    () => SUPPORTED_LANGUAGES.find((l) => l.code === selectedLanguage) || SUPPORTED_LANGUAGES[0],
    [selectedLanguage]
  );

  const [highlightedIndex, setHighlightedIndex] = useState(() => {
    const idx = SUPPORTED_LANGUAGES.findIndex((l) => l.code === selectedLanguage);
    return Math.max(0, idx);
  });

  useEffect(() => {
    const idx = filteredLanguages.findIndex((l) => l.code === selectedLanguage);
    setHighlightedIndex(idx >= 0 ? idx : 0);
  }, [debouncedSearch, filteredLanguages, selectedLanguage]);

  useEffect(() => {
    const lang = filteredLanguages[highlightedIndex];
    if (!lang) return;
    const el = itemRefs.current.get(lang.code);
    if (el) {
      el.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }, [highlightedIndex, filteredLanguages]);

  // Typewriter effect when list closes
  useEffect(() => {
    if (isListOpen) {
      setTypewriterText('');
      return;
    }
    const text = strings.welcome;
    let i = 0;
    setTypewriterText('');
    const timer = setInterval(() => {
      setTypewriterText(text.slice(0, ++i));
      if (i >= text.length) clearInterval(timer);
    }, 45);
    return () => clearInterval(timer);
  }, [isListOpen, strings.welcome]);

  const handleSelect = useCallback(
    (lang: Language) => {
      onSelect(lang.code);
      setIsListOpen(false);
      setSearch('');
    },
    [onSelect]
  );

  const handleReopenList = useCallback(() => {
    setIsListOpen(true);
    setTimeout(() => searchInputRef.current?.focus(), 120);
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!isListOpen) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onNext();
        }
        return;
      }
      const max = filteredLanguages.length - 1;
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setHighlightedIndex((i) => Math.min(i + 1, max));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setHighlightedIndex((i) => Math.max(i - 1, 0));
          break;
        case 'PageDown':
          e.preventDefault();
          setHighlightedIndex((i) => Math.min(i + 5, max));
          break;
        case 'PageUp':
          e.preventDefault();
          setHighlightedIndex((i) => Math.max(i - 5, 0));
          break;
        case 'Home':
          e.preventDefault();
          setHighlightedIndex(0);
          break;
        case 'End':
          e.preventDefault();
          setHighlightedIndex(max);
          break;
        case 'Enter': {
          const lang = filteredLanguages[highlightedIndex];
          if (lang) {
            e.preventDefault();
            handleSelect(lang);
          }
          break;
        }
        case 'Escape':
          if (search) {
            e.preventDefault();
            setSearch('');
            searchInputRef.current?.focus();
          }
          break;
      }
    },
    [filteredLanguages, highlightedIndex, handleSelect, search, isListOpen, onNext]
  );

  const activeDescendant = filteredLanguages[highlightedIndex]?.code
    ? `lang-row-${filteredLanguages[highlightedIndex].code}`
    : undefined;

  return (
    <div className={`setup-step setup-step--language ${!isListOpen ? 'setup-step--language-selected' : ''}`} onKeyDown={handleKeyDown} tabIndex={-1}>
      {/* ═══ Monumental Language Preview ═══ */}
      <div
        className={`language-preview ${!isListOpen ? 'language-preview--expanded' : ''}`}
        aria-live="polite"
        aria-atomic="true"
      >
        {/* Flag medallion with rotating rings */}
        <div className="language-preview__medallion">
          <div className="language-preview__ring language-preview__ring--outer" />
          <div className="language-preview__ring language-preview__ring--mid" />
          <div className="language-preview__ring language-preview__ring--inner" />
          <div className="language-preview__flag">{selectedLang.flag}</div>
        </div>

        {/* Welcome text */}
        <h1 className="language-preview__welcome">
          {isListOpen ? strings.welcome : (
            <>
              {typewriterText}
              <span className="language-preview__cursor" />
            </>
          )}
        </h1>
        <p className="language-preview__subtitle">{strings.welcomeSubtitle}</p>

        {/* Cinematic quote reveal (only when selected) */}
        {!isListOpen && (
          <>
            <div className="language-preview__quote">
              <span className="language-preview__quote-line" aria-hidden="true" />
              <p className="language-preview__quote-text">
                {strings.selectedQuote}
              </p>
              <span className="language-preview__quote-line" aria-hidden="true" />
            </div>
            <button
              className="language-preview__change"
              onClick={handleReopenList}
              type="button"
            >
              <span className="language-preview__change-icon">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M11 7H3M3 7L6 4M3 7L6 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
              {strings.changeLanguage}
            </button>
          </>
        )}
      </div>

      {/* ═══ Collapsible Language List ═══ */}
      <div className={`language-list-shell ${isListOpen ? 'language-list-shell--open' : 'language-list-shell--closed'}`}>
        {/* Floating search */}
        <div className="language-search">
          <svg className="language-search__icon" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M11.5 11.5L14.5 14.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <input
            ref={searchInputRef}
            type="text"
            className="language-search__input"
            placeholder={strings.searchLanguage}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label={strings.searchLanguage}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
          />
          {search && (
            <button
              className="language-search__clear"
              onClick={() => { setSearch(''); searchInputRef.current?.focus(); }}
              aria-label="Clear search"
              type="button"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2 2L10 10M10 2L2 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
          )}
        </div>

        {/* Language list */}
        <div
          className="language-list"
          ref={listRef}
          role="listbox"
          aria-label="Select language"
          aria-activedescendant={activeDescendant}
          tabIndex={0}
        >
          {filteredLanguages.map((lang, index) => {
            const isSelected = lang.code === selectedLanguage;
            const isHighlighted = index === highlightedIndex;
            const id = `lang-row-${lang.code}`;
            return (
              <button
                key={lang.code}
                id={id}
                ref={(el) => {
                  if (el) itemRefs.current.set(lang.code, el);
                }}
                className={`language-row ${isSelected ? 'language-row--selected' : ''} ${isHighlighted ? 'language-row--highlighted' : ''}`}
                style={{ animationDelay: `${index * 25}ms` }}
                role="option"
                aria-selected={isSelected}
                onClick={() => handleSelect(lang)}
                onMouseEnter={() => setHighlightedIndex(index)}
                type="button"
              >
                <span className="language-row__flag" aria-hidden="true">{lang.flag}</span>
                <span className="language-row__native">{lang.nativeName}</span>
                <span className="language-row__divider" aria-hidden="true" />
                <span className="language-row__name">{lang.name}</span>
                {isSelected && (
                  <span className="language-row__check" aria-hidden="true">
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                      <path d="M3 9L7.5 13.5L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                )}
              </button>
            );
          })}
          {filteredLanguages.length === 0 && (
            <div className="language-list__empty" role="status">
              No languages found
            </div>
          )}
        </div>
      </div>

      {/* ═══ Action ═══ */}
      <div className="setup-step__actions setup-step__actions--single">
        <button
          className="setup-btn setup-btn--primary setup-btn--full"
          onClick={onNext}
          disabled={!selectedLanguage}
          type="button"
        >
          {strings.next}
        </button>
      </div>
    </div>
  );
};
