"use client";

import { Button } from "@radix-ui/themes";
import { Plus } from "lucide-react";
import Link from "next/link";

export default function Projects() {
  return (
    <div className="flex flex-wrap justify-center items-center gap-4 p-4 w-[95%] sm:w-3/4 mx-auto border-2 border-dashed border-foreground/10 rounded-lg">
      {/* TODO: projects */}
      <div className="flex flex-col gap-2 items-center">
        <p className="text-primary text-lg font-medium">
          Még nem készített projektet
        </p>
        <p className="text-muted-foreground text-md">
          Készíts egy új projektet
        </p>
        <Link href="/projects/create">
          <Button
            size="2"
            variant="outline"
            color="green"
            className="bg-[#00A36C] hover:bg-[#00A36C]/90 text-primary font-medium w-max mt-2 cursor-pointer"
          >
            <Plus width="14" height="14" />
            Új projekt
          </Button>
        </Link>
      </div>
    </div>
  );
}
