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


export async function GET(
    req: Request,
) {
    try {
        const { searchParams } = new URL(req.url)

        const isPaid = searchParams.get('isPaid');

        const products = await prismadb.order.findMany({
            where: {
                isPaid: isPaid ? false : undefined,
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
