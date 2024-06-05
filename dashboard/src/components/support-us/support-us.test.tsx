import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { SupportUs } from '.';
import { useLocalStorage as originalUseLocalStorage } from '@uidotdev/usehooks';
import '@testing-library/jest-dom';

vi.mock('@uidotdev/usehooks', () => ({
    useLocalStorage: vi.fn(),
}));

const useLocalStorage = originalUseLocalStorage as unknown as ReturnType<typeof vi.fn>;

describe('SupportUs Component', () => {
    it('renders the SupportUs component when localStorage is true', () => {
        useLocalStorage.mockReturnValue([true, vi.fn()]);

        render(<SupportUs variant="local-storage" />);

        expect(screen.getByText(/Support Us/i)).toBeInTheDocument();
        expect(screen.getByText(/support-us.desc/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Close/i })).toBeInTheDocument();
    });

    it('does not render the SupportUs component when localStorage is false', () => {
        useLocalStorage.mockReturnValue([false, vi.fn()]);

        render(<SupportUs variant="local-storage" />);

        expect(screen.queryByText(/Support Us/i)).not.toBeInTheDocument();
    });

    it('closes the SupportUs card when the close button is clicked in local-storage mode', () => {
        const setSupportUsOpen = vi.fn();
        useLocalStorage.mockReturnValue([true, setSupportUsOpen]);

        render(<SupportUs variant="local-storage" />);

        const closeButton = screen.getByRole('button', { name: /Close/i });
        fireEvent.mouseDown(closeButton);

        expect(setSupportUsOpen).toHaveBeenCalledWith(false);
    });

    it('renders the SupportUs component in view mode without close button', () => {
        render(<SupportUs variant="view" />);

        expect(screen.getByText(/Support Us/i)).toBeInTheDocument();
        expect(screen.queryByRole('button', { name: /Close/i })).not.toBeInTheDocument();
    });

    it('redirects to the donation link when the donation button is clicked', () => {
        useLocalStorage.mockReturnValue([true, vi.fn()]);

        render(<SupportUs variant="local-storage" />);

        const donationLink = screen.getByRole('link', { name: /support-us.donate/i });
        expect(donationLink).toHaveAttribute('href', 'https://github.com/khodedawsh/marzneshin#donation');
    });
});
