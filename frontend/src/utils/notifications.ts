export type ToastType = "success" | "error" | "info" | "warning";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

// Almacenamiento global de toasts
let toasts: Toast[] = [];
let listeners: ((toasts: Toast[]) => void)[] = [];

export function subscribe(listener: (toasts: Toast[]) => void) {
  listeners.push(listener);
  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
}

function notify(toasts: Toast[]) {
  listeners.forEach((listener) => listener(toasts));
}

export function showToast(
  message: string,
  type: ToastType = "info",
  duration = 3000
) {
  const id = Date.now().toString();
  const toast: Toast = { id, message, type, duration };

  toasts = [...toasts, toast];
  notify(toasts);

  if (duration > 0) {
    setTimeout(() => {
      toasts = toasts.filter((t) => t.id !== id);
      notify(toasts);
    }, duration);
  }

  return id;
}

export function removeToast(id: string) {
  toasts = toasts.filter((t) => t.id !== id);
  notify(toasts);
}

export function getToasts() {
  return toasts;
}
