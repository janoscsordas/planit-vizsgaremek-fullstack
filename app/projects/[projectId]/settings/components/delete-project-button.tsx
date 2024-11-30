'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { deleteProject } from '@/actions/projects.action'

export default function DeleteProjectButton({
	projectId,
	disabled,
}: {
	disabled: boolean
	projectId: string
}) {
	const [error, setError] = useState<string | null>(null)
	const [isLoading, setIsLoading] = useState(false)

	const handleProjectDeletion = async () => {
		setIsLoading(true)
		setError(null)
		disabled = true

		const response = await deleteProject(projectId)

		if (!response.success) {
			setError(response.message)
			return
		}
	}
	
	return (
		<>
			<div className="flex">
				{error && <p className="text-red-500 mt-2 text-center absolute left-6">{error}</p>}
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
				</div>
			</div>
		</>
	)
}
