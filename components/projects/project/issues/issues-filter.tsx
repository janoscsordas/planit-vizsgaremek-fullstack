"use client";

import { Button } from "@/components/ui/button";
import { Check, CircleDot } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useTransition } from "react";

export default function IssuesFilter({
    numberOfOpenIssues,
    numberOfClosedIssues,
}: {
    numberOfOpenIssues: number;
    numberOfClosedIssues: number;
}) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [isPending, startTransition] = useTransition();

    const handleFilter = useCallback((status: string) => {
        startTransition(() => {
            const params = new URLSearchParams(searchParams.toString());
            const currentStatus = params.get('status');

            if (currentStatus === status) {
                params.delete('status');
            } else {
                params.set('status', status);
            }

            router.push(`?${params.toString()}`, { scroll: false });
        });
    }, [searchParams, router]);

    const currentStatus = searchParams.get('status');

    return (
        <div className="flex items-center gap-2">
            <Button 
                variant="outline" 
                className={`text-primary ${currentStatus === 'open' ? 'font-bold text-emerald' : ''}`} 
                onClick={() => handleFilter('open')}
                disabled={isPending}
            >
                <CircleDot className="w-4 h-4 mr-2" />
                {numberOfOpenIssues} Nyitva
            </Button>
            <Button 
                variant="ghost" 
                className={`text-muted-foreground ${currentStatus === 'closed' ? 'font-bold text-emerald' : ''}`} 
                onClick={() => handleFilter('closed')}
                disabled={isPending}
            >
                <Check className="w-3 h-3" />
                {numberOfClosedIssues} Lezárva
            </Button>
        </div>
    )  
}