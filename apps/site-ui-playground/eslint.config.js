import reactConfig from "@workspace/eslint-config/react";

export default [
  {
    ignores: ["dist", "src/routeTree.gen.ts"]
  },
  ...reactConfig,
  {
    rules: {
      "react-refresh/only-export-components": [
        "warn",
        {
          allowConstantExport: true,
          allowExportNames: ["Route"]
        }
      ]
    }
  }
];
