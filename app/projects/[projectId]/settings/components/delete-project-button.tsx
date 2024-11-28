'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
// import { backToProjects } from "next-auth/react"

export default function DeleteProjectButton({
	disabled,
}: {
	disabled: boolean
}) {
	const [error, setError] = useState<string | null>(null)
	const [isLoading, setIsLoading] = useState(false)

	const handleProjectDeletion = async () => {
		setIsLoading(true)
		setError(null)
		disabled = true

		try {
			const response = await fetch('/api/projects', {
				method: 'DELETE',
			})

			if (!response.ok) {
				setError('Projekt törlése sikertelen')
				return
			}

			// Get back to the projects page
			// await backToProjects({
			// 	redirect: true,
			// 	redirectTo: `/login?message=${encodeURIComponent(
			// 		'Projekt sikeresen törölve'
			// 	)}`,
			// })
		} catch (error) {
			setError('Projekt törlése sikertelen')
		} finally {
			disabled = false
			setIsLoading(false)
		}
	}

	return (
		<div>
			<Button
				onClick={handleProjectDeletion}
				disabled={disabled || isLoading}
				className="bg-red-500 hover:bg-red-600 text-white"
			>
				{isLoading ? (
					<span className="flex items-center gap-2">
						<Loader2 className="animate-spin" />
						Projekt törlése folyamatban...
					</span>
				) : (
					'Projekt törlése'
				)}
			</Button>
			{error && <p className="text-red-500 mt-2">{error}</p>}
		</div>
	)
}
