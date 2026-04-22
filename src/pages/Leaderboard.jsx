import { Trophy, Search, Star, Award, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLeaderboard } from '../hooks/useLeaderboard.js';
import { useState } from 'react';

const RANK_COLORS = {
  1: { text: 'text-[var(--color-rank-gold)]', bg: 'from-[var(--color-rank-gold)]/10', border: 'border-[var(--color-rank-gold)]/30', badge: 'bg-[var(--color-rank-gold)] text-[#5e4f00]', shadow: 'shadow-[0_0_20px_rgba(255,215,0,0.3)]' },
  2: { text: 'text-[var(--color-rank-silver)]', bg: 'from-[var(--color-rank-silver)]/10', border: 'border-[var(--color-rank-silver)]/30', badge: 'bg-[var(--color-rank-silver)] text-bg-primary', shadow: 'shadow-[0_0_15px_rgba(192,192,192,0.5)]' },
  3: { text: 'text-[var(--color-rank-bronze)]', bg: 'from-[var(--color-rank-bronze)]/10', border: 'border-[var(--color-rank-bronze)]/30', badge: 'bg-[var(--color-rank-bronze)] text-[#4a2e12]', shadow: 'shadow-[0_0_15px_rgba(205,127,50,0.6)]' },
};

export default function Leaderboard() {
  const { leaderboard, loading } = useLeaderboard();
  const [search, setSearch] = useState('');

  const topThree = leaderboard.slice(0, Math.min(3, leaderboard.length));
  const others = leaderboard.slice(3);
  const filtered = others.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.business.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center border border-gold/20">
            <Trophy className="text-gold" size={20} />
          </div>
          <div>
            <h1 className="text-2xl font-bold font-display text-text-primary">Leaderboard</h1>
            <p className="text-sm text-text-secondary">{leaderboard.length} participant{leaderboard.length !== 1 ? 's' : ''} · Batch 1 Rankings</p>
          </div>
        </div>

        {leaderboard.length > 4 && (
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search participants..."
              className="w-full sm:w-64 pl-9 pr-4 py-2 bg-bg-secondary border border-bg-tertiary rounded-xl text-sm focus:outline-none focus:border-gold/50 text-text-primary"
            />
          </div>
        )}
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <Loader2 className="text-gold animate-spin" size={32} />
          <p className="text-text-secondary text-sm">Fetching rankings...</p>
        </div>
      ) : (
        <>
          {/* Podium — only if 3+ users */}
          {topThree.length >= 3 ? (
            <div className="flex flex-col md:flex-row items-end justify-center gap-4 md:gap-6 pt-10 pb-6">
              {/* Rank 2 */}
              <PodiumCard user={topThree[1]} pos={2} key={topThree[1].id} delay={0.2} height="h-40" />
              {/* Rank 1 */}
              <PodiumCard user={topThree[0]} pos={1} key={topThree[0].id} delay={0.3} height="h-48" elevated />
              {/* Rank 3 */}
              <PodiumCard user={topThree[2]} pos={3} key={topThree[2].id} delay={0.1} height="h-36" />
            </div>
          ) : topThree.length > 0 ? (
            /* Fewer than 3 — show simple top cards */
            <div className="grid gap-4">
              {topThree.map((u, i) => (
                <TopUserCard key={u.id} user={u} pos={i + 1} />
              ))}
            </div>
          ) : (
            <div className="text-center py-24 text-text-secondary">
              No participants yet. Be the first to join!
            </div>
          )}

          {/* Rest of list */}
          {(others.length > 0 || (search && filtered.length === 0)) && (
            <div className="glass-strong rounded-3xl overflow-hidden mt-8">
              <div className="hidden sm:grid grid-cols-12 gap-4 p-4 border-b border-bg-tertiary text-xs font-semibold text-text-secondary uppercase tracking-wider bg-bg-secondary/50">
                <div className="col-span-1 text-center">Rank</div>
                <div className="col-span-5">Participant</div>
                <div className="col-span-3 text-center">Tasks</div>
                <div className="col-span-3 text-right pr-4">Points</div>
              </div>

              <div className="divide-y divide-bg-tertiary">
                {(search ? filtered : others).map((u, i) => (
                  <LeaderboardRow key={u.id} user={u} delay={0.05 * i} />
                ))}
                {search && filtered.length === 0 && (
                  <div className="text-center py-8 text-text-secondary text-sm">No results for "{search}"</div>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function PodiumCard({ user, pos, delay, height, elevated }) {
  const colors = RANK_COLORS[pos] || RANK_COLORS[3];
  const avatarSize = pos === 1 ? 'w-20 h-20' : 'w-16 h-16';
  const avatarTop = pos === 1 ? '-top-10' : '-top-8';

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={`flex-1 flex flex-col items-center relative w-full ${elevated ? 'md:-translate-y-8 z-20' : ''}`}
    >
      {pos === 1 && (
        <div className="absolute -top-16 text-gold drop-shadow-lg z-20">
          <Award size={32} />
        </div>
      )}
      <div className={`${avatarSize} rounded-full bg-bg-tertiary border-4 ${pos === 1 ? 'border-[var(--color-rank-gold)]' : 'border-bg-primary'} absolute ${avatarTop} z-10 overflow-hidden ${colors.shadow}`}>
        <img src={`https://ui-avatars.com/api/?name=${user.name}&background=374151&color=fff`} className="w-full h-full" alt={user.name} />
      </div>
      <div className={`w-full bg-gradient-to-t ${colors.bg} via-transparent border ${colors.border} ${pos === 1 ? 'rounded-t-3xl' : 'rounded-t-2xl'} ${height} pt-10 pb-4 px-2 text-center flex flex-col justify-between backdrop-blur-sm relative overflow-hidden`}>
        <div className="relative z-10">
          <p className={`font-bold ${colors.text} text-xs md:text-sm truncate`}>{user.name}</p>
          <p className="text-[10px] text-text-secondary truncate mt-0.5">{user.business}</p>
          {user.isCurrentUser && <span className="text-[9px] font-bold text-gold bg-gold/10 px-1.5 py-0.5 rounded-full mt-1 inline-block">YOU</span>}
        </div>
        <div className="relative z-10">
          <span className={`font-mono font-black ${pos === 1 ? 'text-3xl text-white' : 'text-xl text-text-primary'}`}>{user.points}</span>
          <span className="text-[10px] text-text-secondary ml-1">pts</span>
        </div>
      </div>
      <div className={`${colors.badge} font-black w-${pos === 1 ? '10 h-10 text-lg' : '8 h-8 text-sm'} rounded-full flex items-center justify-center absolute -bottom-${pos === 1 ? '5' : '4'} ${colors.shadow} z-10`}>
        {pos}
      </div>
    </motion.div>
  );
}

function TopUserCard({ user, pos }) {
  const colors = RANK_COLORS[pos] || RANK_COLORS[3];
  return (
    <div className={`flex items-center gap-4 p-4 rounded-2xl border bg-gradient-to-r ${colors.bg} to-transparent ${colors.border} ${user.isCurrentUser ? 'ring-1 ring-gold/40' : ''}`}>
      <span className={`text-2xl font-black font-display ${colors.text} w-8 text-center`}>#{pos}</span>
      <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-bg-tertiary">
        <img src={`https://ui-avatars.com/api/?name=${user.name}&background=374151&color=fff`} className="w-full h-full" alt={user.name} />
      </div>
      <div className="flex-1 min-w-0">
        <p className={`font-bold truncate ${user.isCurrentUser ? 'text-gold' : 'text-text-primary'}`}>
          {user.name} {user.isCurrentUser && <span className="text-xs">(You)</span>}
        </p>
        <p className="text-xs text-text-secondary truncate">{user.business}</p>
      </div>
      <div className="text-right">
        <p className={`font-mono font-bold text-xl ${colors.text}`}>{user.points}</p>
        <p className="text-xs text-text-secondary">pts</p>
      </div>
    </div>
  );
}

function LeaderboardRow({ user, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      className={`grid grid-cols-12 gap-4 p-4 items-center transition-colors hover:bg-bg-tertiary/30 border-l-4 ${user.isCurrentUser ? 'bg-gold/5 border-l-gold' : 'border-l-transparent'}`}
    >
      <div className="col-span-2 sm:col-span-1 text-center">
        <span className={`font-mono font-bold ${user.isCurrentUser ? 'text-gold text-lg' : 'text-text-secondary'}`}>#{user.rank}</span>
      </div>
      <div className="col-span-7 sm:col-span-5 flex items-center gap-3 min-w-0">
        <div className="w-10 h-10 rounded-full bg-bg-tertiary overflow-hidden flex-shrink-0 border border-bg-primary">
          <img src={`https://ui-avatars.com/api/?name=${user.name}&background=374151&color=fff`} className="w-full h-full" alt={user.name} />
        </div>
        <div className="min-w-0">
          <p className={`text-sm font-semibold truncate ${user.isCurrentUser ? 'text-gold' : 'text-text-primary'}`}>
            {user.isCurrentUser ? `${user.name} (You)` : user.name}
          </p>
          <p className="text-xs text-text-secondary truncate">{user.business}</p>
        </div>
      </div>
      <div className="hidden sm:col-span-3 sm:flex justify-center">
        <span className="bg-bg-primary/50 border border-bg-tertiary px-3 py-1 rounded-lg text-xs">
          <span className={user.isCurrentUser ? 'text-gold font-bold' : 'text-text-primary'}>{user.tasks_done}</span>
          <span className="text-text-secondary"> / {user.total}</span>
        </span>
      </div>
      <div className="col-span-3 flex items-center justify-end gap-1.5 pr-2">
        <Star size={14} className={user.points > 0 ? (user.isCurrentUser ? 'text-gold fill-gold' : 'text-success') : 'text-gray-600'} />
        <span className={`font-mono font-bold ${user.isCurrentUser ? 'text-gold text-base' : 'text-text-primary'}`}>{user.points}</span>
        <span className="text-xs text-text-secondary hidden sm:inline">pts</span>
      </div>
    </motion.div>
  );
}
