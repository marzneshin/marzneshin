import { useSupportUs } from './use-support-us';
import { describe, it, expect, } from 'vitest';
import { renderHook } from '@testing-library/react';
import { act } from "react";

import '@testing-library/jest-dom';

describe('useSupportUs hook', () => {
    it('returns local storage value and setter when variant is "local-storage"', () => {
        const defaultValue = true;
        const { result } = renderHook(() => useSupportUs('local-storage', defaultValue));

        expect(result.current[0]).toBe(defaultValue);

        const newValue = !defaultValue;
        act(() => {
            result.current[1](newValue);
        });

        expect(result.current[0]).toBe(newValue);
    });

    it('returns state value and setter when variant is "status"', () => {
        const defaultValue = true;
        const { result } = renderHook(() => useSupportUs('status', defaultValue));

        expect(result.current[0]).toBe(defaultValue);

        const newValue = !defaultValue;
        act(() => {
            result.current[1](newValue);
        });

        expect(result.current[0]).toBe(newValue);
    });
});
