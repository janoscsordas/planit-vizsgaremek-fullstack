import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

interface Breadcrumb {
  label: string
  href: string
  active?: boolean
}

export default async function ProjectBreadcrumb({
  breadcrumbs,
}: {
  breadcrumbs: Breadcrumb[]
}) {
  return (
    <>
      <Breadcrumb>
        <BreadcrumbList>
          {breadcrumbs.map((breadcrumb, index) => (
            <>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href={breadcrumb.href} className={breadcrumb.active ? "text-emerald" : ""}>
                  {breadcrumb.label}
                </BreadcrumbLink>
              </BreadcrumbItem>
              {index < breadcrumbs.length - 1 && (
                <BreadcrumbSeparator className="hidden md:block" />
              )}
            </>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </>
  )
}
