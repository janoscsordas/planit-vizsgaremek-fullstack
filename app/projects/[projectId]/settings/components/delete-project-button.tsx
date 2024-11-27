'use client'

import { Button } from '@radix-ui/themes'

export default function DeleteProjectButton() {
	return (
		<div>
			<Button
				// onClick={handleAccountDeletion}
				// disabled={disabled || isLoading}
				className="bg-red-500 hover:bg-red-600 text-white"
			>
				{/* {isLoading ? (
					<span className="flex items-center gap-2">
						<Loader2 className="animate-spin" />
						Fiók törlése folyamatban...
					</span>
				) : (
					'Fiók törlése'
				)} */}
				Fiók törlése
			</Button>
			{/* {error && <p className="text-red-500 mt-2">{error}</p>} */}
			<p className="text-red-500 mt-2">Veszélyes zóna!</p>
		</div>
	)
}
