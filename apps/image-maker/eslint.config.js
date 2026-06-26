import reactConfig from "@workspace/eslint-config/react";

export default [
  {
    ignores: ["dist"]
  },
  ...reactConfig
];
