'use client';

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
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const formSchema = z.object({
  managerEmail: z.string().email('Please enter a valid email address'),
});

interface SettingsFormProps {
  initialEmail?: string | null;
}

export function SettingsForm({ initialEmail }: SettingsFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      managerEmail: initialEmail || '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const formData = new FormData();
    formData.append('managerEmail', values.managerEmail);

    const result = await updateManagerEmail(formData);

    if (result.error) {
      toast.error('Error', {
        description: result.error,
      });
    } else {
      toast.success('Success', {
        description: 'Manager email updated successfully',
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
        <Button type='submit'>Update Manager&apos;s Email</Button>
      </form>
    </Form>
  );
}
