import { CircleAlert, CircleCheck, Info, X } from "lucide-react";
import { createContext, useCallback, useContext, useState } from "react";
import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";

// ── Types ──────────────────────────────────────────────────────────
type NotificationType = "success" | "error" | "info";

interface Notification {
  description?: string;
  id: string;
  title: string;
  type: NotificationType;
}

interface NotificationContextValue {
  confirm: (title: string, description?: string) => Promise<boolean>;
  notify: (type: NotificationType, title: string, description?: string) => void;
}

const NotificationContext = createContext<NotificationContextValue | null>(
  null
);

// ── Hook ───────────────────────────────────────────────────────────
export function useNotification() {
  const ctx = useContext(NotificationContext);
  if (!ctx) {
    throw new Error(
      "useNotification must be used inside <NotificationProvider>"
    );
  }
  return ctx;
}

// ── Confirm Modal ──────────────────────────────────────────────────
interface ConfirmState {
  description?: string;
  resolve: (value: boolean) => void;
  title: string;
}

function ConfirmDialog({
  state,
  onClose,
}: {
  state: ConfirmState;
  onClose: (val: boolean) => void;
}) {
  return (
    <div className="fade-in-0 fixed inset-0 z-[100] flex animate-in items-center justify-center bg-black/50 backdrop-blur-sm duration-200">
      <div className="zoom-in-95 slide-in-from-bottom-2 mx-4 w-full max-w-sm animate-in rounded-lg border border-border bg-card p-6 shadow-xl duration-200">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-500/15">
            <CircleAlert className="h-4 w-4 text-amber-500" />
          </div>
          <div className="min-w-0">
            <h3 className="font-bold text-foreground text-sm">{state.title}</h3>
            {state.description && (
              <p className="mt-1.5 text-muted-foreground text-xs leading-relaxed">
                {state.description}
              </p>
            )}
          </div>
        </div>
        <div className="mt-5 flex items-center justify-end gap-2">
          <button
            className="rounded-md border border-border bg-background px-4 py-2 font-medium text-muted-foreground text-xs transition-colors hover:bg-muted"
            onClick={() => onClose(false)}
            type="button"
          >
            Cancelar
          </button>
          <button
            className="rounded-md bg-destructive px-4 py-2 font-medium text-destructive-foreground text-xs transition-colors hover:bg-destructive/90"
            onClick={() => onClose(true)}
            type="button"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Provider ───────────────────────────────────────────────────────
export function NotificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [confirmState, setConfirmState] = useState<ConfirmState | null>(null);

  const notify = useCallback(
    (type: NotificationType, title: string, description?: string) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      setNotifications((prev) => [...prev, { id, type, title, description }]);

      // Auto-dismiss after 4 seconds
      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
      }, 4000);
    },
    []
  );

  const confirm = useCallback(
    (title: string, description?: string): Promise<boolean> =>
      new Promise((resolve) => {
        setConfirmState({ title, description, resolve });
      }),
    []
  );

  const handleConfirmClose = (value: boolean) => {
    if (confirmState) {
      confirmState.resolve(value);
      setConfirmState(null);
    }
  };

  const dismissNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const iconMap = {
    success: CircleCheck,
    error: CircleAlert,
    info: Info,
  };

  const styleMap = {
    success:
      "border-emerald-500/30 bg-emerald-500/10 text-emerald-500 [&_[data-slot=alert-description]]:text-emerald-400/80",
    error:
      "border-destructive/30 bg-destructive/10 text-destructive [&_[data-slot=alert-description]]:text-destructive/80",
    info: "border-border bg-card text-foreground [&_[data-slot=alert-description]]:text-muted-foreground",
  };

  return (
    <NotificationContext.Provider value={{ notify, confirm }}>
      {children}

      {/* Notification toast stack */}
      {notifications.length > 0 && (
        <div className="fixed top-4 right-4 z-[90] flex w-full max-w-sm flex-col gap-2">
          {notifications.map((n) => {
            const Icon = iconMap[n.type];
            return (
              <Alert
                className={`slide-in-from-right-full fade-in-0 animate-in shadow-lg duration-300 ${styleMap[n.type]}`}
                key={n.id}
              >
                <Icon className="h-4 w-4" />
                <AlertTitle className="font-bold text-xs">{n.title}</AlertTitle>
                {n.description && (
                  <AlertDescription className="text-[11px]">
                    {n.description}
                  </AlertDescription>
                )}
                <AlertAction>
                  <button
                    className="rounded-md p-0.5 opacity-60 transition-opacity hover:opacity-100"
                    onClick={() => dismissNotification(n.id)}
                    type="button"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </AlertAction>
              </Alert>
            );
          })}
        </div>
      )}

      {/* Confirm dialog */}
      {confirmState && (
        <ConfirmDialog onClose={handleConfirmClose} state={confirmState} />
      )}
    </NotificationContext.Provider>
  );
}
