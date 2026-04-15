import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const { status, points, feedback } = await req.json();

    const updateData: Record<string, unknown> = {};
    if (status) updateData.status = status;
    if (points !== undefined) updateData.points = points;
    if (feedback !== undefined) updateData.feedback = feedback;

    const { data: submission, error } = await supabase
      .from("submissions")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Update submission error:", error);
      return NextResponse.json(
        { error: "Failed to update submission" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      id: submission.id,
      userId: submission.user_id,
      weekNumber: submission.week_number,
      taskTitle: submission.task_title,
      proofUrl: submission.proof_url,
      description: submission.description,
      points: submission.points,
      status: submission.status,
      feedback: submission.feedback,
      createdAt: submission.created_at,
      updatedAt: submission.updated_at,
    });
  } catch (error) {
    console.error("Update submission error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
