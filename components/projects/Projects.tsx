"use client"

import { useQuery } from "@tanstack/react-query"
import { useState, useMemo } from "react"
import { Spinner } from "@radix-ui/themes"
import SearchFilters from "@/components/projects/Search-filter"
import ProjectList from "@/components/projects/ProjectList"
import { Project } from "@/lib/definitions/projects"
import { User } from "next-auth"

export default function Projects({ userSession }: { userSession: User }) {
  // State for search and status filters
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  // Fetch user's projects from the database using Tanstack Query via API route
  // Avoiding leaking secrets to the client
  const { data, isLoading, error } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const response = await fetch("/api/projects", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
      if (!response.ok) {
        const errorMessage = await response.json()
        throw new Error(errorMessage.error)
      }
      const { ownedProjects, memberProjects } = await response.json()

      return { ownedProjects, memberProjects } as {
        ownedProjects: Project[]
        memberProjects: Project[]
      }
    },
    staleTime: 60 * 10000,
    refetchOnWindowFocus: false,
  })

  // Filter projects based on search term and status
  // This is the essential part of the filtering logic
  const filteredProjects = useMemo(() => {
    const ownedProjects =
      data?.ownedProjects?.filter(
        (project: Project) =>
          project.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
          (statusFilter === "all" || project.status === statusFilter)
      ) || []

    const memberProjects =
      data?.memberProjects?.filter(
        (project: Project) =>
          project.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
          (statusFilter === "all" || project.status === statusFilter)
      ) || []

    return { ownedProjects, memberProjects }
  }, [data, searchTerm, statusFilter])

  // Display error message if there's an error
  if (error) return <div>Error: {error.message}</div>

  // Render the main UI
  return (
    <div className="space-y-6 w-[95%] mx-auto">
      <SearchFilters
        searchTerm={searchTerm}
        statusFilter={statusFilter}
        onSearchChange={setSearchTerm}
        onStatusChange={setStatusFilter}
      />

      <div className="space-y-6">
        {/* Display loading spinner while fetching projects */}
        {isLoading ? (
          <Spinner size="3" className="mx-auto" />
        ) : (
          <>
            <ProjectList
              title={userSession?.name + " Projektjei"}
              projects={filteredProjects.ownedProjects as Project[]}
            />
            <ProjectList
              title="Tagja vagy a következő projekteknek:"
              projects={filteredProjects.memberProjects as Project[]}
            />
          </>
        )}
      </div>
    </div>
  )
}
