import { z } from 'zod'
import {MAX_EMAIL_LENGTH, MAX_USERNAME_LENGTH} from "@/lib/utils/globalVariables";

export const loginSchema = z.object({
	email: z
		.string()
		.email()
		.min(1, { message: 'Email cím megadása kötelező' })
		.max(MAX_EMAIL_LENGTH, { message: `Email cím maximum ${MAX_EMAIL_LENGTH} karakter lehet` }),
	password: z
		.string()
		.min(1, { message: 'Jelszó megadása kötelező' })
		.max(32, { message: 'Jelszó maximum 32 karakter lehet' }),
})

export const signupSchema = z.object({
	name: z
		.string()
		.min(3, { message: 'A név minimum 3 karakter lehet' })
		.max(MAX_USERNAME_LENGTH, { message: `A név maximum ${MAX_USERNAME_LENGTH} karakter lehet` }),
	email: z
		.string()
		.email()
		.min(1, { message: 'Email cím megadása kötelező' })
		.max(MAX_EMAIL_LENGTH, { message: `Email cím maximum ${MAX_EMAIL_LENGTH} karakter lehet` }),
	password: z
		.string()
		.min(8, { message: 'Jelszó minimum 8 karakter lehet' })
		.max(32, { message: 'Jelszó maximum 32 karakter lehet' })
		.regex(/[!@#$%^&*(),.?":{}|<>-]/, {
			message:
				'A jelszónak tartalmaznia kell legalább egy speciális karaktert',
		}),
})

export const userChangeFormSchema = z.object({
	name: z
		.string()
		.min(3, { message: 'A név minimum 3 karakter lehet' })
		.max(MAX_USERNAME_LENGTH, { message: `A név maximum ${MAX_USERNAME_LENGTH} karakter lehet` }),
})

export const userBirthDateSchema = z.object({
	birthday: z.date(),
})

export const userPasswordChangeSchema = z.object({
	password: z
		.string()
		.min(8, { message: 'Jelszó minimum 8 karakter lehet' })
		.max(32, { message: 'Jelszó maximum 32 karakter lehet' })
		.regex(/[!@#$%^&*(),.?":{}|<>-]/, {
			message:
				'A jelszónak tartalmaznia kell legalább egy speciális karaktert',
		}),
	confirmPassword: z
		.string()
		.min(8, { message: 'Jelszó minimum 8 karakter lehet' })
		.max(32, { message: 'Jelszó maximum 32 karakter lehet' })
		.regex(/[!@#$%^&*(),.?":{}|<>-]/, {
			message:
				'A jelszónak tartalmaznia kell legalább egy speciális karaktert',
		}),
})
