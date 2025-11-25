import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Crown, Trophy, BookOpen, LogOut, Settings as SettingsIcon } from 'lucide-react';
import confetti from 'canvas-confetti';

import Background from './components/Background';
import Button from './components/Button';
import GameSetup from './components/GameSetup';
import RoleCard from './components/RoleCard';
import RulesView from './components/RulesView';
import Scoreboard from './components/Scoreboard';
import SettingsMenu from './components/SettingsMenu';

import { Player, GameState, RoleType, View, ScoreData, Settings } from './types';
import { ROLES, STORAGE_KEY_SCORES, DEFAULT_SETTINGS } from './constants';
import { audioManager } from './utils/audioManager';

const App: React.FC = () => {
  // --- State ---
  const [view, setView] = useState<View>('LANDING');
  const [isAuthed, setIsAuthed] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  
  const [gameState, setGameState] = useState<GameState>({
    phase: 'SETUP',
    players: [],
    currentRound: 1,
    policeId: null,
    chorId: null,
    rajaId: null,
    message: ''
  });

  const [revealedCardId, setRevealedCardId] = useState<string | null>(null);
  const [selectedSuspectId, setSelectedSuspectId] = useState<string | null>(null);
  const [sessionScores, setSessionScores] = useState<Record<string, ScoreData>>({});
  
  // --- Effects ---
  useEffect(() => {
    const authed = localStorage.getItem('isAuthed');
    if (authed) setIsAuthed(true);
    
    // Load settings
    const savedSettings = localStorage.getItem('royalCourtSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  useEffect(() => {
    // Apply audio settings
    audioManager.setVolumes(settings.masterVolume, settings.sfxVolume, settings.musicVolume);
    localStorage.setItem('royalCourtSettings', JSON.stringify(settings));
  }, [settings]);

  // --- Logic ---

  const getRolesForCount = (count: number): RoleType[] => {
    // Core Roles
    const roles: RoleType[] = ['Raja', 'Police', 'Chor', 'Rani'];
    
    if (count >= 5) roles.push('Mantri');
    if (count >= 6) roles.push('Senapati');
    if (count >= 7) roles.push('Courtesan');
    if (count >= 8) roles.push('Praja');
    
    return roles;
  };

  const shuffleArray = <T,>(array: T[]): T[] => {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  const updatePersistentScores = (players: Player[]) => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_SCORES);
      let allScores: ScoreData[] = stored ? JSON.parse(stored) : [];
      
      players.forEach(p => {
        const existingIdx = allScores.findIndex(s => s.name === p.name);
        if (existingIdx >= 0) {
          allScores[existingIdx] = {
            ...allScores[existingIdx],
            roundsPlayed: allScores[existingIdx].roundsPlayed + 1,
            totalScore: allScores[existingIdx].totalScore + (p.score - (sessionScores[p.name]?.totalScore || 0)), // diff
            wins: allScores[existingIdx].wins + (p.wins > (sessionScores[p.name]?.wins || 0) ? 1 : 0),
            lastPlayed: new Date().toISOString()
          };
        } else {
          allScores.push({
            name: p.name,
            roundsPlayed: 1,
            totalScore: p.score,
            wins: p.wins,
            lastPlayed: new Date().toISOString()
          });
        }
      });
      
      localStorage.setItem(STORAGE_KEY_SCORES, JSON.stringify(allScores));
      
      // Update session tracking
      const newSession: Record<string, ScoreData> = {};
      players.forEach(p => {
        newSession[p.name] = {
           name: p.name,
           roundsPlayed: p.roundsPlayed,
           totalScore: p.score,
           wins: p.wins,
           lastPlayed: new Date().toISOString()
        };
      });
      setSessionScores(newSession);

    } catch (e) {
      console.error("Save failed", e);
    }
  };

  // --- Handlers ---

  const handleAuth = () => {
    localStorage.setItem('isAuthed', 'true');
    setIsAuthed(true);
    audioManager.play('CLICK');
  };

  const startGame = (setupPlayers: Array<{ name: string; color: string; icon: string }>) => {
    const rolesToAssign = shuffleArray(getRolesForCount(setupPlayers.length));
    
    const newPlayers: Player[] = setupPlayers.map((p, index) => ({
      id: `p-${index}`,
      name: p.name,
      color: p.color,
      icon: p.icon,
      role: rolesToAssign[index],
      score: 0,
      roundsPlayed: 0,
      wins: 0,
      isRevealed: false,
      isPubliclyRevealed: false
    }));

    const police = newPlayers.find(p => p.role === 'Police');
    const chor = newPlayers.find(p => p.role === 'Chor');
    const raja = newPlayers.find(p => p.role === 'Raja');

    setGameState({
      phase: 'DISTRIBUTION',
      players: newPlayers,
      currentRound: 1,
      policeId: police?.id || null,
      chorId: chor?.id || null,
      rajaId: raja?.id || null,
      message: 'Pass the device. Tap to secretly view your role.'
    });

    setView('GAME');
    audioManager.play('GAME_START');
  };

  const handleCardClick = (playerId: string) => {
    audioManager.play('CARD_FLIP');
    
    if (gameState.phase === 'DISTRIBUTION') {
      if (revealedCardId === playerId) {
        setRevealedCardId(null);
        setGameState(prev => ({
          ...prev,
          players: prev.players.map(p => p.id === playerId ? { ...p, isRevealed: true } : p)
        }));
      } else {
        setRevealedCardId(playerId);
      }
    }
  };

  const finishDistribution = () => {
    setRevealedCardId(null);
    setGameState(prev => ({
      ...prev,
      phase: 'REVEAL_RAJA',
      message: `The Court is in session. ${ROLES.Raja.names[settings.language]}, reveal yourself!`
    }));
    audioManager.play('CLICK');
  };

  const revealRaja = () => {
    if (gameState.phase !== 'REVEAL_RAJA') return;
    
    audioManager.play('SUCCESS');
    setGameState(prev => ({
      ...prev,
      players: prev.players.map(p => p.id === prev.rajaId ? { ...p, isPubliclyRevealed: true } : p),
      phase: 'REVEAL_POLICE',
      message: `${ROLES.Raja.names[settings.language]} Revealed! Now, ${ROLES.Police.names[settings.language]}, show your badge!`
    }));
    
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 }, colors: ['#d4af37'] });
  };

  const revealPolice = () => {
    if (gameState.phase !== 'REVEAL_POLICE') return;
    
    audioManager.play('SUCCESS');
    setGameState(prev => ({
      ...prev,
      players: prev.players.map(p => p.id === prev.policeId ? { ...p, isPubliclyRevealed: true } : p),
      phase: 'GUESSING',
      message: `${ROLES.Police.names[settings.language]}, identify the ${ROLES.Chor.names[settings.language]}! Select a suspect.`
    }));
  };

  const handleSuspectSelect = (suspectId: string) => {
    if (gameState.phase !== 'GUESSING') return;
    const suspect = gameState.players.find(p => p.id === suspectId);
    if (suspect?.isPubliclyRevealed || suspectId === gameState.policeId) return;
    
    setSelectedSuspectId(suspectId);
    audioManager.play('CLICK');
  };

  const confirmGuess = () => {
    if (!selectedSuspectId) return;

    const isCorrect = selectedSuspectId === gameState.chorId;
    let resultMessage = '';

    const updatedPlayers = gameState.players.map(p => {
      let roundPoints = 0;
      let isWinner = false;
      
      if (p.role === 'Chor') {
        if (isCorrect) roundPoints = 0;
        else {
           roundPoints = 800; // Bonus
           isWinner = true;
        }
      } else if (p.role === 'Police') {
        if (isCorrect) {
          roundPoints = 800;
          isWinner = true;
        }
        else roundPoints = 0;
      } else if (p.role) {
        // Others retain points
        roundPoints = ROLES[p.role].points;
        if (roundPoints > 0) isWinner = true;
      }

      return {
        ...p,
        score: p.score + roundPoints,
        roundsPlayed: p.roundsPlayed + 1,
        wins: p.wins + (isWinner ? 1 : 0),
        isPubliclyRevealed: true
      };
    });

    const chorName = updatedPlayers.find(p => p.id === gameState.chorId)?.name;

    if (isCorrect) {
      resultMessage = `Justice Served! The ${ROLES.Chor.names[settings.language]} was ${chorName}.`;
      audioManager.play('SUCCESS');
      confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 }, colors: ['#3182ce', '#d4af37'] });
    } else {
      resultMessage = `The ${ROLES.Chor.names[settings.language]} Escapes! It was ${chorName}.`;
      audioManager.play('FAILURE');
    }

    setGameState({
      ...gameState,
      players: updatedPlayers,
      phase: 'ROUND_END',
      message: resultMessage
    });

    updatePersistentScores(updatedPlayers);
  };

  const nextRound = () => {
    const names = gameState.players.map(p => ({ name: p.name, color: p.color, icon: p.icon }));
    const rolesToAssign = shuffleArray(getRolesForCount(names.length));

    const newPlayers = gameState.players.map((p, index) => ({
      ...p,
      role: rolesToAssign[index],
      isRevealed: false,
      isPubliclyRevealed: false
    }));

     const police = newPlayers.find(p => p.role === 'Police');
    const chor = newPlayers.find(p => p.role === 'Chor');
    const raja = newPlayers.find(p => p.role === 'Raja');

    setGameState({
      phase: 'DISTRIBUTION',
      players: newPlayers,
      currentRound: gameState.currentRound + 1,
      policeId: police?.id || null,
      chorId: chor?.id || null,
      rajaId: raja?.id || null,
      message: 'New Round! Tap to view your new role.'
    });
    
    setRevealedCardId(null);
    setSelectedSuspectId(null);
    audioManager.play('GAME_START');
  };

  // --- Render ---

  if (!isAuthed) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
        <Background />
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-slate-900/90 border border-royal-gold/30 p-8 rounded-2xl text-center shadow-2xl backdrop-blur-sm"
        >
          <Crown className="w-16 h-16 mx-auto text-royal-gold mb-6" />
          <h1 className="font-heading text-4xl font-bold text-white mb-2">ROYAL COURT</h1>
          <p className="font-mono text-royal-gold/60 text-sm mb-8 tracking-[0.2em]">ACCESS RESTRICTED</p>
          <Button onClick={handleAuth} className="w-full">Enter Court</Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-slate-200 font-body relative overflow-hidden flex flex-col">
      <Background />
      
      {/* Settings Modal */}
      <AnimatePresence>
        {showSettings && (
          <SettingsMenu 
            settings={settings}
            onUpdate={setSettings}
            onClose={() => setShowSettings(false)}
            onResetData={() => {
              localStorage.removeItem(STORAGE_KEY_SCORES);
              setSessionScores({});
              setShowSettings(false);
            }}
          />
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="p-4 border-b border-white/5 bg-slate-900/50 backdrop-blur-sm flex justify-between items-center sticky top-0 z-50 h-16">
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setView('LANDING')}>
          <div className="w-10 h-10 bg-royal-gold rounded-lg flex items-center justify-center shadow-[0_0_10px_rgba(212,175,55,0.4)] group-hover:scale-105 transition-transform">
             <Crown className="text-royal-dark w-6 h-6" />
          </div>
          <span className="font-heading font-bold text-xl tracking-wider text-white hidden sm:block">ROYAL COURT</span>
        </div>
        
        {view === 'GAME' && (
           <div className="font-mono text-royal-gold text-xs sm:text-sm border border-royal-gold/30 px-3 py-1 rounded-full bg-royal-gold/5 flex items-center gap-2">
             <span>ROUND {gameState.currentRound}</span>
             <span className="w-1 h-1 bg-white rounded-full opacity-50"></span>
             <span>{gameState.phase.replace('_', ' ')}</span>
           </div>
        )}

        <div className="flex gap-2">
           <button onClick={() => setShowSettings(true)} className="p-2 hover:bg-white/10 rounded-lg transition-colors" title="Settings">
             <SettingsIcon size={20} className="text-slate-400 hover:text-white" />
           </button>
           
          {view === 'GAME' && (
             <button onClick={() => setView('SCOREBOARD')} className="p-2 hover:bg-white/10 rounded-lg transition-colors" title="Scoreboard">
               <Trophy size={20} className="text-royal-gold" />
             </button>
          )}
          
          {view === 'GAME' && (
            <button onClick={() => setView('RULES')} className="p-2 hover:bg-white/10 rounded-lg transition-colors" title="Rules">
              <BookOpen size={20} />
            </button>
          )}
          
          {view !== 'LANDING' && view !== 'SETUP' && (
            <button 
              onClick={() => {
                if (view === 'GAME' && !confirm("Quit game in progress?")) return;
                setView('LANDING');
              }} 
              className="p-2 hover:bg-white/10 rounded-lg transition-colors text-red-400" 
              title="Exit"
            >
               <LogOut size={20} />
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto p-4 flex flex-col relative z-10 overflow-hidden">
        <AnimatePresence mode='wait'>
          
          {/* LANDING VIEW */}
          {view === 'LANDING' && (
            <motion.div 
              key="landing"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center justify-center flex-1 text-center"
            >
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="mb-8 relative"
              >
                <div className="absolute inset-0 bg-royal-gold/20 blur-3xl rounded-full" />
                <h1 className="relative font-heading text-6xl md:text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-royal-gold via-yellow-100 to-yellow-600 drop-shadow-2xl">
                  {settings.language === 'HINDI' ? 'RAJA MANTRI' : 'ROYAL COURT'}
                </h1>
              </motion.div>
              
              <p className="max-w-xl text-slate-300 text-lg md:text-xl mb-12 font-light tracking-wide">
                A high-stakes game of deduction, deception, and royalty. 
                <br /><span className="text-royal-gold font-mono text-sm mt-2 block">4 - 8 PLAYERS</span>
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 w-full max-w-md">
                <Button size="lg" onClick={() => setView('SETUP')} className="flex-1">Start New Game</Button>
                <Button size="lg" variant="secondary" onClick={() => setView('RULES')} className="flex-1">How to Play</Button>
              </div>

              <div className="mt-8 text-slate-500 text-sm hover:text-royal-gold cursor-pointer transition-colors" onClick={() => setView('SCOREBOARD')}>
                 View Hall of Fame
              </div>
            </motion.div>
          )}

          {/* SETUP VIEW */}
          {view === 'SETUP' && (
            <GameSetup 
              key="setup" 
              onStart={startGame} 
              onBack={() => setView('LANDING')} 
            />
          )}

          {/* GAME VIEW */}
          {view === 'GAME' && (
            <motion.div 
              key="game"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col h-full"
            >
              {/* Game Status Message */}
              <div className="text-center mb-6 mt-2 relative">
                 <h2 className="font-heading text-xl md:text-3xl text-white mb-2 drop-shadow-lg px-4">
                   {gameState.message}
                 </h2>
                 <div className="h-0.5 w-32 bg-gradient-to-r from-transparent via-royal-gold to-transparent mx-auto" />
              </div>

              {/* Card Grid */}
              <div className="flex-1 flex items-center justify-center py-4">
                <div className={`grid ${gameState.players.length > 6 ? 'grid-cols-4' : 'grid-cols-2 md:grid-cols-3'} gap-4 md:gap-8`}>
                  {gameState.players.map((player) => {
                    let isFlipped = false;
                    if (gameState.phase === 'ROUND_END') isFlipped = true;
                    else if (player.isPubliclyRevealed) isFlipped = true;
                    else if (gameState.phase === 'DISTRIBUTION' && revealedCardId === player.id) isFlipped = true;

                    const isSelected = selectedSuspectId === player.id;

                    return (
                      <div key={player.id} className="relative flex flex-col items-center">
                         <RoleCard 
                            role={player.role!} 
                            playerName={player.name}
                            color={player.color}
                            isRevealed={player.isRevealed}
                            isFlipped={isFlipped}
                            small={gameState.players.length > 6}
                            language={settings.language}
                            onClick={() => {
                              if (gameState.phase === 'DISTRIBUTION') handleCardClick(player.id);
                              else if (gameState.phase === 'GUESSING') handleSuspectSelect(player.id);
                            }}
                         />
                         
                         {/* Action Buttons below cards based on phase */}
                         <div className="absolute -bottom-14 left-0 w-full flex justify-center z-20 pointer-events-none">
                            <div className="pointer-events-auto">
                              {gameState.phase === 'REVEAL_RAJA' && player.id === gameState.rajaId && !player.isPubliclyRevealed && (
                                <Button size="sm" onClick={revealRaja}>I am {ROLES.Raja.names[settings.language]}</Button>
                              )}
                              {gameState.phase === 'REVEAL_POLICE' && player.id === gameState.policeId && !player.isPubliclyRevealed && (
                                <Button size="sm" onClick={revealPolice}>I am {ROLES.Police.names[settings.language]}</Button>
                              )}
                              {gameState.phase === 'GUESSING' && isSelected && (
                                <div className="flex flex-col items-center gap-1 animate-in fade-in zoom-in duration-200">
                                  <div className="text-red-400 font-bold text-[10px] uppercase animate-pulse">Suspect Selected</div>
                                  <Button size="sm" variant="danger" onClick={confirmGuess}>Accuse</Button>
                                </div>
                              )}
                            </div>
                         </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Bottom Controls */}
              <div className="mt-auto pt-4 flex justify-center pb-8 h-20">
                 {gameState.phase === 'DISTRIBUTION' && (
                   <Button 
                    onClick={finishDistribution} 
                    disabled={!gameState.players.every(p => p.isRevealed)}
                    variant={gameState.players.every(p => p.isRevealed) ? 'primary' : 'secondary'}
                   >
                     {gameState.players.every(p => p.isRevealed) ? "Begin Round" : "Waiting for all to view..."}
                   </Button>
                 )}
                 {gameState.phase === 'ROUND_END' && (
                   <div className="flex gap-4">
                     <Button variant="secondary" onClick={() => setView('SCOREBOARD')}>Scores</Button>
                     <Button onClick={nextRound}>Next Round</Button>
                   </div>
                 )}
              </div>
            </motion.div>
          )}

          {/* RULES VIEW */}
          {view === 'RULES' && (
            <RulesView key="rules" onBack={() => setView(gameState.phase === 'SETUP' ? 'LANDING' : 'GAME')} language={settings.language} />
          )}

          {/* SCOREBOARD VIEW */}
          {view === 'SCOREBOARD' && (
             <Scoreboard 
               key="scoreboard" 
               currentPlayers={gameState.players} 
               onBack={() => setView(gameState.players.length > 0 ? 'GAME' : 'LANDING')} 
             />
          )}

        </AnimatePresence>
      </main>
    </div>
  );
};

export default App;
