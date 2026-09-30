import { REPOSITORY } from "../content";
import type { Theme } from "../theme";
import { GitHubIcon, MenuIcon, MoonIcon, SunIcon } from "./Icons";

interface HeaderProps {
  theme: Theme;
  onToggleTheme: () => void;
  onToggleMenu: () => void;
}

export function Header({ theme, onToggleTheme, onToggleMenu }: HeaderProps) {
  const logo = theme === "dark" ? "./logo-dark.png" : "./logo.png";
  return (
    <header className="header">
      <button type="button" className="icon-button menu-button" onClick={onToggleMenu} aria-label="Open navigation">
        <MenuIcon />
      </button>
      <a className="brand" href="#/">
        <img src={logo} alt="" width="32" height="32" />
        <span className="brand-name">Immune</span>
        <span className="brand-section">User Guide</span>
      </a>
      <nav className="header-actions" aria-label="Site">
        <a className="icon-button" href={REPOSITORY} target="_blank" rel="noreferrer" aria-label="Immune on GitHub" title="Immune on GitHub">
          <GitHubIcon />
        </a>
        <button
          type="button"
          className="icon-button"
          onClick={onToggleTheme}
          aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          title={theme === "dark" ? "Light mode" : "Dark mode"}
        >
          {theme === "dark" ? <SunIcon /> : <MoonIcon />}
        </button>
      </nav>
    </header>
  );
}
