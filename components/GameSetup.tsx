import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Play, Plus, Trash2, AlertCircle, Crown, Shield, Sword, Scroll, Key, Coins, Flag, Gem, ArrowLeft } from 'lucide-react';
import Button from './Button';
import { MIN_PLAYERS, MAX_PLAYERS, PLAYER_COLORS, PLAYER_ICONS, PLAYER_ICON_LABELS } from '../constants';
import { audioManager } from '../utils/audioManager';

interface GameSetupProps {
  onStart: (players: Array<{ name: string; color: string; icon: string }>) => void;
  onBack: () => void;
}

interface TempPlayer {
  id: string;
  name: string;
  color: string;
  icon: string;
}

// Icon Mapping
const IconMap: Record<string, React.ReactNode> = {
  Crown: <Crown size={18} />,
  Shield: <Shield size={18} />,
  Sword: <Sword size={18} />,
  Scroll: <Scroll size={18} />,
  Key: <Key size={18} />,
  Coins: <Coins size={18} />,
  Flag: <Flag size={18} />,
  Gem: <Gem size={18} />
};

const GameSetup: React.FC<GameSetupProps> = ({ onStart, onBack }) => {
  const [players, setPlayers] = useState<TempPlayer[]>([
    { id: '1', name: 'Player 1', color: PLAYER_COLORS[0], icon: 'Crown' },
    { id: '2', name: 'Player 2', color: PLAYER_COLORS[1], icon: 'Shield' },
    { id: '3', name: 'Player 3', color: PLAYER_COLORS[2], icon: 'Sword' },
    { id: '4', name: 'Player 4', color: PLAYER_COLORS[3], icon: 'Scroll' },
  ]);
  
  const [error, setError] = useState<string>('');

  const addPlayer = () => {
    if (players.length < MAX_PLAYERS) {
      const nextIndex = players.length;
      setPlayers([
        ...players, 
        { 
          id: Date.now().toString(), 
          name: `Player ${nextIndex + 1}`, 
          color: PLAYER_COLORS[nextIndex % PLAYER_COLORS.length], 
          icon: PLAYER_ICONS[nextIndex % PLAYER_ICONS.length] 
        }
      ]);
      setError('');
      audioManager.play('CLICK');
    }
  };

  const removePlayer = (index: number) => {
    if (players.length > MIN_PLAYERS) {
      const newPlayers = players.filter((_, i) => i !== index);
      setPlayers(newPlayers);
      audioManager.play('CLICK');
    }
  };

  const updatePlayer = (index: number, field: keyof TempPlayer, value: string) => {
    const newPlayers = [...players];
    newPlayers[index] = { ...newPlayers[index], [field]: value };
    setPlayers(newPlayers);
  };

  const validateAndStart = () => {
    if (players.some(p => !p.name.trim())) {
      setError('All subjects must have a name!');
      audioManager.play('FAILURE');
      return;
    }
    
    const names = players.map(p => p.name.trim().toLowerCase());
    if (new Set(names).size !== names.length) {
      setError('Names must be unique!');
      audioManager.play('FAILURE');
      return;
    }

    if (players.some(p => p.name.length > 20 || !/^[a-zA-Z0-9 _-]+$/.test(p.name))) {
       setError('Names must be 1-20 chars (Letters, Numbers, spaces, - _)');
       audioManager.play('FAILURE');
       return;
    }

    audioManager.play('SUCCESS');
    onStart(players);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 w-full h-[90vh] flex flex-col justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-slate-900/90 backdrop-blur-md border border-royal-gold/20 rounded-2xl p-6 md:p-8 shadow-2xl flex flex-col max-h-full"
      >
        <div className="flex justify-between items-start mb-6 border-b border-white/5 pb-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={onBack} className="!px-2 !py-2 sm:hidden border border-slate-700">
               <ArrowLeft size={20} />
            </Button>
            <div className="p-3 bg-royal-gold/10 rounded-lg hidden sm:block">
              <Users className="text-royal-gold" size={32} />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-heading font-bold text-white">Assemble Court</h2>
              <p className="text-slate-400 text-sm">{players.length} Players Ready</p>
            </div>
          </div>
          
          <Button variant="secondary" size="sm" onClick={onBack} className="hidden sm:flex">
             <ArrowLeft size={16} /> Go Back
          </Button>
        </div>

        {/* Player List */}
        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar mb-6 space-y-3">
          <AnimatePresence>
            {players.map((player, index) => (
              <motion.div 
                key={player.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, height: 0 }}
                className="flex flex-col md:flex-row gap-3 bg-slate-800/50 p-3 rounded-xl border border-white/5 hover:border-royal-gold/20 transition-all items-center"
              >
                {/* Number */}
                <span className="font-mono text-slate-600 text-sm w-6 hidden md:block">0{index + 1}</span>
                
                {/* Icon Selector */}
                <div className="relative group flex flex-col items-center gap-1 min-w-[60px]">
                   <button 
                     className="w-10 h-10 rounded-lg bg-slate-700 flex items-center justify-center text-royal-gold border border-transparent hover:border-royal-gold transition-colors"
                     onClick={() => {
                        const currentIconIdx = PLAYER_ICONS.indexOf(player.icon);
                        const nextIcon = PLAYER_ICONS[(currentIconIdx + 1) % PLAYER_ICONS.length];
                        updatePlayer(index, 'icon', nextIcon);
                     }}
                   >
                      {IconMap[player.icon] || <Users size={18} />}
                   </button>
                   <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                     {PLAYER_ICON_LABELS[player.icon]}
                   </span>
                </div>

                {/* Name Input */}
                <div className="flex-1 w-full">
                  <input
                    type="text"
                    value={player.name}
                    onChange={(e) => updatePlayer(index, 'name', e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:border-royal-gold focus:ring-1 focus:ring-royal-gold outline-none transition-all font-body text-sm md:text-base"
                    placeholder="Enter Alias"
                    maxLength={20}
                  />
                </div>

                {/* Color & Controls */}
                <div className="flex items-center gap-3 justify-between w-full md:w-auto">
                   {/* Color Picker */}
                   <div className="flex gap-1 justify-center md:justify-start">
                     {PLAYER_COLORS.slice(0, 5).map(c => (
                        <button
                          key={c}
                          onClick={() => updatePlayer(index, 'color', c)}
                          className={`w-6 h-6 rounded-full border-2 transition-transform ${player.color === c ? 'border-white scale-110' : 'border-transparent opacity-40 hover:opacity-100'}`}
                          style={{ backgroundColor: c }}
                        />
                     ))}
                   </div>
                   
                   {players.length > MIN_PLAYERS && (
                     <button 
                       onClick={() => removePlayer(index)}
                       className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-colors ml-2"
                     >
                       <Trash2 size={16} />
                     </button>
                   )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Footer Actions */}
        <div className="border-t border-white/10 pt-6">
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 text-red-400 text-sm mb-4 justify-center bg-red-900/10 p-2 rounded-lg"
            >
              <AlertCircle size={16} /> {error}
            </motion.div>
          )}

          <div className="flex gap-4">
            <Button 
              variant="ghost" 
              onClick={addPlayer}
              disabled={players.length >= MAX_PLAYERS}
              className="flex-1 border-dashed border border-slate-600 text-slate-400 hover:text-white hover:border-white"
            >
              <Plus size={18} /> Add Subject
            </Button>
            
            <Button 
              variant="primary" 
              onClick={validateAndStart}
              className="flex-[2] shadow-lg shadow-royal-gold/20"
            >
               Start Game <Play size={18} />
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default GameSetup;
