import React from 'react';
import styles from './Switch.module.css';

interface SwitchProps {
  label?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  description?: string;
  disabled?: boolean;
}

export const Switch: React.FC<SwitchProps> = ({ 
  label, 
  checked, 
  onChange, 
  description,
  disabled = false 
}) => {
  return (
    <div className={`${styles.container} ${disabled ? styles.disabled : ''}`}>
      <div className={styles.content}>
        {label && <span className={styles.label}>{label}</span>}
        {description && <p className={styles.description}>{description}</p>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        className={`${styles.toggle} ${checked ? styles.checked : ''}`}
        onClick={() => !disabled && onChange(!checked)}
      >
        <span className={styles.slider} />
      </button>
    </div>
  );
};
