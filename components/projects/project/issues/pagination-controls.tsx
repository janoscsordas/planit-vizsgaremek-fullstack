"use client"

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import React from "react";

interface PaginationControlProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export default function PaginationControls({
    currentPage,
    totalPages,
    onPageChange
}: PaginationControlProps) {
    // Generating page numbers to be shown
    const getPageNumbers = () => {
        const pages = []
        const showPages = 5; // Number of page buttons to show

        // Always show first page
        pages.push(1);

        let startPage = Math.max(2, currentPage - Math.floor(showPages / 2));
        let endPage = Math.min(totalPages - 1, startPage + showPages - 1);

        // Adjust start if we're near the end
        if (endPage - startPage < showPages - 1) {
            startPage = Math.max(2, endPage - showPages + 1);
        }

        // Add ellipsis after first page if needed
        if (startPage > 2) {
            pages.push("...");
        }

        // Add middle pages
        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }

        // Add ellipsis before last page if needed
        if (endPage < totalPages - 1) {
            pages.push("...");
        }

        if (totalPages > 1) {
            pages.push(totalPages);
        }

        return pages;
    };

    return (
        <div className="flex items-center justify-center gap-2 mt-8 mb-2">
            <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2"
            >
                <ChevronLeft className="h-4 w-4" />
            </Button>

            <div className="flex gap-2">
                {getPageNumbers().map((page, index) => (
                    <React.Fragment key={index}>
                        {page === "..." ? (
                            <span className="px-3 py-2">...</span>
                        ) : (
                            <Button
                                variant={page === currentPage ? "default" : "outline"}
                                size="sm"
                                onClick={() => onPageChange(page as number)}
                                className="px-3 py-2"
                            >
                                {page}
                            </Button>
                        )}
                    </React.Fragment>
                ))}
            </div>

            <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2"
            >
                <ChevronRight className="h-4 w-4" />
            </Button>
        </div>
    )
}