"use client"

import { Button } from '@/components/ui/button'
import { ChevronLeft } from 'lucide-react'

export default function ProfileHeader() {
	return (
		<>
			<section className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
				<div>
					<h2 className="text-2xl font-bold">Fiókbeállítások</h2>
					<p className="text-muted-foreground pt-2">
						Fiókbeállítások kezelése és testreszabása.
					</p>
				</div>
				<div className="flex gap-2 items-center">
					<Button variant={"outline"} onClick={() => window.history.back()}>
						<ChevronLeft /> Vissza az előző oldalra
					</Button>
				</div>
			</section>
			<hr className="my-6" />
		</>
	)
}
