import Mux from "@mux/mux-node";
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

const { Video } = new Mux(
  process.env.MUX_TOKEN_ID!,
  process.env.MUX_TOKEN_SECRET!,
);

export async function GET(
  req: Request,
  { params }: {
    params: {
      courseId: string;
    }
  }
) {
  try {

    const user = await getCurrentUser();
    const userId = user?.id;

    const course = await prismadb.course.findUnique({
      where: {
        id: params.courseId,
      },
      include: {
        chapters: {
          where: {
            isPublished: true,
          },
          /*include: {
            userProgress: {
              where: {
               userId,
              }
            }
          },*/
          orderBy: {
            position: "asc"
          }
        },
      },
    });

    return NextResponse.json(course, {
      headers: corsHeaders
    });
  } catch (error) {
    console.log("[COURSES]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}


export async function DELETE(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const user = await getCurrentUser();
    const userId = user?.id;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const course = await prismadb.course.findUnique({
      where: {
        id: params.courseId,
        userId: userId,
      },
      include: {
        chapters: {
          include: {
            muxData: true,
          }
        }
      }
    });

    if (!course) {
      return new NextResponse("Not found", { status: 404 });
    }

    for (const chapter of course.chapters) {
      if (chapter.muxData?.assetId) {
        await Video.Assets.del(chapter.muxData.assetId);
      }
    }

    const deletedCourse = await prismadb.course.delete({
      where: {
        id: params.courseId,
      },
    });

    return NextResponse.json(deletedCourse, {
      headers: corsHeaders
    });
  } catch (error) {
    console.log("[COURSE_ID_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const user = await getCurrentUser();
    const userId = user?.id;
    const { courseId } = params;
    const values = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const course = await prismadb.course.update({
      where: {
        id: courseId,
        userId
      },
      data: {
        ...values,
      }
    });

    return NextResponse.json(course, {
      headers: corsHeaders
    });
  } catch (error) {
    console.log("[COURSE_ID]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}