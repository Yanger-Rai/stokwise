import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  HandCoins,
  Package,
  Store,
  TrendingDown,
  TrendingUp,
  TriangleAlert,
} from "lucide-react";
import Link from "next/link";

function SectionCards() {
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Products</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            1,250
          </CardTitle>
          <CardAction>
            <Badge variant="destructive">
              <TrendingDown />
              -20%
            </Badge>
            <div className="bg-cyan-100 p-1 rounded-md mt-1 flex justify-center">
              <Package className="text-cyan-600" />
            </div>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Down 20% this period <TrendingDown className="size-4" />
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Active Stores</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            3
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <TrendingUp />
              +1
            </Badge>
            <div className="bg-cyan-100 p-1 rounded-md mt-1 flex justify-center">
              <Store className="text-cyan-600" />
            </div>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">This Month</div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Low Stock Products</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            <Button
              variant="link"
              className="text-3xl cursor-pointer text-foreground"
            >
              <Link href="products/lowstock">4</Link>
            </Button>
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <TrendingUp />
              +4.5%
            </Badge>
            <div className="bg-amber-100 p-1 rounded-md mt-1 flex justify-center">
              <TriangleAlert className="text-amber-600" />
            </div>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 text-amber-600 flex gap-2 font-medium">
            +2 from yesterday
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Value</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            ₹45,678.00
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="bg-green-500 text-white">
              <TrendingUp />
              +12.5%
            </Badge>
            <div className="bg-cyan-100 p-1 rounded-md mt-1 flex justify-center">
              <HandCoins className="text-cyan-600" />
            </div>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            +20% this period <TrendingUp className="size-4" />
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

export default SectionCards;
