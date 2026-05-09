'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Upload, Image as ImageIcon, Trash2, Copy, Check } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { apiFetch } from '@/lib/api';
import styles from './page.module.css';

export default function MediaLibraryPage() {
  const [media, setMedia] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      // apiFetch needs to handle FormData differently
      const token = document.cookie.split('; ').find(row => row.startsWith('auth_token='))?.split('=')[1];
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/media/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      
      if (!response.ok) throw new Error('Upload failed');
      
      const newMedia = await response.json();
      setMedia([newMedia, ...media]);
    } catch (err) {
      alert('Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this asset?')) return;
    try {
      await apiFetch(`/media/${id}`, { method: 'DELETE' });
      setMedia(media.filter(m => m.id !== id));
    } catch (err) {
      alert('Failed to delete');
    }
  };

  const copyToClipboard = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerInfo}>
          <h1 className="brand-font">Media Library</h1>
          <p>Manage your images and documents.</p>
        </div>
        <Button onClick={() => fileInputRef.current?.click()} isLoading={isUploading}>
          <Upload size={18} />
          Upload Asset
        </Button>
        <input 
          type="file" 
          ref={fileInputRef} 
          style={{ display: 'none' }} 
          onChange={handleUpload}
          accept="image/*"
        />
      </header>

      {isLoading ? (
        <div className={styles.loading}>Loading assets...</div>
      ) : media.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}><ImageIcon size={48} /></div>
          <h3>No assets yet</h3>
          <p>Upload your first image to start building your library.</p>
        </div>
      ) : (
        <div className={styles.grid}>
          {media.map((item) => (
            <div key={item.id} className={styles.card}>
              <div className={styles.preview}>
                {item.mimetype.startsWith('image/') ? (
                  <img src={item.url} alt={item.filename} />
                ) : (
                  <div className={styles.filePlaceholder}><ImageIcon size={32} /></div>
                )}
              </div>
              <div className={styles.cardInfo}>
                <span className={styles.filename}>{item.filename}</span>
                <span className={styles.filesize}>{(item.size / 1024).toFixed(1)} KB</span>
              </div>
              <div className={styles.cardActions}>
                <button 
                  className={styles.actionBtn} 
                  onClick={() => copyToClipboard(item.url, item.id)}
                  title="Copy URL"
                >
                  {copiedId === item.id ? <Check size={16} color="#10b981" /> : <Copy size={16} />}
                </button>
                <button 
                  className={styles.actionBtn} 
                  onClick={() => handleDelete(item.id)}
                  title="Delete"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
