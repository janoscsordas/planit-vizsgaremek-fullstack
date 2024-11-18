import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Avatar, Button, IconButton, TextField } from "@radix-ui/themes";
import Image from "next/image";
import { Bell, Filter, Search } from "lucide-react";
import Link from "next/link";
import Projects from "@/components/projects/Projects";

export default async function ProjectsPage() {
  const session = await auth();

  if (!session?.user) {
    return redirect("/login");
  }

  return (
    <div>
      {/* navbar */}
      <nav className="flex justify-between items-center p-4 border-b-2 border-foreground/10">
        <h1 className="text-muted-foreground">Projektek</h1>

        <div className="flex items-center gap-4">
          {/* TODO: notifications animation */}
          <IconButton variant="ghost" color="gray" className="cursor-pointer">
            <Bell width="18" height="18" className="text-muted-foreground" />
          </IconButton>
          {session.user.image ? (
            <Image
              src={session.user.image}
              alt="Profilkép"
              width={38}
              height={32}
              className="rounded-full"
            />
          ) : (
            <Avatar radius="full" fallback="A" />
          )}
        </div>
      </nav>

      {/* buttons */}
      <div className="flex items-center gap-4 p-4 w-full sm:w-3/4 mx-auto">
        <Link href="/projects/create">
          <Button
            size="2"
            variant="outline"
            color="green"
            className="bg-[#00A36C] hover:bg-[#00A36C]/90 text-primary font-medium w-max cursor-pointer"
          >
            Új projekt
          </Button>
        </Link>
        <TextField.Root
          placeholder="Projekt keresése..."
          radius="large"
          size="2"
          color="green"
        >
          <TextField.Slot>
            <Search height="16" width="16" className="text-muted-foreground" />
          </TextField.Slot>
        </TextField.Root>
        <Button variant="outline" size="2" color="green" className="cursor-pointer">
          <Filter width="14" height="14" />
        </Button>
      </div>

      {/* projects */}

      <div className="flex flex-wrap gap-4 p-4 w-[95%] sm:w-3/4 mx-auto">
        <h2 className="text-primary text-xl py-4 font-bold">
          {session.user.name} projektjei
        </h2>
      </div>
      <div>
        <Projects />
      </div>
    </div>
  );
}
