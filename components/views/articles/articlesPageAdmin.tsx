"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { LabeledInput } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Eye, Pencil, Plus, Search, Trash2, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { TableData } from "@/components/tables";
import { useEffect, useState } from "react";
import { deleteArticleApi, getArticlesApi } from "@/lib/api/articlesApi";
import { getCategoriesApi } from "@/lib/api/categoryApi";
import { useHasMounted } from "@/hooks/use-mounted";
import { useArticleQuery } from "@/hooks/use-queryParams";
import { TableSkeleton } from "@/components/sekeletonTable";
import { useDebounce } from "@/hooks/use-debounce";
import PaginationComponent from "@/components/pagination";
import { toast } from "react-toastify";
import { Spinner } from "@/components/ui/spiner";
export interface Category {
  id: string;
  userId: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  username: string;
}

export interface Article {
  id: string;
  userId: string;
  categoryId: string;
  title: string;
  content: string;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
  category: Category;
  user: User;
}

export interface ArticleResponse {
  data: Article[];
  total: number;
  page: number;
  limit: number;
}

export type CategoryOption = {
  value: string;
  label: string;
};

export default function ArticlesAdmin() {
  const { query, setQuery } = useArticleQuery();
  const Router = useRouter();
  const hasMounted = useHasMounted();
  const [categoriesOptions, setCategoriesOptions] = useState<CategoryOption[]>(
    []
  );
  const [titleArticle, setTitleArticle] = useState<string>("");
  const [articles, setArticles] = useState<ArticleResponse>();
  const [loading, setLoading] = useState<boolean>(false);
  const debouncedTitle = useDebounce(titleArticle, 500);
  const columns = [
    { label: "Thumbnail", className: " flex items-center ml-10" },
    { label: "Title", className: "max-w-[200px] text-center" },
    { label: "Category", cassName: "text-center" },
    { label: "Created At", className: "whitespace-nowrap text-center" },
    { label: "Actions", className: "w-[100px] text-center" },
  ];

  const rows = articles?.data.map((article) => [
    <Image
      key={article.id}
      src={article.imageUrl}
      alt={article.title}
      width={80}
      height={50}
      className="rounded-md object-cover "
    />,
    article.title,
    article.category.name,
    format(new Date(article.createdAt), "dd MMM yyyy"),
    <div key={`actions-${article.id}`} className="flex items-center gap-2 ">
      <Button
        size="icon"
        variant="ghost"
        onClick={() => Router.push(`/articles/preview?id=${article.id}`)}
      >
        <Eye className="w-4 h-4" />
      </Button>
      <Button
        onClick={() => Router.push(`/articles/edit?id=${article.id}`)}
        size="icon"
        variant="ghost"
      >
        <Pencil className="w-4 h-4" />
      </Button>
      <Dialog>
        <DialogTrigger className="text-red-500 hover:text-red-600 cursor-pointer">
          <Trash2 className="w-4 h-4" />
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Articles</DialogTitle>
            <DialogDescription>
              Deleting this article is permanent and cannot be undone. All
              related content will be removed.
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
              onClick={() => handleDeleteArticle(article.id)}
              disabled={loading}
            >
              {loading ? <Spinner /> : "Delete"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>,
  ]);

  const handleDeleteArticle = async (articleId: string) => {
    try {
      setLoading(true);
      await deleteArticleApi(articleId);
      getDataArticlesApi();
      setLoading(false);
      toast.success(`deleted successfully.`);
    } catch (error) {
      toast.error(`Failed to delete article.`);
      setLoading(false);
    }
  };

  const getDataArticlesApi = async () => {
    setLoading(true);

    try {
      const articlesData = await getArticlesApi({
        page: query.page,
        limit: query.limit,
        category: query.categoryId,
        title: query.title,
        sortBy: "title",
        sortOrder: "asc",
      });
      setArticles(articlesData);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching articles:", error);
    }
  };

  const getDataCategoriesApi = async () => {
    try {
      const categoriesData = await getCategoriesApi({
        page: 1,
        limit: 10000,
      });
      setCategoriesOptions(
        categoriesData.data
          .filter((category: any) => category?.id && category?.name)
          .map((category: any) => ({
            value: String(category.id),
            label: category.name,
          }))
      );
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    if (hasMounted) {
      getDataArticlesApi();
      getDataCategoriesApi();
    }
  }, [hasMounted, query]);

  useEffect(() => {
    if (debouncedTitle !== query.title) {
      setQuery({ ...query, title: debouncedTitle, page: 1 });
    }
  }, [debouncedTitle]);
  if (!hasMounted) return null;
  return (
    <div className="p-4">
      <Card>
        <CardHeader className="border-b">
          <span className=" font-bold">Total Articles : {articles?.total}</span>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4 border-b pb-4">
            <div className="flex gap-4">
              <div className="w-[180px]">
                <Select
                  value={query.categoryId}
                  onValueChange={(value) =>
                    setQuery({ categoryId: value, page: 1, limit: 10 })
                  }
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[200px] overflow-y-auto">
                    {categoriesOptions.map((category: CategoryOption) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <LabeledInput
                size="md"
                prefix={<Search />}
                value={titleArticle}
                onChange={(e) => setTitleArticle(e.target.value)}
                placeholder="Search by title.."
                className="w-[180px]"
              />
              {(query.title || query.categoryId) && (
                <Tooltip>
                  <TooltipTrigger>
                    <div
                      onClick={() =>
                        setQuery({
                          title: "",
                          categoryId: "",
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
            <Button
              onClick={() => Router.push("/articles/create")}
              className="bg-blue-600"
            >
              <Plus className="mr-2" />
              Add Articles
            </Button>
          </div>
          {loading ? (
            <TableSkeleton columns={columns} />
          ) : (
            <TableData columns={columns} data={rows} />
          )}
          <PaginationComponent
            totalData={articles?.total ?? 0}
            pageSize={articles?.limit}
            currentPage={articles?.page ?? 1}
            onPageChange={(page) => setQuery({ ...query, page })}
          />
        </CardContent>
      </Card>
    </div>
  );
}
