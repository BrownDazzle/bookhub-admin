"use client"

import { ColumnDef } from "@tanstack/react-table"

import { CellAction } from "./cell-action"

export type ProductColumn = {
  id: string
  title: string;
  price: string;
  category: string;
  publisher: string;
  level: string;
  createdAt: string;
  isFeatured: boolean;
  isArchived: boolean;
}

export const columns: ColumnDef<ProductColumn>[] = [
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "isArchived",
    header: "Archived",
  },
  {
    accessorKey: "isFeatured",
    header: "Featured",
  },
  {
    accessorKey: "price",
    header: "Price",
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "publisher",
    header: "Publisher",
  },
  {
    accessorKey: "level",
    header: "Level",
    cell: ({ row }) => (
      <div className="flex items-center gap-x-2">
        {row.original.level}
        <div className="h-6 w-6 rounded-full border" style={{ backgroundColor: row.original.level }} />
      </div>
    )
  },
  {
    accessorKey: "createdAt",
    header: "Date",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />
  },
];
