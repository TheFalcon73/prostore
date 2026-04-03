"use client";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { MenuIcon } from "lucide-react";
import Link from "next/link";

type Category = {
  category: string;
  _count: number;
};

const CategoryDrawerClient = ({ categories }: { categories: Category[] }) => {
  return (
    <Drawer direction="left">
      <DrawerTrigger asChild>
        <Button variant="outline">
          <MenuIcon />
        </Button>
      </DrawerTrigger>

      <DrawerContent className="h-full max-w-sm">
        <DrawerHeader>
          <DrawerTitle>Select Category</DrawerTitle>
        </DrawerHeader>
        <div className="overflow-y-auto p-4">
          {categories.map((x) => (
            <DrawerClose asChild key={x.category}>
              <Link
                href={`/search?category=${x.category}`}
                className="flex w-full items-center rounded-md px-3 py-2 text-sm hover:bg-accent"
              >
                {x.category} ({x._count})
              </Link>
            </DrawerClose>
          ))}
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default CategoryDrawerClient;
