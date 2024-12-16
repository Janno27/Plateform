import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface ABInitiatorProps {
  currentStep?: number;
  children?: React.ReactNode;
}

export default function ABInitiator({ currentStep = 1, children }: ABInitiatorProps) {
  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardContent className="pt-6">
        <div className="flex flex-col gap-6">
          {children}
        </div>
      </CardContent>
    </Card>
  );
}