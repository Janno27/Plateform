"use client";

import React from 'react';
import { PromptSection } from '@/components/ab-initiator/sections/prompt-section';

export default function ABInitiatorPage() {
  return (
    <div className="relative min-h-screen w-full">
      {/* Light mode background */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-white dark:from-transparent dark:to-transparent">
        <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02]" />
      </div>
      
      {/* Dark mode background */}
      <div className="absolute inset-0 dark:bg-gradient-to-b dark:from-gray-900 dark:to-gray-800">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-800 to-transparent" />
      </div>
      
      {/* Content */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center p-4">
        <PromptSection />
      </div>
    </div>
  );
}