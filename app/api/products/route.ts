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

    const { title, price, categoryId, levelId, publisherId, images, isFeatured, isArchived } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!title) {
      return new NextResponse("Title is required", { status: 400 });
    }

    if (!images || !images.length) {
      return new NextResponse("Images are required", { status: 400 });
    }

    if (!price) {
      return new NextResponse("Price is required", { status: 400 });
    }

    if (!categoryId) {
      return new NextResponse("Category id is required", { status: 400 });
    }

    if (!levelId) {
      return new NextResponse("Level id is required", { status: 400 });
    }

    if (!publisherId) {
      return new NextResponse("Publisher id is required", { status: 400 });
    }

    const product = await prismadb.product.create({
      data: {
        title,
        price,
        isFeatured,
        isArchived,
        categoryId,
        levelId,
        publisherId,
        images: {
          createMany: {
            data: [
              ...images.map((image: { url: string }) => image),
            ],
          },
        },
      },
    });

    return NextResponse.json(product, {
      headers: corsHeaders
    });
  } catch (error) {
    console.log('[PRODUCTS_POST]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export async function GET(
  req: Request,
) {
  try {
    const { searchParams } = new URL(req.url)
    const categoryId = searchParams.get('categoryId') || undefined;
    const levelId = searchParams.get('levelId') || undefined;
    const publisherId = searchParams.get('publisherId') || undefined;
    const isFeatured = searchParams.get('isFeatured');

    const products = await prismadb.product.findMany({
      where: {
        categoryId,
        levelId,
        publisherId,
        isFeatured: isFeatured ? true : undefined,
        isArchived: false,
      },
      include: {
        images: true,
        category: true,
        level: true,
        publisher: true,
      },
      orderBy: {
        createdAt: 'desc',
      }
    });

    return NextResponse.json(products, {
      headers: corsHeaders
    });
  } catch (error) {
    console.log('[PRODUCTS_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};
