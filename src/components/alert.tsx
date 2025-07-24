import * as React from "react"

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
}

interface AlertDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  className?: string
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      role="alert"
      className={`relative w-full rounded-lg border p-4 ${className || ''}`}
      {...props}
    />
  )
)
Alert.displayName = "Alert"

const AlertDescription = React.forwardRef<HTMLParagraphElement, AlertDescriptionProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={`text-sm ${className || ''}`}
      {...props}
    />
  )
)
AlertDescription.displayName = "AlertDescription"

export { Alert, AlertDescription }