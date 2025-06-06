import * as React from "react"
import { useToast } from "@/hooks/use-toast"

export function ToastViewport() {
  const { toasts } = useToast()

  return (
    <div className="fixed top-8 right-8 flex flex-col gap-2 z-50">
      {toasts.map((t) => {
        // Pick green styling for success, red for destructive, gray for default
        let bgColor, borderColor, textColor
        switch (t.variant) {
          case "destructive":
            bgColor = "bg-red-50"
            borderColor = "border-red-500"
            textColor = "text-red-800"
            break
          case "success":
          default:
            bgColor = "bg-green-50"
            borderColor = "border-green-500"
            textColor = "text-green-800"
            break
        }

        return (
          <div
            key={t.id}
            className={`
              ${bgColor} ${borderColor} ${textColor}
              max-w-sm w-full flex flex-col gap-1 rounded-lg border shadow-lg p-4
            `}
          >
            {t.title && (
              <strong className="text-sm font-medium">{t.title}</strong>
            )}
            {t.description && (
              <p className="text-sm leading-tight">{t.description}</p>
            )}
          </div>
        )
      })}
    </div>
  )
}
