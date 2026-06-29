import reactConfig from "@workspace/eslint-config/react";

export default [
  ...reactConfig,
  {
    rules: {
      "react-hooks/refs": "off",
      "react-hooks/set-state-in-effect": "off"
    }
  }
];
