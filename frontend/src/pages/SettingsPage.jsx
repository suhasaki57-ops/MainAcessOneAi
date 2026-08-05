import DashboardLayout from '../components/layout/DashboardLayout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import SelectField from '../components/forms/SelectField';
import { useSettings } from '../context/SettingsContext';
import { useTheme } from '../context/ThemeContext';
import { useNotification } from '../context/NotificationContext';
import { FiSettings, FiMoon, FiEye, FiZap, FiCheck, FiType } from 'react-icons/fi';

export const SettingsPage = () => {
  const { settings, updateSettings } = useSettings();
  const { themeMode, setThemeMode } = useTheme();
  const { addToast } = useNotification();

  const handleSave = () => {
    addToast({ message: 'Accessibility preferences saved successfully!', type: 'success' });
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6 max-w-3xl mx-auto">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Accessibility Preferences & Settings</h1>
          <p className="text-sm text-slate-400 mt-1">Configure interface modes, font scaling, high contrast, and reading options.</p>
        </div>

        {/* Theme Mode Selector */}
        <Card className="flex flex-col gap-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <FiMoon className="text-cyan-400 text-lg" />
            <h3 className="font-bold text-white text-sm">Appearance & Theme Mode</h3>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[
              { id: 'dark', label: 'Dark Mode' },
              { id: 'light', label: 'Light Mode' },
              { id: 'system', label: 'System Default' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setThemeMode(item.id);
                  updateSettings({ mode: item.id });
                }}
                className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-between transition-all ${
                  themeMode === item.id
                    ? 'border-cyan-500 bg-cyan-500/10 text-cyan-400 shadow-md'
                    : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-white'
                }`}
              >
                <span>{item.label}</span>
                {themeMode === item.id && <FiCheck className="text-sm" />}
              </button>
            ))}
          </div>
        </Card>

        {/* Font Scaling & Dyslexia Mode */}
        <Card className="flex flex-col gap-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <FiType className="text-cyan-400 text-lg" />
            <h3 className="font-bold text-white text-sm">Font & Typography Scaling</h3>
          </div>

          <SelectField
            label="Global Font Size"
            value={settings.fontSize}
            onChange={(e) => updateSettings({ fontSize: e.target.value })}
            options={[
              { value: 'small', label: 'Small (14px)' },
              { value: 'medium', label: 'Medium (16px - Standard)' },
              { value: 'large', label: 'Large (18px)' },
              { value: 'xlarge', label: 'Extra Large (20px)' },
            ]}
          />

          <label className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer">
            <div>
              <p className="text-xs font-semibold text-white">Dyslexia-Friendly Font Mode</p>
              <p className="text-[11px] text-slate-400">Uses high readability font spacing for enhanced comprehension.</p>
            </div>
            <input
              type="checkbox"
              checked={settings.dyslexiaFont}
              onChange={(e) => updateSettings({ dyslexiaFont: e.target.checked })}
              className="rounded bg-slate-800 border-slate-700 text-cyan-600 focus:ring-cyan-500 w-4 h-4"
            />
          </label>
        </Card>

        {/* High Contrast & Motion */}
        <Card className="flex flex-col gap-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <FiEye className="text-cyan-400 text-lg" />
            <h3 className="font-bold text-white text-sm">Visual & Motion Enhancements</h3>
          </div>

          <label className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer">
            <div>
              <p className="text-xs font-semibold text-white">High Contrast Mode</p>
              <p className="text-[11px] text-slate-400">Maximizes color contrast ratios to satisfy WCAG AAA standards.</p>
            </div>
            <input
              type="checkbox"
              checked={settings.highContrast}
              onChange={(e) => updateSettings({ highContrast: e.target.checked })}
              className="rounded bg-slate-800 border-slate-700 text-cyan-600 focus:ring-cyan-500 w-4 h-4"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer">
            <div>
              <p className="text-xs font-semibold text-white">Reduce Motion & Animations</p>
              <p className="text-[11px] text-slate-400">Disables parallax animations and smooth transitions.</p>
            </div>
            <input
              type="checkbox"
              checked={settings.reduceMotion}
              onChange={(e) => updateSettings({ reduceMotion: e.target.checked })}
              className="rounded bg-slate-800 border-slate-700 text-cyan-600 focus:ring-cyan-500 w-4 h-4"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer">
            <div>
              <p className="text-xs font-semibold text-white">Enhanced Keyboard Navigation Focus Rings</p>
              <p className="text-[11px] text-slate-400">Displays high-visibility outline rings on focused interactive elements.</p>
            </div>
            <input
              type="checkbox"
              checked={settings.keyboardNav}
              onChange={(e) => updateSettings({ keyboardNav: e.target.checked })}
              className="rounded bg-slate-800 border-slate-700 text-cyan-600 focus:ring-cyan-500 w-4 h-4"
            />
          </label>

          <Button onClick={handleSave} className="py-3 mt-2">
            Save Preferences
          </Button>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default SettingsPage;
