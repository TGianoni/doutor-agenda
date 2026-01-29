import { zodResolver } from "@hookform/resolvers/zod";
import { ptBR } from "date-fns/locale";
import dayjs from "dayjs";
import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { NumericFormat } from "react-number-format";
import { toast } from "sonner";
import z from "zod";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { doctorsTable, patientsTable } from "@/db/schema";
import { formatCurrencyInCents } from "@/helpers/currency";

const formSchema = z.object({
  patientId: z.string().uuid({
    message: "Paciente é obrigatório.",
  }),
  doctorId: z.string().uuid({
    message: "Médico é obrigatório.",
  }),
  appointmentPrice: z
    .number()
    .min(0.01, { message: "Valor da consulta é obrigatório." }),
  appointmentDate: z.date({
    required_error: "Data é obrigatória.",
  }),
  // Campo de horário será implementado depois
  appointmentTime: z.string().optional(),
});

interface UpsertAppointmentFormProps {
  isOpen: boolean;
  patients: typeof patientsTable.$inferSelect[];
  doctors: typeof doctorsTable.$inferSelect[];
  onSuccess?: () => void;
}

const UpsertAppointmentForm = ({
  isOpen,
  patients,
  doctors,
  onSuccess,
}: UpsertAppointmentFormProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();

  const form = useForm<z.infer<typeof formSchema>>({
    shouldUnregister: true,
    resolver: zodResolver(formSchema),
    defaultValues: {
      patientId: "",
      doctorId: "",
      appointmentPrice: 0,
      appointmentDate: undefined,
      appointmentTime: "",
    },
  });

  const selectedDoctorId = form.watch("doctorId");
  const selectedPatientId = form.watch("patientId");

  const selectedDoctor = useMemo(
    () => doctors.find((doctor) => doctor.id === selectedDoctorId),
    [doctors, selectedDoctorId]
  );

  const isPatientSelected = !!selectedPatientId;
  const isDoctorSelected = !!selectedDoctorId;

  useEffect(() => {
    if (isOpen) {
      form.reset({
        patientId: "",
        doctorId: "",
        appointmentPrice: 0,
        appointmentDate: undefined,
        appointmentTime: "",
      });
      setSelectedDate(undefined);
    }
  }, [isOpen, form]);

  useEffect(() => {
    if (selectedDoctor?.appointmentPriceInCents) {
      form.setValue(
        "appointmentPrice",
        selectedDoctor.appointmentPriceInCents / 100
      );
    }
  }, [selectedDoctor, form]);

  const isPriceDisabled = !isDoctorSelected;
  const isDateDisabled = !isPatientSelected || !isDoctorSelected;
  const isTimeDisabled = !isPatientSelected || !isDoctorSelected;

  // Ainda não temos server action de criação de agendamento
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const appointmentDateTime = dayjs(values.appointmentDate).toDate();

    console.log("Novo agendamento (placeholder):", {
      ...values,
      appointmentPriceInCents: values.appointmentPrice * 100,
      appointmentDateTime,
    });

    toast.success("Formulário de agendamento pronto para integração.");
    onSuccess?.();
  };

  return (
    <DialogContent className="h-full">
      <DialogHeader>
        <DialogTitle>Novo agendamento</DialogTitle>
        <DialogDescription>
          Preencha os dados para criar um novo agendamento.
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-3"
        >
          <FormField
            control={form.control}
            name="patientId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Paciente</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione um paciente" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {patients.map((patient) => (
                      <SelectItem key={patient.id} value={patient.id}>
                        {patient.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="doctorId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Médico</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione um médico" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {doctors.map((doctor) => (
                      <SelectItem key={doctor.id} value={doctor.id}>
                        {doctor.name}{" "}
                        {doctor.appointmentPriceInCents &&
                          `(${formatCurrencyInCents(
                            doctor.appointmentPriceInCents
                          )})`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="appointmentPrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Valor da consulta</FormLabel>
                <FormControl>
                  <NumericFormat
                    value={field.value}
                    onValueChange={(values) => {
                      field.onChange(values.floatValue ?? 0);
                    }}
                    decimalScale={2}
                    fixedDecimalScale
                    decimalSeparator=","
                    allowNegative={false}
                    allowLeadingZeros={false}
                    thousandSeparator="."
                    customInput={Input}
                    prefix="R$ "
                    placeholder={
                      selectedDoctor?.appointmentPriceInCents
                        ? formatCurrencyInCents(
                            selectedDoctor.appointmentPriceInCents
                          )
                        : formatCurrencyInCents(0)
                    }
                    disabled={isPriceDisabled}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="appointmentDate"
            render={() => (
              <FormItem className="flex flex-col">
                <FormLabel>Data</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      data-empty={!selectedDate}
                      className="data-[empty=true]:text-muted-foreground w-[212px] justify-between text-left font-normal"
                      disabled={isDateDisabled}
                    >
                      {selectedDate
                        ? dayjs(selectedDate).format("DD/MM/YYYY")
                        : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={(date) => {
                        setSelectedDate(date);
                        if (date) {
                          form.setValue("appointmentDate", date);
                        }
                      }}
                      defaultMonth={selectedDate}
                      locale={ptBR}
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="appointmentTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Horário</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={isTimeDisabled}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione um horário" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {/* Opções de horário serão implementadas posteriormente */}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <DialogFooter>
            <Button type="submit">
              Salvar agendamento
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
};

export default UpsertAppointmentForm;

