"use client";

import React from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, X } from "lucide-react";

const EXAMPLE_PROMPTS = [
  "Context: High bounce rate detected in funnel analysis",
  "Previous Test: +22% CTR with social proof elements",
  "User Research: Navigation confusion in mobile app",
  "Design Concept: New product card layout",
  "Goal: Increase Add-to-Cart conversion by 5%",
  "Pain Point: Cart abandonment at shipping step",
  "Hypothesis: Simplified checkout will boost sales"
];

export function PromptSection() {
  const [promptText, setPromptText] = React.useState("");

  const handlePromptClick = (prompt: string) => {
    setPromptText(prompt);
  };

  const handleGenerate = () => {
    console.log("Generating with prompt:", promptText);
  };

  const handleClear = () => {
    setPromptText("");
  };

  return (
    <div className="w-full max-w-[720px] mx-auto">
      <div className="text-center space-y-2 mb-8">
        <h1 className="text-4xl font-semibold tracking-tight text-foreground">
          What do you want to test?
        </h1>
        <p className="text-base text-muted-foreground">
          Prompt, Run, Edit and take impactful decisions
        </p>
      </div>

      <div className="relative w-full bg-background rounded-lg border shadow-sm">
        <div className="relative">
          <Textarea
            placeholder="Describe your test idea... (e.g., Our analytics show users spending too much time on product pages. Previous tests indicate sizing information is a key factor. We want to test a new interactive size guide to improve decision speed...)"
            className="min-h-[300px] text-base resize-none pr-24 border-none focus-visible:ring-1 focus-visible:ring-offset-0"
            value={promptText}
            onChange={(e) => setPromptText(e.target.value)}
          />
          
          <div className="absolute right-3 top-3 flex gap-2">
            {promptText && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={handleClear}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          {promptText && (
            <div className="absolute bottom-3 right-3">
              <Button
                size="default"
                className="bg-primary hover:bg-primary/90 px-4"
                onClick={handleGenerate}
              >
                <Sparkles className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-4 mt-8">
        <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
          <Sparkles className="w-4 h-4" />
          Powered by AI for better decisions
        </p>

        <div className="flex flex-wrap gap-2 justify-center">
          {EXAMPLE_PROMPTS.map((prompt, index) => (
            <button
              key={index}
              onClick={() => handlePromptClick(prompt)}
              className="px-4 py-2 text-sm bg-muted hover:bg-muted/80 text-muted-foreground rounded-full transition-colors"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}