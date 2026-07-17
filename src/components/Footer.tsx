export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-surface px-6 py-12">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 md:flex-row">
        <p className="text-sm text-text-muted">
          &copy; 2026 Dokteuk Dance Academy. All rights reserved.
        </p>

        <nav aria-label="Footer navigation">
          <ul className="flex gap-8">
            <li>
              <a
                href="#"
                className="text-sm text-text-muted transition-colors duration-200 hover:text-white focus-gold"
              >
                Contact
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-sm text-text-muted transition-colors duration-200 hover:text-white focus-gold"
              >
                Privacy
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  );
}
