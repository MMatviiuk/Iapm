/**
 * COMPONENT TESTS: EmptyState
 * Testing EmptyState component rendering and interactions
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { EmptyState } from './EmptyState';
import { Plus } from 'lucide-react';

describe('EmptyState', () => {
  it('should render with required props', () => {
    render(
      <EmptyState
        icon={Plus}
        title="No medications"
        description="You haven't added any medications yet"
      />
    );

    expect(screen.getByText('No medications')).toBeInTheDocument();
    expect(screen.getByText("You haven't added any medications yet")).toBeInTheDocument();
  });

  it('should render icon', () => {
    render(
      <EmptyState
        icon={Plus}
        title="Test"
        description="Description"
      />
    );

    // Icon should be rendered (Lucide icons render as SVG)
    const svg = document.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('should render action button when provided', () => {
    const onAction = vi.fn();

    render(
      <EmptyState
        icon={Plus}
        title="No medications"
        description="Add your first medication"
        actionLabel="Add Medication"
        onAction={onAction}
      />
    );

    const button = screen.getByRole('button', { name: /add medication/i });
    expect(button).toBeInTheDocument();
  });

  it('should call onAction when button clicked', () => {
    const onAction = vi.fn();

    render(
      <EmptyState
        icon={Plus}
        title="No medications"
        description="Add your first medication"
        actionLabel="Add Medication"
        onAction={onAction}
      />
    );

    const button = screen.getByRole('button', { name: /add medication/i });
    fireEvent.click(button);

    expect(onAction).toHaveBeenCalledTimes(1);
  });

  it('should not render action button when onAction not provided', () => {
    render(
      <EmptyState
        icon={Plus}
        title="No medications"
        description="Add your first medication"
        actionLabel="Add Medication"
      />
    );

    const button = screen.queryByRole('button');
    expect(button).not.toBeInTheDocument();
  });

  it('should render help link when provided', () => {
    const onHelp = vi.fn();

    render(
      <EmptyState
        icon={Plus}
        title="No medications"
        description="Add your first medication"
        helpText="Need help?"
        onHelp={onHelp}
      />
    );

    const helpLink = screen.getByText(/need help/i);
    expect(helpLink).toBeInTheDocument();
  });

  it('should call onHelp when help link clicked', () => {
    const onHelp = vi.fn();

    render(
      <EmptyState
        icon={Plus}
        title="No medications"
        description="Add your first medication"
        helpText="Need help?"
        onHelp={onHelp}
      />
    );

    const helpLink = screen.getByText(/need help/i);
    fireEvent.click(helpLink);

    expect(onHelp).toHaveBeenCalledTimes(1);
  });

  it('should apply dark mode styles when darkMode is true', () => {
    const { container } = render(
      <EmptyState
        icon={Plus}
        title="No medications"
        description="Add your first medication"
        darkMode={true}
      />
    );

    // Check for dark mode classes
    const wrapper = container.firstChild;
    expect(wrapper).toHaveClass('dark:bg-gray-800');
  });

  it('should have correct text sizes for elderly users', () => {
    render(
      <EmptyState
        icon={Plus}
        title="No medications"
        description="Add your first medication"
      />
    );

    const title = screen.getByText('No medications');
    const description = screen.getByText('Add your first medication');

    // Title should be large (32-40px)
    expect(title).toHaveClass('text-3xl');
    
    // Description should be 18-24px
    expect(description).toHaveClass('text-xl');
  });

  it('should have large button size (56-64px) when action provided', () => {
    const onAction = vi.fn();

    render(
      <EmptyState
        icon={Plus}
        title="No medications"
        description="Add your first medication"
        actionLabel="Add Medication"
        onAction={onAction}
      />
    );

    const button = screen.getByRole('button', { name: /add medication/i });
    
    // Button should be large (h-14 = 56px or h-16 = 64px)
    expect(button).toHaveClass('h-14');
  });

  it('should render multiple empty states independently', () => {
    const { rerender } = render(
      <EmptyState
        icon={Plus}
        title="No medications"
        description="First state"
      />
    );

    expect(screen.getByText('No medications')).toBeInTheDocument();
    expect(screen.getByText('First state')).toBeInTheDocument();

    rerender(
      <EmptyState
        icon={Plus}
        title="No history"
        description="Second state"
      />
    );

    expect(screen.getByText('No history')).toBeInTheDocument();
    expect(screen.getByText('Second state')).toBeInTheDocument();
  });
});
