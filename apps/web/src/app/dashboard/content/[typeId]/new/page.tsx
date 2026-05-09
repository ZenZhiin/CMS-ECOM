'use client';

import React, { use } from 'react';
import { ContentEditor } from '@/features/content/components/ContentEditor';

export default function NewEntryPage({ params }: { params: Promise<{ typeId: string }> }) {
  const { typeId } = use(params);

  return <ContentEditor typeId={typeId} />;
}
