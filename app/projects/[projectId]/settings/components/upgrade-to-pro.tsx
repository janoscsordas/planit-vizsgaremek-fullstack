import { Button } from '@/components/ui/button'

export default function UpgradeToPro() {
	return (
		<form action="">
			<div className="border rounded-md p-4 mt-6">
				<div className="space-y-2">
					<h4 className="font-medium text-sm">
						Szolgáltatás módosítása
					</h4>
					<Button
						disabled
						title="Változtatás Pro-ra"
						variant="outline"
					>
						<h2 className="font-medium text-sm">Váltás Pro-ra</h2>
					</Button>
					<p className="text-muted-foreground text-xs">
						A Pro szolgáltatás jelenleg még nem elérhető!
					</p>
				</div>
			</div>
		</form>
	)
}
