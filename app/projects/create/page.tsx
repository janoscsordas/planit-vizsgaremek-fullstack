import { Avatar, Button } from "@radix-ui/themes";
import { Bell } from "lucide-react";
import Image from "next/image";
import { IconButton } from "@radix-ui/themes";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbLink,
  BreadcrumbItem,
  BreadcrumbList,
} from "@/components/ui/breadcrumb";

export default async function CreateProject() {
  const session = await auth();

  if (!session?.user) {
    return redirect("/login");
  }

  return (
    <div>
      {/* navbar + breadcrumbs */}
      <nav className="flex justify-between items-center p-4 border-b-2 border-foreground/10">
        <div className="">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink
                  className="block w-max pointer-events-none"
                  href="/"
                >
                  <Image
                    className="block select-none"
                    src="/icon.png"
                    alt="Logo"
                    width={32}
                    height={32}
                  />
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href={`/projects`}>
                  {session.user.name} projektjei
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-primary font-bold">
                  Új projekt
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <div className="flex items-center gap-4">
          {/* TODO: notifications animation */}
          <IconButton variant="ghost" color="gray">
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

      {/* create project form */}
      <div className="w-[90%] md:w-[80%] xl:w-2/5 mx-auto border-[1px] border-foreground/10 rounded-lg mt-8 dark:bg-foreground/10">
        <div className="border-b-[1px] border-foreground/10 pb-2 p-4">
          <h2 className="text-primary text-md font-bold pb-1">
            Projekt létrehozása
          </h2>
          <p className="text-muted-foreground text-sm">
            Projekt létrehozásához adj meg egy nevet és egy leírást.
          </p>
        </div>
        <div className="">
          <div className="flex flex-row items-center gap-2">
            <div className="flex justify-between items-center gap-2 w-full border-b-[1px] border-foreground/10 py-2">
              <p className="text-muted-foreground text-sm font-bold p-4">
                Projekt neve
              </p>
              <Input
                placeholder="Projekt neve"
                className="w-96 bg-muted-foreground/5 m-4"
              />
            </div>
          </div>
          <div className="flex flex-row items-center gap-2">
            <div className="flex justify-between items-center gap-2 w-full p-4">
              <Link href="/projects">
                <Button
                  variant="outline"
                  color="gray"
                  className="cursor-pointer"
                >
                  Mégse
                </Button>
              </Link>
              <div className="flex flex-row items-center gap-4">
                <p className="hidden sm:block text-muted-foreground text-sm">
                  Később megváltoztathatod a projekt nevét
                </p>
                <Link href="/projects/create">
                  <Button
                    size="2"
                    variant="outline"
                    color="green"
                    className="bg-[#00A36C] hover:bg-[#00A36C]/90 text-primary font-medium w-max cursor-pointer"
                  >
                    Létrehozás
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
        {/* TODO: form + name  */}
      </div>
    </div>
  );
}
