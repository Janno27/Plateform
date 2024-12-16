"use client";

import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';

const formSchema = z.object({
  context: z.string().min(10, 'Context should be at least 10 characters'),
  hypothesis: z.string().min(10, 'Hypothesis should be at least 10 characters'),
});

type HypothesisFormValues = z.infer<typeof formSchema>;

export function HypothesisForm() {
  const form = useForm<HypothesisFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      context: '',
      hypothesis: '',
    },
  });

  function onSubmit(values: HypothesisFormValues) {
    console.log(values);
    // TODO: Handle form submission
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="context"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Context</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe the current situation and problem you want to solve..."
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="hypothesis"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Hypothesis</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="State your hypothesis about how the changes will impact metrics..."
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Generate Test Plan</Button>
      </form>
    </Form>
  );
}
