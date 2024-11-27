import DialogForProjectDeletion from "./dialog-for-project-deletion";

export default function DeleteProject() {
	return (
		<>
			<section className="mt-6 border border-red-600 rounded-md p-4 mb-10">
				<h4 className="font-medium text-md text-red-500">
					Veszélyes zóna!
				</h4>
				<p className="text-muted-foreground text-sm">
					A változtások nem visszavonhatóak!
				</p>
                <DialogForProjectDeletion />
			</section>
		</>
	)
}