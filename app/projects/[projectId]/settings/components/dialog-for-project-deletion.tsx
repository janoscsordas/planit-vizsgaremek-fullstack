'use client'

import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import DeleteProjectButton from './delete-project-button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { useState, useEffect } from 'react'

export default function DialogForProjectDeletion({
	projectName,
}: {
	projectName: string
}) {
	const [name, setName] = useState('')
	const [disabled, setDisabled] = useState(true)

	useEffect(() => {
		if (name === projectName) {
			setDisabled(false)
			return
		}
		setDisabled(true)
	}, [name])

	return (
		<>
			<Dialog>
				<DialogTrigger asChild>
					<Button
						className="border-red-500 hover:bg-red-500 text-primary mt-2"
						variant="outline"
					>
						Projekt törlés
					</Button>
				</DialogTrigger>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>
							Biztosan törölni akarod fiókodat?
						</DialogTitle>
						<DialogDescription>
							Ha igen, kövesd az alábbi utasítást a fiókod
							végleges törléséhez.
						</DialogDescription>
					</DialogHeader>
					<Label htmlFor="name">
						Írd be a neved a törléshez:
						<kbd className="ml-1 pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
							<span className="text-xs">{projectName}</span>
						</kbd>
					</Label>
					<Input
						id="name"
						name="name"
						type="text"
						value={name}
						onChange={(e) => setName(e.target.value)}
					/>
					<DialogFooter>
						<DialogClose asChild>
							<Button className="bg-muted hover:bg-muted-hover text-white">
								Mégsem
							</Button>
						</DialogClose>
						<DeleteProjectButton disabled={disabled} />
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	)
}
