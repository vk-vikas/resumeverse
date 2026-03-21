import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeSelector } from '../theme-selector';

describe('ThemeSelector Component', () => {
  it('renders all available theme options', () => {
    render(<ThemeSelector selected="bento" onSelect={vi.fn()} />);
    expect(screen.getByText('Bento Grid')).toBeInTheDocument();
    expect(screen.getByText('Journey')).toBeInTheDocument();
    expect(screen.getByText('Terminal')).toBeInTheDocument();
  });

  it('highlights the currently selected theme', () => {
    render(<ThemeSelector selected="journey" onSelect={vi.fn()} />);
    
    // Bento should not be selected
    const bentoButton = screen.getByRole('button', { name: /bento/i });
    expect(bentoButton).toHaveAttribute('aria-selected', 'false');
    
    // Journey should be selected
    const journeyButton = screen.getByRole('button', { name: /journey/i });
    expect(journeyButton).toHaveAttribute('aria-selected', 'true');
  });

  it('calls onSelect callback when a different theme is clicked', () => {
    const handleSelect = vi.fn();
    render(<ThemeSelector selected="bento" onSelect={handleSelect} />);
    
    const terminalButton = screen.getByRole('button', { name: /terminal/i });
    fireEvent.click(terminalButton);
    
    expect(handleSelect).toHaveBeenCalledTimes(1);
    expect(handleSelect).toHaveBeenCalledWith('terminal');
  });
});
