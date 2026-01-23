import { useEffect, useState } from "react";

// Default settings
const DEFAULT_SETTINGS = {
  themePrimary: "#5B21B6", // Tailwind purple-900
  themeSecondary: "#7C3AED", // Tailwind purple-700
  accentColor: "#D946EF",    // Tailwind fuchsia-500
  darkMode: false,
  fontSize: "16",
  fontFamily: "Inter",
  lineSpacing: "1.5",
  margin: "normal",
  pageMode: "scroll", // scroll or flip
};

function AdvancedSettingsPage() {
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem("ebookSettings");
    return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
  });

  // Apply settings and persist
  useEffect(() => {
    document.documentElement.style.setProperty("--theme-primary", settings.themePrimary);
    document.documentElement.style.setProperty("--theme-secondary", settings.themeSecondary);
    document.documentElement.style.setProperty("--accent-color", settings.accentColor);
    document.documentElement.classList.toggle("dark", settings.darkMode);
    localStorage.setItem("ebookSettings", JSON.stringify(settings));
  }, [settings]);

  const updateSetting = (key, value) => setSettings(prev => ({ ...prev, [key]: value }));

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <h2 className="text-3xl font-bold" style={{ color: settings.themePrimary }}>Advanced Settings</h2>

      {/* ================= Theme Colors ================= */}
      <section className="bg-white dark:bg-purple-600 rounded-lg p-6 shadow space-y-4">
        <h3 className="text-xl font-semibold">Theme Colors</h3>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-400">Primary Color</label>
            <input
              type="color"
              value={settings.themePrimary}
              onChange={(e) => updateSetting("themePrimary", e.target.value)}
              className="mt-1 w-full h-10 cursor-pointer"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-400">Secondary Color</label>
            <input
              type="color"
              value={settings.themeSecondary}
              onChange={(e) => updateSetting("themeSecondary", e.target.value)}
              className="mt-1 w-full h-10 cursor-pointer"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-400">Accent Color</label>
            <input
              type="color"
              value={settings.accentColor}
              onChange={(e) => updateSetting("accentColor", e.target.value)}
              className="mt-1 w-full h-10 cursor-pointer"
            />
          </div>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <input
            type="checkbox"
            checked={settings.darkMode}
            onChange={(e) => updateSetting("darkMode", e.target.checked)}
            className="cursor-pointer"
          />
          <span className="text-sm">Enable Dark Mode</span>
        </div>
      </section>

      {/* ================= Font Settings ================= */}
      <section className="bg-white dark:bg-purple-700 rounded-lg p-6 shadow space-y-4">
        <h3 className="text-xl font-semibold">Font & Reading</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-400">Font Family</label>
            <select
              value={settings.fontFamily}
              onChange={(e) => updateSetting("fontFamily", e.target.value)}
              className="mt-1 w-full border rounded p-2 "
            >
              <option value="Inter">Inter</option>
              <option value="Roboto">Roboto</option>
              <option value="Lato">Lato</option>
              <option value="Georgia">Georgia</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-400">Font Size (px)</label>
            <select
              value={settings.fontSize}
              onChange={(e) => updateSetting("fontSize", e.target.value)}
              className="mt-1 w-full border rounded p-2 "
            >
              <option value="14">14</option>
              <option value="16">16</option>
              <option value="18">18</option>
              <option value="20">20</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-400">Line Spacing</label>
            <select
              value={settings.lineSpacing}
              onChange={(e) => updateSetting("lineSpacing", e.target.value)}
              className="mt-1 w-full border rounded p-2 "
            >
              <option value="1.2">1.2</option>
              <option value="1.5">1.5</option>
              <option value="1.8">1.8</option>
              <option value="2">2</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-400">Margin</label>
            <select
              value={settings.margin}
              onChange={(e) => updateSetting("margin", e.target.value)}
              className="mt-1 w-full border rounded p-2 "
            >
              <option value="small">Small</option>
              <option value="normal">Normal</option>
              <option value="large">Large</option>
            </select>
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm text-gray-600 dark:text-gray-400">Page Mode</label>
          <select
            value={settings.pageMode}
            onChange={(e) => updateSetting("pageMode", e.target.value)}
            className="mt-1 w-full border rounded p-2 "
          >
            <option value="scroll">Scroll</option>
            <option value="flip">Page Flip</option>
          </select>
        </div>
      </section>

      <p className="text-sm text-gray-500">All settings are saved automatically in your browser and applied instantly.</p>
    </div>
  );
}

export default AdvancedSettingsPage;
