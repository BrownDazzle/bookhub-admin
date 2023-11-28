import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

import prisma from "@/lib/prismadb";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}


export async function POST(
  request: Request,
) {
  try {
    const body = await request.json();

    const {
      email,
      name,
      password,
    } = body;

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        email,
        name,
        hashedPassword,
      }
    });

    return NextResponse.json(user, {
      headers: corsHeaders
    });
  } catch (error) {
    console.log("REGISTER_ERR", error)
  }
}
