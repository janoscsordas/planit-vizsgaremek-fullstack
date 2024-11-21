"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";


export default function UserBirthDate() {

    return (
        <form action="" className="border border-muted rounded-md p-4 mt-8">
            <h4 className="font-medium text-sm">Születési dátum</h4>
            <p className="text-muted-foreground text-xs pt-2">
                
            </p>
            <Button className="mb-10 md:mb-0 mt-10 bg-emerald hover:bg-emerald-hover" type="submit">Mentés</Button>
        </form>
    )
}