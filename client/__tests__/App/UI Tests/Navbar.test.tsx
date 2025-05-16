import React from "react";
import { render, screen } from "@testing-library/react";
import Navbar from "@/app/ui/navbar";
import { usePathname } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";

jest.mock("next/navigation", () => ({
  usePathname: jest.fn(),
}));

jest.mock("react-firebase-hooks/auth", () => ({
  useAuthState: jest.fn(),
}));

jest.mock("@/app/firebase/config", () => ({
  auth: {},
}));

describe("Navbar", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders all nav links when user is logged in", () => {
    (useAuthState as jest.Mock).mockReturnValue([{ uid: "user123" }]);
    (usePathname as jest.Mock).mockReturnValue("/dashboard");

    render(<Navbar />);

    expect(screen.getByText("Forum")).toBeInTheDocument();
    expect(screen.getByText("Fundraisers")).toBeInTheDocument();
    expect(screen.getByText("Resources")).toBeInTheDocument();
    expect(screen.getByText("Matching Requests")).toBeInTheDocument();
  });

  it("renders limited nav links when user is not logged in", () => {
    (useAuthState as jest.Mock).mockReturnValue([null]);
    (usePathname as jest.Mock).mockReturnValue("/dashboard");

    render(<Navbar />);

    expect(screen.getByText("Forum")).toBeInTheDocument();
    expect(screen.getByText("Fundraisers")).toBeInTheDocument();
    expect(screen.getByText("Resources")).toBeInTheDocument();
    expect(screen.queryByText("Matching Requests")).not.toBeInTheDocument();
  });

  it("highlights active link based on pathname", () => {
    (useAuthState as jest.Mock).mockReturnValue([{ uid: "user123" }]);
    (usePathname as jest.Mock).mockReturnValue("/dashboard/fundraiser");

    render(<Navbar />);

    const activeLink = screen.getByText("Fundraisers");
    expect(activeLink.className).toMatch(/bg-\[--greige-deep\]/);
  });
});
