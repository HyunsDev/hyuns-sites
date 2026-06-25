import "@testing-library/jest-dom/vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { createMemoryHistory } from "@tanstack/react-router";
import { describe, expect, it, vi } from "vitest";
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

  it("shows external link destinations as tooltips", async () => {
    renderPortal();

    fireEvent.focus(await screen.findByRole("link", { name: "HyunsDev" }));
    expect(screen.getByRole("tooltip", { name: "https://hyuns.dev" })).toBeVisible();

    fireEvent.focus(screen.getByRole("link", { name: "PKM Utils" }));
    expect(screen.getByRole("tooltip", { name: "https://pkm-utils.hyuns.dev" })).toBeVisible();

    expect(screen.queryByRole("tooltip", { name: "/projects" })).not.toBeInTheDocument();
  });

  it("marks moveable items for new tabs while command or control is held", async () => {
    renderPortal();

    const hyunsDevLink = await screen.findByRole("link", { name: "HyunsDev" });
    const hyunsDevLabel = screen.getByText("HyunsDev");
    const projectsLabel = screen.getByText("Projects");

    expect(hyunsDevLink).not.toHaveAttribute("target");
    expect(hyunsDevLabel).not.toHaveClass("underline");
    expect(projectsLabel).not.toHaveClass("underline");

    fireEvent.keyDown(window, { key: "Meta", metaKey: true });

    expect(hyunsDevLink).toHaveAttribute("target", "_blank");
    expect(hyunsDevLink).toHaveAttribute("rel", "noopener noreferrer");
    expect(hyunsDevLabel).toHaveClass("underline");
    expect(projectsLabel).toHaveClass("underline");

    fireEvent.keyUp(window, { key: "Meta", metaKey: false });

    expect(hyunsDevLink).not.toHaveAttribute("target");
    expect(hyunsDevLabel).not.toHaveClass("underline");
    expect(projectsLabel).not.toHaveClass("underline");
  });

  it("opens internal portal pages in a new tab while command or control is held", async () => {
    const openSpy = vi.spyOn(window, "open").mockImplementation(() => null);

    try {
      renderPortal();

      fireEvent.keyDown(window, { key: "Control", ctrlKey: true });
      fireEvent.click(await screen.findByRole("button", { name: "Projects" }), {
        ctrlKey: true
      });

      expect(openSpy).toHaveBeenCalledWith("/projects", "_blank", "noopener,noreferrer");
      expect(screen.getByText("Portal")).toBeVisible();
    } finally {
      openSpy.mockRestore();
    }
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
