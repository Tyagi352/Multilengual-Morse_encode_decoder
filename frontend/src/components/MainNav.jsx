import { Link } from "react-router-dom"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export function MainNav({
  className,
  ...props
}) {
  return (
    <nav
      className={cn("flex items-center space-x-4 lg:space-x-6", className)}
      {...props}
    >
      <Button variant="ghost" asChild>
        <Link
          to="/"
          className="text-sm font-medium transition-colors hover:text-primary"
        >
          Home
        </Link>
      </Button>
      <Button variant="ghost" asChild>
        <Link
          to="/history"
          className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
        >
          History
        </Link>
      </Button>
      <Button variant="ghost" asChild>
        <Link
          to="/encoder"
          className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
        >
          Encoder
        </Link>
      </Button>
    </nav>
  )
}
