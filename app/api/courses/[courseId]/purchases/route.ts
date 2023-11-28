
import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";
import getCurrentUser from "@/actions/get-current-user";


export async function GET(
    req: Request,
    { params }: { params: { courseId: string, userId: string } }
) {
    try {
        const user = await getCurrentUser();
        const userId = user?.id;
        const { title } = await req.json();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const purchase = await prismadb.purchase.findUnique({
            where: {
                userId_courseId: {
                    userId: params.userId,
                    courseId: params.courseId,
                }
            }
        });


        return NextResponse.json(purchase);
    } catch (error) {
        console.log("[CHAPTERS]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}