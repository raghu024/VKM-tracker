import Leaderboard from "@/components/Leaderboard";

export default function LeaderboardPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-gradient-gold mb-2 text-3xl font-bold">
          Leaderboard
        </h1>
        <p className="text-dark-400">
          See how you rank against other participants in the VK & SIP Mentorship
          Program
        </p>
      </div>

      {/* Legend */}
      <div className="mb-6 flex flex-wrap items-center justify-center gap-4 text-xs text-dark-400">
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded-full bg-gradient-to-r from-yellow-400 to-amber-500" />
          <span>1st Place</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded-full bg-gradient-to-r from-gray-300 to-gray-400" />
          <span>2nd Place</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded-full bg-gradient-to-r from-amber-600 to-amber-700" />
          <span>3rd Place</span>
        </div>
      </div>

      <Leaderboard />

      {/* Points Info */}
      <div className="card-dark mt-8 p-6">
        <h3 className="mb-3 font-semibold text-white">How Points Work</h3>
        <ul className="space-y-2 text-sm text-dark-300">
          <li className="flex items-start gap-2">
            <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gold-400" />
            Each week has 3 tasks worth up to 10 points each (30 points per week)
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gold-400" />
            Upload proof of implementation for each task to earn points
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gold-400" />
            Admins review your submissions and award points based on quality
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gold-400" />
            Maximum total points: 360 across all 12 weeks
          </li>
        </ul>
      </div>
    </div>
  );
}
