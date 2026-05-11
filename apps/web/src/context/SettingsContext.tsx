'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { apiFetch } from '@/lib/api';

interface GlobalSettings {
  siteName: string;
  siteLogo: string | null;
  isEcommerceEnabled: boolean;
  [key: string]: any;
}

interface SettingsContextType {
  settings: GlobalSettings | null;
  isLoading: boolean;
  refreshSettings: () => Promise<void>;
  updateToggle: (key: string, value: boolean) => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<GlobalSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSettings = useCallback(async () => {
    try {
      const data = await apiFetch('/settings');
      setSettings(data);
    } catch (err) {
      console.error('Failed to fetch global settings', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const updateToggle = async (key: string, value: boolean) => {
    if (!settings) return;
    
    // Optimistic update
    const previousSettings = { ...settings };
    setSettings({ ...settings, [key]: value });

    try {
      await apiFetch('/settings', {
        method: 'PATCH',
        body: JSON.stringify({ [key]: value })
      });
    } catch (err) {
      console.error('Failed to update toggle', err);
      setSettings(previousSettings);
      throw err;
    }
  };

  return (
    <SettingsContext.Provider value={{ 
      settings, 
      isLoading, 
      refreshSettings: fetchSettings,
      updateToggle 
    }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
