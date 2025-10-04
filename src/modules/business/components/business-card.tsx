import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChevronRight } from "lucide-react";
import React from "react";

interface BusinessCardProps {
  title: string; // business name
  location?: string;
}
export const BusinessCard = ({ title, location }: BusinessCardProps) => {
  return (
    <Card className="flex flex-col cursor-pointer hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-[4px] hover:-translate-y-[4px] transition-all">
      <CardHeader>
        <CardTitle className="pt-2">{title}</CardTitle>
        <CardDescription>{location}</CardDescription>
        <CardAction>
          <ChevronRight />
        </CardAction>
      </CardHeader>
      <CardContent className="flex-grow space-y-4"></CardContent>
    </Card>
  );
};
