"use client";

import React from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, X } from "lucide-react";

const EXAMPLE_PROMPTS = [
  "Test new homepage design",
  "Improve checkout flow",
  "Experiment with pricing strategy",
  "Optimize user onboarding",
  "Test email subject lines"
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
    <div className="w-full max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-2">
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
            placeholder="Describe what you want to test... (e.g., We want to test a new homepage design to improve conversion rate)"
            className="min-h-[180px] text-base resize-none pr-24 border-none focus-visible:ring-1 focus-visible:ring-offset-0"
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
                className="bg-primary hover:bg-primary/90"
                onClick={handleGenerate}
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Generate Test Plan
              </Button>
            </div>
          )}
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