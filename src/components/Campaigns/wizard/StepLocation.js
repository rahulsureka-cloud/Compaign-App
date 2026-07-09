import React from 'react';
import { WEB_LOCATIONS, MOBILE_LOCATIONS } from '../campaignOptions';
import '../../../styles/wizard.css';

/** Placement selection: which web and mobile surfaces the campaign appears on. */
export default function StepLocation({ form, patch }) {
  const toggle = (field, value) => {
    const list = form[field];
    patch({ [field]: list.includes(value) ? list.filter((v) => v !== value) : [...list, value] });
  };

  const LocationGroup = ({ title, field, options }) => (
    <div className="location-card">
      <h3>{title}</h3>
      <div className="location-options">
        {options.map((opt) => (
          <label key={opt} className="checkbox-row">
            <input
              type="checkbox"
              checked={form[field].includes(opt)}
              onChange={() => toggle(field, opt)}
            />
            {opt}
          </label>
        ))}
      </div>
    </div>
  );

  return (
    <div className="wizard-body">
      <h2>Location</h2>
      <p className="hint">Choose where this campaign is displayed on web and mobile.</p>
      <div className="location-columns">
        <LocationGroup title="Web location" field="webLocations" options={WEB_LOCATIONS} />
        <LocationGroup title="Mobile location" field="mobileLocations" options={MOBILE_LOCATIONS} />
      </div>
    </div>
  );
}
