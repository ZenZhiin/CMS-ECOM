'use client';

import React, { useEffect, useState } from 'react';
import { Mail, Calendar, Trash2, Download, Search, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { apiFetch } from '@/lib/api';
import { useParams, useRouter } from 'next/navigation';
import { useToast } from '@/context/ToastContext';
import styles from './page.module.css';

export default function SubmissionsPage() {
  const params = useParams();
  const router = useRouter();
  const { showToast } = useToast();
  const [form, setForm] = useState<any>(null);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [params.formId]);

  const fetchData = async () => {
    try {
      const [formData, submissionData] = await Promise.all([
        apiFetch(`/forms/${params.formId}`),
        apiFetch(`/submissions/form/${params.formId}`)
      ]);
      setForm(formData);
      setSubmissions(submissionData);
    } catch (err) {
      console.error('Failed to fetch data', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this submission?')) return;
    
    try {
      await apiFetch(`/submissions/${id}`, { method: 'DELETE' });
      setSubmissions(submissions.filter(s => s.id !== id));
      showToast('Submission deleted', 'success');
    } catch (err) {
      showToast('Failed to delete submission', 'error');
    }
  };

  if (isLoading) return <div className={styles.loading}>Loading leads...</div>;
  if (!form) return <div className={styles.error}>Form not found</div>;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerTop}>
          <button onClick={() => router.back()} className={styles.backBtn}>
            <ChevronLeft size={20} />
            Back to Forms
          </button>
          <Button variant="secondary" size="sm">
            <Download size={16} />
            Export CSV
          </Button>
        </div>
        <div className={styles.headerInfo}>
          <h1 className="brand-font">{form.name} Leads</h1>
          <p>Manage and review all submissions captured via this form.</p>
        </div>
      </header>

      <div className={styles.content}>
        {submissions.length === 0 ? (
          <div className={styles.empty}>
            <Mail size={48} />
            <p>No submissions found yet. Keep marketing!</p>
          </div>
        ) : (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Submitted At</th>
                  {form.fields.map((field: any) => (
                    <th key={field.name}>{field.label}</th>
                  ))}
                  <th className={styles.actionsCell}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {submissions.map((sub) => (
                  <tr key={sub.id}>
                    <td className={styles.dateCell}>
                      <Calendar size={14} />
                      {new Date(sub.createdAt).toLocaleDateString()}
                    </td>
                    {form.fields.map((field: any) => (
                      <td key={field.name}>
                        {sub.data[field.name] || '-'}
                      </td>
                    ))}
                    <td className={styles.actionsCell}>
                      <button className={styles.deleteBtn} onClick={() => handleDelete(sub.id)}>
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
