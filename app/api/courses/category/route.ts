import { NextResponse } from 'next/server';

import prismadb from '@/lib/prismadb';
import { getCourses } from '@/actions/get-courses';

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
    { params }: { params: { userId: string } }
) {
    try {

        const courseCategory = await prismadb.courseCategory.findMany({
            orderBy: {
                name: "asc"
            }
        });

        return NextResponse.json(courseCategory, {
            headers: corsHeaders
        });
    } catch (error) {
        console.log('[CATEGORIES_GET]', error);
        return new NextResponse("Internal error", { status: 500 });
    }
};