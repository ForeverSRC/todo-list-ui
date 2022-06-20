export const routes = [
  {
    path: "/",
    name: "home",
    redirect: {name: "item-page"},
  },
  {
    path: "/items",
    name: "item-page",
    component: () => import("@/view/ItemList"),

  },
  {
    path: "/missions",
    component: () => import("@/view/MissionLayout"),
    children: [
      {
        path: "",
        name: "mission-page",
        component: () => import("@/view/MissionList"),
      },
      {
        path: "create",
        name: "mission-create",
        component: () => import("@/view/MissionCreate")
      },
      {
        path: ":mid",
        name: "mission-detail",
        component: () => import("@/view/MissionDetail")
      }
    ]
  },
]
