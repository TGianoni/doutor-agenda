import { EditIcon, MoreVerticalIcon, TrashIcon } from "lucide-react"
import { useAction } from "next-safe-action/hooks"
import { useState } from "react"
import { toast } from "sonner"

import { deletePatient } from "@/actions/delete-patient"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Dialog } from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { patientsTable } from "@/db/schema"

import UpsertPatientForm from "./upsert-patient-form"

interface PatientsTableActionsProps {
    patient: typeof patientsTable.$inferSelect;
}

const PatientsTableActions = ({patient} : PatientsTableActionsProps) => {
    const [upsertDialogIsOpen, setUpsertDialogIsOpen] = useState(false)
    const [deleteDialogIsOpen, setDeleteDialogIsOpen] = useState(false)
    
    const deletePatientAction = useAction(deletePatient, {
        onSuccess: () => {
            toast.success("Paciente deletado com sucesso.")
            setDeleteDialogIsOpen(false)
        },
        onError: () => {
            toast.error("Erro ao deletar paciente.")
        }
    })

    const handleDeletePatientClick = () => {
        if (!patient) return
        deletePatientAction.execute({id: patient.id})
    }

  return (
    <>
        <Dialog open={upsertDialogIsOpen} onOpenChange={setUpsertDialogIsOpen}>
            <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                    <MoreVerticalIcon className="h-4 w-4"/>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuLabel>{patient.name}</DropdownMenuLabel>
                <DropdownMenuSeparator />                    
                <DropdownMenuItem
                    onClick={() => {
                    setUpsertDialogIsOpen(true)
                    // Fecha o Dropdown para não ficar sobreposto ao Dialog
                    document.body.click()
                    }}
                >
                    <EditIcon className="mr-2" />
                    Editar
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => {
                    setDeleteDialogIsOpen(true)
                    // Fecha o Dropdown para não ficar sobreposto ao AlertDialog
                    document.body.click()
                    }}
                >
                    <TrashIcon className="mr-2" />
                    Excluir
                </DropdownMenuItem>
            </DropdownMenuContent>
            </DropdownMenu>

            <UpsertPatientForm 
            isOpen={upsertDialogIsOpen}
            patient={patient}
            onSuccess={() => setUpsertDialogIsOpen(false)}
            />
        </Dialog>

        <AlertDialog open={deleteDialogIsOpen} onOpenChange={setDeleteDialogIsOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                <AlertDialogTitle>Tem certeza que deseja deletar este paciente?</AlertDialogTitle>
                <AlertDialogDescription>
                    Essa ação não pode ser revertida. Isso irá deletar o Paciente
                    e todas as consultas agendadas.
                </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeletePatientClick}>Deletar</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    </>
  )
}

export default PatientsTableActions