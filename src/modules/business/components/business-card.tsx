import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BusinessRow } from "@/types/stores.type";
import { ChevronRight, Trash } from "lucide-react";
import React from "react";
import { DeleteBusinessDialog } from "./delete-business";

interface BusinessCardProps {
  business: BusinessRow;
  onClick: () => void;
}
export const BusinessCard = ({ business, onClick }: BusinessCardProps) => {
  return (
    <Card className="group flex flex-col hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-[4px] hover:-translate-y-[4px] transition-all">
      <CardHeader>
        <CardTitle className="pt-2">{business.name}</CardTitle>
        <CardDescription>{business.slug}</CardDescription>
        <CardAction>
          <Button
            size={"icon"}
            variant={"ghost"}
            onClick={onClick}
            className=""
          >
            <ChevronRight className="transition-transform duration-300 group-hover:scale-200" />
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="flex-grow space-y-4"></CardContent>
      <CardFooter className="justify-end">
        <DeleteBusinessDialog business={business}>
          <Button size={"icon"} variant="ghost">
            <Trash />
            <span className="sr-only">Delete</span>
          </Button>
        </DeleteBusinessDialog>
      </CardFooter>
    </Card>
  );
};
