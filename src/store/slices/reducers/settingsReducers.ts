/**
 * Settings Reducers
 * Theme, font, location, timezone, time mode
 */

import type { PayloadAction } from '@reduxjs/toolkit';
import type { CalendarState, TimeMode } from '../../../types';
import type { ThemeId, FontId, GeometryPattern, BackgroundGeometryPattern } from '../../../types/themes';
import type { CountryCode } from '../../../types';
import { getTodayHekaDate, getTodayHekaDateInTimezone } from '../../../services/calendarService';
import { SUB_REGIONS } from '../../../types';

export const setTheme = (state: CalendarState, action: PayloadAction<ThemeId>) => {
  state.theme = action.payload;
};

export const setFont = (state: CalendarState, action: PayloadAction<FontId>) => {
  state.font = action.payload;
};

export const setHeaderGeometry = (state: CalendarState, action: PayloadAction<GeometryPattern>) => {
  state.headerGeometry = action.payload;
};

export const setBackgroundGeometry = (state: CalendarState, action: PayloadAction<BackgroundGeometryPattern>) => {
  state.backgroundGeometry = action.payload;
};

export const setLocation = (state: CalendarState, action: PayloadAction<CountryCode>) => {
  state.location = action.payload;
  state.subRegion = null;
};

export const setSubRegion = (state: CalendarState, action: PayloadAction<string | null>) => {
  state.subRegion = action.payload;
};

export const toggleTimeMode = (state: CalendarState) => {
  const nextMode = state.timeMode === 'SYNC' ? 'TRUE' : 'SYNC';
  state.timeMode = nextMode;
};

export const setTimeMode = (state: CalendarState, action: PayloadAction<TimeMode>) => {
  state.timeMode = action.payload;
};

export const syncToLocalToday = (state: CalendarState) => {
  const locationData = state.subRegion
    ? SUB_REGIONS[state.location]?.find(r => r.code === state.subRegion)
    : null;
  const timezone = locationData?.timezone;

  const today = timezone
    ? getTodayHekaDateInTimezone(timezone)
    : getTodayHekaDate();

  state.viewDate = today;
  state.selectedDate = null;
};
