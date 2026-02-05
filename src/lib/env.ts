import 'dotenv/config';
import z from 'zod';
import { formatSchemaError } from './utils';

const EnvSchema = z.object({
    GITHUB_USERNAME: z.string(),
    GITHUB_TOKEN: z.string()
});

export type Env = z.infer<typeof EnvSchema>;

export function parseEnv(env: unknown): Env {
    try {
        return EnvSchema.parse(env);
    } catch (err) {
        if (err instanceof z.ZodError) {
            throw new Error(formatSchemaError('Invalid environment variables', err));
        }

        throw err;
    }
}

export const env = parseEnv(process.env);
