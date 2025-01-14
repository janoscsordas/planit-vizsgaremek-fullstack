import DialogForProjectDeletion from "./dialog-for-project-deletion"

export default function DeleteProject({
  projectName,
  projectId,
}: {
  projectName: string
  projectId: string
}) {
  return (
    <>
      <section className="p-4 mt-6 mb-10 border border-red-600 rounded-md">
        <h4 className="font-medium text-red-500 text-md">Veszélyes zóna!</h4>
        <p className="text-sm text-muted-foreground">
          A változtások nem visszavonhatóak!
        </p>
        <DialogForProjectDeletion
          projectName={projectName}
          projectId={projectId}
        />
      </section>
    </>
  )
}
