"use client"

import type { Metadata } from "next"
import { Inter as FontSans } from "next/font/google"

import "./globals.css"
import { AuthProvider } from "@/providers/Auth"
import { Avatar, AvatarImage } from "@radix-ui/react-avatar"
import {
  AlertCircle,
  Archive,
  ExternalLink,
  File,
  Inbox,
  LayoutDashboard,
  MessageSquare,
  PenBox,
  PhoneCall,
  Search,
  Send,
  ShoppingCart,
  Trash2,
  User,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { Separator } from "@/components/ui/separator"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Toaster } from "@/components/ui/sonner"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TooltipProvider } from "@/components/ui/tooltip"
import { SideBar } from "@/components/side-bar"
import { SiteHeader } from "@/components/site-header"
import { ThemeProvider } from "@/components/theme-provider"

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <head>
        <title>GabON!</title>
      </head>
      <body
        className={cn(
          "min-h-screen bg-card font-sans antialiased",
          fontSans.variable
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme={"ligth"}
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>{children}</AuthProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
