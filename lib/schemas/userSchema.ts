import { z } from 'zod'

export const loginSchema = z.object({
	email: z
		.string()
		.email()
		.min(1, { message: 'Email cím megadása kötelező' })
		.max(40, { message: 'Email cím maximum 40 karakter lehet' }),
	password: z
		.string()
		.min(1, { message: 'Jelszó megadása kötelező' })
		.max(32, { message: 'Jelszó maximum 32 karakter lehet' }),
})

export const signupSchema = z.object({
	name: z
		.string()
		.min(3, { message: 'A név minimum 3 karakter lehet' })
		.max(32, { message: 'A név maximum 32 karakter lehet' }),
	email: z
		.string()
		.email()
		.min(1, { message: 'Email cím megadása kötelező' })
		.max(40, { message: 'Email cím maximum 40 karakter lehet' }),
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
		.max(32, { message: 'A név maximum 32 karakter lehet' }),
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
	newPassword: z
		.string()
		.min(8, { message: 'Jelszó minimum 8 karakter lehet' })
		.max(32, { message: 'Jelszó maximum 32 karakter lehet' })
		.regex(/[!@#$%^&*(),.?":{}|<>-]/, {
			message:
				'A jelszónak tartalmaznia kell legalább egy speciális karaktert',
		}),
})
