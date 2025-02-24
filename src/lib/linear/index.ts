import { LinearClient } from '@linear/sdk';
import { db } from '@/db';
import { eq } from 'drizzle-orm';
import { users } from '@/db/schema';

export interface LinearIssueSearchResult {
  id: string;
  identifier: string;
  title: string;
  description: string | null;
  url: string;
  state: {
    name: string;
    type: string;
  };
  assignee: {
    id: string;
    name: string;
    email: string;
  } | null;
}

export interface LinearProjectSearchResult {
  id: string;
  name: string;
  description: string | null;
  url: string;
  state: string;
  lead: {
    id: string;
    name: string;
    email: string;
  } | null;
}

export class LinearAPI {
  private client: LinearClient | null = null;
  private userId: string;

  constructor(userId: string) {
    this.userId = userId;
  }

  private async initializeClient() {
    if (this.client) return;

    const user = await db.query.users.findFirst({
      where: eq(users.id, this.userId),
    });

    if (!user?.linearApiKey) {
      throw new Error('Linear API key not found for user');
    }

    this.client = new LinearClient({
      apiKey: user.linearApiKey,
    });
  }

  async searchIssueById(
    issueId: string
  ): Promise<LinearIssueSearchResult | null> {
    await this.initializeClient();
    if (!this.client) throw new Error('Failed to initialize Linear client');

    try {
      const issue = await this.client.issue(issueId);
      if (!issue) return null;

      const [state, assignee] = await Promise.all([
        issue.state,
        issue.assignee,
      ]);

      return {
        id: issue.id,
        identifier: issue.identifier,
        title: issue.title,
        description: issue.description || null,
        url: issue.url,
        state: {
          name: state?.name || 'Unknown',
          type: state?.type || 'Unknown',
        },
        assignee: assignee
          ? {
              id: assignee.id,
              name: assignee.name,
              email: assignee.email,
            }
          : null,
      };
    } catch (error) {
      console.error('Error searching for issue:', error);
      return null;
    }
  }

  async searchIssuesByText(
    searchText: string
  ): Promise<LinearIssueSearchResult[]> {
    await this.initializeClient();
    if (!this.client) throw new Error('Failed to initialize Linear client');

    try {
      // Match project keys with flexible formatting:
      // - Case insensitive
      // - Optional separator (hyphen or space)
      // Examples: "TOY-8", "toy 8", "TOY8", "Toy-8"
      const issueNumberMatch = searchText.match(/([A-Za-z]+)[-\s]*(\d+)/i);
      const issueNumber = issueNumberMatch
        ? parseInt(issueNumberMatch[2])
        : null;

      const issues = await this.client.issues({
        filter: {
          or: [
            { title: { contains: searchText } },
            { description: { contains: searchText } },
            ...(issueNumber ? [{ number: { eq: issueNumber } }] : []),
          ],
        },
        first: 10, // Limit to first 10 results
      });

      const issueResults = await Promise.all(
        issues.nodes.map(async (issue) => {
          const [state, assignee] = await Promise.all([
            issue.state,
            issue.assignee,
          ]);

          return {
            id: issue.id,
            identifier: issue.identifier,
            title: issue.title,
            description: issue.description || null,
            url: issue.url,
            state: {
              name: state?.name || 'Unknown',
              type: state?.type || 'Unknown',
            },
            assignee: assignee
              ? {
                  id: assignee.id,
                  name: assignee.name,
                  email: assignee.email,
                }
              : null,
          };
        })
      );

      return issueResults;
    } catch (error) {
      console.error('Error searching for issues:', error);
      return [];
    }
  }

  async searchProjectById(
    projectId: string
  ): Promise<LinearProjectSearchResult | null> {
    await this.initializeClient();
    if (!this.client) throw new Error('Failed to initialize Linear client');

    try {
      const project = await this.client.project(projectId);
      if (!project) return null;

      const lead = await project.lead;

      return {
        id: project.id,
        name: project.name,
        description: project.description || null,
        url: project.url,
        state: project.state,
        lead: lead
          ? {
              id: lead.id,
              name: lead.name,
              email: lead.email,
            }
          : null,
      };
    } catch (error) {
      console.error('Error searching for project:', error);
      return null;
    }
  }

  async searchProjectsByText(
    searchText: string
  ): Promise<LinearProjectSearchResult[]> {
    await this.initializeClient();
    if (!this.client) throw new Error('Failed to initialize Linear client');

    try {
      const projects = await this.client.projects({
        filter: {
          name: { contains: searchText },
        },
        first: 10, // Limit to first 10 results
      });

      const projectResults = await Promise.all(
        projects.nodes.map(async (project) => {
          const lead = await project.lead;

          return {
            id: project.id,
            name: project.name,
            description: project.description || null,
            url: project.url,
            state: project.state,
            lead: lead
              ? {
                  id: lead.id,
                  name: lead.name,
                  email: lead.email,
                }
              : null,
          };
        })
      );

      return projectResults;
    } catch (error) {
      console.error('Error searching for projects:', error);
      return [];
    }
  }
}
