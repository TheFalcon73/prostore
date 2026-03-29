"use client";
import { useRouter } from 'next/navigation'
import { useTransition } from 'react';
import { paymentMethodSchema } from '@/lib/validators';
import { useForm,Controller } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod"
import z from 'zod'
import { PAYMENT_METHODS,DEFAULT_PAYMENT_METHOD } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { ArrowRight, Loader } from "lucide-react";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group"
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field"
import { updateUserPaymentMethod } from '@/lib/actions/user.actions';
import { toast } from 'sonner';


const PaymentMethodForm = ({
  preferredPaymentMethod,
}: {
  preferredPaymentMethod: string | null;
}) => {
    /// PaymentMethodForm logic start here

    const router = useRouter();

      const form = useForm<z.infer<typeof paymentMethodSchema>>({
    resolver: zodResolver(paymentMethodSchema),
    defaultValues: {
        type: preferredPaymentMethod || DEFAULT_PAYMENT_METHOD
    },
  })

  const [isPending, startTransition] = useTransition()

  async function onSubmit(values: z.infer<typeof paymentMethodSchema>) {
    startTransition(async() => {
        const res = await updateUserPaymentMethod(values); // Update the payment method field in the user table

        if(!res.success) { 
            toast.error(res.message)
            return
        } 

        router.push('/place-order')
    })
  }


  return (
    <>
      <div className="max-w-md mx-auto space-y-4">
        <h1 className="h2-bold mt-4">Payment Method</h1>
        <p className="text-sm text-muted-foreground">
          Please, select a Payment Method{" "}
        </p>
        <form
          id="form-rhf-paymentmethod"
          method="post"
          className="space-y-4"
          onSubmit={form.handleSubmit(onSubmit)}
        >
        <div className='flex flex-col md:flex-rox gap-5'> 
          <FieldGroup>
            <Controller
              name="type"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className='space-y-3'>
                  <FieldLabel htmlFor="form-rhf-type"></FieldLabel>
                  <RadioGroup
                    name={field.name}
                    value={field.value}
                    onValueChange={field.onChange}
                    aria-invalid={fieldState.invalid}
                  >
                    {PAYMENT_METHODS.map((paymentMethod) => (
                      <FieldLabel
                        key={paymentMethod}
                        htmlFor={`form-rhf-radiogroup-${paymentMethod}`}
                      >
                        <Field
                          orientation="horizontal"
                          data-invalid={fieldState.invalid}
                        >
                          <FieldContent>
                            <FieldTitle>{paymentMethod}</FieldTitle>
                          </FieldContent>
                          <RadioGroupItem
                            value={paymentMethod}
                            id={`form-rhf-radiogroup-${paymentMethod}`}
                            aria-invalid={fieldState.invalid}
                            className='flex items-center space-x-3 space-y-0'
                          />
                        </Field>
                      </FieldLabel>
                    ))}
                  </RadioGroup>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        </div>
        </form>
        
        <div className="flex gap-2 my-10">
          <Button type="submit" disabled={isPending} form="form-rhf-paymentmethod">
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
};

export default PaymentMethodForm;
