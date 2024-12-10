'use client'

import React from 'react'
import { useState, useEffect } from 'react'
import { differenceInDays } from 'date-fns'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Loader2 } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { projectChangeFormSchema } from '@/lib/schemas/projectsSchema'
import { toast } from 'sonner'

interface ProjectData {
	projectName: string
	projectNameChangedAt: Date | null
}

interface FormState {
	name: string
	isLoading: boolean
	error: string | null
	disabled: boolean
	submitDisabled: boolean
}

const COOLDOWN_DAYS = 90

const ProjectNameForm = ({
	projectId,
	projectData,
}: {
	projectData: ProjectData
	projectId: string
}) => {
	const [formState, setFormState] = useState<FormState>({
		name: projectData.projectName,
		isLoading: false,
		error: null,
		disabled: false,
		submitDisabled: false,
	})

	// Calculate remaining days for username change
	const getRemainingDays = (): number | null => {
		if (!projectData.projectNameChangedAt) return null
		return (
			COOLDOWN_DAYS -
			differenceInDays(
				new Date(),
				new Date(projectData.projectNameChangedAt)
			)
		)
	}

	// Check if username change is allowed
	useEffect(() => {
		const remainingDays = getRemainingDays()
		if (projectData.projectName === formState.name) {
			setFormState((prev) => ({ ...prev, submitDisabled: true }))
		} else {
			setFormState((prev) => ({ ...prev, submitDisabled: false }))
		}
		if (remainingDays && remainingDays > 0) {
			setFormState((prev) => ({ ...prev, disabled: true }))
		}
	}, [projectData.projectNameChangedAt, formState.name])

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { value } = e.target
		setFormState((prev) => ({
			...prev,
			name: value,
			error: null,
		}))
	}

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()

		if (formState.disabled || formState.isLoading) {
			return
		}

		try {
			setFormState((prev) => ({ ...prev, isLoading: true, error: null }))

			const validatedData = projectChangeFormSchema.safeParse({
				name: formState.name.trim(),
			})

			if (!validatedData.success) {
				throw new Error(
					validatedData.error.errors[0]?.message ||
						'Érvénytelen projektnév!'
				)
			}

			const response = await fetch('/api/projects', {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					name: validatedData.data.name,
					projectId: projectId,
				}),
			})

			if (!response.ok) {
				const errorData = await response.json()
				throw new Error(
					errorData.message || 'Hiba történt a módosítás során!'
				)
			}

			const data = await response.json()

			toast('Sikeres módosítás!', {
				position: 'top-center',
				duration: 3000,
				description: data.message || 'A projetnév sikeresen módosítva!',
			})
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : 'Váratlan hiba történt'

			setFormState((prev) => ({ ...prev }))

			toast('Hiba történt!', {
				position: 'top-center',
				duration: 3000,
				description: errorMessage,
			})
		} finally {
			setFormState((prev) => ({ ...prev, isLoading: false }))
		}
	}

	const remainingDays = getRemainingDays()

	return (
		<form
			onSubmit={handleSubmit}
			className="space-y-4 border rounded-md p-6 mt-6"
		>
			<div className="space-y-2">
				<h4 className="font-medium text-sm">Projektnév módosítása</h4>

				<Input
					type="text"
					name="name"
					id="name"
					placeholder="Projektnév"
					value={formState.name}
					onChange={handleChange}
					disabled={formState.disabled || formState.isLoading}
					className="text-sm"
					aria-label="Projektnév"
				/>

				{formState.disabled && remainingDays ? (
					<p className="text-red-500 text-xs">
						{remainingDays} nap múlva módosíthatod újra a projekt
						nevét.
					</p>
				) : (
					<p className="text-muted-foreground text-xs">
						Módosíthatod a projektnevet. A következő módosításra{' '}
						<span className="font-semibold text-muted-foreground">
							{COOLDOWN_DAYS} nap{' '}
						</span>
						múlva kerülhet sor.
					</p>
				)}
			</div>

			{formState.error && (
				<Alert variant="destructive">
					<AlertDescription>{formState.error}</AlertDescription>
				</Alert>
			)}

			<Button
				type="submit"
				className="w-max bg-emerald hover:bg-emerald-hover"
				disabled={
					formState.disabled ||
					formState.isLoading ||
					formState.submitDisabled
				}
			>
				{formState.isLoading ? (
					<span className="flex items-center gap-2">
						<Loader2 className="h-4 w-4 animate-spin" />
						Feldolgozás...
					</span>
				) : (
					'Mentés'
				)}
			</Button>
		</form>
	)
}

export default ProjectNameForm
