import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../ui/breadcrumb"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import Image from "next/image"

export default async function NavbarBreadcrumb() {
  const session = await auth()

  if (!session?.user) {
    return redirect("/login")
  }

  return (
    <div className="">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>
              <Image
                className="block select-none"
                src="/icon.png"
                alt="Logo"
                width={32}
                height={32}
              />
            </BreadcrumbPage>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={`/projects`}>
              {session.user.name} projektjei
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  )
}
