import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import HomeOverview from "@/views/HomeOverview";

describe("HomeOverview", () => {
  it("renders the dashboard heading", () => {
    render(<HomeOverview />);
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
  });

  it("renders the description text", () => {
    render(<HomeOverview />);
    expect(
      screen.getByText("Monitor student performance and risk indicators")
    ).toBeInTheDocument();
  });

  it("renders total predictions card", () => {
    render(<HomeOverview />);
    expect(screen.getByText("Total Predictions")).toBeInTheDocument();
  });

  it("renders at-risk students card", () => {
    render(<HomeOverview />);
    expect(screen.getByText("At-Risk Students")).toBeInTheDocument();
  });

  it("renders success rate card", () => {
    render(<HomeOverview />);
    expect(screen.getByText("Success Rate")).toBeInTheDocument();
    expect(screen.getByText("12")).toBeInTheDocument();
  });
});
