import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LogOut, BookOpen, Shield, HelpCircle, Search, ArrowLeft } from 'lucide-react';
import { ROLES } from '../constants';
import { Language } from '../types';
import Button from './Button';

interface RulesViewProps {
  onBack: () => void;
  language: Language;
}

const RulesView: React.FC<RulesViewProps> = ({ onBack, language }) => {
  const [activeTab, setActiveTab] = useState<'basics' | 'roles' | 'scoring'>('basics');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredRoles = Object.values(ROLES).filter(role => 
    role.names[language].toLowerCase().includes(searchTerm.toLowerCase()) || 
    role.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const TabButton = ({ id, label }: { id: typeof activeTab, label: string }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`px-4 py-2 rounded-lg text-sm font-heading font-bold transition-all ${
        activeTab === id 
          ? 'bg-royal-gold text-royal-dark shadow-lg' 
          : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
      }`}
    >
      {label}
    </button>
  );

  const getRoleName = (key: string) => {
      // Find role by key to ensure safety
      const role = Object.values(ROLES).find(r => r.id === key);
      return role ? role.names[language] : key;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="w-full max-w-4xl mx-auto h-[80vh] flex flex-col bg-slate-900/95 border border-royal-gold/20 rounded-2xl shadow-2xl backdrop-blur-xl overflow-hidden"
    >
      {/* Header */}
      <div className="p-6 border-b border-white/10 flex justify-between items-center bg-slate-900">
        <div className="flex items-center gap-3">
          <BookOpen className="text-royal-gold" />
          <h2 className="text-2xl font-heading font-bold text-white">Royal Decree</h2>
        </div>
        <Button variant="secondary" size="sm" onClick={onBack} className="flex gap-2">
           <ArrowLeft size={16} /> Go Back
        </Button>
      </div>

      {/* Tabs */}
      <div className="px-6 py-4 flex gap-2 border-b border-white/5 bg-slate-900/50 overflow-x-auto">
        <TabButton id="basics" label="Basics" />
        <TabButton id="roles" label="Roles & Strategy" />
        <TabButton id="scoring" label="Scoring" />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
        {activeTab === 'basics' && (
          <div className="space-y-6">
            <section className="bg-slate-800/50 p-6 rounded-xl border border-white/5">
              <h3 className="text-xl font-heading text-royal-gold mb-3">Objective</h3>
              <p className="text-slate-300 leading-relaxed">
                Royal Court is a game of hidden identities and deduction. Players are dealt secret roles. 
                The <strong>{getRoleName('Police')}</strong> must identify the <strong>{getRoleName('Chor')}</strong> to win points. 
                The <strong>{getRoleName('Raja')}</strong> maintains order, while other subjects try to survive the investigation.
              </p>
            </section>
            
            <section>
              <h3 className="text-xl font-heading text-white mb-4">Game Phases</h3>
              <div className="grid gap-4 md:grid-cols-2">
                {[
                  { title: '1. Distribution', desc: 'Roles are assigned secretly. Players view their cards.' },
                  { title: '2. The Reveal', desc: `The ${getRoleName('Raja')} reveals themselves first, followed by the ${getRoleName('Police')}.` },
                  { title: '3. Investigation', desc: `The ${getRoleName('Police')} must deduce who the ${getRoleName('Chor')} is from the remaining players.` },
                  { title: '4. Judgment', desc: `Police selects a suspect. If correct, Justice is served. If wrong, the Thief escapes.` }
                ].map((phase, i) => (
                  <div key={i} className="flex gap-4 p-4 bg-white/5 rounded-lg">
                    <div className="w-8 h-8 rounded-full bg-royal-gold/20 flex items-center justify-center text-royal-gold font-mono font-bold">
                      {i + 1}
                    </div>
                    <div>
                      <h4 className="font-bold text-white mb-1">{phase.title}</h4>
                      <p className="text-sm text-slate-400">{phase.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {activeTab === 'roles' && (
          <div className="space-y-4">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-3 text-slate-500" size={18} />
              <input 
                type="text" 
                placeholder="Search roles..." 
                className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-white focus:border-royal-gold outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="grid gap-4">
              {filteredRoles.map((role) => (
                <div key={role.id} className="flex flex-col md:flex-row gap-4 bg-slate-800/50 p-4 rounded-xl border border-white/5 hover:border-royal-gold/30 transition-colors">
                  <div className="flex items-center gap-4 md:w-1/3">
                    <div className="w-12 h-12 flex items-center justify-center bg-slate-700 rounded-full text-royal-gold font-bold font-mono text-lg">
                      {role.priority}
                    </div>
                    <div>
                      <div className="font-heading text-xl font-bold text-white">{role.names[language]}</div>
                      <div className="font-mono text-royal-gold text-sm">{role.points} PTS</div>
                    </div>
                  </div>
                  <div className="md:w-2/3 border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0 md:pl-4">
                    <p className="text-slate-300 mb-2">{role.description}</p>
                    <div className="bg-royal-gold/5 p-2 rounded text-xs text-royal-gold/80 font-mono">
                      <strong>Objective:</strong> {role.objective}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'scoring' && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-green-900/20 border border-green-500/30 p-6 rounded-xl">
                <h3 className="text-green-400 font-heading text-lg mb-4 flex items-center gap-2">
                  <Shield size={20} /> Justice Served
                </h3>
                <p className="text-slate-300 text-sm mb-4">If {getRoleName('Police')} correctly identifies the {getRoleName('Chor')}:</p>
                <ul className="space-y-2 text-sm">
                  <li className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-white">{getRoleName('Police')}</span>
                    <span className="font-mono text-green-400">+800</span>
                  </li>
                  <li className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-white">{getRoleName('Chor')}</span>
                    <span className="font-mono text-red-400">0</span>
                  </li>
                  <li className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-white">Others</span>
                    <span className="font-mono text-royal-gold">Retain Points</span>
                  </li>
                </ul>
              </div>

              <div className="bg-red-900/20 border border-red-500/30 p-6 rounded-xl">
                <h3 className="text-red-400 font-heading text-lg mb-4 flex items-center gap-2">
                  <HelpCircle size={20} /> Thief Escapes
                </h3>
                <p className="text-slate-300 text-sm mb-4">If {getRoleName('Police')} accuses the wrong person:</p>
                <ul className="space-y-2 text-sm">
                  <li className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-white">{getRoleName('Police')}</span>
                    <span className="font-mono text-red-400">0</span>
                  </li>
                  <li className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-white">{getRoleName('Chor')}</span>
                    <span className="font-mono text-green-400">+800</span>
                  </li>
                   <li className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-white">Others</span>
                    <span className="font-mono text-royal-gold">Retain Points</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="bg-blue-900/20 border border-blue-500/20 p-4 rounded-xl">
              <h4 className="text-blue-300 font-bold mb-2">Note on {getRoleName('Raja')}</h4>
              <p className="text-sm text-slate-400">The {getRoleName('Raja')} always scores <strong>2000 points</strong> regardless of the outcome, as long as they reveal themselves correctly at the start.</p>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default RulesView;
