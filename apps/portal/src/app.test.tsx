import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import { createMemoryHistory } from "@tanstack/react-router";
import { describe, expect, it } from "vitest";
import { App } from "./app";
import { getPortalPage } from "./portal-data";
import { getPortalIcon } from "./portal-icons";
import { getRouter } from "./router";

function renderPortal(path = "/") {
  const history = createMemoryHistory({
    initialEntries: [path]
  });
  const router = getRouter({ history });

  return render(<App router={router} />);
}

describe("Portal", () => {
  it("renders the portal route groups", async () => {
    renderPortal();

    expect(await screen.findByText("Portal")).toBeVisible();
    expect(screen.getByText("개인 웹사이트")).toBeVisible();
    expect(screen.getByText("유틸리티")).toBeVisible();
    expect(screen.getByText("프로젝트")).toBeVisible();
    expect(screen.getByText("외부 링크")).toBeVisible();
  });

  it("renders primary site links with expected hrefs", async () => {
    renderPortal();

    expect(await screen.findByRole("link", { name: "HyunsDev" })).toHaveAttribute(
      "href",
      "https://hyuns.dev"
    );
    expect(screen.getByRole("link", { name: "PKM Utils" })).toHaveAttribute(
      "href",
      "https://pkm-utils.hyuns.dev"
    );
    expect(screen.getByRole("link", { name: "블로그" })).toHaveAttribute(
      "href",
      "https://velog.io/@phw3071"
    );
    expect(screen.getByRole("link", { name: "Threads" })).toHaveAttribute(
      "href",
      "https://www.instagram.com/hyunsdev"
    );
  });

  it("renders the projects route placeholder", async () => {
    renderPortal("/projects");

    expect(await screen.findByText("Projects")).toBeVisible();
    expect(screen.getByText("추후 추가 예정")).toBeVisible();
  });

  it("loads pages from YAML data", () => {
    expect(getPortalPage("/")?.columns).toHaveLength(3);
    expect(getPortalPage("/projects")?.title).toBe("Projects");
  });

  it("supports Simple Icons from YAML icon names", () => {
    const YouTubeIcon = getPortalIcon("Simple:YouTube");

    render(<YouTubeIcon data-testid="simple-icon" />);

    expect(screen.getByTestId("simple-icon")).toHaveAttribute("viewBox", "0 0 24 24");
    expect(screen.getByTestId("simple-icon").querySelector("path")).toHaveAttribute("d");
  });
});
