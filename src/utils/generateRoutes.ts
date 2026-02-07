import type { ISidebarItem } from "@/types";


export const generateRoutes = (sidebarItems: ISidebarItem[]) => {
  return sidebarItems.flatMap((section) =>
    section.items
      .filter((route) => !route.isExternal && route.component)
      .map((route) => ({
        path: route.url,
        Component: route.component,
      }))
  );
};