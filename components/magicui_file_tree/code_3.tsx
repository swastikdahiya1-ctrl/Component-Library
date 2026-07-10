Copy
const elements: TreeViewElement[] = [
  {
    id: "src",
    type: "folder",
    name: "src",
    children: [
      { id: "components", type: "folder", name: "components" },
      { id: "app", type: "folder", name: "app" },
      { id: "page", name: "page.tsx" },
      { id: "layout", name: "layout.tsx" },
    ],
  },
]
 
<Tree elements={elements} />