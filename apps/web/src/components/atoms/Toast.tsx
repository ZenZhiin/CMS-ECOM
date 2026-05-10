import React from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import styles from './Toast.module.css';

export type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  const Icon = type === 'success' ? CheckCircle : type === 'error' ? AlertCircle : Info;
  
  return (
    <div className={`${styles.toast} ${styles[type]}`}>
      <div className={styles.icon}><Icon size={18} /></div>
      <div className={styles.message}>{message}</div>
      <button className={styles.close} onClick={onClose}>
        <X size={16} />
      </button>
    </div>
  );
};
