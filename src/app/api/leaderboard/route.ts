import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const users = await prisma.user.findMany({
    where: { role: "client" },
    select: {
      id: true,
      name: true,
      submissions: {
        where: { status: "approved" },
        select: {
          points: true,
          weekNumber: true,
        },
      },
    },
  });

  const leaderboard = users
    .map((user) => ({
      id: user.id,
      name: user.name,
      totalPoints: user.submissions.reduce((sum, s) => sum + s.points, 0),
      weeksCompleted: new Set(user.submissions.map((s) => s.weekNumber)).size,
      submissionCount: user.submissions.length,
    }))
    .sort((a, b) => b.totalPoints - a.totalPoints);

  return NextResponse.json(leaderboard);
}
