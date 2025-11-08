import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import StudentsView from "@/views/StudentsView";

vi.mock("@/hooks/useClient", () => ({
  useClient: () => ({
    loading: false,
    error: null,
    fetchClient: vi
      .fn()
      .mockResolvedValue({ students: [], total: 0, skip: 0, limit: 10 }),
  }),
}));

describe("StudentsView", () => {
  it("renders the heading", () => {
    render(<StudentsView />);
    expect(screen.getByText("Students")).toBeInTheDocument();
  });

  it("renders the description text", () => {
    render(<StudentsView />);
    expect(
      screen.getByText("Manage student records and risk assessments")
    ).toBeInTheDocument();
  });

  it("renders the create student button", () => {
    render(<StudentsView />);
    expect(screen.getByText("Create Student")).toBeInTheDocument();
  });
});
