import React from "react"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

export interface Breadcrumb {
  label: string
  href: string
  active?: boolean
  isVisible?: boolean
}

export default function BreadcrumbComponent({
  breadcrumbs,
}: {
  breadcrumbs: Breadcrumb[]
}) {
  return (
    <>
      <Breadcrumb>
        <BreadcrumbList>
          {breadcrumbs.map((breadcrumb, index) => (
            <React.Fragment key={index}>
              <BreadcrumbItem className="hidden sm:block">
                <BreadcrumbLink
                  href={breadcrumb.href}
                  className={breadcrumb.active ? "text-emerald" : ""}
                  style={{
                    visibility: breadcrumb.isVisible ? "hidden" : "visible",
                  }}
                >
                  {breadcrumb.label}
                </BreadcrumbLink>
              </BreadcrumbItem>
              {index < breadcrumbs.length - 1 && (
                <BreadcrumbSeparator className="hidden sm:block" />
              )}
            </React.Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </>
  )
}
