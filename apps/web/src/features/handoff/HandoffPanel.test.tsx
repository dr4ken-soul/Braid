/**
 * Handoff gate contract. The route action stays disabled until the case holds
 * evidence and a transcript, the deque target, and a reason of at least ten
 * characters; a successful routing records the queue acceptance.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import React from 'react';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';

const api = vi.hoisted(() => ({
  createHandoff: vi.fn(),
  BraidApiError: class BraidApiError extends Error {
    code: string;
    status: number;
    constructor(code: string, message: string, status: number) {
      super(message);
      this.code = code;
      this.status = status;
    }
  },
}));

vi.mock('@/lib/api', () => api);

import { HandoffPanel } from './HandoffPanel';

function renderPanel(overrides?: Partial<Parameters<typeof HandoffPanel>[0]>) {
  const props = {
    caseId: '9f1c2a34-0142-4b0e-9c1d-a00000000142',
    evidenceCount: 12,
    hasTranscript: true,
    handoffs: [],
    ...overrides,
  };
  return render(React.createElement(HandoffPanel, props));
}

function routeButton() {
  const buttons = screen.getAllByRole('button', { name: /route to adjuster/i });
  return buttons[buttons.length - 1] as HTMLButtonElement;
}

beforeEach(() => {
  cleanup();
  api.createHandoff.mockReset();
});

afterEach(cleanup);

describe('HandoffPanel', () => {
  it('keeps the route action disabled on a bare case', () => {
    renderPanel({ evidenceCount: 0, hasTranscript: false });
    expect(routeButton().disabled).toBe(true);
    expect(api.createHandoff).not.toHaveBeenCalled();
  });

  it('stays disabled until the reason reaches ten characters', () => {
    renderPanel();
    fireEvent.change(screen.getByLabelText('Queue target'), {
      target: { value: 'adjuster-queue' },
    });
    fireEvent.change(screen.getByLabelText('Escalation reason'), {
      target: { value: 'short' },
    });
    expect(routeButton().disabled).toBe(true);
  });

  it('routes to the chosen queue and records the acceptance', async () => {
    api.createHandoff.mockResolvedValueOnce({
      handoff: {
        id: 'handoff-accept-1',
        destination: 'adjuster-queue',
        reason: 'Caller rear door damage needs coverage verification against the policy record.',
        queueAcceptance: {
          state: 'accepted',
          queue: 'adjuster-queue',
          acceptedAt: '2026-05-02T10:40:00.000Z',
          acceptedBy: 'adjuster-queue-mock',
        },
      },
    });

    renderPanel();
    fireEvent.change(screen.getByLabelText('Queue target'), {
      target: { value: 'adjuster-queue' },
    });
    fireEvent.change(screen.getByLabelText('Escalation reason'), {
      target: { value: 'Caller rear door damage needs coverage verification against the policy record.' },
    });
    const button = routeButton();
    expect(button.disabled).toBe(false);
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getAllByText('Handoff accepted').length).toBeGreaterThan(0);
    });
    expect(api.createHandoff).toHaveBeenCalledTimes(1);
    await waitFor(() => {
      expect(api.createHandoff).toHaveBeenCalledWith(
        '9f1c2a34-0142-4b0e-9c1d-a00000000142',
        {
          destination: 'adjuster-queue',
          reason: 'Caller rear door damage needs coverage verification against the policy record.',
          createdBy: 'operator',
        },
      );
    });
    expect(await screen.findByText('Handoff accepted')).toBeTruthy();
  });

  it('renders existing handoffs with their queue acceptance', () => {
    renderPanel({
      handoffs: [
        {
          id: 'handoff-existing-1',
          destination: 'human-follow-up-queue',
          reason: 'Policy record surfaced an unavailable dependency; verify by phone.',
          createdAt: '2026-05-02T11:00:00.000Z',
          createdBy: 'agent',
          queueAcceptance: null,
        },
      ],
    });
    expect(screen.getByText('human-follow-up-queue · agent · 2026-05-02 11:00:00 UTC')).toBeTruthy();
    expect(screen.getByText('Policy record surfaced an unavailable dependency; verify by phone.')).toBeTruthy();
    expect(screen.getByText('queue pending acceptance')).toBeTruthy();
  });
});

describe('HandoffPanel failure copy', () => {
  it('announces a routed failure with the failed state pill', async () => {
    api.createHandoff.mockImplementationOnce(() =>
      Promise.reject(
        new api.BraidApiError('HANDOFF_FAILED', 'The queue target refused the handoff.', 502),
      ),
    );

    renderPanel();
    fireEvent.change(screen.getByLabelText('Queue target'), {
      target: { value: 'adjuster-queue' },
    });
    fireEvent.change(screen.getByLabelText('Escalation reason'), {
      target: { value: 'Rear door damage escalation needs a human reviewer.' },
    });
    fireEvent.click(routeButton());

    await waitFor(() => {
      expect(screen.getAllByText('Handoff failed').length).toBeGreaterThan(0);
    });
    expect(await screen.findByText('The queue target refused the handoff.')).toBeTruthy();
  });
});
