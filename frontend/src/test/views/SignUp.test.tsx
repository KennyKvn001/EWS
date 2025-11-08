import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import SignUpPage from "@/views/SignUp";

vi.mock("@clerk/clerk-react", () => ({
  SignUp: () => <div data-testid="clerk-signup">SignUp Component</div>,
}));

describe("SignUpPage", () => {
  it("renders the EWS heading", () => {
    render(<SignUpPage />);
    expect(screen.getByText("EWS")).toBeInTheDocument();
  });

  it("renders the Early Warning System description", () => {
    render(<SignUpPage />);
    expect(screen.getByText("Early Warning System")).toBeInTheDocument();
  });

  it("renders the graduation cap icon", () => {
    const { container } = render(<SignUpPage />);
    const icon = container.querySelector("svg");
    expect(icon).toBeInTheDocument();
  });
});
