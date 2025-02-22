import { Webhook } from 'svix';
import { WebhookEvent } from '@clerk/nextjs/server';
import { db } from '@/db';
import { eq } from 'drizzle-orm';
import { headers } from 'next/headers';
import { users } from '@/db/schema';

export async function POST(req: Request) {
  // Get the headers
  const headersList = await headers();
  const svix_id = headersList.get('svix-id') ?? '';
  const svix_timestamp = headersList.get('svix-timestamp') ?? '';
  const svix_signature = headersList.get('svix-signature') ?? '';

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occured -- no svix headers', {
      status: 400,
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your webhook secret
  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET || '');

  let evt: WebhookEvent;

  // Verify the webhook payload
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error occured', {
      status: 400,
    });
  }

  // Handle the webhook
  const eventType = evt.type;

  try {
    if (eventType === 'user.created' || eventType === 'user.updated') {
      const { id, email_addresses, first_name, last_name } = evt.data;
      const email = email_addresses[0]?.email_address;
      const name = `${first_name || ''} ${last_name || ''}`.trim();

      if (!email) {
        return new Response('No email found', { status: 400 });
      }

      // Upsert user in database
      await db
        .insert(users)
        .values({
          id: id as string,
          email,
          name: name || email,
          role: 'developer', // Default role
        })
        .onConflictDoUpdate({
          target: users.id,
          set: {
            email,
            name: name || email,
          },
        });
    }

    if (eventType === 'user.deleted') {
      const { id } = evt.data;
      // Delete user from database
      await db.delete(users).where(eq(users.id, id as string));
    }

    return new Response('Webhook processed successfully', { status: 200 });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return new Response('Error processing webhook', { status: 500 });
  }
}
