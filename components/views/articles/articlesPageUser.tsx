import { Search, ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import { ArticleResponse, CategoryOption } from "./articlesPageAdmin";
import { getCategoriesApi } from "@/lib/api/categoryApi";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LabeledInput } from "@/components/ui/input";
import { useArticleQuery } from "@/hooks/use-queryParams";
import { getArticlesApi } from "@/lib/api/articlesApi";
import ArticleCard from "./articleCard";
import { stripHtmlAndTruncate } from "@/lib/utils";
import PaginationComponent from "@/components/pagination";
import ArticleCardSkeleton from "./articleListSkeleton";
import { useDebounce } from "@/hooks/use-debounce";
import EmptyState from "@/components/emptyState";
export default function ArticlesPageUser() {
  const { query, setQuery } = useArticleQuery();
  const [titleArticle, setTitleArticle] = useState<string>();
  const [articles, setArticles] = useState<ArticleResponse>();
  const [loading, setLoading] = useState(false);
  const debouncedTitle = useDebounce(titleArticle, 500);
  const [categoriesOptions, setCategoriesOptions] =
    useState<CategoryOption[]>();
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

  const getDataArticlesApi = async () => {
    setLoading(true);

    try {
      const articlesData = await getArticlesApi({
        page: query.page,
        limit: 9,
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

  useEffect(() => {
    getDataCategoriesApi();
    getDataArticlesApi();
  }, [query]);

  useEffect(() => {
    if (debouncedTitle !== query.title) {
      setQuery({ ...query, title: debouncedTitle, page: 1 });
    }
  }, [debouncedTitle]);
  return (
    <div>
      <div className="relative min-h-[500px] w-full text-white">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/hero.jpg')" }}
        ></div>

        <div className="absolute inset-0 bg-blue-500/80 flex items-center justify-center px-4">
          <div className="max-w-3xl w-full text-center font-bold space-y-4">
            <p className="text-sm sm:text-base">Blog genzet</p>
            <p className="text-2xl sm:text-4xl md:text-5xl leading-tight">
              The Journal: Design Resources, Interviews, and Industry News
            </p>
            <p className="text-base sm:text-lg font-normal">
              Your daily dose of design insights!
            </p>

            <div className="bg-blue-500 flex flex-col sm:flex-row  rounded-md  text-black gap-4 p-3 ">
              <Select
                value={query.categoryId}
                onValueChange={(value) =>
                  setQuery({ categoryId: value, page: 1, limit: 10 })
                }
                className="sm:w-60 bg-white rounded-md"
              >
                <SelectTrigger className="w-full  text-sm">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="max-h-[200px] overflow-y-auto">
                  {categoriesOptions?.map((category: CategoryOption) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <LabeledInput
                size="md"
                prefix={<Search />}
                value={titleArticle}
                onChange={(e) => setTitleArticle(e.target.value)}
                placeholder="Search by title.."
                className="w-full bg-white"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-sm text-gray-600 mb-6">
          Showing: {articles?.data.length} of {articles?.total} articles
        </div>
        {!loading && articles?.data.length === 0 && <EmptyState />}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 9 }).map((_, idx) => (
              <ArticleCardSkeleton key={idx} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-10">
            {articles?.data.map((article) => (
              <ArticleCard
                url={article.id}
                key={article.id}
                imageUrl={article.imageUrl}
                title={article.title}
                date={new Date(article.createdAt).toLocaleDateString()}
                description={stripHtmlAndTruncate(article.content)}
                tags={[article.category.name]}
              />
            ))}
          </div>
        )}

        <PaginationComponent
          totalData={articles?.total ?? 0}
          pageSize={articles?.limit}
          currentPage={articles?.page ?? 1}
          onPageChange={(page) => setQuery({ ...query, page })}
        />
      </div>
    </div>
  );
}
