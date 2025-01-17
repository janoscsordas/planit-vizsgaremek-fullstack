"use client"

import { useRouter, useSearchParams } from "next/navigation"
import React from "react"
import PaginationControls from "./pagination-controls"

interface PaginationData {
  total: number
  totalPages: number
  currentPage: number
  limit: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}

export default function IssuesPagination({
  paginationData,
  projectId,
}: {
  paginationData: PaginationData
  projectId: string
}) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handlePageChange = (page: number) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()))
    current.set("page", page.toString())

    const search = current.toString()
    const query = search ? `?${search}` : ""

    router.push(`${window.location.pathname}${query}`)
  }

  return (
    <PaginationControls
      currentPage={paginationData.currentPage}
      totalPages={paginationData.totalPages}
      onPageChange={handlePageChange}
    />
  )
}
