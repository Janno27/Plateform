"use client";

import React from 'react';

interface ABInitiatorProps {
  children: React.ReactNode;
}

export default function ABInitiator({ children }: ABInitiatorProps) {
  return (
    <div className="flex-1 flex items-center justify-center">
      {children}
    </div>
  );
}