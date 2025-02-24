import { LinearAPI } from '@/lib/linear';
import { headers } from 'next/headers';
import { z } from 'zod';

// Schema for the webhook request body
const SearchRequestSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  searchText: z.string().min(1, 'Search text is required'),
});

export async function POST(req: Request) {
  console.log('\n=== Linear Search Webhook Request Started ===');

  // Get the webhook secret from headers
  const headersList = await headers();
  const webhookSecret = headersList.get('x-webhook-secret');

  // Verify the webhook secret
  if (webhookSecret !== process.env.ELEVENLABS_WEBHOOK_SECRET) {
    return new Response('Unauthorized', { status: 401 });
  }
  console.log('Authentication successful');

  try {
    // Parse and validate the request body
    const rawBody = await req.json();
    console.log('Raw request body:', rawBody);

    const validatedData = SearchRequestSchema.parse(rawBody);
    console.log('Validated request data:', validatedData);

    // Initialize Linear API with the user's credentials
    console.log('Initializing Linear API with userId:', validatedData.userId);
    const linearApi = new LinearAPI(validatedData.userId);

    // Search for issues
    console.log('Searching Linear issues with text:', validatedData.searchText);
    const issues = await linearApi.searchIssuesByText(validatedData.searchText);
    console.log('Linear API search results:', {
      issueCount: issues.length,
      issues: issues.map((issue) => ({
        id: issue.id,
        identifier: issue.identifier,
        title: issue.title,
        description: issue.description,
        state: issue.state,
        assignee: issue.assignee?.name,
      })),
    });

    // Return the results
    const response = { issues };
    console.log('Sending successful response with issues');
    console.log('=== Linear Search Webhook Request Completed ===\n');

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error: unknown) {
    console.error('Error processing Linear search webhook:', {
      error,
      errorName: error instanceof Error ? error.name : 'Unknown',
      errorMessage: error instanceof Error ? error.message : String(error),
      errorStack: error instanceof Error ? error.stack : undefined,
    });

    if (error instanceof z.ZodError) {
      console.log('Validation error details:', error.errors);
      return new Response(
        JSON.stringify({
          error: 'Invalid request data',
          details: error.errors,
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    console.log('=== Linear Search Webhook Request Failed ===\n');
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
