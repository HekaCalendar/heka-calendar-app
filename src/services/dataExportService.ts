/**
 * Data Export Service - GDPR Compliance
 * Allows users to export all their data in a readable format
 */

import { persistence } from '../astrology/services/persistence';

export interface ExportData {
  exportDate: string;
  appVersion: string;
  dataVersion: string;
  userData: {
    profiles: any[];
    charts: any[];
    preferences: any;
    selectedProfile: string | null;
  };
  calendarData: {
    notes: Record<string, any>;
    settings: any;
  };
  journalData: {
    entries: any[];
  };
  energyVotes: any;
  tutorialProgress: any;
  achievementProgress: any;
  aiConfig: {
    provider?: string;
    hasCustomKeys: boolean;
  };
}

/**
 * Export all user data from localStorage
 * Returns a JSON object containing all user-created data
 */
export async function exportAllUserData(): Promise<ExportData> {
  const exportData: ExportData = {
    exportDate: new Date().toISOString(),
    appVersion: '2.2.0',
    dataVersion: '1.0',
    userData: {
      profiles: [],
      charts: [],
      preferences: null,
      selectedProfile: null,
    },
    calendarData: {
      notes: {},
      settings: {},
    },
    journalData: {
      entries: [],
    },
    energyVotes: null,
    tutorialProgress: null,
    achievementProgress: null,
    aiConfig: {
      hasCustomKeys: false,
    },
  };

  try {
    // Export astrology profiles and charts
    exportData.userData.profiles = await persistence.getAllProfiles();
    exportData.userData.preferences = await persistence.getPreferences();
    exportData.userData.selectedProfile = await persistence.getSelectedProfile();

    // Get all charts for all profiles
    const allProfiles = await persistence.getAllProfiles();
    for (const profile of allProfiles) {
      const charts = await persistence.getChartsForProfile(profile.id);
      exportData.userData.charts.push(...charts);
    }

    // Export calendar notes
    const notes: Record<string, any> = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('heka:')) {
        try {
          const value = localStorage.getItem(key);
          if (value) {
            notes[key] = JSON.parse(value);
          }
        } catch {
          notes[key] = localStorage.getItem(key);
        }
      }
    }
    exportData.calendarData.notes = notes;

    // Export journal entries
    const journalData = localStorage.getItem('heka-journal-entries');
    if (journalData) {
      try {
        exportData.journalData.entries = JSON.parse(journalData);
      } catch {
        exportData.journalData.entries = [];
      }
    }

    // Export energy votes
    const energyVotes = localStorage.getItem('heka-energy-votes');
    if (energyVotes) {
      try {
        exportData.energyVotes = JSON.parse(energyVotes);
      } catch {
        exportData.energyVotes = null;
      }
    }

    // Export tutorial progress
    const tutorialProgress = localStorage.getItem('heka-tutorial-state-v2');
    if (tutorialProgress) {
      try {
        exportData.tutorialProgress = JSON.parse(tutorialProgress);
      } catch {
        exportData.tutorialProgress = null;
      }
    }

    // Export achievement progress
    const achievementProgress = localStorage.getItem('heka-achievement-progress');
    if (achievementProgress) {
      try {
        exportData.achievementProgress = JSON.parse(achievementProgress);
      } catch {
        exportData.achievementProgress = null;
      }
    }

    // Export AI config (without API keys for security)
    const aiConfig = localStorage.getItem('celestial-ai-config');
    if (aiConfig) {
      try {
        const config = JSON.parse(aiConfig);
        exportData.aiConfig = {
          provider: config.type,
          hasCustomKeys: !!(localStorage.getItem('celestial-groq-key') || 
                          localStorage.getItem('celestial-openai-key')),
        };
      } catch {
        exportData.aiConfig = { hasCustomKeys: false };
      }
    }

    // Check for custom API keys (don't export the keys, just note they exist)
    exportData.aiConfig.hasCustomKeys = !!(
      localStorage.getItem('celestial-groq-key') ||
      localStorage.getItem('celestial-openai-key')
    );

    return exportData;
  } catch (error) {
    console.error('[DataExport] Failed to export data:', error);
    throw new Error('Failed to export user data. Please try again.');
  }
}

/**
 * Generate a downloadable JSON file with user data
 */
export async function downloadUserDataExport(): Promise<void> {
  const data = await exportAllUserData();
  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `heka-calendar-export-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
}

/**
 * Generate a human-readable text export
 */
export async function generateHumanReadableExport(): Promise<string> {
  const data = await exportAllUserData();
  
  let output = '═══════════════════════════════════════════════════════════════\n';
  output += 'HEKA CALENDAR - DATA EXPORT\n';
  output += '═══════════════════════════════════════════════════════════════\n\n';
  output += `Export Date: ${new Date(data.exportDate).toLocaleString()}\n`;
  output += `App Version: ${data.appVersion}\n\n`;
  
  // Profiles
  output += '─────────────────────────────────────────────────────────────\n';
  output += 'PROFILES\n';
  output += '─────────────────────────────────────────────────────────────\n';
  if (data.userData.profiles.length === 0) {
    output += 'No profiles created.\n';
  } else {
    data.userData.profiles.forEach((profile, index) => {
      output += `\nProfile ${index + 1}: ${profile.name || 'Unnamed'}\n`;
      output += `  ID: ${profile.id}\n`;
      output += `  Created: ${new Date(profile.createdAt).toLocaleDateString()}\n`;
    });
  }
  
  // Charts
  output += '\n\n─────────────────────────────────────────────────────────────\n';
  output += 'NATAL CHARTS\n';
  output += '─────────────────────────────────────────────────────────────\n';
  if (data.userData.charts.length === 0) {
    output += 'No charts calculated.\n';
  } else {
    output += `Total charts: ${data.userData.charts.length}\n`;
    data.userData.charts.forEach((chart, index) => {
      output += `\nChart ${index + 1}:\n`;
      output += `  Calculated: ${new Date(chart.calculatedAt).toLocaleString()}\n`;
      if (chart.planets?.sun) {
        output += `  Sun Sign: ${chart.planets.sun.sign}\n`;
      }
    });
  }
  
  // Calendar Notes
  output += '\n\n─────────────────────────────────────────────────────────────\n';
  output += 'CALENDAR DATA\n';
  output += '─────────────────────────────────────────────────────────────\n';
  const noteKeys = Object.keys(data.calendarData.notes);
  if (noteKeys.length === 0) {
    output += 'No calendar notes found.\n';
  } else {
    output += `Total data entries: ${noteKeys.length}\n`;
  }
  
  // Journal
  output += '\n\n─────────────────────────────────────────────────────────────\n';
  output += 'JOURNAL ENTRIES\n';
  output += '─────────────────────────────────────────────────────────────\n';
  if (data.journalData.entries.length === 0) {
    output += 'No journal entries found.\n';
  } else {
    output += `Total entries: ${data.journalData.entries.length}\n`;
  }
  
  // Energy Votes
  output += '\n\n─────────────────────────────────────────────────────────────\n';
  output += 'ENERGY VOTES\n';
  output += '─────────────────────────────────────────────────────────────\n';
  if (!data.energyVotes) {
    output += 'No energy votes recorded.\n';
  } else {
    const voteDays = Object.keys(data.energyVotes);
    output += `Days with votes: ${voteDays.length}\n`;
  }
  
  // Tutorial & Achievements
  output += '\n\n─────────────────────────────────────────────────────────────\n';
  output += 'APP PROGRESS\n';
  output += '─────────────────────────────────────────────────────────────\n';
  output += `Tutorial completed: ${data.tutorialProgress?.completed ? 'Yes' : 'No'}\n`;
  output += `Achievements unlocked: ${data.achievementProgress?.achievements?.length || 0}\n`;
  
  // AI Config
  output += '\n\n─────────────────────────────────────────────────────────────\n';
  output += 'AI FEATURES\n';
  output += '─────────────────────────────────────────────────────────────\n';
  output += `AI Provider: ${data.aiConfig.provider || 'None configured'}\n`;
  output += `Custom API keys: ${data.aiConfig.hasCustomKeys ? 'Yes' : 'No'}\n`;
  
  output += '\n\n═══════════════════════════════════════════════════════════════\n';
  output += 'END OF EXPORT\n';
  output += '═══════════════════════════════════════════════════════════════\n';
  
  return output;
}

/**
 * Download human-readable text export
 */
export async function downloadHumanReadableExport(): Promise<void> {
  const text = await generateHumanReadableExport();
  const blob = new Blob([text], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `heka-calendar-export-${new Date().toISOString().split('T')[0]}.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
}

/**
 * Clear all local user data (GDPR Right to Erasure)
 */
export async function clearAllUserData(): Promise<void> {
  try {
    // Clear astrology data
    await persistence.clearAll();
    
    // Clear all HEKA-related localStorage keys
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (
        key.startsWith('heka:') ||
        key.startsWith('celestial-') ||
        key.startsWith('natal-chart-')
      )) {
        keysToRemove.push(key);
      }
    }
    
    keysToRemove.forEach(key => localStorage.removeItem(key));
    
    console.log('[DataExport] All user data cleared');
  } catch (error) {
    console.error('[DataExport] Failed to clear data:', error);
    throw new Error('Failed to clear user data. Please try again.');
  }
}

/**
 * Get data export size estimate
 */
export async function getDataSizeEstimate(): Promise<string> {
  try {
    const data = await exportAllUserData();
    const jsonString = JSON.stringify(data);
    const bytes = new Blob([jsonString]).size;
    
    if (bytes < 1024) {
      return `${bytes} bytes`;
    } else if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(2)} KB`;
    } else {
      return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    }
  } catch {
    return 'Unknown';
  }
}
