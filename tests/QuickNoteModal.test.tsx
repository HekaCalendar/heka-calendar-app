import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import QuickNoteModal from '../src/components/QuickNoteModal';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

const mockDay = {
  hekaDate: { year: 2024, month: 5, day: 15 },
  civilDate: { year: 2024, month: 6, day: 15 },
  dayOfWeek: 6,
  moonPhase: 'waxing gibbous',
  isHoliday: false,
  holidayName: null,
  season: 'summer',
  zodiacSign: 'Gemini',
  planetaryHour: { planet: 'moon', hour: 3 },
  energy: { celestial: 7, terrestrial: 5 },
} as any;

describe('QuickNoteModal', () => {
  it('returns null when isOpen is false', () => {
    const { container } = render(
      <QuickNoteModal isOpen={false} day={mockDay} onClose={vi.fn()} onSave={vi.fn()} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('returns null when day is null', () => {
    const { container } = render(
      <QuickNoteModal isOpen={true} day={null} onClose={vi.fn()} onSave={vi.fn()} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders modal when open with a day', () => {
    render(<QuickNoteModal isOpen={true} day={mockDay} onClose={vi.fn()} onSave={vi.fn()} />);
    expect(screen.getByText('calendar:quickNote')).toBeInTheDocument();
    expect(screen.getByText(/calendar:addingTo/)).toBeInTheDocument();
  });

  it('calls onClose when overlay is clicked', () => {
    const onClose = vi.fn();
    render(<QuickNoteModal isOpen={true} day={mockDay} onClose={onClose} onSave={vi.fn()} />);
    const overlay = document.querySelector('.quick-note-modal-overlay');
    fireEvent.click(overlay!);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when close button is clicked', () => {
    const onClose = vi.fn();
    render(<QuickNoteModal isOpen={true} day={mockDay} onClose={onClose} onSave={vi.fn()} />);
    fireEvent.click(screen.getByLabelText('Close'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when cancel button is clicked', () => {
    const onClose = vi.fn();
    render(<QuickNoteModal isOpen={true} day={mockDay} onClose={onClose} onSave={vi.fn()} />);
    fireEvent.click(screen.getByText('dayPanel:noteEditor.cancel'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onSave with trimmed content then onClose when save is clicked', () => {
    const onSave = vi.fn();
    const onClose = vi.fn();
    render(<QuickNoteModal isOpen={true} day={mockDay} onClose={onClose} onSave={onSave} />);

    const textarea = screen.getByPlaceholderText('dayPanel:notePlaceholder');
    fireEvent.change(textarea, { target: { value: '  Hello world  ' } });

    fireEvent.click(screen.getByText('dayPanel:noteEditor.saveNote'));
    expect(onSave).toHaveBeenCalledWith('Hello world');
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not call onSave or onClose when clicking disabled save button', () => {
    const onSave = vi.fn();
    const onClose = vi.fn();
    render(<QuickNoteModal isOpen={true} day={mockDay} onClose={onClose} onSave={onSave} />);

    const saveButton = screen.getByText('dayPanel:noteEditor.saveNote');
    // Button is disabled when empty, so click does nothing
    fireEvent.click(saveButton);
    expect(onSave).not.toHaveBeenCalled();
    expect(onClose).not.toHaveBeenCalled();
  });

  it('save button is disabled when textarea is empty', () => {
    render(<QuickNoteModal isOpen={true} day={mockDay} onClose={vi.fn()} onSave={vi.fn()} />);
    const saveButton = screen.getByText('dayPanel:noteEditor.saveNote');
    expect(saveButton).toBeDisabled();
  });

  it('closes on Escape key', () => {
    const onClose = vi.fn();
    render(<QuickNoteModal isOpen={true} day={mockDay} onClose={onClose} onSave={vi.fn()} />);
    const textarea = screen.getByPlaceholderText('dayPanel:notePlaceholder');
    fireEvent.keyDown(textarea, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('saves on Ctrl+Enter', () => {
    const onSave = vi.fn();
    const onClose = vi.fn();
    render(<QuickNoteModal isOpen={true} day={mockDay} onClose={onClose} onSave={onSave} />);

    const textarea = screen.getByPlaceholderText('dayPanel:notePlaceholder');
    fireEvent.change(textarea, { target: { value: 'Quick note' } });
    fireEvent.keyDown(textarea, { key: 'Enter', ctrlKey: true });

    expect(onSave).toHaveBeenCalledWith('Quick note');
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
