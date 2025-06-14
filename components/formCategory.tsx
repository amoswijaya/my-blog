"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { DialogClose } from "@radix-ui/react-dialog";

type FormValues = {
  name: string;
  id?: string;
};

export default function FormCategory({
  onChange,
  defaultValues,
}: {
  onChange?: (form: FormValues) => void;
  defaultValues?: Partial<FormValues>; // Tambah prop defaultValues
}) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues,
  });

  useEffect(() => {
    if (defaultValues?.name) {
      setValue("name", defaultValues.name);
    }
  }, [defaultValues?.name, setValue]);

  const onSubmit = (data: FormValues) => {
    onChange?.(data);
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>
          {defaultValues ? "Edit Category" : "Add Category"}
        </DialogTitle>
      </DialogHeader>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div className="flex flex-col">
          <label htmlFor="categoryName" className="text-sm font-medium">
            Category
          </label>
          <input
            type="text"
            id="categoryName"
            placeholder="Input category"
            className={`mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 ${
              errors.name
                ? "border-red-500 focus:ring-red-500"
                : "focus:ring-blue-500"
            }`}
            {...register("name", {
              required: "Category field cannot be empty",
            })}
          />
          {errors.name && (
            <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
          )}
        </div>

        <div className="flex justify-end">
          <DialogClose>
            <Button type="button" variant="outline" className="mr-2">
              Cancel
            </Button>
          </DialogClose>

          <Button type="submit">
            {defaultValues ? "Save Changes" : "Add"}
          </Button>
        </div>
      </form>
    </DialogContent>
  );
}
