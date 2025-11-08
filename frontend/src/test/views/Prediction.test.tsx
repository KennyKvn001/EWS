import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Prediction from "@/views/Prediction";

describe("Prediction", () => {
  it("renders the heading", () => {
    render(<Prediction />);
    expect(screen.getByText("Student Risk Prediction")).toBeInTheDocument();
  });

  it("renders the description text", () => {
    render(<Prediction />);
    expect(
      screen.getByText(
        "Enter student information manually or upload a file for batch predictions"
      )
    ).toBeInTheDocument();
  });

  it("renders the Form tab", () => {
    render(<Prediction />);
    expect(screen.getByText("Form")).toBeInTheDocument();
  });

  it("renders the Upload File tab", () => {
    render(<Prediction />);
    expect(screen.getByText("Upload File")).toBeInTheDocument();
  });
});
