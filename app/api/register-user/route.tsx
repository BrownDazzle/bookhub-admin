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
    console.log("REG,", body)
    const {
      email,
      name,
      picture,
    } = body;

    //const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        email,
        name,
        image: picture,
      }
    });

    return NextResponse.json(user, {
      headers: corsHeaders
    });
  } catch (error) {
    console.log("REGISTER_ERR", error)
  }
}



export async function GET(request: Request) {
  try {
    const email = request.url.includes('?') ? new URL(request.url, 'http://dummy').searchParams.get('email') : null;

    // Ensure the email is present in the query parameters
    if (!email) {
      return new NextResponse('Email is missing in the request', { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user) {
      return new NextResponse('User not found', { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('[PRODUCTS_GET]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}
