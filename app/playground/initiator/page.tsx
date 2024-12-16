"use client";

import React from 'react';
import { PromptSection } from '@/components/ab-initiator/sections/prompt-section';

export default function ABInitiatorPage() {
  return (
    <div className="flex-1 flex min-h-[calc(100vh-65px)]">
      <div className="flex-1 flex items-center justify-center">
        <div className="w-[600px] mx-auto px-4">
          <PromptSection />
        </div>
      </div>
    </div>
  );
}