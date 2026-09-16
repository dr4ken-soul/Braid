/**
 * Badge label contract. State language is shared vocabulary across the web
 * console, so the mapped labels and tones are rendered and asserted here.
 */
import { describe, expect, it } from 'vitest';
import React from 'react';
import { render } from '@testing-library/react';
import { OutcomeBadge, RiskState, StatePill, type UiState } from '@braid/ui';

describe('StatePill labels', () => {
  const cases: Array<[UiState, string]> = [
    ['evidence-extracted', 'Evidence extracted'],
    ['contradiction-found', 'Contradiction found'],
    ['handoff-pending', 'Handoff pending'],
    ['handoff-accepted', 'Handoff accepted'],
    ['handoff-failed', 'Handoff failed'],
    ['unavailable', 'Unavailable'],
    ['stale', 'Stale'],
  ];

  it.each(cases)('renders %j as %j', (state, label) => {
    const { container } = render(React.createElement(StatePill, { state }));
    expect(container.textContent).toContain(label);
    expect(container.querySelector('.sr-only')?.textContent).toBe(`state: ${label}`);
  });
});

describe('OutcomeBadge labels', () => {
  it.each([
    ['allowed', 'Allowed'],
    ['blocked', 'Blocked'],
    ['failed', 'Failed'],
  ] as Array<['allowed' | 'blocked' | 'failed', string]>)(
    'renders a %j call as %j',
    (outcome, label) => {
      const { container } = render(React.createElement(OutcomeBadge, { outcome }));
      expect(container.textContent).toBe(label);
    },
  );
});

describe('RiskState', () => {
  it('renders its label and error tone by default', () => {
    const { container } = render(
      React.createElement(RiskState, { label: '1 open contradiction' }),
    );
    expect(container.textContent).toContain('1 open contradiction');
    expect(container.firstElementChild?.className).toContain('text-[var(--error)]');
  });

  it('renders a warning tone when configured', () => {
    const { container } = render(
      React.createElement(RiskState, { label: 'Medium severity', tone: 'warning' }),
    );
    expect(container.firstElementChild?.className).toContain('text-[var(--warning)]');
  });
});
