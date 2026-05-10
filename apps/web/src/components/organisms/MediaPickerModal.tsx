'use client';

import React, { useEffect, useState } from 'react';
import { X, Image as ImageIcon, Search } from 'lucide-react';
import { apiFetch } from '@/lib/api';
import styles from './MediaPickerModal.module.css';

interface MediaPickerModalProps {
  onSelect: (url: string) => void;
  onClose: () => void;
}

export const MediaPickerModal: React.FC<MediaPickerModalProps> = ({ onSelect, onClose }) => {
  const [media, setMedia] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchMedia();
  }, []);

  const fetchMedia = async () => {
    try {
      const data = await apiFetch('/media');
      setMedia(data);
    } catch (err) {
      console.error('Failed to fetch media', err);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredMedia = media.filter(m => 
    m.filename.toLowerCase().includes(search.toLowerCase()) &&
    m.mimetype.startsWith('image/')
  );

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <header className={styles.header}>
          <h3>Select Media Asset</h3>
          <button onClick={onClose} className={styles.closeBtn}><X size={20} /></button>
        </header>
        
        <div className={styles.searchBar}>
          <Search size={18} />
          <input 
            type="text" 
            placeholder="Search assets..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className={styles.content}>
          {isLoading ? (
            <div className={styles.loading}>Loading library...</div>
          ) : filteredMedia.length === 0 ? (
            <div className={styles.empty}>No images found</div>
          ) : (
            <div className={styles.grid}>
              {filteredMedia.map((item) => (
                <div 
                  key={item.id} 
                  className={styles.card} 
                  onClick={() => onSelect(item.url)}
                >
                  <img src={item.url} alt={item.filename} />
                  <div className={styles.info}>
                    <span>{item.filename}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
