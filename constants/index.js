export const sidebarLinks = [
  {
    imgURL: "/assets/home.png",
    route: "/",
    label: "Home",
  },
  {
    imgURL: "/assets/search.png",
    route: "/search",
    label: "Search",
  },
  {
    imgURL: "/assets/comment.png",
    route: "/activity",
    label: "Activity",
  },
  {
    imgURL: "/assets/buzz.png",
    route: "/create-buzz",
    label: "Create Buzz",
  },
  {
    imgURL: "/assets/community.png",
    route: "/communities",
    label: "Communities",
  },
  {
    imgURL: "/assets/user.png",
    route: "/profile",
    label: "Profile",
  },
];

export const profileTabs = [
  { value: "buzzes", label: "Buzzes", icon: "/assets/create.png" },
  { value: "replies", label: "Replies", icon: "/assets/comment.png" },
  // { value: "tagged", label: "Tagged", icon: "/assets/tag.svg" },
];

export const communityTabs = [
  { value: "buzzes", label: "Buzzes", icon: "/assets/comment.png" },
  { value: "members", label: "Members", icon: "/assets/community.png" },
  { value: "requests", label: "Requests", icon: "/assets/request.svg" },
];
