import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";
import getCurrentUser from "@/actions/get-current-user";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET(
  req: Request,
  { params }: { params: { publisherId: string } }
) {
  try {
    if (!params.publisherId) {
      return new NextResponse("Publisher id is required", { status: 400 });
    }

    const publisher = await prismadb.publisher.findUnique({
      where: {
        id: params.publisherId
      }
    });

    return NextResponse.json(publisher, {
      headers: corsHeaders
    });
  } catch (error) {
    console.log('[PUBLISHER_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export async function DELETE(
  req: Request,
  { params }: { params: { publisherId: string, storeId: string } }
) {
  try {
    const user = await getCurrentUser();
    const userId = user?.id;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!params.publisherId) {
      return new NextResponse("Publisher id is required", { status: 400 });
    }


    const publisher = await prismadb.publisher.delete({
      where: {
        id: params.publisherId
      }
    });

    return NextResponse.json(publisher, {
      headers: corsHeaders
    });
  } catch (error) {
    console.log('[PUBLISHER_DELETE]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};


export async function PATCH(
  req: Request,
  { params }: { params: { publisherId: string, storeId: string } }
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


    if (!params.publisherId) {
      return new NextResponse("Publisher id is required", { status: 400 });
    }

    const publisher = await prismadb.publisher.update({
      where: {
        id: params.publisherId
      },
      data: {
        name,
        value
      }
    });

    return NextResponse.json(publisher, {
      headers: corsHeaders
    });
  } catch (error) {
    console.log('[PUBLISHER_PATCH]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};
