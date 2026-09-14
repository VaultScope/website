import { render, screen, act } from '@testing-library/react';
import { expect, test, describe, vi, beforeEach } from 'vitest';
import { ToastProvider, useToast } from './components/Toast';

function ToastTrigger({ type, message }: { type: 'success' | 'error' | 'info'; message: string }) {
  const toast = useToast();
  return <button onClick={() => toast[type](message)}>Trigger</button>;
}

describe('ToastProvider', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  test('renders children without crashing', () => {
    render(<ToastProvider><div data-testid='child'>Child</div></ToastProvider>);
    expect(screen.getByTestId('child')).toBeDefined();
  });

  test('shows success toast when triggered', () => {
    render(
      <ToastProvider>
        <ToastTrigger type="success" message="Operation complete" />
      </ToastProvider>
    );

    act(() => {
      screen.getByText('Trigger').click();
    });

    expect(screen.getByText('Operation complete')).toBeDefined();
  });

  test('shows error toast when triggered', () => {
    render(
      <ToastProvider>
        <ToastTrigger type="error" message="Something went wrong" />
      </ToastProvider>
    );

    act(() => {
      screen.getByText('Trigger').click();
    });

    expect(screen.getByText('Something went wrong')).toBeDefined();
  });

  test('auto-dismisses toast after 5 seconds', () => {
    render(
      <ToastProvider>
        <ToastTrigger type="info" message="Temporary message" />
      </ToastProvider>
    );

    act(() => {
      screen.getByText('Trigger').click();
    });

    expect(screen.getByText('Temporary message')).toBeDefined();

    act(() => {
      vi.advanceTimersByTime(5001);
    });

    expect(screen.queryByText('Temporary message')).toBeNull();
  });

  test('multiple toasts can coexist', () => {
    function MultiTrigger() {
      const toast = useToast();
      return (
        <>
          <button onClick={() => toast.success('First')}>T1</button>
          <button onClick={() => toast.error('Second')}>T2</button>
        </>
      );
    }

    render(
      <ToastProvider>
        <MultiTrigger />
      </ToastProvider>
    );

    act(() => {
      screen.getByText('T1').click();
      screen.getByText('T2').click();
    });

    expect(screen.getByText('First')).toBeDefined();
    expect(screen.getByText('Second')).toBeDefined();
  });

  test('useToast throws outside of provider', () => {
    function BadComponent() {
      useToast();
      return null;
    }

    expect(() => render(<BadComponent />)).toThrow('useToast must be used within ToastProvider');
  });
});
