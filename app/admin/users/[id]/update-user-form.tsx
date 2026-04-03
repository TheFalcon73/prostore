"use client";

import { updateUserSchema } from "@/lib/validators";
import { useRouter } from "next/navigation";
import z from "zod";
import { toast } from "sonner";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateUser } from "@/lib/actions/user.actions";

import { Button } from "@/components/ui/button";
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
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { USER_ROLES } from "@/lib/constants";

const UpdateUserForm = ({
  user,
}: {
  user: z.infer<typeof updateUserSchema>;
}) => {
  const router = useRouter();

  const form = useForm<z.infer<typeof updateUserSchema>>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: user,
  });

  const onSubmit = async (values: z.infer<typeof updateUserSchema>) => {
    try {
        const res = await updateUser({
            ...values,
            id: user.id
        })

        if(!res.success){
            toast.error(res.message)
            return;
        }

        toast.success(res.message)

        form.reset();
        
        router.push('/admin/users');

    } catch (error) {
        toast.error((error as Error).message)
    }

  }

  return (
    <Card className="w-full sm:max-w-md">
      <CardHeader>
        <CardTitle></CardTitle>
        <CardDescription></CardDescription>
      </CardHeader>
      <CardContent>
        <form id="form-rhf-updateuser" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-updateuser-email">
                    Email
                  </FieldLabel>
                  <Input
                    {...field}
                    id="form-rhf-updateuser-email"
                    aria-invalid={fieldState.invalid}
                    placeholder={user.email}
                    autoComplete="off"
                    disabled={true}
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
                  <FieldLabel htmlFor="form-rhf-updateuser-name">
                    Name
                  </FieldLabel>
                  <Input
                    {...field}
                    id="form-rhf-updateuser-name"
                    aria-invalid={fieldState.invalid}
                    placeholder={user.name}
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="role"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field
                  orientation="responsive"
                  data-invalid={fieldState.invalid}
                >
                  <FieldContent>
                    <FieldLabel htmlFor="form-rhf-updateuser-role-label">
                      Role
                    </FieldLabel>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </FieldContent>
                  <Select
                    name={field.name}
                    value={field.value.toString()}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger
                      id="form-rhf-updateuser-role-trigger"
                      aria-invalid={fieldState.invalid}
                      className="min-w-[120px]"
                    >
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent position="item-aligned">
                      {USER_ROLES.map((role) => (
                        <SelectItem key={role} value={role}>
                          {" "}
                          {role.charAt(0).toUpperCase() + role.slice(1)}{" "}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
            form="form-rhf-updateuser"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? "Submitting..." : "Update User"}
          </Button>
        </Field>
      </CardFooter>
    </Card>
  );
};

export default UpdateUserForm;
