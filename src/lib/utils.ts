import z from 'zod';

export function formatSchemaError(message: string, errorObject: z.ZodError) {
    const issues = errorObject.issues.map(e => `${e.path.join('.')}: ${e.message}\n`).join('\n');
    return `${message}:\n\n${issues}`;
}
