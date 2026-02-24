"use client";

import { useState, useEffect } from "react";
import { List } from "lucide-react";
import { FadeIn } from "@/components/shared/motion";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { DocsSidebar } from "./docs-sidebar";
import { GettingStarted } from "./sections/getting-started";
import { DashboardSection } from "./sections/dashboard-section";
import { TokenDetailSection } from "./sections/token-detail-section";
import { DiscoverySection } from "./sections/discovery-section";
import { MigrationHealthSection } from "./sections/migration-health-section";
import { ProposalsSection } from "./sections/proposals-section";
import { OnboardingSection } from "./sections/onboarding-section";
import { MdsMethodologySection } from "./sections/mds-methodology-section";
import { DataSourcesSection } from "./sections/data-sources-section";
import { GlossarySection } from "./sections/glossary-section";

export function DocsPage() {
  const [activeSection, setActiveSection] = useState("getting-started");
  const [sheetOpen, setSheetOpen] = useState(false);

  // Scroll-spy via IntersectionObserver
  useEffect(() => {
    const sections = document.querySelectorAll("[data-section]");
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((e) => e.isIntersecting);
        if (visible) {
          const id = visible.target.getAttribute("data-section");
          if (id) setActiveSection(id);
        }
      },
      { rootMargin: "-20% 0px -75% 0px", threshold: 0 }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  // Handle deep links
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash) {
      setTimeout(() => {
        document.getElementById(hash)?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, []);

  return (
    <div className="space-y-6">
      {/* Hero */}
      <FadeIn>
        <div className="rounded-xl bg-gradient-to-r from-purple-500/10 via-transparent to-cyan-500/10 border border-white/5 p-6">
          <h1 className="text-2xl font-bold">
            <span className="gradient-text">Documentation</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
            Complete guide to Tideshift&apos;s demand-driven token migration
            platform. Covers every page, methodology, data source, and feature.
          </p>
        </div>
      </FadeIn>

      {/* Two-column layout */}
      <div className="flex gap-8">
        {/* Sticky TOC — desktop only */}
        <aside className="hidden lg:block w-60 shrink-0">
          <div className="sticky top-6 glass-card p-4 rounded-xl">
            <DocsSidebar activeId={activeSection} />
          </div>
        </aside>

        {/* Content */}
        <div className="flex-1 min-w-0 space-y-12">
          <GettingStarted />
          <DashboardSection />
          <TokenDetailSection />
          <DiscoverySection />
          <MigrationHealthSection />
          <ProposalsSection />
          <OnboardingSection />
          <MdsMethodologySection />
          <DataSourcesSection />
          <GlossarySection />
        </div>
      </div>

      {/* Mobile TOC — floating button */}
      <div className="lg:hidden fixed bottom-6 right-6 z-50">
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger asChild>
            <Button
              size="icon"
              className="h-12 w-12 rounded-full shadow-lg bg-primary/90 hover:bg-primary"
            >
              <List className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 pt-10">
            <DocsSidebar
              activeId={activeSection}
              onItemClick={() => setSheetOpen(false)}
            />
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
