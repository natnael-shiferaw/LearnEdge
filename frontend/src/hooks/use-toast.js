// src/hooks/use-toast.js
import * as React from "react"

const TOAST_LIMIT = 1
const AUTO_DISMISS_DELAY = 4000   // close after 4s
const AUTO_REMOVE_DELAY  = 5000   // remove after 5s

let count = 0
function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER
  return count.toString()
}

export const reducer = (state, action) => {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      }

    case "UPDATE_TOAST":
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      }

    case "DISMISS_TOAST":
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toastId || action.toastId == null
            ? { ...t, open: false }
            : t
        ),
      }

    case "REMOVE_TOAST":
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      }

    default:
      return state
  }
}

const listeners = []
let memoryState = { toasts: [] }

function dispatch(action) {
  memoryState = reducer(memoryState, action)
  listeners.forEach((l) => l(memoryState))
}

export function toast({ title, description, variant }) {
  const id = genId()

  // 1) add it
  dispatch({
    type: "ADD_TOAST",
    toast: {
      id,
      open: true,
      title,
      description,
      variant,
      // let the toast component call this when its close button is clicked
      onOpenChange: (open) => {
        if (!open) dispatch({ type: "DISMISS_TOAST", toastId: id })
      },
    },
  })

  // 2) auto-close after AUTO_DISMISS_DELAY
  setTimeout(() => {
    dispatch({ type: "DISMISS_TOAST", toastId: id })
  }, AUTO_DISMISS_DELAY)

  // 3) remove entirely after AUTO_REMOVE_DELAY
  setTimeout(() => {
    dispatch({ type: "REMOVE_TOAST", toastId: id })
  }, AUTO_REMOVE_DELAY)

  return { id, dismiss: () => dispatch({ type: "DISMISS_TOAST", toastId: id }) }
}

export function useToast() {
  const [state, setState] = React.useState(memoryState)
  React.useEffect(() => {
    listeners.push(setState)
    return () => {
      const idx = listeners.indexOf(setState)
      if (idx > -1) listeners.splice(idx, 1)
    }
  }, [])
  return {
    ...state,
    toast,
    dismiss: (toastId) => dispatch({ type: "DISMISS_TOAST", toastId }),
  }
}
