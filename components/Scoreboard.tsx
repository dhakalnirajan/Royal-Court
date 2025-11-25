import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, ChevronUp, ChevronDown, ArrowLeft } from 'lucide-react';
import { Player, ScoreData } from '../types';
import { STORAGE_KEY_SCORES } from '../constants';
import Button from './Button';

interface ScoreboardProps {
  currentPlayers: Player[];
  onBack: () => void;
}

type SortField = 'name' | 'totalScore' | 'roundsPlayed' | 'wins';

const Scoreboard: React.FC<ScoreboardProps> = ({ currentPlayers, onBack }) => {
  const [allScores, setAllScores] = useState<ScoreData[]>([]);
  const [viewMode, setViewMode] = useState<'current' | 'all'>('current');
  const [sortField, setSortField] = useState<SortField>('totalScore');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    // Load historical data
    try {
      const stored = localStorage.getItem(STORAGE_KEY_SCORES);
      if (stored) {
        setAllScores(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load scores", e);
    }
  }, []);

  // Merge current session into display data if in 'current' mode, 
  // or merge current into historical for 'all' mode (simulated for view)
  const displayData = viewMode === 'current' 
    ? currentPlayers.map(p => ({
        name: p.name,
        roundsPlayed: p.roundsPlayed,
        totalScore: p.score,
        wins: p.wins,
        lastPlayed: new Date().toISOString()
      }))
    : allScores;

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const sortedData = [...displayData].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <div className="w-4 h-4 opacity-0" />;
    return sortDirection === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-5xl mx-auto w-full bg-slate-900/90 border border-royal-gold/30 rounded-2xl p-8 shadow-2xl backdrop-blur-lg"
    >
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 border-b border-white/10 pb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-royal-gold/10 rounded-lg">
            <Trophy className="text-royal-gold" size={28} />
          </div>
          <div>
            <h2 className="text-3xl font-heading font-bold text-white">Royal Standings</h2>
            <p className="text-slate-400 text-sm">Hall of Fame</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 items-center justify-center">
          <div className="bg-slate-800 p-1 rounded-lg flex text-sm font-bold font-mono">
            <button 
              onClick={() => setViewMode('current')}
              className={`px-3 py-1.5 rounded ${viewMode === 'current' ? 'bg-royal-gold text-royal-dark' : 'text-slate-400 hover:text-white'}`}
            >
              Session
            </button>
            <button 
              onClick={() => setViewMode('all')}
              className={`px-3 py-1.5 rounded ${viewMode === 'all' ? 'bg-royal-gold text-royal-dark' : 'text-slate-400 hover:text-white'}`}
            >
              All Time
            </button>
          </div>
          
          <Button variant="secondary" size="sm" onClick={onBack} className="flex gap-2 items-center">
             <ArrowLeft size={16} /> Go Back
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-white/5">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-800/50 text-slate-300 font-mono text-xs uppercase tracking-wider">
              <th className="p-4 cursor-pointer hover:bg-white/5 transition-colors group" onClick={() => handleSort('name')}>
                <div className="flex items-center gap-2">Player <SortIcon field="name" /></div>
              </th>
              <th className="p-4 text-center cursor-pointer hover:bg-white/5 transition-colors group" onClick={() => handleSort('roundsPlayed')}>
                <div className="flex items-center justify-center gap-2">Rounds <SortIcon field="roundsPlayed" /></div>
              </th>
              <th className="p-4 text-center cursor-pointer hover:bg-white/5 transition-colors group" onClick={() => handleSort('wins')}>
                 <div className="flex items-center justify-center gap-2">Wins <SortIcon field="wins" /></div>
              </th>
              <th className="p-4 text-center">Win Rate</th>
              <th className="p-4 text-right cursor-pointer hover:bg-white/5 transition-colors group" onClick={() => handleSort('totalScore')}>
                 <div className="flex items-center justify-end gap-2">Score <SortIcon field="totalScore" /></div>
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedData.length === 0 ? (
               <tr><td colSpan={5} className="p-8 text-center text-slate-500">No records found. Start a game to make history!</td></tr>
            ) : (
              sortedData.map((data, idx) => {
                const winRate = data.roundsPlayed > 0 ? Math.round((data.wins / data.roundsPlayed) * 100) : 0;
                return (
                  <motion.tr 
                    key={idx} 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors"
                  >
                    <td className="p-4 font-bold text-white font-heading">
                      {idx === 0 && <span className="mr-2 text-yellow-400">👑</span>}
                      {data.name}
                    </td>
                    <td className="p-4 text-center text-slate-300 font-mono">{data.roundsPlayed}</td>
                    <td className="p-4 text-center text-slate-300 font-mono">{data.wins}</td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-16 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                          <div className="h-full bg-royal-gold" style={{ width: `${winRate}%` }} />
                        </div>
                        <span className="text-xs text-slate-400 font-mono w-8">{winRate}%</span>
                      </div>
                    </td>
                    <td className="p-4 text-right font-mono text-royal-gold text-lg font-bold">
                      {data.totalScore.toLocaleString()}
                    </td>
                  </motion.tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default Scoreboard;
