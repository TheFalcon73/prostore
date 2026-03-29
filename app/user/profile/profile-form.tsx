"use client";
import { useSession } from "next-auth/react";
import { updateProfileSchema } from "@/lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Check, Loader } from "lucide-react";
import { toast } from "sonner";
import { useFormStatus } from "react-dom";
import { Controller, useForm } from "react-hook-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { updateProfile } from "@/lib/actions/user.actions";

const ProfileForm = () => {
  const { data: session, update } = useSession();

  const form = useForm<z.infer<typeof updateProfileSchema>>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: session?.user?.name ?? "",
      email: session?.user?.email ?? "",
    },
  });

  const onSubmit = async (values: z.infer<typeof updateProfileSchema>) => {
    const res = await updateProfile(values);
    if(!res.success){
        toast.error(res.message)
    }

    const newSession = {
        ...session,
        user: {
            ...session?.user,
            name: values.name
        }
    }

    await update(newSession);

    toast.success(res.message)

  }; 

  return (
    <Card>
      <CardHeader>
        <CardTitle></CardTitle>
        <CardDescription></CardDescription>
      </CardHeader>
      <CardContent>
        <form id="form-rhf-updatename" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-updatename-email">
                    Email
                  </FieldLabel>
                  <Input
                    {...field}
                    id="form-rhf-updatename-email"
                    aria-invalid={fieldState.invalid}
                    autoComplete="off"
                    disabled
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-updatename-name">
                    User
                  </FieldLabel>
                  <Input
                    {...field}
                    id="form-rhf-updatename-name"
                    aria-invalid={fieldState.invalid}
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
      </CardContent>
      <CardFooter>
              <Field orientation="horizontal">
                <Button 
                type="submit" 
                form="form-rhf-updatename"
                size='lg'
                className="button col-span-2 w-full"
                disabled={form.formState.isSubmitting}
                >
                  { form.formState.isSubmitting ? 'Submitting...' : 'Update Profile'}
                </Button>
              </Field>
            </CardFooter>
    </Card>
  );
};

export default ProfileForm;
