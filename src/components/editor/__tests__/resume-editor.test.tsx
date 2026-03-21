import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ResumeEditor } from '../resume-editor';

// Mock lucide-react icons that ResumeEditor relies on internally to avoid SVGs cluttering jsdom
vi.mock('lucide-react', () => ({
  Check: () => <div data-testid="icon-check" />,
  LayoutGrid: () => <div data-testid="icon-layout" />,
  ScrollText: () => <div data-testid="icon-scroll" />,
  Terminal: () => <div data-testid="icon-terminal" />,
  Plus: () => <div data-testid="icon-plus" />,
  Trash2: () => <div data-testid="icon-trash" />,
  X: () => <div data-testid="icon-x" />,
  Sparkles: () => <div data-testid="icon-sparkles" />,
  Loader2: () => <div data-testid="icon-loader" />,
  RotateCcw: () => <div data-testid="icon-rotate" />,
  ChevronDown: () => <div data-testid="icon-chevron" />,
  ChevronUp: () => <div data-testid="icon-chevron-up" />,
}));

// Mock the context provider
const mockUpdateField = vi.fn();

vi.mock('../editor-context', () => ({
  useEditor: () => ({
    data: {
      name: 'Jane Doe',
      title: 'Senior Developer',
      summary: '',
      contact: { email: 'jane@example.com' },
      experience: [],
      education: [],
      projects: [],
      skills: { languages: [], frameworks: [], tools: [], soft: [] },
      certifications: [],
      highlights: []
    },
    theme: 'bento',
    updateField: mockUpdateField,
    setTheme: vi.fn()
  })
}));

describe('ResumeEditor Component', () => {
  it('renders resume data in editable input fields', () => {
    render(<ResumeEditor />);
    
    const nameInput = screen.getByDisplayValue('Jane Doe');
    const titleInput = screen.getByDisplayValue('Senior Developer');
    
    expect(nameInput).toBeInTheDocument();
    expect(titleInput).toBeInTheDocument();
  });

  it('calls updateField context method when user edits the name field', () => {
    render(<ResumeEditor />);
    
    // Find the input containing Jane Doe
    const nameInput = screen.getByDisplayValue('Jane Doe');
    
    // Simulate user typing a new name
    fireEvent.change(nameInput, { target: { value: 'Jane Smith' } });
    
    // Assert the global context updater was called
    expect(mockUpdateField).toHaveBeenCalledTimes(1);
    expect(mockUpdateField).toHaveBeenCalledWith('name', 'Jane Smith');
  });
});
