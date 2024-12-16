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
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-semibold tracking-tight text-foreground">
          What do you want to test?
        </h1>
        <p className="text-base text-muted-foreground">
          Prompt, Run, Edit and take impactful decisions
        </p>
      </div>

      <div className="relative w-full bg-background rounded-xl border shadow-sm">
        <div className="relative p-4">
          <Textarea
            placeholder="Describe your test idea... e.g., Users spend too long finding size info on product pages. We want to test a new size guide to improve decision speed."
            className="min-h-[200px] text-base resize-none border-none bg-transparent p-0 focus-visible:ring-0 focus-visible:ring-offset-0 pr-12"
            value={promptText}
            onChange={(e) => setPromptText(e.target.value)}
          />
          
          {/* CTA buttons */}
          <div className="absolute bottom-1 right-1 flex gap-2 items-center">
            {promptText && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 hover:bg-muted/50"
                onClick={handleClear}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
            
            {promptText && (
              <Button
                size="default"
                className="bg-primary hover:bg-primary/90 px-4 shadow-sm"
                onClick={handleGenerate}
              >
                <Sparkles className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-4">
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