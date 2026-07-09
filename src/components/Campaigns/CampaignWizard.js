import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { campaignApi, segmentApi } from '../../services/api';
import { emptyCampaign, WIZARD_STEPS } from './campaignOptions';
import WizardProgress from './wizard/WizardProgress';
import StepSetup from './wizard/StepSetup';
import StepSegment from './wizard/StepSegment';
import StepLocation from './wizard/StepLocation';
import StepReview from './wizard/StepReview';
import '../../styles/wizard.css';

export default function CampaignWizard() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [form, setForm] = useState(emptyCampaign());
  const [segments, setSegments] = useState([]);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const patch = (changes) => setForm((prev) => ({ ...prev, ...changes }));

  // GR-004: required Setup fields must be valid before leaving step 1 / submitting.
  const datesValid = form.startDate && form.endDate && form.endDate >= form.startDate;
  const setupValid = form.name.trim() !== '' && datesValid && form.channels.length > 0;

  useEffect(() => {
    segmentApi.getAll().then(setSegments).catch(() => setSegments([]));
  }, []);

  useEffect(() => {
    if (!isEdit) return;
    campaignApi
      .getAll()
      .then((all) => {
        const found = all.find((c) => c.id === id);
        if (found) setForm({ ...emptyCampaign(), ...found });
        else setError('Campaign not found.');
      })
      .catch((e) => setError(e.message));
  }, [id, isEdit]);

  const next = () => {
    if (step === 1 && !setupValid) return; // guarded by the disabled Next button too
    setError('');
    setStep((s) => Math.min(s + 1, WIZARD_STEPS.length));
  };
  const back = () => setStep((s) => Math.max(s - 1, 1));

  const save = async (status) => {
    if (!form.name.trim()) {
      setStep(1);
      setError('Campaign name is required.');
      return;
    }
    setSaving(true);
    setError('');
    const payload = { ...form, status };
    try {
      if (isEdit) await campaignApi.update(id, payload);
      else await campaignApi.create(payload);
      navigate('/campaigns');
    } catch (e) {
      setError(e.message);
      setSaving(false);
    }
  };

  return (
    <div className="wizard-page">
      <WizardProgress current={step} onStepClick={setStep} />

      <div className="panel wizard-panel">
        {error && <div className="error-banner">{error}</div>}

        {step === 1 && <StepSetup form={form} patch={patch} />}
        {step === 2 && <StepSegment form={form} patch={patch} segments={segments} />}
        {step === 3 && <StepLocation form={form} patch={patch} />}
        {step === 4 && <StepReview form={form} segments={segments} onEdit={setStep} />}
      </div>

      {step === 1 && !setupValid && (
        <p className="wizard-hint">
          Enter a campaign name, start &amp; end dates (end on or after start), and
          select at least one channel to continue.
        </p>
      )}

      <div className="wizard-footer">
        <button type="button" className="btn btn-outline" onClick={() => navigate('/campaigns')}>
          Cancel
        </button>
        <div className="footer-right">
          {step > 1 && (
            <button type="button" className="btn btn-outline" onClick={back}>Back</button>
          )}
          {step < WIZARD_STEPS.length && (
            <button
              type="button"
              className="btn btn-primary"
              onClick={next}
              disabled={step === 1 && !setupValid}
            >
              Next
            </button>
          )}
          {step === WIZARD_STEPS.length && (
            <button
              type="button"
              className="btn btn-primary"
              disabled={saving || !setupValid}
              onClick={() => save('Under approval')}
            >
              {saving ? 'Sending…' : 'Send for approval'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
