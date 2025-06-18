"use client"

import { ChevronRight, ShieldQuestion, type LucideIcon } from "lucide-react"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { UserContext } from "@/context/UserContext"
import { useContext } from "react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip"

export function NavMain({
  items,
  permissions
}: {
  items: {
    title: string
    url: string
    icon: LucideIcon
    isActive?: boolean
    permissionRequired: string | null
    show: boolean
    items?: {
      title: string
      url: string
      icon: LucideIcon
      permissionRequired: string | null
    }[]
  }[],
  permissions: Array<string>
}) {

  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => (
          item.show == true ? (
            <Collapsible key={item.title} asChild defaultOpen={item.isActive}>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip={item.title}>
                {item.permissionRequired != null ? 
                  permissions.includes(item.permissionRequired) ? (
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  ) : (
                    <></>
                  )
                 : (
                  <a href={item.url}>
                    <item.icon />
                    <span>{item.title}</span>
                  </a>
                )}
              </SidebarMenuButton>
              {item.items?.length ? (
                <>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuAction className="data-[state=open]:rotate-90">
                      <ChevronRight />
                      <span className="sr-only">Toggle</span>
                    </SidebarMenuAction>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items?.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton asChild>
                            {subItem.permissionRequired != null ? 
                              permissions.includes(subItem.permissionRequired) ? (
                                <a href={subItem.url}>
                                  <span>{subItem.title}</span>
                                </a>
                              ) : (
                                <></>
                              )
                            : (
                              <a href={subItem.url}>
                                <span>{subItem.title}</span>
                              </a>
                            )}
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </>
              ) : null}
            </SidebarMenuItem>
          </Collapsible>
          ) : (<></>)
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
