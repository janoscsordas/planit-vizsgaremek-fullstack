import ProfileHeaderNavButtons from "./ProfileHeaderNavButtons";

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
				<ProfileHeaderNavButtons />
			</section>
			<hr className="my-6" />
		</>
	)
}
