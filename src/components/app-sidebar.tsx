"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  BarChart3,
  BookOpen,
  Coins,
  FileText,
  Globe,
  Users,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { ApiHealthBoard } from "@/components/sidebar/api-health-board";
import { useTokens } from "@/hooks/use-tokens";

const navItems = [
  { title: "Dashboard", href: "/", icon: BarChart3 },
  { title: "Tokens", href: "/tokens", icon: Coins },
  { title: "Discovery", href: "/discovery", icon: Globe },
  { title: "Proposals", href: "/proposals", icon: FileText },
  { title: "Migrations", href: "/migrations", icon: Activity },
  { title: "Docs", href: "/docs", icon: BookOpen },
];

const onboardingItems = [
  { title: "RENDER Onboarding", href: "/onboard/render" },
  { title: "HNT Onboarding", href: "/onboard/hnt" },
  { title: "POWR Onboarding", href: "/onboard/powr" },
  { title: "GEOD Onboarding", href: "/onboard/geod" },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { providerHealth } = useTokens();

  return (
    <Sidebar variant="inset" collapsible="icon">
      <SidebarHeader className="p-4">
        <Link href="/" className="flex items-center gap-2.5 group">
          <Image
            src="/logo.png"
            alt="Tideshift"
            width={32}
            height={32}
            className="h-8 w-8 rounded-lg"
          />
          <span className="text-lg font-bold tracking-tight gradient-text group-data-[collapsible=icon]:hidden">
            Tideshift
          </span>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Discovery</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={
                      item.href === "/"
                        ? pathname === "/"
                        : pathname.startsWith(item.href)
                    }
                    tooltip={item.title}
                  >
                    <Link href={item.href}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Onboarding</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {onboardingItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href}
                    tooltip={item.title}
                  >
                    <Link href={item.href}>
                      <Users className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <ApiHealthBoard providers={providerHealth} />

      <SidebarFooter className="p-4 group-data-[collapsible=icon]:hidden">
        <div className="glass-card p-3 text-xs text-muted-foreground">
          <p className="font-medium text-foreground">Powered by Sunrise</p>
          <p className="mt-1">Solana Graveyard Hackathon</p>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
