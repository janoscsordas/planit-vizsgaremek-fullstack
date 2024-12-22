"use client";

import { TextField } from "@radix-ui/themes";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { useDebounce } from "use-debounce";

export default function SearchForm({ defaultValue = '' }) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [searchTerm, setSearchTerm] = useState(defaultValue);
    const [debouncedValue] = useDebounce(searchTerm, 500);

    useEffect(() => {
        if (debouncedValue) {
            startTransition(() => {
                router.push(`/chat/history?query=${encodeURIComponent(debouncedValue)}`)
            })
        } else if (debouncedValue === '') {
            startTransition(() => {
                router.push(`/chat/history`);
            })
        }
    }, [debouncedValue, router]);

    return (
        <TextField.Root 
            name="search" 
            id="search" 
            placeholder="Korábbi chat keresés..." 
            className="my-3 mx-2" 
            color="green"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
        >
            <TextField.Slot>
                <Search className="w-4 h-4" />
            </TextField.Slot>
        </TextField.Root>
    )
}