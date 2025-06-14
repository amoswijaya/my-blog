"use client";

import { useForm, FormProvider, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LabeledInput } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { schemaArticles } from "@/zod-schemas/articles";
import ContentEditor from "@/components/contentEditor";
import { getCategoriesApi } from "@/lib/api/categoryApi";
import { uploadImageApi } from "@/lib/api/imageApi";
import {
  createArticleApi,
  getArticleByIdApi,
  updateArticleApi,
} from "@/lib/api/articlesApi";
import { toast } from "react-toastify";
import { CategoryOption } from "./articlesPageAdmin";
import { Spinner } from "@/components/ui/spiner";
import PreviewPage from "./previewArticles";

export default function ArticleForm({ isNew = false }: { isNew?: boolean }) {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const Router = useRouter();
  const form = useForm({
    resolver: zodResolver(schemaArticles),
    defaultValues: {
      title: "",
      categoryId: "",
      content: "",
      imageUrl: null,
    },
  });

  const [categoriesOptions, setCategoriesOptions] = useState<CategoryOption[]>(
    []
  );
  const [loadingImage, setLoadingImage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isPreview, setIsPreview] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = form;

  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
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
            value: String(category.id), // pastikan string
            label: category.name,
          }))
      );
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    if (!isNew && id) {
      const fetchArticleData = async () => {
        try {
          const articleData = await getArticleByIdApi(id);
          console.log("Fetched article data:", articleData);
          form.reset({
            title: articleData.title,
            categoryId: articleData.categoryId,
            content: articleData.content,
            imageUrl: articleData.imageUrl || null,
          });
          setThumbnailUrl(articleData.imageUrl || null);
        } catch (error) {
          console.error("Error fetching article data:", error);
          toast.error("Failed to fetch article data.");
        }
      };
      fetchArticleData();
    }
  }, [id]);

  useEffect(() => {
    getDataCategoriesApi();
  }, []);

  const onSubmit = async (data: any) => {
    try {
      setLoading(true);
      if (isNew) {
        await createArticleApi(data);
        toast.success("Article created successfully!");
      } else {
        await updateArticleApi(id as string, data);
        toast.success("Article updated successfully!");
      }
      Router.push(`/articles`);
    } catch (error) {
      console.error("Error creating article:", error);
      toast.error("Failed to create article.");
    } finally {
      setLoading(false);
    }
  };

  if (isPreview) {
    return (
      <div>
        <div
          onClick={() => setIsPreview(false)}
          className="bg-white flex items-center space-x-2 cursor-pointer hover:opacity-70 p-4"
        >
          <ArrowLeft />
          <h2 className="text-lg font-semibold">Back To Edit</h2>
        </div>
        <PreviewPage articleData={form.getValues()} />
      </div>
    );
  }

  return (
    <div className="p-4">
      <FormProvider {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <div
                onClick={() => Router.back()}
                className="flex items-center space-x-2 cursor-pointer hover:opacity-70"
              >
                <ArrowLeft />
                <h2 className="text-lg font-semibold">
                  {isNew ? "Create" : "Edit"} Articles
                </h2>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <Label>Thumbnails</Label>
                <Controller
                  name="imageUrl"
                  control={control}
                  render={({ field: { onChange } }) => (
                    <div className="space-y-2">
                      <label className="border border-dashed rounded-md flex items-center justify-center h-32 cursor-pointer text-center text-sm text-gray-500 w-60 relative overflow-hidden">
                        <input
                          type="file"
                          accept="image/png, image/jpeg"
                          onChange={async (e) => {
                            try {
                              setLoadingImage(true);
                              const file = e.target.files?.[0];
                              if (file) {
                                const imgUrl = await uploadImageApi(file);
                                onChange(imgUrl);
                                setThumbnailUrl(imgUrl);
                              }
                            } catch (error) {
                              console.error("Error uploading file:", error);
                              onChange(null);
                              setThumbnailUrl(null);
                            } finally {
                              setLoadingImage(false);
                            }
                          }}
                          className="hidden"
                          id="thumbnail-input"
                        />

                        {loadingImage ? (
                          <div className="animate-pulse bg-gray-200 h-full w-full rounded-md" />
                        ) : thumbnailUrl ? (
                          <img
                            src={thumbnailUrl}
                            alt="Thumbnail"
                            className="h-full w-full object-contain rounded-md"
                          />
                        ) : (
                          <div>
                            <p>Click to select files</p>
                            <p className="text-xs">
                              Support File Type: jpg or png
                            </p>
                          </div>
                        )}
                      </label>

                      {thumbnailUrl && (
                        <div className="flex justify-center gap-2 w-60">
                          <button
                            type="button"
                            onClick={() => {
                              document
                                .getElementById("thumbnail-input")
                                ?.click();
                            }}
                            className="text-blue-600 text-sm hover:underline "
                          >
                            Changes
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              onChange(null);
                              setThumbnailUrl(null);
                            }}
                            className="text-red-600 text-sm hover:underline"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                />
              </div>

              <div className="space-y-1">
                <Label>Title</Label>
                <Controller
                  name="title"
                  control={control}
                  render={({ field }) => (
                    <LabeledInput {...field} placeholder="Input title" />
                  )}
                />
                {errors.title && (
                  <p className="text-sm text-red-500">{errors.title.message}</p>
                )}
              </div>

              <div className="space-y-1">
                <Label>Category</Label>
                <Controller
                  name="categoryId"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categoriesOptions.map((category) => (
                          <SelectItem
                            key={category.value}
                            value={category.value}
                          >
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.categoryId && (
                  <p className="text-sm text-red-500">
                    {errors.categoryId.message}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  The existing category list can be seen in the{" "}
                  <span
                    onClick={() => Router.push("/category")}
                    className="text-blue-500 underline cursor-pointer"
                  >
                    category
                  </span>{" "}
                  menu
                </p>
              </div>

              <div className="space-y-1">
                <Controller
                  name="content"
                  control={control}
                  render={({ field }) => (
                    <ContentEditor
                      value={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />
                {errors.content && (
                  <p className="text-sm text-red-500">
                    {errors.content.message}
                  </p>
                )}
              </div>

              <div className="w-full flex justify-end gap-2">
                <Button
                  onClick={() => Router.back()}
                  variant="outline"
                  className="mt-4"
                >
                  Cancel
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => {
                    setIsPreview(true);
                  }}
                  className="mt-4"
                  type="button"
                >
                  Preview
                </Button>
                <Button disabled={loading} type="submit" className="mt-4">
                  {loading ? <Spinner /> : "Upload"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </FormProvider>
    </div>
  );
}
