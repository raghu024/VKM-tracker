import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST() {
  try {
    const adminExists = await prisma.user.findUnique({
      where: { email: "admin@vkmsip.com" },
    });

    if (!adminExists) {
      await prisma.user.create({
        data: {
          name: "Admin",
          email: "admin@vkmsip.com",
          password: await bcrypt.hash("admin123", 12),
          role: "admin",
        },
      });
    }

    return NextResponse.json({ message: "Seed completed" });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json({ error: "Seed failed" }, { status: 500 });
  }
}
