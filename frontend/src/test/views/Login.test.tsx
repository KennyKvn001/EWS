import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import Login from "@/views/Login";

vi.mock("@clerk/clerk-react", () => ({
  SignIn: () => <div data-testid="clerk-signin">SignIn Component</div>,
}));

describe("Login", () => {
  it("renders the EWS heading", () => {
    render(<Login />);
    expect(screen.getByText("EWS")).toBeInTheDocument();
  });

  it("renders the Early Warning System description", () => {
    render(<Login />);
    expect(screen.getByText("Early Warning System")).toBeInTheDocument();
  });

  it("renders the graduation cap icon", () => {
    const { container } = render(<Login />);
    const icon = container.querySelector("svg");
    expect(icon).toBeInTheDocument();
  });
});
