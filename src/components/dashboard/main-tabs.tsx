import {
  Activity,
  BarChart3,
  Calendar,
  Settings,
  Sparkles,
} from "lucide-react";

export type TabType =
  | "active-session"
  | "history"
  | "stats"
  | "insights"
  | "settings";

interface TabItem {
  icon: React.ComponentType<{ className?: string }>;
  id: TabType;
  label: string;
}

interface MainTabsProps {
  activeTab: TabType;
  isOwner?: boolean;
  onTabChange: (tab: TabType) => void;
}

export function MainTabs({
  activeTab,
  onTabChange,
  isOwner = false,
}: MainTabsProps) {
  const tabs: TabItem[] = [
    { id: "active-session", label: "Sesión Activa", icon: Activity },
    { id: "history", label: "Sesiones Anteriores", icon: Calendar },
    { id: "stats", label: "Estadísticas", icon: BarChart3 },
    { id: "insights", label: "Recomendaciones", icon: Sparkles },
  ];

  if (isOwner) {
    tabs.push({ id: "settings", label: "Ajustes", icon: Settings });
  }

  return (
    <div className="border-border border-b bg-card/30 backdrop-blur-xs">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <nav
          aria-label="Tabs"
          className="scrollbar-none -mb-px flex space-x-6 overflow-x-auto"
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                className={`group flex cursor-pointer items-center whitespace-nowrap border-b-2 px-1 py-4 font-medium text-sm transition-all duration-200 focus:outline-none ${
                  isActive
                    ? "border-primary font-semibold text-foreground"
                    : "border-transparent text-muted-foreground hover:border-border hover:text-foreground/80"
                }
                `}
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                type="button"
              >
                <Icon
                  className={`mr-2 h-4 w-4 shrink-0 transition-colors duration-200 ${isActive ? "text-primary" : "text-muted-foreground/75 group-hover:text-foreground/70"}
                  `}
                />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
