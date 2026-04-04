"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, Resolver, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
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
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { insertReviewSchema } from "@/lib/validators";
import { reviewFormDefaultValues } from "@/lib/constants";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {Star } from 'lucide-react'
import {createUpdateReview, getReviewByProductId} from '@/lib/actions/review.actions'

//////////////////////////////////////////////////////////////////////

type ReviewFormValues = z.infer<typeof insertReviewSchema>;

const ReviewForm = ({
  userId,
  productId,
  onReviewSubmitted,
}: {
  userId: string;
  productId: string;
  onReviewSubmitted: () => void;
}) => {
  /////////////////////////////// Logic ////////////////////////////

  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof insertReviewSchema>>({
    resolver: zodResolver(insertReviewSchema) as Resolver<ReviewFormValues>,
    defaultValues: {
      title: "",
      description: "",
      productId: productId, // you have this from props!
      userId: userId, // you have this from props!
      rating: 0,
    },
  });


  // Open Form Handler
  const handleOpenForm = async () => {
    form.setValue('productId', productId);
    form.setValue('userId', userId);
    
    const review = await getReviewByProductId({productId})

    if(review){
      form.setValue('title', review.title);
      form.setValue('description', review.description);
      form.setValue('rating', review.rating);
    }

    setOpen(true);
  };


  // Submut Form Handler
  async function onSubmit(values: z.infer<typeof insertReviewSchema>) {
      const res = await createUpdateReview({... values, productId}) 
      
      if (!res.success) {
        toast.error(res.message)
      }

      setOpen(false)

      onReviewSubmitted();

      toast.success(res.message)

   }



  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button onClick={handleOpenForm} variant="default">
        Write a Review
      </Button>
      <DialogContent className="sm:max-w-[425px]">
        <form id="form-rhf-reviews" onSubmit={form.handleSubmit(onSubmit)} method="POST">
          <DialogHeader>
            <DialogTitle>Write a Review</DialogTitle>
            <DialogDescription>
              Share your thoughts with others customers
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <FieldGroup>
              {/* Title */}
              <Controller
                name="title"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-rhf-reviews-title">
                      Title
                    </FieldLabel>
                    <Input
                      {...field}
                      id="form-rhf-reviews-title"
                      aria-invalid={fieldState.invalid}
                      placeholder="Enter a Title"
                      autoComplete=""
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              {/* Description */}
              <Controller
                name="description"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-rhf-reviews-description">
                      Description
                    </FieldLabel>
                    <Textarea
                      {...field}
                      id="form-rhf-reviews-description"
                      aria-invalid={fieldState.invalid}
                      placeholder="Enter a description"
                      autoComplete=""
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              {/* Rating */}
              <Controller
                name="rating"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field
                    orientation="responsive"
                    data-invalid={fieldState.invalid}
                  >
                    <FieldContent>
                      <FieldLabel htmlFor="form-rhf-reviews-review">
                        Review
                      </FieldLabel>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </FieldContent>
                    <Select
                      value={field.value.toString()}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger
                        id="form-rhf-reviews-review-select"
                        aria-invalid={fieldState.invalid}
                      >
                        <SelectValue placeholder="Select a rating" />
                      </SelectTrigger>
                      <SelectContent position="item-aligned">
                        <SelectItem value="1">1 <Star className="inline h-4 w-4"/> </SelectItem>
                        <SelectItem value="2">2 <Star className="inline h-4 w-4"/> </SelectItem>
                        <SelectItem value="3">3 <Star className="inline h-4 w-4"/> </SelectItem>
                        <SelectItem value="4">4 <Star className="inline h-4 w-4"/> </SelectItem>
                        <SelectItem value="5">5 <Star className="inline h-4 w-4"/> </SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                )}
              />
            </FieldGroup>
          </div>
          <DialogFooter>
            <Button type='submit' size='lg' className="w-full" disabled={ form.formState.isSubmitting}>
                {form.formState.isSubmitting ? 'Submitting...' : 'Submit'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ReviewForm;
