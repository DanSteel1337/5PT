export function Footer() {
  return (
    <footer className="border-t border-border/40 py-6 mt-auto">
      <div className="container">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Five Pillars Investment Platform. All rights reserved.
          </div>

          <div className="flex items-center gap-6">
            <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Terms of Service
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Documentation
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
