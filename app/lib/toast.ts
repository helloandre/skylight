import { SkylightEventTarget } from "./events";

export type ToastMessage = {
  text: string;
  options?: ToastOptions;
};
type ToastOptions = {
  type?: string;
};

const ee = new SkylightEventTarget("toasts");
export function toast(text: string, options?: ToastOptions) {
  ee.emit<ToastMessage>("add", { text, options });
}
export function onToast(cb: (d?: ToastMessage) => void) {
  ee.on<ToastMessage>("add", cb);
}
