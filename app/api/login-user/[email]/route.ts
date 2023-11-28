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

export async function GET(
    request: Request,
    { params }: {
        params: {
            email: string;
        }
    }
) {
    try {

        const user = await prisma.user.findUnique({
            where: {
                email: params.email
            }
        });

        return NextResponse.json(user);
    } catch (error) {
        console.log('[PRODUCTS_GET]', error);
        return new NextResponse("Internal error", { status: 500 });
    }
};