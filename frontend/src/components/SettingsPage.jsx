import { useEffect, useState } from "react";

function SettingsPage(){
  const [theme, setTheme] = useState(localStorage.getItem("themeColor") || "#4f46e5");

  useEffect(() => {
    document.documentElement.style.setProperty("--theme", theme);
    localStorage.setItem("themeColor", theme);
  }, [theme]);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Settings</h2>
      <div className="space-y-2">
        <p className="text-gray-600">Pick primary theme color</p>
        <input type="color" value={theme} onChange={(e)=>setTheme(e.target.value)} />
      </div>
      <div className="text-sm text-gray-500">Theme is saved in your browser.</div>
    </div>
  )
}

export default SettingsPage;


