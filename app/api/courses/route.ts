
import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";
import { isTeacher } from "@/lib/teacher";
import { getProgress } from "@/actions/get-progress";
import { CourseCategory, Course } from "@prisma/client";
import { getCourses } from "@/actions/get-courses";
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
  { params }: {
    params: {
      userId: string;
      title?: string;
      categoryId?: string;
    }
  }
) {
  try {
    const courses = await getCourses({
      userId: params.userId,
      title: params.title,
      categoryId: params.categoryId
    });

    return NextResponse.json(courses, {
      headers: corsHeaders
    });
  } catch (error) {
    console.log("[COURSES]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(
  req: Request,
) {
  try {
    const user = await getCurrentUser();
    const userId = user?.id;

    const { title } = await req.json();

    if (!userId || !isTeacher(userId)) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const course = await prismadb.course.create({
      data: {
        userId,
        title,
      }
    });

    return NextResponse.json(course, {
      headers: corsHeaders
    });
  } catch (error) {
    console.log("[COURSES]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}