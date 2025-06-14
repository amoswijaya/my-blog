"use client";
import ArticleCard from "@/components/views/articles/articleCard";
import { getArticleByIdApi, getArticlesApi } from "@/lib/api/articlesApi";
import { stripHtmlAndTruncate } from "@/lib/utils";
import { format } from "date-fns";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import ArticleDetailSkeleton from "./articleSkeleton";

type User = {
  username: string;
};

type Category = {
  name: string;
};

type ArticleData = {
  title: string;
  content: string;
  imageUrl: string;
  createdAt?: string;
  user?: User;
  category?: Category;
};

const AuthorInfo = ({ user, date }: { user: string; date: string }) => {
  const formattedDate = format(
    new Date(date || "2025-06-13T06:56:19.540Z"),
    "MMMM d, yyyy"
  );

  return (
    <div className="flex items-center space-x-3 text-sm text-gray-500">
      <div className="flex flex-col md:flex-row md:items-center">
        <span> {formattedDate}</span>
        <span className="hidden md:inline mx-2">•</span>

        <span className="font-semibold text-gray-800">Created by {user}</span>
      </div>
    </div>
  );
};
export default function PreviewPage({ articleData }: any) {
  const [articleDetail, setArticleDetail] = useState<ArticleData | null>(
    articleData || null
  );
  const [otherArticle, serOtherArticle] = useState<any>();
  const pathname = usePathname();
  const id = pathname.split("/")[3];
  const getDataArticle = async () => {
    try {
      const data = await getArticleByIdApi(id || "");
      setArticleDetail(data);
    } catch (error) {
      console.log(error);
    }
  };

  const getDataArticlesApi = async () => {
    try {
      const articlesData = await getArticlesApi({
        page: 1,
        limit: 3,
        sortBy: "title",
        sortOrder: "asc",
      });
      serOtherArticle(articlesData);
    } catch (error) {
      console.error("Error fetching articles:", error);
    }
  };

  useEffect(() => {
    getDataArticlesApi();
    getDataArticle();
  }, []);

  if (!articleDetail) {
    return <ArticleDetailSkeleton />;
  }
  return (
    <div className="bg-white py-8 md:py-16">
      <article className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-8 text-center md:text-left flex flex-col justify-center">
          <div className="mt-6 flex justify-center ">
            <AuthorInfo
              user={articleDetail?.user?.username ?? ""}
              date={articleDetail?.createdAt ?? ""}
            />
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight text-center">
            {articleDetail?.title}
          </h1>
        </header>
        <div className="w-full aspect-video rounded-lg overflow-hidden relative mb-8 shadow-lg">
          <Image
            src={articleDetail?.imageUrl}
            alt={articleDetail?.title || ""}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority
          />
        </div>
        <div
          className="prose prose-lg max-w-none prose-indigo"
          dangerouslySetInnerHTML={{ __html: articleDetail?.content || "" }}
        />
        {!articleData && (
          <div className="py-2">
            <span className="font-bold text-xl">Other articles</span>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-5">
              {otherArticle?.data.map((article: any) => (
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
          </div>
        )}
      </article>
    </div>
  );
}
