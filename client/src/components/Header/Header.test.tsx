import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { Header } from "./Header";

vi.mock("../../assets/Horizontal Blue Logo Transparent.png", () => ({
  default: "/mock-logo.png",
}));

const HeaderWithRouter = () => (
  <BrowserRouter>
    <Header />
  </BrowserRouter>
);

describe("Header Component", () => {
  it("renders header with logo and navigation", () => {
    render(<HeaderWithRouter />);

    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getByAltText("PJMF Logo")).toBeInTheDocument();
    expect(screen.getByText("About")).toBeInTheDocument();
  });

  it("has correct navigation links", () => {
    render(<HeaderWithRouter />);

    const logoLink = screen.getByAltText("PJMF Logo").closest("a");
    const aboutLink = screen.getByText("About");

    expect(logoLink).toHaveAttribute("href", "/");
    expect(aboutLink).toHaveAttribute("href", "/about");
  });

  it("applies correct CSS classes", () => {
    render(<HeaderWithRouter />);

    const header = screen.getByRole("banner");
    expect(header).toHaveClass("header");
    expect(header.querySelector(".header-left")).toHaveClass("header-left");
    expect(header.querySelector(".logo")).toHaveClass("logo");
    expect(header.querySelector(".nav-link")).toHaveClass("nav-link");
  });
});
