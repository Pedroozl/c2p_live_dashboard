import * as React from "react"
import {
  Archive,
  BookOpen,
  Bot,
  Building,
  Calendar,
  Command,
  Crown,
  FileArchive,
  Files,
  Frame,
  LifeBuoy,
  Map,
  PieChart,
  Send,
  Settings2,
  Terminal,
  Book,
  UsersIcon,
  ChartArea,
  Users,
  Cloud,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { UserContext } from "@/context/UserContext"
import Image from "next/image"
import LoadingComponent from "./loading-page"
import { useTheme } from "next-themes"
import { Separator } from "./ui/separator"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const {user} = React.useContext(UserContext)
  const theme = useTheme()
  const [loading, setLoading] = React.useState<boolean>(true)
  const [mainNavPerm, setMainNavPerm] = React.useState<any>({
    navMain: [
      {
        title: "Streams",
        url: "/manage/streams",
        icon: Files,
        isActive: true,
        permissionRequired: null,
        show: true,
      },
    ],
    navSecondary: []
  })

  React.useEffect(() => { 
    var t = mainNavPerm
    for(var i = 0; i < t.navMain.length; i++) {
      var permshow = 0
      if(t.navMain[i].items) {
        for(var ii = 0; ii < t.navMain[i].items?.length; ii++){
          if(t.navMain[i].items[ii].permissionRequired && user.permissions.includes(t.navMain[i].items[ii].permissionRequired)) {
            permshow++
          }else if(t.navMain[i].items[ii].permissionRequired == null){
            permshow++
          }
        }
      }
      if(!t.navMain[i].items && t.navMain[i].permissionRequired == null) permshow++
      if(!t.navMain[i].items && t.navMain[i].permissionRequired != null && user.permissions.includes(t.navMain[i].permissionRequired)) permshow++
      if(permshow == 0) t.navMain[i].show = true
      t.navMain[i].show = true
    }
    setMainNavPerm(t)
    setLoading(false)
  }, [])

  if(loading) {
    return <LoadingComponent/>
  }
  
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/">
                <div className="grid flex-1 items-center justify-center text-sm leading-tight">
                  <Image width={120} height={120} alt="logo" src={theme.theme == "dark" ? "https://www.c2p.tech/logo.png" : "https://www.c2p.tech/logo.png"}/>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <Separator/>
      <SidebarContent> 
        <NavMain items={mainNavPerm.navMain} permissions={user.permissions}/>
        <NavSecondary items={mainNavPerm.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser/>
      </SidebarFooter>
    </Sidebar>
  )
}
