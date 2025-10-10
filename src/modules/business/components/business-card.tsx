import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BusinessRow } from "@/types/stores.type";
import { ChevronRight } from "lucide-react";
import React from "react";

interface BusinessCardProps {
  business: BusinessRow;
  onClick: () => void;
}
export const BusinessCard = ({ business, onClick }: BusinessCardProps) => {
  return (
    <Card
      className="flex flex-col cursor-pointer hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-[4px] hover:-translate-y-[4px] transition-all"
      onClick={onClick}
    >
      <CardHeader>
        <CardTitle className="pt-2">{business.name}</CardTitle>
        <CardDescription>{business.slug}</CardDescription>
        <CardAction>
          <ChevronRight />
        </CardAction>
      </CardHeader>
      <CardContent className="flex-grow space-y-4"></CardContent>
    </Card>
  );
};
