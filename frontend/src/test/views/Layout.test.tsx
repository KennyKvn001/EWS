import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
import { BrowserRouter } from "react-router";
import Layout from "@/views/Layout";

vi.mock("@clerk/clerk-react", () => ({
  UserButton: () => <div data-testid="clerk-userbutton">UserButton</div>,
}));

describe("Layout", () => {
  it("renders without crashing", () => {
    const { container } = render(
      <BrowserRouter>
        <Layout />
      </BrowserRouter>
    );
    expect(container).toBeInTheDocument();
  });

  it("renders the main content area", () => {
    const { container } = render(
      <BrowserRouter>
        <Layout />
      </BrowserRouter>
    );
    const mainElement = container.querySelector("main");
    expect(mainElement).toBeInTheDocument();
  });
});
