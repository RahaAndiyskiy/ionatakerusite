export default function Footer() {
  return (
    <footer className="px-6 md:px-16 py-12 border-t border-white/10">
      <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <p className="text-sm text-black/40 tracking-widest uppercase">
          © {new Date().getFullYear()} Iona Takeru
        </p>
        <div className="flex gap-6">
          <a
            href="mailto:hello@ionatakeru.com"
            className="text-sm text-black/60 hover:text-black transition-colors tracking-widest uppercase"
          >
            Email
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-black/60 hover:text-black transition-colors tracking-widest uppercase"
          >
            Instagram
          </a>
        </div>
      </div>
    </footer>
  );
}
