"use client";
import { useState, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { Input } from "../ui/input";
import { Field, FieldDescription, FieldLabel } from "../ui/field";

const AdminSearch = () => {
  const pathname = usePathname();
  const formActionUrl = pathname.includes("/admin/orders")
    ? "/admin/orders"
    : pathname.includes("/admin/users")
      ? "/admin/users"
      : "/admin/products";

  const searchParams = useSearchParams();

  const [queryValue, setQueryValue] = useState(searchParams.get("query") || "");

  useEffect(() => {
    setQueryValue(searchParams.get("query") || "");
  }, [searchParams]);

  return (
    <form action={formActionUrl} method="GET">
      <Field>
        <Input
          id="input-search-query"
          type="search"
          placeholder="Search..."
          name="query"
          value={queryValue}
          onChange={(e) => setQueryValue(e.target.value)}
          className="md:w-25 lg:w-75"
        />
        <button className="sr-only" type="submit">
          {" "}
          Search
        </button>
      </Field>
    </form>
  );
};

export default AdminSearch;
