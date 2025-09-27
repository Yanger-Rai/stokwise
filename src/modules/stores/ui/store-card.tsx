// src/modules/stores/ui/store-card.tsx
import React from "react";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MapPin, Store } from "lucide-react";
import { StoreData } from "@/types/stores.type";

export function StoreCard({ store }: { store: StoreData }) {
  return (
    <Card
      className="@container/card cursor-pointer hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-[4px] hover:-translate-y-[4px] transition-all"
      onClick={() => {
        alert(`${store.name} clicked`);
      }}
    >
      <CardHeader>
        <CardDescription>{store.location}</CardDescription>
        <CardTitle className="text-xl font-semibold @[250px]/card:text-2xl">
          {store.name}
        </CardTitle>
        <CardAction>
          <div className="bg-cyan-100 p-1 rounded-md mt-1 flex justify-center">
            <Store className="text-cyan-600" />
          </div>
        </CardAction>
      </CardHeader>
      <CardFooter className="flex-col items-start gap-1.5 text-sm border-t border-t-border pt-4">
        <div className="line-clamp-1 flex items-center gap-2 font-medium">
          <MapPin className="size-4" />
          Total Items:{" "}
          <span className="font-bold tabular-nums">{store.totalItems}</span>
        </div>
      </CardFooter>
    </Card>
  );
}

export default StoreCard;
