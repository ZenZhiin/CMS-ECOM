'use client';

import React, { use } from 'react';
import { ContentEditor } from '@/features/content/components/ContentEditor';

export default function EditEntryPage({ params }: { params: Promise<{ typeId: string, entryId: string }> }) {
  const { typeId, entryId } = use(params);

  return <ContentEditor typeId={typeId} entryId={entryId} />;
}
