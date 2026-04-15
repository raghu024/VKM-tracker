import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { v4 as uuid } from "uuid";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const weekNumber = searchParams.get("week");

  const where: Record<string, unknown> = {};

  if (session.user.role !== "admin") {
    where.userId = session.user.id;
  }

  if (weekNumber) {
    where.weekNumber = parseInt(weekNumber);
  }

  const submissions = await prisma.submission.findMany({
    where,
    include: { user: { select: { name: true, email: true } } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(submissions);
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

    const submission = await prisma.submission.create({
      data: {
        userId: session.user.id,
        weekNumber,
        taskTitle,
        description: description || "",
        proofUrl,
        status: "pending",
        points: 0,
      },
    });

    return NextResponse.json(submission, { status: 201 });
  } catch (error) {
    console.error("Submission error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
