import * as React from "react";
import { ToastActionElement, type ToastProps } from "@/components/ui/toast";

export type ToasterToast = ToastProps & {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
};

const TOAST_LIMIT = 1;
const TOAST_REMOVE_DELAY = 1000000;

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>();

const genId = () => Math.random().toString(36).substring(2, 9);

export function useToast() {
  const [toasts, setToasts] = React.useState<ToasterToast[]>([]);

  const addToast = React.useCallback(
    (toast: Omit<ToasterToast, "id">) => {
      const id = genId();
      const newToast = { ...toast, id };
      setToasts((prev) => [...prev, newToast].slice(-TOAST_LIMIT));

      const timeout = setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
        toastTimeouts.delete(id);
      }, TOAST_REMOVE_DELAY);

      toastTimeouts.set(id, timeout);
      return id;
    },
    []
  );

  const dismiss = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    const timeout = toastTimeouts.get(id);
    if (timeout) clearTimeout(timeout);
    toastTimeouts.delete(id);
  }, []);

  return {
    toasts,
    toast: addToast,
    dismiss,
  };
}
