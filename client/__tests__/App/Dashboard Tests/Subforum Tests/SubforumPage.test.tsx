import {render, screen} from '@testing-library/react';
import Subforum from '@/app/dashboard/subforum/[subforum_id]/page';
import "@testing-library/jest-dom";
import "whatwg-fetch";

//mock forum component
jest.mock('@/app/ui/forum', () => {
  return jest.fn(props => (
    <div data-testid="forum-component" data-subforum-id={props.subforumID}>Mock Forum Component</div>
  ));
});

//mock subforumbar component
jest.mock('@/app/ui/subforumbar', () => {
  return jest.fn(() => (
    <div data-testid="subforumbar-component">Mock Subforumbar Component</div>
  ));
});

describe('SubforumPage Component', () => {
  it('renders correctly with the right Subforum ID', async () => {
    const mockParams = Promise.resolve({ subforum_id: 'test-subforum-123' });

    const component = await Subforum({ params: mockParams });
    const { container } = render(component);
    
    // Check if the Forum component received the correct subforum ID
    const forumElement = screen.getByTestId('forum-component');
    expect(forumElement).toBeInTheDocument();
    expect(forumElement).toHaveAttribute('data-subforum-id', 'test-subforum-123');
    
    // Check if the Subforumbar component is rendered
    expect(screen.getByTestId('subforumbar-component')).toBeInTheDocument();
    
    // Verify the main container exists (simpler approach)
    expect(container.querySelector('.bg-\\[--greige-mist\\]')).toBeInTheDocument();
  });
});