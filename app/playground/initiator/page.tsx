"use client";

import React from 'react';
import ABInitiator from '@/components/ab-initiator';
import { Separator } from '@/components/ui/separator';
import { PromptSection } from '@/components/ab-initiator/sections/prompt-section';

export default function ABInitiatorPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">A/B Test Initiator</h2>
          <p className="text-muted-foreground">
            Setup and configure your A/B test with guided steps
          </p>
        </div>
      </div>
      <Separator />
      
      <div className="grid gap-4">
        <ABInitiator>
          <PromptSection />
        </ABInitiator>
      </div>
    </div>
  );
}