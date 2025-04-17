import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react';
import Button from './app/ui/button';  // Adjust the path to your component

import '@testing-library/jest-dom/'; // For jest-dom matchers


test("button renders with label", () => {
  render(<Button label="Click Me" />);
  const button = screen.getByText(/Click Me/i);
  expect(button).toBeInTheDocument();
});

test("click event handler is called when button is clicked", () => {
  const handleClick = jest.fn();
  render(<Button label="Click Me" onClick={handleClick} />);
  const button = screen.getByText(/Click Me/i);
  fireEvent.click(button);
  expect(handleClick).toHaveBeenCalledTimes(1);
});
