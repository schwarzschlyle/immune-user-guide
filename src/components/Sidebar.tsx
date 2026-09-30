import { GROUPS, type Section } from "../content";
import { hrefFor, type Route } from "../routing";

interface SidebarProps {
  route: Route;
  sections: Section[];
  open: boolean;
}

export function Sidebar({ route, sections, open }: SidebarProps) {
  return (
    <aside className={`sidebar${open ? " open" : ""}`} aria-label="User guide">
      <a className={`sidebar-home${route.slug === null ? " active" : ""}`} href="#/">
        Overview
      </a>
      {GROUPS.map((group) => (
        <div key={group.name} className="sidebar-group">
          <p className="sidebar-group-name">{group.name}</p>
          <ul>
            {group.entries.map((entry) => {
              const active = entry.slug === route.slug;
              return (
                <li key={entry.slug}>
                  <a className={active ? "active" : undefined} href={hrefFor({ slug: entry.slug, anchor: null })}>
                    {entry.title}
                  </a>
                  {active && sections.length > 0 && (
                    <ul className="sidebar-sections">
                      {sections.map((section) => (
                        <li key={section.id}>
                          <a
                            className={section.id === route.anchor ? "active" : undefined}
                            href={hrefFor({ slug: entry.slug, anchor: section.id })}
                          >
                            {section.title}
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </aside>
  );
}
