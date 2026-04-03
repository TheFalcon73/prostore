"use client";

import { insertProductSchema, updateProductSchema } from "@/lib/validators";
import { Product } from "@/types";
import { useRouter } from "next/navigation";
import { Resolver, useForm, Controller } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { productDefaultValues } from "@/lib/constants";
import { zodResolver } from "@hookform/resolvers/zod";
import slugify from "slugify";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createProduct, updateProduct } from "@/lib/actions/product.actions";
import { UploadButton } from "@/lib/uploadthing";
import Image from "next/image";
import { Checkbox } from "../ui/checkbox";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";


const ProductForm = ({
  type,
  product,
  productId,
}: {
  type: "Create" | "Update";
  product?: Product;
  productId?: string;
}) => {
  const router = useRouter();

  /* const form = useForm<z.infer<typeof insertProductSchema>>({
        resolver:
        type === 'Update'
        ? zodResolver(updateProductSchema)
        : zodResolver(insertProductSchema),
        defaultValues:
        product && type === 'Update' ? product : productDefaultValues
    }) */

  type InsertProduct = z.infer<typeof insertProductSchema>;
  type UpdateProduct = z.infer<typeof updateProductSchema>;
  type ProductFormValues = InsertProduct | UpdateProduct;

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(
      type === "Update" ? updateProductSchema : insertProductSchema,
    ) as Resolver<ProductFormValues>,
    defaultValues:
      product && type === "Update" ? product : productDefaultValues,
  });

  async function onSubmit(data: z.infer<typeof insertProductSchema>) {
    // On Create
    if (type === "Create") {
      const res = await createProduct(data);

      if (!res.success) {
        toast.error(res.message);
      } else {
        toast.success(res.message);
        router.push("/admin/products/");
      }
    }

    //On Update
    if (type === "Update") {
      if (!productId) {
        router.push("/admin/products/");
        return;
      }

      const res = await updateProduct({ ...data, id: productId });

      if (!res.success) {
        toast.error(res.message);
      } else {
        toast.success(res.message);
        router.push("/admin/products/");
      }
    }
  }

  const images = form.watch("images") || [];
  const isFeatured = form.watch("isFeatured");
  const rawBanner = form.watch("bannerImage");
  const banner = rawBanner
    ? rawBanner.startsWith("http") || rawBanner.startsWith("/")
      ? rawBanner
      : `/${rawBanner}`
    : null;

  console.log({ isFeatured, banner });

  return (
    <>
      <form
        method="POST"
        onSubmit={form.handleSubmit(onSubmit)}
        id="form-rhf-product"
        className="space-y-8"
      >
        <FieldGroup>
          <div className="flex flex-col md:flex-row gap-5">
            {/* Name */}
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field className="w-full" data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-product-name">Name</FieldLabel>
                  <Input
                    {...field}
                    id="form-rhf-product-name"
                    aria-invalid={fieldState.invalid}
                    placeholder="Enter Product Name"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            {/* Slug */}
            <Controller
              name="slug"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field className="w-full" data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-product-slug">Name</FieldLabel>
                  <div className="relative">
                    <Input
                      {...field}
                      id="form-rhf-product-slug"
                      aria-invalid={fieldState.invalid}
                      placeholder="Enter Slug"
                      autoComplete="off"
                    />
                    <Button
                      type="button"
                      className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-1 mt-2"
                      onClick={() => {
                        form.setValue(
                          "slug",
                          slugify(form.getValues("name"), { lower: true }),
                        );
                      }}
                    >
                      Generate
                    </Button>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </div>
                </Field>
              )}
            />
          </div>
          <div className="flex flex-col md:flex-row gap-5">
            {/* Category */}
            <Controller
              name="category"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field className="w-full" data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-product-category">
                    Category
                  </FieldLabel>
                  <Input
                    {...field}
                    id="form-rhf-product-category"
                    aria-invalid={fieldState.invalid}
                    placeholder="Enter Product Category"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            {/* Brand */}
            <Controller
              name="brand"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field className="w-full" data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-product-brand">
                    Brand
                  </FieldLabel>
                  <Input
                    {...field}
                    id="form-rhf-product-brand"
                    aria-invalid={fieldState.invalid}
                    placeholder="Enter Product Brand"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </div>
          <div className="flex flex-col md:flex-row gap-5">
            {/* Price */}
            <Controller
              name="price"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field className="w-full" data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-product-price">
                    Price
                  </FieldLabel>
                  <Input
                    {...field}
                    id="form-rhf-product-price"
                    aria-invalid={fieldState.invalid}
                    placeholder="Enter Product Price"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            {/* Stock */}
            <Controller
              name="stock"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field className="w-full" data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-product-stock">
                    Stock
                  </FieldLabel>
                  <Input
                    {...field}
                    id="form-rhf-product-stock"
                    aria-invalid={fieldState.invalid}
                    placeholder="Enter Product Stock"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </div>
          <div className="upload-field flex flex-col md:flex-row gap-5">
            {/* Images */}
            <Controller
              name="images"
              control={form.control}
              render={({ fieldState }) => (
                <Field className="w-full" data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-product-images">
                    Images
                  </FieldLabel>
                  <Card>
                    <CardContent className="space-y-2 mt-2 min-h-48">
                      <div className="flex-start space-x-2">
                        {images.map((image: string) => (
                          <Image
                            key={image}
                            src={image}
                            alt="product image"
                            className="w-20 h-20 object-cover object-center rounded-sm"
                            width={100}
                            height={100}
                          />
                        ))}
                        <UploadButton
                          endpoint="imageUploader"
                          onClientUploadComplete={(res) => {
                            if (!res) return;

                            form.setValue("images", [...images, res[0].url]);
                          }}
                          onUploadError={(error: Error) => {
                            toast.error(`ERROR! ${error.message}`);
                          }}
                        />
                      </div>
                    </CardContent>
                  </Card>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </div>
          <div className="upload-field">
            {/* isFeatured */}
            Featured Product
            <Card>
              <CardContent className="space-y-2 mt-2">
                <Controller
                  name="isFeatured"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <FieldGroup>
                      <Field
                        orientation="horizontal"
                        data-invalid={fieldState.invalid}
                      >
                        <Checkbox
                          id="form-rhf-product-isfeatured"
                          name={field.name}
                          aria-invalid={fieldState.invalid}
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                        <FieldLabel
                          htmlFor="form-rhf-checkbox-isfeatured"
                          className="font-normal"
                        >
                          Is Featured?
                        </FieldLabel>
                      </Field>
                      {isFeatured && banner && (
                        <Image
                          src={banner}
                          alt="banner image"
                          className="w-full object-cover object-center rounded-sm"
                          width={1920}
                          height={600}
                        />
                      )}

                      {isFeatured && !banner && (
                        <UploadButton
                          endpoint="imageUploader"
                          onClientUploadComplete={(res) => {
                            if (!res) return;

                            form.setValue("bannerImage", res[0].url);
                          }}
                          onUploadError={(error: Error) => {
                            toast.error(`ERROR! ${error.message}`);
                          }}
                        />
                      )}
                    </FieldGroup>
                  )}
                />
              </CardContent>
            </Card>
          </div>
          <div>
            {/* Description */}
            <Controller
              name="description"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field className="w-full" data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-product-description">
                    Product Description
                  </FieldLabel>
                  <InputGroup>
                    <InputGroupTextarea
                      {...field}
                      id="form-rhf-product-description"
                      placeholder="Enter Product Description"
                      rows={6}
                      className="min-h-24 resize-none"
                      aria-invalid={fieldState.invalid}
                    />
                    <InputGroupAddon align="block-end">
                      <InputGroupText className="tabular-nums">
                        {field.value.length}/100 characters
                      </InputGroupText>
                    </InputGroupAddon>
                  </InputGroup>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </div>
          <div>
            {/* Submit */}
            <Button
              type="submit"
              size="lg"
              disabled={form.formState.isSubmitting}
              className="button col-span-2 w-full"
            >
              {form.formState.isSubmitting
                ? "Submitting..."
                : `${type} Product`}
            </Button>
          </div>
        </FieldGroup>
      </form>
    </>
  );
};

export default ProductForm;
