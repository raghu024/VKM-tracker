import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { v4 as uuid } from "uuid";

// Map snake_case DB row to camelCase for frontend
function mapSubmission(row: Record<string, unknown>) {
  return {
    id: row.id,
    userId: row.user_id,
    weekNumber: row.week_number,
    taskTitle: row.task_title,
    proofUrl: row.proof_url,
    description: row.description,
    points: row.points,
    status: row.status,
    feedback: row.feedback,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    // If user relation is included
    ...(row.users && typeof row.users === "object"
      ? { user: row.users }
      : {}),
  };
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const weekNumber = searchParams.get("week");

  let query = supabase
    .from("submissions")
    .select("*, users(name, email)")
    .order("created_at", { ascending: false });

  if (session.user.role !== "admin") {
    query = query.eq("user_id", session.user.id);
  }

  if (weekNumber) {
    query = query.eq("week_number", parseInt(weekNumber));
  }

  const { data, error } = await query;

  if (error) {
    console.error("Fetch submissions error:", error);
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }

  const mapped = (data || []).map(mapSubmission);
  return NextResponse.json(mapped);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const weekNumber = parseInt(formData.get("weekNumber") as string);
    const taskTitle = formData.get("taskTitle") as string;
    const description = formData.get("description") as string;
    const file = formData.get("proof") as File | null;

    if (!weekNumber || !taskTitle) {
      return NextResponse.json(
        { error: "Week number and task title are required" },
        { status: 400 }
      );
    }

    let proofUrl = "";

    if (file && file.size > 0) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const ext = path.extname(file.name) || ".bin";
      const filename = `${uuid()}${ext}`;
      const uploadDir = path.join(process.cwd(), "public", "uploads");

      await mkdir(uploadDir, { recursive: true });
      const filePath = path.join(uploadDir, filename);
      await writeFile(filePath, buffer);

      proofUrl = `/uploads/${filename}`;
    }

    const { data: submission, error } = await supabase
      .from("submissions")
      .insert({
        user_id: session.user.id,
        week_number: weekNumber,
        task_title: taskTitle,
        description: description || "",
        proof_url: proofUrl,
        status: "pending",
        points: 0,
      })
      .select()
      .single();

    if (error) {
      console.error("Submission insert error:", error);
      return NextResponse.json(
        { error: "Failed to create submission" },
        { status: 500 }
      );
    }

    return NextResponse.json(mapSubmission(submission), { status: 201 });
  } catch (error) {
    console.error("Submission error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
