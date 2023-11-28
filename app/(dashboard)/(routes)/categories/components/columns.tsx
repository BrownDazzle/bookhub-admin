"use client"

import { ColumnDef } from "@tanstack/react-table"

import { CellAction } from "./cell-action"
import Image from "next/image"

export type CategoryColumn = {
  id: string
  name: string;
  url: string;
  createdAt: string;
}

export const columns: ColumnDef<CategoryColumn>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "url",
    header: "Billboard",
    cell: ({ row }) => (<Image alt="billboard" src={row.original.url} width={50} height={50} className="rounded-md" />),
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
