import React from 'react';
import { MainLayout } from '../../components/layout/MainLayout';
import { BroadcastRoom } from '../../components/broadcast/BroadcastRoom';
import { Radio } from '../../components/ui/Icons';

const BroadcastPage: React.FC = () => {
  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <div className="flex items-center gap-3">
          <Radio className="h-8 w-8 text-primary-maroon" />
          <h1 className="text-3xl font-bold text-neutral-charcoal">
            Broadcast Chat Room
          </h1>
        </div>

        {/* Broadcast Room */}
        <BroadcastRoom />
      </div>
    </MainLayout>
  );
};

export default BroadcastPage;
