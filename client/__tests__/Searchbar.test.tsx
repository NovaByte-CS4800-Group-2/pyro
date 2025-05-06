import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SearchBar from '@/app/ui/searchbar';

// Mock the @heroui/input component
jest.mock('@heroui/input', () => ({
  Input: ({ type, placeholder, value, onChange, className }: any) => (
    <input
      data-testid="mock-input"
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={className}
    />
  ),
}));

describe('SearchBar Component', () => {
  test('renders with correct className logic and handles onChange', () => {
    const mockOnChange = jest.fn();
    
    // Test with className provided
    const { rerender } = render(
      <SearchBar value="" onChange={mockOnChange} className="custom-class" />
    );
    
    const inputWithClass = screen.getByTestId('mock-input');
    expect(inputWithClass).toHaveAttribute('class', 'w-full mb-4 custom-class');
    
    // Test the onChange handler
    fireEvent.change(inputWithClass, { target: { value: 'test' } });
    expect(mockOnChange).toHaveBeenCalledWith('test');
    
    // Test without className (default case)
    rerender(<SearchBar value="" onChange={mockOnChange} />);
    
    const inputWithoutClass = screen.getByTestId('mock-input');
    expect(inputWithoutClass).toHaveAttribute('class', 'w-full mb-4 ');
  });
});