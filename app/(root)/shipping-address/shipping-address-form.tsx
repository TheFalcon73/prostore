"use client";
import { ShippingAddress } from "@/types";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { shippingAddressSchema } from "@/lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { shippingAddressDefaultValues } from "@/lib/constants";
import { ArrowRight, Loader } from "lucide-react";
import { updateUserAddress } from "@/lib/actions/user.actions";

export function ShippingAddressForm({ address }: { address: ShippingAddress }) {
  const router = useRouter();

  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof shippingAddressSchema>>({
    resolver: zodResolver(shippingAddressSchema),
    mode: "onBlur",
    defaultValues: address || shippingAddressDefaultValues,
  });

  async function onSubmit(data: z.infer<typeof shippingAddressSchema>) {
    startTransition(async () => {
      const res = await updateUserAddress(data);

      if (!res.success) {
        toast.error(res.message);

        return;
      }

      router.push("/payment-method");
    });
  }

  return (
    <>
      <div className="max-w-md mx-auto space-y-4">
        <h1 className="h2-bold mt-4">Shipping Address</h1>
        <p className="text-sm text-muted-foreground">
          Please, enter an address to ship to{" "}
        </p>
        <form
          id="form-rhf-address"
          method="post"
          className="space-y-4"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FieldGroup>
            <Controller
              name="fullName"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-fullname">Full Name</FieldLabel>
                  <Input
                    {...field}
                    id="form-rhf-fullname"
                    aria-invalid={fieldState.invalid}
                    placeholder="Enter Full Name"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="streetAddress"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-streetaddress">
                    Street Address
                  </FieldLabel>
                  <Input
                    {...field}
                    id="form-rhf-streetaddres"
                    aria-invalid={fieldState.invalid}
                    placeholder="Enter Street Address"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="city"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-city">City</FieldLabel>
                  <Input
                    {...field}
                    id="form-rhf-city"
                    aria-invalid={fieldState.invalid}
                    placeholder="Enter City"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="postalCode"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-postalcode">
                    Postal Code
                  </FieldLabel>
                  <Input
                    {...field}
                    id="form-rhf-postalcode"
                    aria-invalid={fieldState.invalid}
                    placeholder="Enter Postal Code"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="country"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-country">Country</FieldLabel>
                  <Input
                    {...field}
                    id="form-rhf-postalcode"
                    aria-invalid={fieldState.invalid}
                    placeholder="Enter Country"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        </form>
        <div className="flex gap-2">
          <Button type="submit" disabled={isPending} form="form-rhf-address">
            {isPending ? (
              <Loader className="w-4 h-4 animate-spin" />
            ) : (
              <ArrowRight className="w-4 h-4" />
            )}{" "}
            Continue
          </Button>
        </div>
      </div>
    </>
  );
}

export default ShippingAddressForm;
