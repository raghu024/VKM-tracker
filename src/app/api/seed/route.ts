import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import bcrypt from "bcryptjs";

export async function POST() {
  try {
    // Check if admin already exists
    const { data: existing } = await supabase
      .from("users")
      .select("id")
      .eq("email", "admin@vkmsip.com")
      .single();

    if (!existing) {
      const { error } = await supabase.from("users").insert({
        name: "Admin",
        email: "admin@vkmsip.com",
        password: await bcrypt.hash("admin123", 12),
        role: "admin",
      });

      if (error) {
        console.error("Seed insert error:", error);
        return NextResponse.json({ error: "Seed failed" }, { status: 500 });
      }
    }

    return NextResponse.json({ message: "Seed completed" });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json({ error: "Seed failed" }, { status: 500 });
  }
}
