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
  req: Request,
) {
  try {
    const user = await getCurrentUser();
    const userId = user?.id;


    const body = await req.json();

    const { name, url } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    if (!url) {
      return new NextResponse("Billboard ID is required", { status: 400 });
    }

    const category = await prismadb.category.create({
      data: {
        name,
        url
      }
    });

    return NextResponse.json(category, {
      headers: corsHeaders
    });
  } catch (error) {
    console.log('[CATEGORIES_POST]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export async function GET(
  req: Request
) {
  try {

    const categories = await prismadb.category.findMany();

    return NextResponse.json(categories, {
      headers: corsHeaders
    });
  } catch (error) {
    console.log('[CATEGORIES_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};
