"use client";

import React from 'react';
import { PromptSection } from '@/components/ab-initiator/sections/prompt-section';

export default function ABInitiatorPage() {
  return (
    <div className="flex-1 flex items-center justify-center min-h-[calc(100vh-65px)]">
      <div className="w-full max-w-4xl px-4">
        <PromptSection />
      </div>
    </div>
  );
}