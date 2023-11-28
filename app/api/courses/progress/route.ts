
import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";
import { isTeacher } from "@/lib/teacher";
import { getProgress } from "@/actions/get-progress";

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
    { params }: {
        params: {
            userId: string;
            courseId: string;
        }
    }
) {
    try {
        const userId = params.userId;
        const courseId = params.courseId;

        const progress = await getProgress(userId, courseId);

        return NextResponse.json(progress, {
            headers: corsHeaders
        });
    } catch (error) {
        console.log("[COURSES]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}