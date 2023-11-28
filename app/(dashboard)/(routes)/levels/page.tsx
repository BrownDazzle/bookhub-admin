import { format } from "date-fns";

import prismadb from "@/lib/prismadb";

import { LevelColumn } from "./components/columns"
import { LevelClient } from "./components/client";

const LevelsPage = async () => {
  const levels = await prismadb.level.findMany({
    orderBy: {
      createdAt: 'desc'
    }
  });

  const formattedLevels: LevelColumn[] = levels.map((item) => ({
    id: item.id,
    name: item.name,
    value: item.value,
    createdAt: format(item.createdAt, 'MMMM do, yyyy'),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <LevelClient data={formattedLevels} />
      </div>
    </div>
  );
};

export default LevelsPage;
