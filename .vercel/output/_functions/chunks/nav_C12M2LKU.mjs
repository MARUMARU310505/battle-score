!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{};e.SENTRY_RELEASE={id:"805457d8ec1c94ee4030256bb46249a10dc0d51b"};var n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="e3517aa1-8257-472c-a02d-181ce237a0aa",e._sentryDebugIdIdentifier="sentry-dbid-e3517aa1-8257-472c-a02d-181ce237a0aa");}catch(e){}}();import { jsx, jsxs } from 'react/jsx-runtime';
import { Moon, Sun, LayoutDashboard, User, LogOut } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button as Button$1 } from '@base-ui/react/button';
import { cva } from 'class-variance-authority';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { a as createSupabaseBrowserClient } from './supabase_tpVG-NFv.mjs';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const buttonVariants = cva(
  "group/button inline-flex shrink-0 select-none items-center justify-center whitespace-nowrap rounded-md border border-transparent bg-clip-padding font-medium text-sm outline-none transition-all focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/80",
        outline: "border-border bg-background shadow-xs hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 aria-expanded:bg-secondary aria-expanded:text-secondary-foreground",
        ghost: "hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50",
        destructive: "bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:focus-visible:ring-destructive/40 dark:hover:bg-destructive/30",
        link: "text-primary underline-offset-4 hover:underline"
      },
      size: {
        default: "h-9 gap-1.5 in-data-[slot=button-group]:rounded-md px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        xs: "h-6 gap-1 in-data-[slot=button-group]:rounded-md rounded-[min(var(--radius-md),8px)] px-2 text-xs has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-8 gap-1 in-data-[slot=button-group]:rounded-md rounded-[min(var(--radius-md),10px)] px-2.5 has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5",
        lg: "h-10 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        icon: "size-9",
        "icon-xs": "size-6 in-data-[slot=button-group]:rounded-md rounded-[min(var(--radius-md),8px)] [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-8 in-data-[slot=button-group]:rounded-md rounded-[min(var(--radius-md),10px)]",
        "icon-lg": "size-10"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}) {
  return /* @__PURE__ */ jsx(
    Button$1,
    {
      className: cn(buttonVariants({ variant, size, className })),
      "data-slot": "button",
      ...props
    }
  );
}

function ThemeToggle() {
  const [theme, setThemeState] = useState("light");
  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setThemeState(isDark ? "dark" : "light");
  }, []);
  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setThemeState(nextTheme);
    if (nextTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", nextTheme);
  };
  return /* @__PURE__ */ jsx(
    Button,
    {
      "aria-label": "Toggle theme",
      className: "h-9 w-9 rounded-md text-foreground hover:bg-muted/50",
      onClick: toggleTheme,
      size: "icon",
      variant: "ghost",
      children: theme === "light" ? /* @__PURE__ */ jsx(Moon, { className: "h-4 w-4 transition-all" }) : /* @__PURE__ */ jsx(Sun, { className: "h-4 w-4 transition-all" })
    }
  );
}

function Nav({ user = null }) {
  const handleSignIn = async () => {
    const supabase = createSupabaseBrowserClient();
    const redirectTo = `${window.location.origin}/auth/callback`;
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo
      }
    });
  };
  return /* @__PURE__ */ jsx("header", { className: "sticky top-0 z-50 w-full border-border border-b bg-background/80 backdrop-blur-md", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto flex h-20 max-w-7xl items-center justify-between px-4 xl:px-6 xl:px-8", children: [
    /* @__PURE__ */ jsx("div", { className: "flex items-center gap-2", children: /* @__PURE__ */ jsx("a", { className: "flex items-center space-x-2", href: "/", children: /* @__PURE__ */ jsxs("span", { className: "font-bold text-foreground text-xl tracking-tight", children: [
      "Battle Score",
      /* @__PURE__ */ jsx("span", { className: "ml-1.5 hidden border-border border-l pl-1.5 font-light font-sans text-muted-foreground text-sm uppercase xl:inline-block", children: "BR Analytics" })
    ] }) }) }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
      /* @__PURE__ */ jsx(ThemeToggle, {}),
      user ? /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
        /* @__PURE__ */ jsx("span", { className: "hidden text-muted-foreground text-sm xl:inline-block", children: user.email }),
        /* @__PURE__ */ jsx(
          "a",
          {
            className: cn(
              buttonVariants({ variant: "outline", size: "icon" }),
              "h-8 w-8"
            ),
            href: "/dashboard",
            title: "Dashboard",
            children: /* @__PURE__ */ jsx(LayoutDashboard, { className: "h-4 w-4" })
          }
        ),
        /* @__PURE__ */ jsx(
          "a",
          {
            className: cn(
              buttonVariants({ variant: "outline", size: "icon" }),
              "h-8 w-8"
            ),
            href: "/dashboard/profile",
            title: "Editar Perfil",
            children: /* @__PURE__ */ jsx(User, { className: "h-4 w-4" })
          }
        ),
        /* @__PURE__ */ jsx(
          "a",
          {
            className: cn(
              buttonVariants({ variant: "ghost", size: "icon" }),
              "h-8 w-8 text-muted-foreground hover:text-foreground"
            ),
            href: "/api/auth/signout",
            title: "Cerrar sesión",
            children: /* @__PURE__ */ jsx(LogOut, { className: "h-4 w-4" })
          }
        )
      ] }) : /* @__PURE__ */ jsx(Button, { onClick: handleSignIn, size: "sm", children: /* @__PURE__ */ jsx("span", { children: "Iniciar con Google" }) })
    ] })
  ] }) });
}

export { Button as B, Nav as N };
