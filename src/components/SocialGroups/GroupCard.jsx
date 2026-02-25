
import React from 'react';
import { motion } from 'framer-motion';
import { Users, Calendar, Globe, Check, TrendingUp } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';

const GroupCard = ({ group, onClick }) => {
  // const navigate = useNavigate();
  
  const calculateMatchScore = () => {
    // Simplified matching algorithm
    return Math.floor(Math.random() * 30) + 70; // 70-100%
  };
  
  const matchScore = calculateMatchScore();
  
  // Use fetched image or fallback to a fast placeholder (avoiding Unsplash random which can be slow/rate-limited)
  const bgImage = group.image || "https://images.pexels.com/photos/210186/pexels-photo-210186.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=600&w=800";


  // Dummy Members Logic
  const members = (group.members && group.members.length > 0) 
    ? group.members 
    : Array.from({ length: 4 }).map((_, i) => ({
        userId: `dummy_${group.groupId}_${i}`,
        username: `Member ${i}`,
        avatar: `https://ui-avatars.com/api/?name=${group.name.substring(0,2)}+${i}&background=random&color=fff`
      }));

  return (
    <motion.div
      className="bg-black/40 backdrop-blur-md rounded-xl overflow-hidden border border-white/10 cursor-pointer transition-all duration-300 hover:border-blue-400/50 hover:bg-black/50 hover:shadow-xl h-full flex flex-col justify-between group"
      whileHover={{ y: -2 }}
      onClick={() => onClick(group.groupId)}
    >
      {/* Group Image - Compact */}
      <div className="h-24 overflow-hidden bg-white/5 relative">
        <img 
            src={bgImage} 
            alt={group.name} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
        />
        {/* Match Score Overlay */}
        {matchScore >= 70 && (
          <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-1.5 py-0.5 rounded text-[10px] font-bold text-green-400 border border-white/10 flex items-center gap-1 shadow-sm">
            <TrendingUp className="w-2.5 h-2.5" />
            <span>{matchScore}%</span>
          </div>
        )}
      </div>

      <div className="p-3 flex flex-col flex-grow">
        {/* Header */}
        <div className="mb-2">
            <div className="flex items-start justify-between gap-2">
                <h3 className="text-sm font-bold text-white leading-tight line-clamp-1 tracking-tight group-hover:text-blue-300 transition-colors" title={group.name}>
                    {group.name}
                </h3>
                {group.verified && (
                    <Check className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                )}
            </div>
            <p className="text-[10px] text-gray-400 font-medium mt-0.5">
                {group.memberCount} members • {group.upcomingMeetups?.length || 0} events
            </p>
        </div>
        
        {/* Description - Minimal */}
        <p className="text-gray-300 text-[11px] line-clamp-2 leading-relaxed mb-3 flex-grow font-light">{group.description}</p>
        
        {/* Footer Info */}
        <div className="flex items-center justify-between mt-auto pt-2 border-t border-white/10">
            {/* Members Stack */}
            <div className="flex items-center -space-x-1.5">
                {members.slice(0, 3).map((member) => (
                    <img
                    key={member.userId}
                    src={member.avatar || member.userAvatar}
                    alt={member.username}
                    className="w-5 h-5 rounded-full border border-black/50 object-cover bg-white/10"
                    />
                ))}
                 {(group.memberCount > 3) && (
                    <div className="w-5 h-5 rounded-full bg-white/10 border border-black/50 flex items-center justify-center text-[8px] font-bold text-gray-300">
                    +{group.memberCount - 3}
                    </div>
                )}
            </div>

            {/* Action */}
             <button 
                className="text-[10px] font-bold text-white bg-blue-600/80 hover:bg-blue-600 px-3 py-1 rounded-full transition-all border border-blue-500/30 shadow-lg shadow-blue-500/20"
                onClick={(e) => {
                    e.stopPropagation();
                    onClick(group.groupId, 'about'); 
                }}
            >
                Join
            </button>
        </div>
      </div>
    </motion.div>
  );
};

export default GroupCard;
