import { format } from "date-fns";

import prismadb from "@/lib/prismadb";

import { PublisherColumn } from "./components/columns"
import { PublishersClient } from "./components/client";

const PublishersPage = async () => {
  const publishers = await prismadb.publisher.findMany({
    orderBy: {
      createdAt: 'desc'
    }
  });

  const formattedPublishers: PublisherColumn[] = publishers.map((item) => ({
    id: item.id,
    name: item.name,
    value: item.value,
    createdAt: format(item.createdAt, 'MMMM do, yyyy'),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <PublishersClient data={formattedPublishers} />
      </div>
    </div>
  );
};

export default PublishersPage;
