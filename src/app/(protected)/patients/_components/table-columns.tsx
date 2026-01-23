"use client"

import { ColumnDef } from "@tanstack/react-table"

import { patientsTable } from "@/db/schema"
import { formatPhoneNumber } from "@/helpers/phone"

import PatientsTableActions from "./table-actions"

export const patientsTableColumns: ColumnDef<typeof patientsTable.$inferSelect>[] = [
  {
    id: "name",
    accessorKey: "name",
    header: "Nome",
  },
  {
    id: "email",
    accessorKey: "email",
    header: "Email",
  },
  {
    id: "phoneNumber",
    accessorKey: "phoneNumber",
    header: "Telefone",
    cell: (params) => {
      const patient = params.row.original
      return (formatPhoneNumber(patient.phoneNumber))
    }
  },
  {
    id: "sex",
    accessorKey: "sex",
    header: "Sexo",
    cell: (params) => {
      const patient = params.row.original
      return patient.sex === "male" ? "Masculino" : "Feminino"
    }
  },
  {
    id: 'actions',
    cell: (params) => {
      const patient = params.row.original
        return (
            <PatientsTableActions patient={patient}/>
        )
    }
  }
]