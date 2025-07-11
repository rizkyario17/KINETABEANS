import React, { Suspense } from 'react';
import InventoryClient from './InventoryClient';

export default function Page() {
  return (
    <Suspense fallback={<div>Loading inventory...</div>}>
      <InventoryClient />
    </Suspense>
  );
}
