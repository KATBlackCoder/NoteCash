import { defineStore } from 'pinia';
import { ref, watch } from 'vue';
import { darkTheme, GlobalTheme } from 'naive-ui';

export type ThemeMode = 'light' | 'dark';

export const useThemeStore = defineStore('theme', () => {
  // State
  const themeMode = ref<ThemeMode>(getInitialTheme());
  const theme = ref<GlobalTheme | null>(themeMode.value === 'dark' ? darkTheme : null);

  // Get initial theme from localStorage or system preference
  function getInitialTheme(): ThemeMode {
    // Check if we have a saved preference in localStorage
    if (typeof window !== 'undefined' && window.localStorage) {
      const savedTheme = localStorage.getItem('theme-mode');
      if (savedTheme === 'light' || savedTheme === 'dark') {
        return savedTheme;
      }
    }
    
    // Default to light theme
    return 'light';
  }

  // Actions
  function setThemeMode(mode: ThemeMode) {
    themeMode.value = mode;
    theme.value = mode === 'dark' ? darkTheme : null;
    
    // Save to localStorage for persistence
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('theme-mode', mode);
    }
  }

  function toggleTheme() {
    const newMode: ThemeMode = themeMode.value === 'light' ? 'dark' : 'light';
    setThemeMode(newMode);
  }

  return {
    themeMode,
    theme,
    setThemeMode,
    toggleTheme
  };
}); 