
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="sticky top-0 z-30 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl font-bold">♟️ Chess Master</span>
        </Link>
        <nav className="flex items-center gap-4">
          <Link to="/play">
            <Button variant="default">Play Now</Button>
          </Link>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
