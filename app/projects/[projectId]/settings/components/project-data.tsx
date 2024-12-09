'use client'

import { Badge, Code, DataList, Flex, IconButton } from '@radix-ui/themes'
import { CopyIcon } from 'lucide-react'
import { format } from 'date-fns'
import { hu } from 'date-fns/locale'

interface ProjectData {
	projectName: string
	projectNameChangedAt: Date | null
	projectCreatedAt: Date
	projectTier: 'free' | 'paid'
	projectStatus: 'active' | 'completed' | 'archived'
}

export default function ProjectData({
	projectId,
	projectData,
}: {
	projectId: string
	projectData: ProjectData
}) {
	return (
		<div className="space-y-4 border border-muted rounded-md p-6 mt-6">
			<h4 className="font-medium text-sm">Projekt információk</h4>
			<div className="">
				<DataList.Root>
					<DataList.Item align="center">
						<DataList.Label minWidth="88px">
							Projekt státusza
						</DataList.Label>
						<DataList.Value>
							{/* check if when the status is active write "aktív" when its completed write "Elvégezett"and so on */}
							<Badge
								color={
									projectData.projectStatus === 'active'
										? 'green'
										: projectData.projectStatus ===
										  'completed'
										? 'blue'
										: 'crimson'
								}
								variant="soft"
								radius="full"
							>
								{projectData.projectStatus}
							</Badge>
						</DataList.Value>
					</DataList.Item>
					<DataList.Item>
						<DataList.Label minWidth="88px">Szint</DataList.Label>
						<DataList.Value>
							{/* check if when the status is active write "aktív" when its completed write "Elvégezett"and so on */}
							<Badge
								color={
									projectData.projectTier === 'free'
										? 'amber'
										: 'violet'
								}
								variant="soft"
								radius="full"
							>
								{projectData.projectTier}
							</Badge>
						</DataList.Value>
					</DataList.Item>
					<DataList.Item>
						<DataList.Label minWidth="88px">ID</DataList.Label>
						<DataList.Value>
							<Flex
								align="center"
								gap="2"
								onClick={() =>
									navigator.clipboard.writeText(projectId)
								}
								className="cursor-pointer"
							>
								<Code variant="ghost">{projectId}</Code>
								<IconButton
									// TODO: copy to clipboard tooltip !!!
									// onClick={() => window.prompt("Másolás vágólapra", projectId)}
									aria-label="Copy value"
									color="jade"
									variant="ghost"
									className="size-4 cursor-pointer p-1 m-1"
								>
									<CopyIcon />
								</IconButton>
							</Flex>
						</DataList.Value>
					</DataList.Item>
					<DataList.Item>
						<DataList.Label minWidth="88px">
							Projekt neve
						</DataList.Label>
						<DataList.Value
							className={
								projectData.projectNameChangedAt &&
								projectData.projectName !==
									projectData.projectNameChangedAt.toString()
									? 'text-emerald'
									: ''
							}
						>
							{projectData.projectName}
						</DataList.Value>
					</DataList.Item>
					<DataList.Item>
						<DataList.Label minWidth="88px">
							Készítés ideje
						</DataList.Label>
						<DataList.Value>
							{format(
								projectData.projectCreatedAt,
								'yyyy. MMMM d. H:mm',
								{
									locale: hu,
								}
							)}
						</DataList.Value>
					</DataList.Item>
					<DataList.Item>
						<DataList.Label minWidth="88px">
							Utolsó névváltoztatás
						</DataList.Label>
						<DataList.Value>
							<p className="flex justify-center items-center text-xs font-semibold text-emerald">
								{projectData.projectNameChangedAt
									? format(
											projectData.projectNameChangedAt,
											'yyyy. MMMM d. H.mm',
											{
												locale: hu,
											}
									  )
									: '(nincs adat)'}
							</p>
						</DataList.Value>
					</DataList.Item>
				</DataList.Root>
			</div>
		</div>
	)
}
