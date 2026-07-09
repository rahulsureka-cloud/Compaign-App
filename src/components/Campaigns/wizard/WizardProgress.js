import React from 'react';
import { WIZARD_STEPS } from '../campaignOptions';
import '../../../styles/wizard.css';

/**
 * Horizontal 5-step progress tracker (Setup → Content → Segment → Location →
 * Review). `current` is 1-based. Completed steps are clickable via onStepClick.
 */
export default function WizardProgress({ current, onStepClick }) {
  return (
    <div className="wizard-progress">
      {WIZARD_STEPS.map((label, i) => {
        const step = i + 1;
        const state = step < current ? 'done' : step === current ? 'active' : 'todo';
        return (
          <React.Fragment key={label}>
            <button
              type="button"
              className={`wp-step ${state}`}
              onClick={() => state === 'done' && onStepClick?.(step)}
              disabled={state === 'todo'}
            >
              <span className="wp-circle">{state === 'done' ? '✓' : step}</span>
              <span className="wp-label">{label}</span>
            </button>
            {step < WIZARD_STEPS.length && <span className={`wp-line ${step < current ? 'done' : ''}`} />}
          </React.Fragment>
        );
      })}
    </div>
  );
}
