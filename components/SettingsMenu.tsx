import React from 'react';
import { motion } from 'framer-motion';
import { X, Volume2, Globe, Monitor, RotateCcw } from 'lucide-react';
import { Settings, Language } from '../types';

interface SettingsMenuProps {
  settings: Settings;
  onUpdate: (newSettings: Settings) => void;
  onClose: () => void;
  onResetData: () => void;
}

const SettingsMenu: React.FC<SettingsMenuProps> = ({ settings, onUpdate, onClose, onResetData }) => {
  
  const updateVolume = (type: 'masterVolume' | 'sfxVolume' | 'musicVolume', val: string) => {
    onUpdate({ ...settings, [type]: parseFloat(val) });
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-slate-900 border border-royal-gold/30 rounded-2xl p-6 w-full max-w-md shadow-2xl"
      >
        <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
          <h2 className="text-xl font-heading font-bold text-white flex items-center gap-2">
            <Monitor size={20} className="text-royal-gold" /> Settings
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-full transition-colors">
            <X size={24} className="text-slate-400 hover:text-white" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Language */}
          <div className="space-y-3">
            <label className="text-sm font-bold text-slate-400 flex items-center gap-2">
              <Globe size={16} /> LANGUAGE
            </label>
            <div className="flex bg-slate-800 p-1 rounded-lg">
              {(['NEPALI', 'ENGLISH'] as Language[]).map((lang) => (
                <button
                  key={lang}
                  onClick={() => onUpdate({ ...settings, language: lang })}
                  className={`flex-1 py-2 rounded-md text-sm font-bold transition-all ${
                    settings.language === lang 
                      ? 'bg-royal-gold text-royal-dark shadow-md' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {lang === 'NEPALI' ? 'Nepali (Raja)' : 'English (King)'}
                </button>
              ))}
            </div>
          </div>

          {/* Audio */}
          <div className="space-y-4">
            <label className="text-sm font-bold text-slate-400 flex items-center gap-2">
              <Volume2 size={16} /> AUDIO
            </label>
            
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-slate-500">
                <span>Master Volume</span>
                <span>{Math.round(settings.masterVolume * 100)}%</span>
              </div>
              <input 
                type="range" 
                min="0" max="1" step="0.1"
                value={settings.masterVolume}
                onChange={(e) => updateVolume('masterVolume', e.target.value)}
                className="w-full accent-royal-gold h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs text-slate-500">
                <span>Sound Effects</span>
                <span>{Math.round(settings.sfxVolume * 100)}%</span>
              </div>
              <input 
                type="range" 
                min="0" max="1" step="0.1"
                value={settings.sfxVolume}
                onChange={(e) => updateVolume('sfxVolume', e.target.value)}
                className="w-full accent-royal-gold h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>

          {/* Danger Zone */}
          <div className="pt-4 mt-4 border-t border-white/5">
             <button 
               onClick={() => {
                 if (confirm("Are you sure? This will delete all score history.")) {
                   onResetData();
                 }
               }}
               className="w-full py-3 border border-red-500/30 bg-red-900/10 text-red-400 hover:bg-red-900/30 rounded-lg text-sm font-bold transition-colors flex items-center justify-center gap-2"
             >
               <RotateCcw size={16} /> Reset Game Data
             </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SettingsMenu;
