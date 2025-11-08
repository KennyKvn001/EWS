import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Simulations from "@/views/Simulations";

describe("Simulations", () => {
  it("renders the heading", () => {
    render(<Simulations />);
    expect(screen.getByText("What-If Scenarios")).toBeInTheDocument();
  });

  it("renders the description text", () => {
    render(<Simulations />);
    expect(
      screen.getByText(
        "Adjust student parameters to see how different factors affect risk predictions"
      )
    ).toBeInTheDocument();
  });
});
