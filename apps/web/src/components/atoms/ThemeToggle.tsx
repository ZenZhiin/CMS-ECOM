'use client';

import React, { useEffect, useState } from 'react';
import { Lightbulb } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import styles from './ThemeToggle.module.css';

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch by only rendering after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className={styles.togglePlaceholder}>
        <Lightbulb size={20} style={{ opacity: 0.2 }} />
      </div>
    );
  }

  return (
    <button 
      className={styles.toggle} 
      onClick={toggleTheme}
      title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      aria-label="Toggle Theme"
    >
      <div className={`${styles.iconWrap} ${theme === 'dark' ? styles.isDark : styles.isLight}`}>
        <Lightbulb size={20} className={styles.icon} />
        <div className={styles.glow} />
      </div>
    </button>
  );
};
