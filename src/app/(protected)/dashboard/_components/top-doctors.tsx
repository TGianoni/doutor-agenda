import { Stethoscope } from "lucide-react";
import React from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardTitle } from "@/components/ui/card";

interface TopDoctorsProps {
  doctors: {
    id: string;
    name: string;
    avatarImageUrl: string | null;
    specialty: string;
    appointments: number;
  }[];
}

function getInitials(name: string): string {
  const words = name.replace("Dr. ", "").split(" ");
  if (words.length >= 2) {
    return `${words[0][0]}${words[1][0]}`.toUpperCase();
  }
  return words[0].substring(0, 2).toUpperCase();
}

export default function TopDoctors({
  doctors,
}: TopDoctorsProps): React.ReactElement {
  return (
    <Card className="mx-auto w-full">
      <CardContent>
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Stethoscope className="text-muted-foreground" />
            <CardTitle className="text-base">Médicos</CardTitle>
          </div>
        </div>

        {/* Doctors List */}
        <div className="space-y-6">
          {doctors.map((doctor) => (
            <div key={doctor.id} className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Avatar className="h-10 w-10 border-2 border-slate-100">
                  <AvatarImage
                    src={doctor.avatarImageUrl || undefined}
                    alt={doctor.name}
                  />
                  <AvatarFallback className="bg-slate-100 text-sm font-medium text-slate-600">
                    {getInitials(doctor.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <h3 className="text-sm">{doctor.name}</h3>
                  <span className="text-muted-foreground text-sm">
                    {doctor.specialty}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-muted-foreground text-sm">
                  {doctor.appointments} agend.
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
