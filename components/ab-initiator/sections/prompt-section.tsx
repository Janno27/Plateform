"use client";

import React from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, X } from "lucide-react";

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
    console.log("Generating with prompt:", promptText);
  };

  const handleClear = () => {
    setPromptText("");
  };

  return (
    <div className="min-h-[80vh] w-full flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Background gradient and design elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-gray-800 opacity-95"></div>
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-32 h-32 bg-blue-500/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-purple-500/10 rounded-full blur-xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-3xl space-y-8 text-center">
        <div className="space-y-2">
          <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight">
            What do you want to test?
          </h1>
          <p className="text-base text-gray-400">
            Prompt, Run, Edit and take impactful decisions
          </p>
        </div>

        <div className="relative w-full">
          <Textarea
            placeholder="Describe what you want to test... (e.g., We want to test a new homepage design to improve conversion rate)"
            className="min-h-[180px] text-base bg-white/10 backdrop-blur-sm border-gray-700 rounded-xl text-white placeholder:text-gray-500 resize-none pr-12"
            value={promptText}
            onChange={(e) => setPromptText(e.target.value)}
          />
          
          {promptText && (
            <div className="absolute right-3 top-3 flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-gray-400 hover:text-white hover:bg-white/10"
                onClick={handleClear}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}

          {promptText && (
            <div className="absolute -bottom-4 right-3 transform translate-y-full pt-4">
              <Button
                size="lg"
                className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                onClick={handleGenerate}
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Generate Test Plan
              </Button>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <p className="text-sm text-gray-400 flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4" />
            Powered by AI for better decisions
          </p>

          <div className="flex flex-wrap gap-2 justify-center">
            {EXAMPLE_PROMPTS.map((prompt, index) => (
              <button
                key={index}
                onClick={() => handlePromptClick(prompt)}
                className="px-4 py-2 text-sm bg-white/5 hover:bg-white/10 text-gray-300 rounded-full transition-colors border border-gray-700/50 backdrop-blur-sm"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}