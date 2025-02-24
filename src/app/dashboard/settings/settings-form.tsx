'use client';

import { Eye, EyeOff } from 'lucide-react';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { updateManagerEmail } from './actions';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const formSchema = z.object({
  managerEmail: z.string().email('Please enter a valid email address'),
  linearApiKey: z.string().min(1, 'Linear API key is required'),
});

interface SettingsFormProps {
  initialEmail?: string | null;
  initialLinearApiKey?: string | null;
}

export function SettingsForm({
  initialEmail,
  initialLinearApiKey,
}: SettingsFormProps) {
  const [showApiKey, setShowApiKey] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      managerEmail: initialEmail || '',
      linearApiKey: initialLinearApiKey || '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const formData = new FormData();
    formData.append('managerEmail', values.managerEmail);
    formData.append('linearApiKey', values.linearApiKey);

    const result = await updateManagerEmail(formData);

    if (result.error) {
      toast.error('Error', {
        description: result.error,
      });
    } else {
      toast.success('Success', {
        description: 'Settings updated successfully',
      });
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='space-y-8'
      >
        <FormField
          control={form.control}
          name='managerEmail'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Manager&apos;s Email</FormLabel>
              <FormDescription>
                Enter your manager&apos;s email address for notifications and
                updates.
              </FormDescription>
              <FormControl>
                <Input
                  placeholder='manager@company.com'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='linearApiKey'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Linear API Key</FormLabel>
              <FormDescription>
                Enter your Linear API key to enable issue tracking integration.
              </FormDescription>
              <FormControl>
                <div className='flex gap-2'>
                  <Input
                    type={showApiKey ? 'text' : 'password'}
                    placeholder='lin_api_xxx...'
                    {...field}
                    value={
                      field.value
                        ? showApiKey
                          ? field.value
                          : `${field.value.slice(0, 8)}${'*'.repeat(
                              Math.max(0, field.value.length - 8)
                            )}`
                        : ''
                    }
                  />
                  <Button
                    type='button'
                    variant='outline'
                    size='icon'
                    onClick={() => setShowApiKey(!showApiKey)}
                  >
                    {showApiKey ? (
                      <EyeOff className='h-4 w-4' />
                    ) : (
                      <Eye className='h-4 w-4' />
                    )}
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type='submit'>Update Settings</Button>
      </form>
    </Form>
  );
}
