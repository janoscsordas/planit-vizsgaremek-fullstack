import { z } from "zod"

export const issueCreationFormSchema = z.object({
  issueName: z
    .string()
    .min(4, {
      message: "A probléma címének minimum 4 karakter hosszúnak kell lennie!",
    })
    .max(100, {
      message: "A probléma címe maximum 100 karakter hosszú lehet!",
    }),
  issueDescription: z
    .string()
    .min(4, {
      message:
        "A probléma leírásának minimum 4 karakter hosszúnak kell lennie!",
    })
    .max(2048, {
      message: "A probléma leírása maximum 2048 karakter hosszú lehet!",
    }),
  taskIssueId: z.string().optional(),
  labels: z.array(z.string()).nullable(),
})

export const issueCommentFormSchema = z.object({
  comment: z
    .string({ message: "A komment mező kitöltése kötelező!" })
    .min(1, {
      message: "A komment mező kitöltése kötelező!",
    })
    .max(2048, {
      message: "A komment maximum 2048 karakter hosszú lehet!",
    }),
})
