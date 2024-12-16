"use client";

import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles } from "lucide-react";

const EXAMPLE_PROMPTS = [
  "Test new homepage design",
  "Improve checkout flow",
  "Experiment with pricing strategy"
];

export function PromptSection() {
  const [promptText, setPromptText] = React.useState("");

  const handlePromptClick = (prompt: string) => {
    setPromptText(prompt);
  };

  const handleGenerate = () => {
    // TODO: Implement generation logic
    console.log("Generating with prompt:", promptText);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl">What do you want to test?</CardTitle>
        <CardDescription className="text-lg">
          Prompt, Run, Edit and take impactful decisions
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Textarea with larger height */}
        <div className="space-y-2">
          <Textarea
            placeholder="Describe what you want to test... (e.g., We want to test a new homepage design to improve conversion rate)"
            className="min-h-[160px] text-base"
            value={promptText}
            onChange={(e) => setPromptText(e.target.value)}
          />
        </div>

        {/* Generate Button */}
        <div>
          <Button 
            size="lg" 
            className="w-full sm:w-auto"
            onClick={handleGenerate}
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Generate Test Plan
          </Button>
        </div>

        {/* AI Message */}
        <div className="text-sm text-muted-foreground flex items-center gap-2">
          <Sparkles className="w-4 h-4" />
          Powered by AI for better decisions
        </div>

        {/* Example Prompts */}
        <div className="space-y-2">
          <p className="text-sm font-medium">Example prompts:</p>
          <div className="flex flex-wrap gap-2">
            {EXAMPLE_PROMPTS.map((prompt, index) => (
              <button
                key={index}
                onClick={() => handlePromptClick(prompt)}
                className="px-4 py-2 text-sm bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded-full transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}