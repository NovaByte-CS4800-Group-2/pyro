import {render, screen, waitFor } from '@testing-library/react';
import { Providers } from '@/app/providers';
import '@testing-library/jest-dom';


//testing the Providers component
describe('Providers', () => {
  it('renders the children correctly', () => { 
    render( // Providers component
      <Providers> 
        <div>Hello World</div>
      </Providers>
    );

    expect(screen.getByText('Hello World')).toBeInTheDocument();
  });
});