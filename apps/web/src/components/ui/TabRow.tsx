'use client';

/**
 * Accessible tab row from the frontend specification, section 19.
 *
 * Keyboard: arrow keys move between tabs, Home and End jump to the ends, and
 * Tab enters the active tab panel. The active tab uses the approved
 * background and text tone. Colours come from tokens only.
 */

import { useId, useState, type KeyboardEvent, type ReactNode } from 'react';

const TAB_LIST = 'flex flex-wrap gap-1 border-b border-[var(--border-default)] pb-2';

const TAB_BUTTON =
  'rounded-sm px-3 py-2 font-mono text-[0.6875rem] uppercase tracking-[0.08em] text-[var(--text-muted)] transition-colors duration-200 ease-out hover:text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]';

const ACTIVE_TAB_CLASSES = 'bg-[var(--accent)] text-[var(--bg-primary)]';

export interface TabDefinition {
  id: string;
  label: string;
  content: ReactNode;
}

export function TabRow({
  tabs,
  initialTab,
  label,
}: {
  tabs: TabDefinition[];
  initialTab?: string;
  label?: string;
}) {
  const [activeTabId, setActiveTabId] = useState(initialTab ?? tabs[0]?.id);
  const baseId = useId();

  if (tabs.length === 0) return null;

  const activeIndex = Math.max(
    0,
    tabs.findIndex((tab) => tab.id === activeTabId),
  );
  const activeTab = tabs[activeIndex];

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    let nextIndex: number | null = null;

    if (event.key === 'ArrowRight') nextIndex = (activeIndex + 1) % tabs.length;
    else if (event.key === 'ArrowLeft') nextIndex = (activeIndex - 1 + tabs.length) % tabs.length;
    else if (event.key === 'Home') nextIndex = 0;
    else if (event.key === 'End') nextIndex = tabs.length - 1;

    if (nextIndex !== null) {
      event.preventDefault();
      setActiveTabId(tabs[nextIndex].id);
      document.getElementById(`${baseId}-tab-${tabs[nextIndex].id}`)?.focus();
    }
  };

  return (
    <div>
      <div role="tablist" aria-label={label ?? 'Audit explorer views'} className={TAB_LIST}>
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab.id;
          return (
            <button
              key={tab.id}
              id={`${baseId}-tab-${tab.id}`}
              role="tab"
              type="button"
              aria-selected={isActive}
              aria-controls={`${baseId}-panel-${tab.id}`}
              tabIndex={isActive ? 0 : -1}
              onKeyDown={handleKeyDown}
              onClick={() => setActiveTabId(tab.id)}
              className={`${TAB_BUTTON} ${isActive ? ACTIVE_TAB_CLASSES : ''}`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
      <div
        id={`${baseId}-panel-${activeTab.id}`}
        role="tabpanel"
        aria-labelledby={`${baseId}-tab-${activeTab.id}`}
        tabIndex={0}
        className="pt-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
      >
        {activeTab.content}
      </div>
    </div>
  );
}
