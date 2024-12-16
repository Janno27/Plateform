"use client";

import React from 'react';
import { PromptSection } from '@/components/ab-initiator/sections/prompt-section';

export default function ABInitiatorPage() {
  return (
    <main className="flex min-h-[calc(100vh-65px)] flex-col">
      {/* Light mode background */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-white dark:from-transparent dark:to-transparent">
        <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02]" />
      </div>
      
      {/* Dark mode background */}
      <div className="absolute inset-0 dark:bg-gradient-to-b dark:from-gray-900 dark:to-gray-800">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-800 to-transparent" />
      </div>
      
      {/* Content */}
      <div className="relative flex-1 flex items-center justify-center px-4">
        <PromptSection />
      </div>
    </main>
  );
}