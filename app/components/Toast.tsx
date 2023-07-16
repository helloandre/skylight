import { useState } from "react";
import { onToast, type ToastMessage } from "~/lib/toast";

export default function Toast() {
  const toastsObj: ToastMessage[] = [];
  const [toasts, setToasts] = useState<ToastMessage[]>(toastsObj);

  onToast((e) => {
    if (e.toast) {
      toastsObj.push(e.toast);
      setToasts([...toastsObj]);
      setTimeout(() => {
        toastsObj.pop();
        setToasts([...toastsObj]);
      }, 5000);
    }
  });

  return (
    <div className="toast toast-top toast-center pt-1">
      {toasts.map((t, idx) => (
        <div
          key={idx}
          className={`alert bg-error ${
            t.options?.type ? `bg-${t.options.type}` : "alert-info"
          }`}
        >
          <span>{t.text}</span>
        </div>
      ))}
    </div>
  );
}
