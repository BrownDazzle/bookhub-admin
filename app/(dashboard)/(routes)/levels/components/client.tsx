"use client";

import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { ApiList } from "@/components/ui/api-list";

import { columns, LevelColumn } from "./columns";

interface LevelClientProps {
  data: LevelColumn[];
}

export const LevelClient: React.FC<LevelClientProps> = ({
  data
}) => {
  const params = useParams();
  const router = useRouter();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={`Levels (${data.length})`} description="Manage levels for your products" />
        <Button onClick={() => router.push(`/${params.storeId}/levels/new`)}>
          <Plus className="mr-2 h-4 w-4" /> Add New
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="name" columns={columns} data={data} />
      <Heading title="API" description="API Calls for Levels" />
      <Separator />
      <ApiList entityName="levels" entityIdName="levelId" />
    </>
  );
};
