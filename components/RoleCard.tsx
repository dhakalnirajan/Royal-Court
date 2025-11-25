import React from 'react';
import { motion } from 'framer-motion';
import { Crown, Shield, Scroll, Sword, Heart, Skull, Music, User, HelpCircle } from 'lucide-react';
import { RoleType, Language } from '../types';
import { ROLES } from '../constants';

interface RoleCardProps {
  role: RoleType;
  playerName: string;
  color?: string;
  isRevealed: boolean;
  isFlipped: boolean;
  onClick: () => void;
  small?: boolean;
  language: Language;
}

const RoleCard: React.FC<RoleCardProps> = ({ role, playerName, color = '#d4af37', isRevealed, isFlipped, onClick, small = false, language }) => {
  const roleDef = ROLES[role];
  const roleName = roleDef.names[language];

  const getIcon = (roleName: RoleType, size: number) => {
    const props = { size, className: "text-white drop-shadow-lg" };
    switch(roleName) {
      case 'Raja': return <Crown {...props} className="text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]" />;
      case 'Rani': return <Heart {...props} className="text-pink-500 drop-shadow-[0_0_10px_rgba(236,72,153,0.5)]" />;
      case 'Mantri': return <Scroll {...props} className="text-blue-400" />;
      case 'Senapati': return <Sword {...props} className="text-red-500" />;
      case 'Police': return <Shield {...props} className="text-cyan-400" />;
      case 'Courtesan': return <Music {...props} className="text-purple-400" />;
      case 'Praja': return <User {...props} className="text-gray-400" />;
      case 'Chor': return <Skull {...props} className="text-slate-200" />;
      default: return <HelpCircle {...props} />;
    }
  };

  const cardVariants = {
    hidden: { rotateY: 0, rotateX: 0 },
    visible: { rotateY: 180, rotateX: 0 },
    hover: { scale: 1.05, y: -5 }
  };

  return (
    <motion.div 
      className={`relative ${small ? 'w-24 h-32' : 'w-40 h-56 md:w-56 md:h-80'} perspective-1000 cursor-pointer group`} 
      onClick={onClick}
      whileHover={!isFlipped ? "hover" : ""}
      variants={cardVariants}
    >
      <motion.div
        className="w-full h-full relative transform-style-3d transition-transform duration-700 shadow-2xl"
        initial={false}
        animate={isFlipped ? "visible" : "hidden"}
        variants={cardVariants}
        transition={{ type: "spring", stiffness: 200, damping: 25 }}
      >
        {/* Front of Card (Face Down) */}
        <div className="absolute inset-0 backface-hidden bg-slate-900 rounded-xl overflow-hidden border-2 border-royal-gold/20 flex flex-col items-center justify-center p-4">
           {/* Geometric Pattern */}
           <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-royal-gold via-transparent to-transparent" />
           <div className="absolute inset-2 border border-royal-gold/10 rounded-lg" />
           
           <div 
            className="w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center mb-4 border-2 border-royal-gold/30 bg-slate-800 shadow-[0_0_15px_rgba(0,0,0,0.5)]"
            style={{ borderColor: color }}
           >
             <span className="font-heading text-2xl font-bold text-white">RC</span>
           </div>
           
           <p className="font-heading text-royal-gold/60 text-xs md:text-sm tracking-[0.2em] text-center mt-2 uppercase">
             {isRevealed ? "View Role" : "Tap Reveal"}
           </p>
           
           <div 
             className="absolute bottom-0 w-full py-2 text-center text-xs font-mono font-bold text-white bg-black/40 backdrop-blur-sm"
             style={{ borderTop: `1px solid ${color}` }}
           >
             {playerName}
           </div>
        </div>

        {/* Back of Card (Face Up) */}
        <div className="absolute inset-0 backface-hidden rotate-y-180 bg-gradient-to-br from-slate-800 to-black border-2 border-royal-gold rounded-xl flex flex-col items-center justify-center p-3 text-center overflow-hidden">
           {/* Role Background Effect */}
           <div className={`absolute top-0 left-0 w-full h-full opacity-20 bg-gradient-to-b from-transparent to-black pointer-events-none`} />
           
           <div className="relative z-10 flex flex-col items-center h-full justify-between py-2">
             <div className="mt-2 p-3 md:p-4 rounded-full bg-slate-900/80 border border-white/10 shadow-inner">
                {getIcon(role, small ? 24 : 48)}
             </div>
             
             <div>
               <h3 className="font-heading text-xl md:text-3xl font-bold text-white mb-1 drop-shadow-md">{roleName}</h3>
               <div className="text-royal-gold font-mono text-xs md:text-sm font-bold bg-royal-gold/10 px-2 py-0.5 rounded-full inline-block mb-1">
                 {roleDef.points} PTS
               </div>
             </div>

             {!small && (
               <div className="text-[10px] md:text-xs text-slate-400 px-2 font-body leading-tight border-t border-white/10 pt-2 opacity-80">
                 {roleDef.description}
               </div>
             )}
             
             <div className="w-full mt-2 pt-2 border-t border-white/5">
                <div 
                  className="inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-white bg-slate-800"
                  style={{ border: `1px solid ${color}` }}
                >
                  {playerName}
                </div>
             </div>
           </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default RoleCard;
