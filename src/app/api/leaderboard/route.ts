import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  // Get all client users
  const { data: users, error: usersError } = await supabase
    .from("users")
    .select("id, name")
    .eq("role", "client");

  if (usersError) {
    console.error("Leaderboard users error:", usersError);
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }

  // Get all approved submissions
  const { data: submissions, error: subError } = await supabase
    .from("submissions")
    .select("user_id, points, week_number")
    .eq("status", "approved");

  if (subError) {
    console.error("Leaderboard submissions error:", subError);
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }

  const leaderboard = (users || [])
    .map((user) => {
      const userSubs = (submissions || []).filter(
        (s) => s.user_id === user.id
      );
      return {
        id: user.id,
        name: user.name,
        totalPoints: userSubs.reduce((sum, s) => sum + s.points, 0),
        weeksCompleted: new Set(userSubs.map((s) => s.week_number)).size,
        submissionCount: userSubs.length,
      };
    })
    .sort((a, b) => b.totalPoints - a.totalPoints);

  return NextResponse.json(leaderboard);
}
