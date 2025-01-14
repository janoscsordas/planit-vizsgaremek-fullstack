import { Badge, Code, DataList, Flex, IconButton } from '@radix-ui/themes'
import { CopyIcon } from 'lucide-react'
import { format } from 'date-fns'
import { hu } from 'date-fns/locale'
import ProjectIdCopy from './project-id-copy'

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
		<div className="p-6 mt-6 space-y-4 border rounded-md">
			<h4 className="text-sm font-medium">Projekt információk</h4>
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
							<ProjectIdCopy projectId={projectId} />
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
							<p className="flex items-center justify-center text-xs font-semibold text-emerald">
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
