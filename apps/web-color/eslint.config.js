import reactConfig from "@workspace/eslint-config/react";

export default [
  {
    ignores: ["dist", "src/components/**", "src/lib/**", "src/routeTree.gen.ts"]
  },
  ...reactConfig,
  {
    rules: {
      "react-refresh/only-export-components": [
        "warn",
        {
          allowConstantExport: true,
          allowExportNames: [
            "Route",
            "badgeVariants",
            "buttonGroupVariants",
            "buttonVariants",
            "tabsListVariants",
            "toggleVariants"
          ]
        }
      ]
    }
  }
];
