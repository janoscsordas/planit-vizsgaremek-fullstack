'use client'
import {
	Dialog,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
	DialogContent,
	DialogClose,
	DialogDescription,
	DialogFooter,
} from '../ui/dialog'
import { Button } from '../ui/button'
import DeleteAccountButton from './DeleteAccountButton'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { useState, useEffect } from 'react'

export default function DialogForAccountDeletion({
	userName,
}: {
	userName: string
}) {
	const [name, setName] = useState('')
	const [disabled, setDisabled] = useState(true)

	useEffect(() => {
		if (name === userName) {
			setDisabled(false)
			return
		}
		setDisabled(true)
	}, [name])

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button
					className="border-red-500 hover:bg-red-500 text-primary mt-2"
					variant="outline"
				>
					Fiók törlése
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Biztosan törölni akarod fiókodat?</DialogTitle>
					<DialogDescription>
						Ha igen, kövesd az alábbi utasítást a fiókod végleges
						törléséhez.
					</DialogDescription>
				</DialogHeader>
				<Label htmlFor="name">
					Írd be a neved a törléshez:
					<kbd className="ml-1 pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
						<span className="text-xs">{userName}</span>
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
						<Button className="bg-muted hover:bg-muted-hover mt-2 sm:mt-0" variant={'outline'}>
							Mégsem
						</Button>
					</DialogClose>
					<DeleteAccountButton disabled={disabled} />
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
