import DashboardLayout from '../components/layout/DashboardLayout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import InputField from '../components/forms/InputField';
import SelectField from '../components/forms/SelectField';

export const Settings = () => {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6 max-w-3xl">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Platform Settings</h1>
          <p className="text-sm text-slate-400 mt-1">Configure speech engines, AI model preferences, and user options.</p>
        </div>

        <Card className="flex flex-col gap-4">
          <h3 className="font-bold text-white text-base border-b border-slate-800 pb-2">Speech & Accessibility</h3>

          <InputField label="Preferred Voice Rate" type="number" defaultValue="1.0" step="0.1" />

          <SelectField
            label="Default Text-to-Speech Engine"
            defaultValue="en-US-Standard-A"
            options={[
              { value: 'en-US-Standard-A', label: 'English (US) - Standard Voice A' },
              { value: 'en-GB-Standard-B', label: 'English (UK) - Standard Voice B' },
            ]}
          />
        </Card>

        <Card className="flex flex-col gap-4">
          <h3 className="font-bold text-white text-base border-b border-slate-800 pb-2">Google Gemini AI Engine</h3>

          <SelectField
            label="Gemini Model Selector"
            defaultValue="gemini-1.5-pro"
            options={[
              { value: 'gemini-1.5-pro', label: 'Gemini 1.5 Pro (Recommended)' },
              { value: 'gemini-1.5-flash', label: 'Gemini 1.5 Flash (Ultra Fast)' },
            ]}
          />
          <Button className="w-fit">Save Preferences</Button>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
