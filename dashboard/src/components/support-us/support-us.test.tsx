import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { SupportUs } from '.';
import { useSupportUs as originalUseSupportUs } from './use-support-us';
import '@testing-library/jest-dom';

vi.mock('./use-support-us', () => ({
    useSupportUs: vi.fn(),
}));

const useSupportUs = originalUseSupportUs as unknown as ReturnType<typeof vi.fn>;

describe('SupportUs Component', () => {
    it('renders the SupportUs component when localStorage is true', () => {
        useSupportUs.mockReturnValue([true, vi.fn()]);

        render(<SupportUs variant="local-storage" />);

        expect(screen.getByText(/support-us.title/i)).toBeInTheDocument();
        expect(screen.getByText(/support-us.desc/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Close/i })).toBeInTheDocument();
    });

    it('does not render the SupportUs component when localStorage is false', () => {
        useSupportUs.mockReturnValue([false, vi.fn()]);

        render(<SupportUs variant="status" />);

        expect(screen.queryByText(/support-us.title/i)).not.toBeInTheDocument();
    });

    it('closes the SupportUs card when the close button is clicked in local-storage mode', () => {
        const setSupportUsOpen = vi.fn();
        useSupportUs.mockReturnValue([true, setSupportUsOpen]);

        render(<SupportUs variant="local-storage" />);

        const closeButton = screen.getByRole('button', { name: /Close/i });
        fireEvent.mouseDown(closeButton);

        expect(setSupportUsOpen).toHaveBeenCalledWith(false);
    });

    it('renders the SupportUs component in view mode without close button', () => {
        render(<SupportUs variant="view" />);

        expect(screen.getByText(/support-us.title/i)).toBeInTheDocument();
        expect(screen.queryByRole('button', { name: /Close/i })).not.toBeInTheDocument();
    });

    it('redirects to the donation link when the donation button is clicked', () => {
        useSupportUs.mockReturnValue([true, vi.fn()]);

        render(<SupportUs variant="local-storage" />);

        const donationLink = screen.getByRole('link', { name: /support-us.donate/i });
        expect(donationLink).toHaveAttribute('href', 'https://github.com/khodedawsh/marzneshin#donation');
    });
});
