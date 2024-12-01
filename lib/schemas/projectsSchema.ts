import { z } from "zod";

export const createProjectSchema = z.object({
    name: z.string().min(4, { message: "A projekt neve minimum 4 karakter hosszúnak kell lennie!" }).max(32, { message: "A projekt neve maximum 32 karakter hosszú lehet!" }),
})

export const updateProjectSchema = z.object({
    userId: z.string().min(4),
    name: z.string().min(4, { message: "A projekt neve minimum 4 karakter hosszúnak kell lennie!" }).max(32, { message: "A projekt neve maximum 32 karakter hosszú lehet!" }).optional(),
    tier: z.enum(["free", "paid"]).optional(),
    status: z.enum(["active", "completed", "archived"]).optional(),
})

export const projectTaskCreationSchema = z.object({
    taskName: z.string({ 
        required_error: "A feladat nevét meg kell adni!",
        invalid_type_error: "A feladat nevét helyesen kell megadnod!"
    }).min(4, { message: "A feladat nevének minimum 4 karakter hosszúnak kell lennie!" }).max(128, { message: "A feladat neve maximum 64 karakter hosszú lehet!" }),
    taskDescription: z.string({
        required_error: "A feladat leírását meg kell adni!",
        invalid_type_error: "A feladat leírását helyesen kell megadnod!"
    }).min(4, { message: "A feladat leírása minimum 4 karakter hosszú lehet!" }).max(256, { message: "A feladat leírása maximum 256 karakter hosszúlehet" }),
    status: z.enum(["pending", "in progress", "finished"], {
        required_error: "A feladat státuszát meg kell adnod!",
        invalid_type_error: "A feladat státuszát helyesen kell megadnod!"
    }),
    priority: z.enum(["low", "medium", "high"], {
        required_error: "A feladat prioritását meg kell adnod!",
        invalid_type_error: "A feladat prioritását helyesen kell megadnod!"
    }),
})