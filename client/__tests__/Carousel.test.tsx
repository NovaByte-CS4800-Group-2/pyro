import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { EmblaCarousel } from '@/app/ui/carousel';

// Create mock API with jest functions to track calls
const mockScrollPrev = jest.fn();
const mockScrollNext = jest.fn();
const mockEmblaApi = { scrollPrev: mockScrollPrev, scrollNext: mockScrollNext };

// Mock with proper API returned
jest.mock('embla-carousel-react', () => ({
  __esModule: true,
  default: jest.fn(() => [null, mockEmblaApi])
}));

jest.mock('embla-carousel-autoplay', () => ({
  __esModule: true,
  default: jest.fn()
}));

jest.mock('@heroicons/react/24/solid', () => ({
  ChevronLeftIcon: () => <span data-testid="left-arrow">←</span>,
  ChevronRightIcon: () => <span data-testid="right-arrow">→</span>
}));

describe('EmblaCarousel', () => {
  beforeEach(() => {
    // Clear mock function calls before each test
    mockScrollPrev.mockClear();
    mockScrollNext.mockClear();
  });

  test('renders carousel with navigation and slides', () => {
    render(<EmblaCarousel />);
    
    // Check for navigation buttons
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(2);
    
    // Check for images with alt text
    const images = screen.getAllByRole('img');
    expect(images).toHaveLength(2);
    
    // Check for specific images
    expect(screen.getByAltText('cat')).toBeInTheDocument();
    expect(screen.getByAltText('dogs')).toBeInTheDocument();
    
    // Check that the carousel container exists
    const container = document.querySelector('.embla__container');
    expect(container).toBeInTheDocument();
  });

  test('calls scrollPrev when left button is clicked', () => {
    render(<EmblaCarousel />);
    
    // Find the left button using the data-testid we added to its icon
    const leftButton = screen.getByTestId('left-arrow').closest('button');
    
    // Click the left button
    if (leftButton) {
      fireEvent.click(leftButton);
    }
    
    // Check that the scrollPrev method was called
    expect(mockScrollPrev).toHaveBeenCalledTimes(1);
  });

  test('calls scrollNext when right button is clicked', () => {
    render(<EmblaCarousel />);
    
    // Find the right button using the data-testid we added to its icon
    const rightButton = screen.getByTestId('right-arrow').closest('button');
    
    // Click the right button
    if (rightButton) {

    fireEvent.click(rightButton);
    }
    // Check that the scrollNext method was called
    expect(mockScrollNext).toHaveBeenCalledTimes(1);
  });
});