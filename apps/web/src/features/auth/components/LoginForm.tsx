'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/features/auth/services/auth.service';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import styles from './LoginForm.module.css';

export const LoginForm: React.FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await authService.login({ email, password });
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.header}>
        <h1 className="brand-font">Welcome Back</h1>
        <p>Enter your credentials to access the CMS</p>
      </div>

      {error && <div className={styles.errorBanner}>{error}</div>}
      
      <div className={styles.fields}>
        <Input 
          label="Email Address" 
          type="email" 
          placeholder="admin@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input 
          label="Password" 
          type="password" 
          placeholder="••••••••" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      <Button type="submit" size="lg" isLoading={isLoading} className={styles.submitBtn}>
        Sign In to Portal
      </Button>

      <div className={styles.footer}>
        <a href="#">Forgot password?</a>
      </div>
    </form>
  );
};
