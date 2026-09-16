/**
 * Navigation contract. The brand pill, the primary nav targets, the skip link,
 * and the mobile section label are part of every route.
 */
import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';
import React from 'react';
import { cleanup, render, screen, within } from '@testing-library/react';

const pathnameHolder = vi.hoisted(() => ({ pathname: '/' }));

vi.mock('next/navigation', () => ({
  usePathname: () => pathnameHolder.pathname,
}));

vi.mock('next/link', () => ({
  default: (props: { href: string; children: React.ReactNode; className?: string }) =>
    React.createElement('a', { href: props.href, className: props.className }, props.children),
}));

import { Nav } from './Nav';

describe('Nav', () => {
  beforeEach(() => {
    pathnameHolder.pathname = '/';
  });

  afterEach(cleanup);

  it('renders the brand pill and primary nav targets', () => {
    render(React.createElement(Nav));
    expect(screen.getAllByRole('link', { name: 'Braid' }).length).toBe(2);
    expect(screen.getByRole('navigation', { name: 'Primary' })).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Conversation' })).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Cases' })).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Evaluations' })).toBeTruthy();
    expect(screen.getAllByRole('link', { name: 'Open a case' }).length).toBe(2);
  });

  it('renders the skip link', () => {
    render(React.createElement(Nav));
    expect(screen.getByRole('link', { name: 'Skip to content' })).toBeTruthy();
  });

  it('labels the mobile bar with the current section', () => {
    pathnameHolder.pathname = '/cases';
    render(React.createElement(Nav));
    const mobile = screen.getByRole('navigation', { name: 'Mobile primary' });
    expect(within(mobile).getByText('Cases')).toBeTruthy();
  });

  it('falls back to Overview for unknown paths', () => {
    pathnameHolder.pathname = '/nowhere';
    render(React.createElement(Nav));
    const mobile = screen.getByRole('navigation', { name: 'Mobile primary' });
    expect(within(mobile).getByText('Overview')).toBeTruthy();
  });
});
