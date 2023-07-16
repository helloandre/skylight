type ToastEvent = Event & { toast?: ToastMessage };
export type ToastMessage = {
  text: string;
  options?: ToastOptions;
};
type ToastOptions = {
  type?: string;
};

class ToastEventTarget extends EventTarget {
  text(text: string, options?: ToastOptions) {
    const e: ToastEvent = new Event("add");
    e.toast = {
      text,
      options,
    };
    return this.dispatchEvent(e);
  }
}
const te = new ToastEventTarget();

export function toast(text: string, options?: ToastOptions) {
  te.text(text, options);
}
export function onToast(cb: (e: ToastEvent) => void) {
  te.addEventListener("add", cb);
}
