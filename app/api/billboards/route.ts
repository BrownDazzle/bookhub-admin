import { NextResponse } from 'next/server';

import prismadb from '@/lib/prismadb';
import getCurrentUser from '@/actions/get-current-user';

export async function POST(
  req: Request,
) {
  try {
    const user = await getCurrentUser();
    const userId = user?.id;

    const body = await req.json();

    const { label, imageUrl } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!label) {
      return new NextResponse("Label is required", { status: 400 });
    }

    if (!imageUrl) {
      return new NextResponse("Image URL is required", { status: 400 });
    }

    const billboard = await prismadb.billboard.create({
      data: {
        label,
        imageUrl,
      }
    });

    return NextResponse.json(billboard);
  } catch (error) {
    console.log('[BILLBOARDS_POST]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export async function GET(
  req: Request,
) {
  try {

    const billboards = await prismadb.billboard.findMany();

    return NextResponse.json(billboards);
  } catch (error) {
    console.log('[BILLBOARDS_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};
