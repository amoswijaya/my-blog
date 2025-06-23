"use client";
import FormCategory from "@/components/formCategory";
import PaginationComponent from "@/components/pagination";
import { TableSkeleton } from "@/components/sekeletonTable";
import { TableData } from "@/components/tables";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { LabeledInput } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spiner";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useDebounce } from "@/hooks/use-debounce";
import { useCategoryQuery } from "@/hooks/use-queryParams";
import {
  deleteCategoryApi,
  getCategoriesApi,
  postCategoryApi,
  updateCategoryApi,
} from "@/lib/api/categoryApi";
import { Pencil, Plus, Search, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
export type Category = {
  id: string;
  userId: string;
  name: string;
  createdAt: string;
  updatedAt: string;
};

interface CategoryResponse {
  data: Category[];
  currentPage: number;
  totalPages: number;
  totalData: number;
}

const columns = [
  { label: "Category", className: "text-center" },
  { label: "Created at", className: "text-center" },
  { label: "Actions", className: "text-center" },
];

export default function Category() {
  const { query, setQuery } = useCategoryQuery();
  const [titleCategory, setTitleCategory] = useState<string>("");
  const [categories, setCategories] = useState<CategoryResponse>();
  const [loading, setLoading] = useState<boolean>(false);
  const [open, setOpen] = useState(false);

  const titleDebounce = useDebounce(titleCategory, 500);
  const getDataCategoriesApi = async () => {
    try {
      setLoading(true);
      const categoriesData = await getCategoriesApi({
        page: query.page || 1,
        limit: query.limit || 10,
        search: query.name || "",
      });
      setCategories(categoriesData);
    } catch (error) {
      toast.error("Failed to fetch categories.");
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    try {
      setLoading(true);
      await deleteCategoryApi(categoryId);
      await getDataCategoriesApi();
      setLoading(false);
      toast.success("Category deleted successfully.");
    } catch (error) {
      setLoading(false);
      toast.error("Failed to delete category.");
      console.error("Error deleting category:", error);
    }
  };

  const handleSubmit = async (data: any) => {
    try {
      setLoading(true);
      if (data.id) {
        await updateCategoryApi(data.id, { name: data.name });
        toast.success("Category updated successfully!");
        setOpen(false);
      } else {
        await postCategoryApi(data);
        toast.success("Category created successfully!");
        setOpen(false);
      }
      await getDataCategoriesApi();
    } catch (error) {
      toast.error("Failed to create category.");
      console.error("Error creating category:", error);
    } finally {
      setLoading(false);
    }
  };

  const rows = categories?.data.map((category) => [
    <div className="flex items-center justify-center">
      <span className="text-sm">{category.name}</span>
    </div>,
    <div className="flex items-center justify-center">
      <span className="text-sm">
        {new Date(category.createdAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })}
      </span>
    </div>,
    <div className="flex items-center justify-center gap-2">
      <Dialog>
        <DialogTrigger>
          <Tooltip>
            <TooltipTrigger>
              <Button variant="ghost" size="icon">
                <Pencil />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Edit Category</TooltipContent>
          </Tooltip>
        </DialogTrigger>
        <FormCategory
          onChange={handleSubmit}
          defaultValues={{ name: category.name, id: category.id }}
        />
      </Dialog>

      <Dialog>
        <DialogTrigger className="text-red-500 hover:text-red-600 cursor-pointer">
          <Tooltip>
            <TooltipTrigger>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => console.log("Delete category", category.id)}
              >
                <Trash2 />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Delete Category</TooltipContent>
          </Tooltip>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Category</DialogTitle>
            <DialogDescription>
              Delete category “{category.name}”? This will remove it from master
              data permanently.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-row gap-2 justify-end w-full">
            <DialogClose>
              <Button variant="outline" className="w-full mb-2">
                Cancel
              </Button>
            </DialogClose>

            <Button
              variant="destructive"
              onClick={() => handleDeleteCategory(category.id)}
              disabled={loading}
            >
              {loading ? <Spinner /> : "Delete"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>,
  ]);

  useEffect(() => {
    if (titleDebounce) {
      setQuery({
        ...query,
        name: titleDebounce,
        page: 1,
      });
    }
  }, [titleDebounce]);

  useEffect(() => {
    const controller = new AbortController();

    getDataCategoriesApi();
    return () => {
      controller.abort();
    };
  }, [query]);
  return (
    <div className="p-4">
      <Card>
        <CardHeader className="border-b">
          <span className=" font-bold">
            Total Articles : {categories?.totalData ?? 0}
          </span>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-4 border-b pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
              <LabeledInput
                size="md"
                prefix={<Search />}
                value={titleCategory}
                onChange={(e) => setTitleCategory(e.target.value)}
                placeholder="Search Category"
                className="w-full sm:w-[180px]"
              />
              {query.name && (
                <Tooltip>
                  <TooltipTrigger>
                    <div
                      onClick={() =>
                        setQuery({
                          name: "",
                          page: 1,
                          limit: 10,
                        })
                      }
                      className="flex items-center justify-center w-8 h-8 cursor-pointer"
                    >
                      <X />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Remove Filter</p>
                  </TooltipContent>
                </Tooltip>
              )}
            </div>

            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="w-full md:w-auto bg-blue-600">
                  <Plus className="mr-2" />
                  Add Category
                </Button>
              </DialogTrigger>
              <FormCategory onChange={handleSubmit} />
            </Dialog>
          </div>

          {loading ? (
            <TableSkeleton columns={columns} />
          ) : (
            <TableData columns={columns} data={rows} />
          )}
          <PaginationComponent
            totalData={categories?.totalData ?? 0}
            pageSize={10}
            currentPage={categories?.currentPage ?? 1}
            onPageChange={(page) => setQuery({ ...query, page })}
          />
        </CardContent>
      </Card>
    </div>
  );
}
