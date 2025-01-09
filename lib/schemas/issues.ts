import { z } from "zod";

export const issueCreationFormSchema = z.object({
    issueName: z
        .string()
        .min(4, {
            message: "Az issuenak minimum 4 karakter hosszúnak kell lennie!",
        })
        .max(100, {
            message: "Az issue maximum 100 karakter hosszú lehet!",
        }),
    issueDescription: z
        .string()
        .min(4, {
            message: "Az issue leírásának minimum 4 karakter hosszúnak kell lennie!",
        }),
    taskIssueId: z
        .string()
        .optional(),
    labels: z
        .array(z.string())
        .nullable(),
});