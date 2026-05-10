'use client';

import React, { useEffect, useState } from 'react';
import { Plus, Search, FileText, ChevronRight, MessageSquare } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { apiFetch } from '@/lib/api';
import Link from 'next/link';
import styles from './page.module.css';

export default function FormsListPage() {
  const [forms, setForms] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchForms();
  }, []);

  const fetchForms = async () => {
    try {
      const data = await apiFetch('/forms');
      setForms(data);
    } catch (err) {
      console.error('Failed to fetch forms', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <div className={styles.loading}>Loading forms...</div>;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerInfo}>
          <h1 className="brand-font">Form Builder</h1>
          <p>Create and manage lead-capture forms for your website.</p>
        </div>
        <Link href="/dashboard/forms/new">
          <Button>
            <Plus size={18} />
            Create New Form
          </Button>
        </Link>
      </header>

      <div className={styles.grid}>
        {forms.length === 0 ? (
          <div className={styles.empty}>
            <FileText size={48} />
            <p>No forms created yet. Start capturing leads today!</p>
            <Link href="/dashboard/forms/new">
              <Button variant="secondary" size="sm">Create Your First Form</Button>
            </Link>
          </div>
        ) : (
          forms.map((form) => (
            <div key={form.id} className={styles.formCard}>
              <div className={styles.cardMain}>
                <div className={styles.formIcon}>
                  <FileText size={24} />
                </div>
                <div className={styles.formInfo}>
                  <h3>{form.name}</h3>
                  <code>/{form.slug}</code>
                </div>
              </div>
              
              <div className={styles.cardStats}>
                <div className={styles.stat}>
                  <MessageSquare size={16} />
                  <span>{form._count?.submissions || 0} Submissions</span>
                </div>
              </div>

              <div className={styles.cardActions}>
                <Link href={`/dashboard/forms/${form.id}/submissions`} className={styles.actionBtn}>
                  View Leads
                  <ChevronRight size={16} />
                </Link>
                <Link href={`/dashboard/forms/${form.id}`} className={styles.editBtn}>
                  Configure
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
