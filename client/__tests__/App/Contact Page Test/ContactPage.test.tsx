import { render, screen } from "@testing-library/react";
import Contact from "@/app/contact/page";

describe("Contact Page", () => {
  it("renders the contact heading and description", () => {
    render(<Contact />);
    expect(
      screen.getByRole("heading", { name: /Contact Us Page/i })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/We would love to hear back from you/i)
    ).toBeInTheDocument();
  });

  it("renders all team member names", () => {
    render(<Contact />);
    expect(screen.getByText(/Natalie Mamikonyan/i)).toBeInTheDocument();
    expect(screen.getByText(/Arin Boyadjian/i)).toBeInTheDocument();
    expect(screen.getByText(/Anastasia Davis/i)).toBeInTheDocument();
    expect(screen.getByText(/Jessica Pinto/i)).toBeInTheDocument();
    expect(screen.getByText(/Hadya Rohin/i)).toBeInTheDocument();
  });
});
