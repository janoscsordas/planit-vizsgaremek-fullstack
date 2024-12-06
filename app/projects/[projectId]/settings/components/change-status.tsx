'use client'

import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { toast } from "sonner"
import { useState } from 'react'


interface StatusData {
	projectStatus: 'active' | 'completed' | 'archived'
}

interface FormState {
	status: 'active' | 'completed' | 'archived'
	isLoading: boolean
	error: string | null
	disabled: boolean
	submitDisabled: boolean
}

export default function ChangeStatus({
	projectId,
	statusData,
}: {
	projectId: string
	statusData: StatusData
}) {
	const [formState, setFormState] = useState<FormState>({
		status: statusData.projectStatus,
		isLoading: false,
		error: null,
		disabled: false,
		submitDisabled: false,
	})
	return (
		<div className="space-y-4 border border-muted rounded-md p-6 mt-6">
			<div className="space-y-2">
				<h4 className="font-medium text-sm">Státusz megváltoztatása</h4>
				<p className="text-muted-foreground text-xs my-1 mb-4">
					Itt megváltoztathatod a projekt státuszát.
				</p>
				<form
					// onSubmit=
					className="space-y-4"
					// onSubmit={}
				>
					<div className="space-y-2">
						<RadioGroup defaultValue="default">
							<div className="flex items-center space-x-2">
								<RadioGroupItem value="default" id="r1" />
								<Label htmlFor="r1">Aktív</Label>
							</div>
							<div className="flex items-center space-x-2">
								<RadioGroupItem value="comfortable" id="r2" />
								<Label htmlFor="r2">Elvégzett</Label>
							</div>
							<div className="flex items-center space-x-2">
								<RadioGroupItem value="compact" id="r3" />
								<Label htmlFor="r3">Archivált</Label>
							</div>
						</RadioGroup>
					</div>
					<Button
						type="submit"
						className="w-max bg-emerald hover:bg-emerald-hover"
					>
						Mentés
					</Button>
				</form>
			</div>
		</div>
	)
}
