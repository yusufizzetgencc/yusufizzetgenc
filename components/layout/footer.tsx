import Link from "next/link"
import { ExternalLink } from "lucide-react"

const socialLinks = [
  {
    href: "https://github.com/yusufizzet",
    label: "GitHub",
    icon: ExternalLink,
  },
  {
    href: "https://x.com/yusufizzet",
    label: "X (Twitter)",
    icon: ExternalLink,
  },
  {
    href: "https://linkedin.com/in/yusufizzet",
    label: "LinkedIn",
    icon: ExternalLink,
  },
]

export function Footer() {
  return (
    <footer className="border-t border-border/40">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row sm:px-6">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Yusuf İzzet Genç. Tüm hakları saklıdır.
        </p>

        <div className="flex items-center gap-3">
          {socialLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              aria-label={link.label}
            >
              <link.icon className="size-4" />
            </Link>
          ))}
        </div>
      </div>
    </footer>
  )
}
