import z from 'zod';
import { env } from './env';
import { formatSchemaError } from './utils';

export const ContributionDaySchema = z.object({
    date: z.string(),
    contributionCount: z.number(),
    color: z.string()
});

export const ContributionWeekSchema = z.object({
    contributionDays: z.array(ContributionDaySchema)
});

export const ContributionCalendarSchema = z.object({
    totalContributions: z.number(),
    weeks: z.array(ContributionWeekSchema)
});

const ContributionDataSchema = z.object({
    data: z.object({
        user: z.object({
            contributionsCollection: z.object({
                contributionCalendar: ContributionCalendarSchema
            })
        })
    })
});

const ContributionDataErrorSchema = z.object({
    message: z.string(),
    status: z.string()
});

export type ContributionDay = z.infer<typeof ContributionDaySchema>;

export type ContributionWeek = z.infer<typeof ContributionWeekSchema>;

export type ContributionCalendar = z.infer<typeof ContributionCalendarSchema>;

export async function getContributionCalendar(): Promise<ContributionCalendar> {
    const contributionsQuery = `
    {
        user(login: "${env.GITHUB_USERNAME}") {
            contributionsCollection {
                contributionCalendar {
                    totalContributions
                    weeks {
                        contributionDays {
                            date
                            contributionCount
                            color
                        }
                    }
                }
            }
        }
    }
    `;

    const res = await fetch('https://api.github.com/graphql', {
        method: 'POST',
        headers: {
            Authorization: `bearer ${env.GITHUB_TOKEN}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query: contributionsQuery })
    });

    const data = await res.json();

    if (!res.ok) {
        const errorParsed = ContributionDataErrorSchema.safeParse(data);
        const errorReason = `Reason: ${errorParsed.success ? errorParsed.data.message : '<unable to parse error message>'}`;
        const message = `Error getting contribution data. Status: ${res.status}. Reason: ${errorReason}.`;
        throw new Error(message);
    }

    const calendarParsed = ContributionDataSchema.safeParse(data);

    if (!calendarParsed.success) {
        throw new Error(
            formatSchemaError('Unable to parse contribution calendar', calendarParsed.error)
        );
    }

    return calendarParsed.data.data.user.contributionsCollection.contributionCalendar;
}
