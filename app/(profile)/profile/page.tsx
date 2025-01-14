import ProfileNavbar from '@/components/profile/profile-navbar'
import DialogForAccountDeletion from '@/components/profile/dialog-for-account-deletion'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import UserForm from '@/components/profile/forms/user-name-form'
import { db } from '@/database'
import { eq } from 'drizzle-orm'
import { AccountsTable, UsersTable } from '@/database/schema/user'
import { UserData } from '@/lib/definitions/user-types'
import UserPasswordForm from '@/components/profile/forms/user-password-form'
import ProfilePictureForm from '@/components/profile/forms/profile-picture-form'
import ProfileHeader from '../profile-header'
import { Avatar, Badge } from '@radix-ui/themes'
import { formatDate } from 'date-fns'
import Image from 'next/image'
import BirthDateForm from '@/components/profile/forms/birth-date-form'

export default async function ProfilePage() {
	const session = await auth()

	if (!session || !session.user || !session.user.name) {
		redirect('/login')
	}

	const [getUserInformation] = await db
		.select()
		.from(UsersTable)
		.where(eq(UsersTable.id, session.user.id))
		.limit(1)

	if (!getUserInformation) {
		redirect('/login')
	}

	const userData: UserData = {
		id: getUserInformation.id,
		name: getUserInformation.name ?? '',
		email: getUserInformation.email ?? '',
		emailVerified: getUserInformation.emailVerified ?? null,
		image: getUserInformation.image ?? null,
		password: getUserInformation.password ?? null,
		tier: getUserInformation.tier ?? 'free',
		birthDate: getUserInformation.birthDate ?? null,
		createdAt: getUserInformation.createdAt ?? new Date(),
		nameChangedAt: getUserInformation.nameChangedAt ?? null,
		imageChangedAt: getUserInformation.imageChangedAt ?? null,
	}

	const [userAccount] = await db
		.select()
		.from(AccountsTable)
		.where(eq(AccountsTable.userId, session.user.id))
		.limit(1)

	return (
		<div className=" w-[90%] mx-auto pt-8 md:pt-16">
			<ProfileHeader birthDate={userData.birthDate} />

			<div className="flex flex-col md:flex-row">
				<ProfileNavbar />
				<div className="ml-0 md:ml-12 mt-2 w-full md:w-[65%]">
					<h3 className="text-xl font-medium">Profilom</h3>
					<p className="text-muted-foreground text-sm pt-2">
						Ahogyan mások látnak téged az oldalon.
					</p>
					<hr className="my-6" />
					<div className='flex items-center gap-4 mb-4'>
						<Avatar
							src={session.user.image ?? undefined}
							fallback={session.user.name?.charAt(0) || '?'}
							alt={session.user.name}
							size="5"
							radius='full'
						/>
						<div>
							<h4 className="font-medium text-md mt-2">
								{session.user.name}
							</h4>
							<p className="text-muted-foreground text-sm mb-1">
								{session.user.email}
							</p>
							<Badge color={`${userData.tier === 'free' ? 'green' : 'yellow'}`}>{userData.tier}</Badge>
						</div>
					</div>
					<hr className='my-6' />
					<div>
						<h4 className="font-medium text-md mt-2">
							Regisztráció dátuma:
						</h4>
						<p className="text-muted-foreground text-sm mb-1">
							{formatDate(userData.createdAt, 'yyyy.MM.dd HH:mm')}
						</p>
					</div>
					<hr className='my-6' />
					{userAccount && (
						<>
							<div>
								<h4 className="font-medium text-md mt-2">
									Összekapcsolt fiók:
								</h4>
								{userAccount.provider && (
									<div className="text-muted-foreground text-sm mb-1 flex gap-2 mt-1">
										<Image 
											src={`${userAccount.provider}.svg`} 
											alt={userAccount.provider}
											width={16}
											height={16}
										/> 
										{userData.name}
									</div>
								)}
							</div>
							<hr className='my-6' />
						</>
					)}

					{/* User Form where the user can change their name */}
					<UserForm userData={userData} />

					{/* Form for adding a birth date to the user account */}
					<BirthDateForm birthDate={userData.birthDate} />

					{/* Form where the user can change their profile picture every 90 days */}
					<ProfilePictureForm
						imageChangedAt={userData.imageChangedAt}
						userId={session.user.id}
					/>

					{/* If user registered with credentials, their password can be changed */}
					{userData.password ? <UserPasswordForm /> : null}

					{/* Section for account deletion */}
					<section className="mt-6 border border-red-600 rounded-md p-4 mb-10">
						<h4 className="font-medium text-md text-red-500">
							Veszélyes zóna!
						</h4>
						<p className="text-muted-foreground text-sm">
							A változtások nem visszavonhatóak!
						</p>
						<DialogForAccountDeletion
							userName={session.user.name}
						/>
					</section>
				</div>
			</div>
		</div>
	)
}
