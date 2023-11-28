import prismadb from "@/lib/prismadb";

import { LevelForm } from "./components/level-form";

const LevelPage = async ({
  params
}: {
  params: { levelId: string }
}) => {
  const level = await prismadb.level.findUnique({
    where: {
      id: params.levelId
    }
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <LevelForm initialData={level} />
      </div>
    </div>
  );
}

export default LevelPage;
