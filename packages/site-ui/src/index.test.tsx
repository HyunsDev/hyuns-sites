import { describe, expect, it } from "vitest";
import * as siteUi from ".";

describe("@workspace/site-ui", () => {
  it("does not export upstream button primitives", () => {
    expect(siteUi).not.toHaveProperty("Button");
    expect(siteUi).not.toHaveProperty("buttonVariants");
  });
});
