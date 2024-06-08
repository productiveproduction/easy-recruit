import React from "react";
const columns = [
  { name: "ID", uid: "id", sortable: true },
  { name: "NAME", uid: "name", sortable: true },
  { name: "ROLE", uid: "role", sortable: true },
  { name: "COMPANY", uid: "company" },
  { name: "EMAIL", uid: "email" },
  { name: "PHONE", uid: "phone" },
  { name: "SCORE", uid: "score", sortable: true },
  { name: "STATUS", uid: "status", sortable: true },
  { name: "ACTIONS", uid: "actions" },
];

const statusOptions = [
  { name: "Screened", uid: "screened" },
  { name: "Failed", uid: "failed" },
  // { name: "Vacation", uid: "vacation" },
];

const users = [
  {
    id: 1,
    name: "Tony Reichert",
    role: "Software Engineer",
    company: "Scentre Group",
    status: "active",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
    email: "tony.reichert@example.com",
    phone: "+1 123 456 7890",
    score: 100,
  },
  {
    id: 2,
    name: "Zoey Lang",
    role: "Marketing Manager",
    company: "Gumtree",
    status: "paused",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
    email: "zoey.lang@example.com",
    phone: "+1 123 456 7890",
    score: 90,
  },
];

export { columns, users, statusOptions };
