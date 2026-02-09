
import { useMemo } from "react";
import { Link, useLocation } from "react-router";

const formatSegment = (segment: string) =>
  segment
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

const labelOverrides: Record<string, string> = {
  admin: "Admin",
  user: "User",
  driver: "Driver",
};

export default function DashboardHeader() {
  const location = useLocation();
  const crumbs = useMemo(() => {
    const parts = location.pathname.split("/").filter(Boolean);
    if (parts.length === 0) {
      return [{ label: "Dashboard", href: "/" }];
    }

    return parts.map((part, index) => {
      const href = "/" + parts.slice(0, index + 1).join("/");
      const label = labelOverrides[part] || formatSegment(part);
      return { label, href };
    });
  }, [location.pathname]);

  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm">
      {crumbs.map((crumb, index) => {
        const isLast = index === crumbs.length - 1;
        return (
          <div key={crumb.href} className="flex items-center gap-2">
            {isLast ? (
              <span className="font-semibold text-slate-700 dark:text-slate-200">
                {crumb.label}
              </span>
            ) : (
              <Link
                to={crumb.href}
                className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
              >
                {crumb.label}
              </Link>
            )}
            {!isLast && <span className="text-slate-400">/</span>}
          </div>
        );
      })}
    </nav>
  );
}
