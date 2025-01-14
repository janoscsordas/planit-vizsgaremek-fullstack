'use client'

import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Input } from '@/components/ui/input'
import { useActionState, useEffect, useState } from 'react'
import { changeProjectStatus, StatusState } from '@/actions/projects.action'

interface FormState {
	disabled: boolean
}

export default function ChangeStatus({
	projectId,
	projectStatus,
}: {
	projectId: string
	projectStatus: string
}) {
	const initialState: StatusState = { message: null, errors: {} }
	const [state, formAction] = useActionState(
		changeProjectStatus,
		initialState
	)

	const [formState, setFormState] = useState<FormState>({
		disabled: true,
	})

	const [radioValue, setRadioValue] = useState(projectStatus)

	const handleRadioChange = (value: string) => {
		setRadioValue(value)
		setFormState({
			disabled: value === projectStatus,
		})
	}

	useEffect(() => {
		setFormState({
			disabled: radioValue === projectStatus,
		})
	}, [radioValue, projectStatus])

	return (
		<div className="space-y-4 border rounded-md p-6 mt-6">
			<div className="space-y-2">
				<h4 className="font-medium text-sm">Státusz megváltoztatása</h4>
				<p className="text-muted-foreground text-xs my-1 mb-4">
					Itt megváltoztathatod a projekt státuszát.
				</p>
				<form action={formAction} className="space-y-4">
					<div className="space-y-2">
						<RadioGroup name="status" defaultValue={projectStatus} onValueChange={handleRadioChange}>
							<div className="flex items-center space-x-2">
								<RadioGroupItem value="active" id="r1" />
								<Label htmlFor="r1">Aktív</Label>
							</div>
							<div className="flex items-center space-x-2">
								<RadioGroupItem value="completed" id="r2" />
								<Label htmlFor="r2">Elvégzett</Label>
							</div>
							<div className="flex items-center space-x-2 text-muted-foreground">
								<RadioGroupItem
									value="archived"
									id="r3"
									disabled
									// TODO: Toast bro
								/>
								<Label htmlFor="r3">Archivált</Label>
							</div>
						</RadioGroup>
						{state?.errors?.status &&
							state?.errors.status.map((error: string) => (
								<p
									className="mt-2 text-sm text-red-500"
									key={error}
								>
									{error}
								</p>
							))}
					</div>
					<Input type="hidden" name="projectId" value={projectId} />
					{state?.message && (
						<p
							className={`mt-2 text-sm ${
								state?.message.startsWith('Hiba')
									? 'text-red-500'
									: 'text-green-500'
							}`}
						>
							{state?.message}
						</p>
					)}
					<Button
						type="submit"
						className="w-max bg-emerald hover:bg-emerald-hover"
						disabled={
							formState.disabled
						}
					>
						Mentés
					</Button>
				</form>
			</div>
		</div>
	)
}
