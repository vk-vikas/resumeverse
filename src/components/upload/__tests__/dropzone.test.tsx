import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Dropzone } from '../dropzone';

describe('Dropzone Component', () => {
  it('renders upload instructions text', () => {
    render(<Dropzone onFileSelect={vi.fn()} />);
    expect(screen.getByText(/Drag & drop your resume/i)).toBeInTheDocument();
    expect(screen.getByText(/PDF or DOCX/i)).toBeInTheDocument();
  });

  it('shows error message when non-PDF/DOCX file is uploaded', async () => {
    const user = userEvent.setup();
    render(<Dropzone onFileSelect={vi.fn()} />);
    
    // Create a mock invalid text file
    const file = new File(['hello'], 'hello.txt', { type: 'text/plain' });
    const input = screen.getByLabelText('Upload your resume', { selector: 'input' });
    
    fireEvent.change(input, { target: { files: [file] } });
    
    expect(await screen.findByText(/Only PDF and DOCX files are accepted/i)).toBeInTheDocument();
  });

  it('calls onFileSelect when a PDF file is uploaded', async () => {
    const user = userEvent.setup();
    const handleFileSelect = vi.fn();
    render(<Dropzone onFileSelect={handleFileSelect} />);
    
    // Create a mock valid PDF file
    const file = new File(['dummy content'], 'resume.pdf', { type: 'application/pdf' });
    const input = screen.getByLabelText('Upload your resume', { selector: 'input' });
    
    await user.upload(input, file);
    
    expect(handleFileSelect).toHaveBeenCalledTimes(1);
    expect(handleFileSelect).toHaveBeenCalledWith(file);
  });
});
