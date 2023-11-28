import { NextResponse } from 'next/server';

import prismadb from '@/lib/prismadb';
import getCurrentUser from '@/actions/get-current-user';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}


export async function POST(
  req: Request
) {
  try {
    const user = await getCurrentUser();
    const userId = user?.id;

    const body = await req.json();

    const { name, value } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    if (!value) {
      return new NextResponse("Value is required", { status: 400 });
    }

    const publisher = await prismadb.publisher.create({
      data: {
        name,
        value,
      }
    });

    return NextResponse.json(publisher, {
      headers: corsHeaders
    });
  } catch (error) {
    console.log('[PUBLISHERS_POST]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export async function GET(
  req: Request
) {
  try {
    const publishers = await prismadb.publisher.findMany();

    return NextResponse.json(publishers, {
      headers: corsHeaders
    });
  } catch (error) {
    console.log('[PUBLISHERS_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};
