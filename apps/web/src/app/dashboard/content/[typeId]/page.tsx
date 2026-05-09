'use client';

import React, { use } from 'react';
import { EntryList } from '@/features/content/components/EntryList';

export default function EntryListPage({ params }: { params: Promise<{ typeId: string }> }) {
  const { typeId } = use(params);

  return <EntryList typeId={typeId} />;
}
