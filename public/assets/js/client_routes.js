export const CLIENT_ROUTES = [
  {
    key: "dashboard",
    label: "Dashboard",
    href: "/app/pages/client/index.html"
  },
  {
    key: "projects",
    label: "Projects",
    href: "/app/pages/client/projects.html"
  },
  {
    key: "project_detail",
    label: "Project Detail",
    href: "/app/pages/client/project-detail.html"
  },
  {
    key: "roles",
    label: "Roles",
    href: "/app/pages/client/roles.html"
  },
  {
    key: "applications",
    label: "Applications",
    href: "/app/pages/client/applications.html"
  },
  {
    key: "shortlists",
    label: "Shortlists",
    href: "/app/pages/client/shortlists.html"
  },
  {
    key: "invites",
    label: "Invites",
    href: "/app/pages/client/invites.html"
  },
  {
    key: "bookings",
    label: "Bookings",
    href: "/app/pages/client/bookings.html"
  },
  {
    key: "pipeline",
    label: "Pipeline",
    href: "/app/pages/client/pipeline.html"
  }
];

export function findClientRouteByPath(pathname){
  const path = String(pathname || "").trim();
  return CLIENT_ROUTES.find(item => item.href === path) || null;
}
