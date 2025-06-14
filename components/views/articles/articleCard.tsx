import Image from "next/image";
import { useRouter } from "next/navigation";

type ArticleCardProps = {
  imageUrl: string;
  title: string;
  description: string;
  date: string;
  tags?: string[];
  url: string;
};

export default function ArticleCard({
  imageUrl,
  title,
  description,
  date,
  tags,
  url,
}: ArticleCardProps) {
  const router = useRouter();
  return (
    <div
      onClick={() => router.push(`/articles/preview?id=${url}`)}
      className="max-w-sm rounded-2xl overflow-hidden shadow-md bg-white cursor-pointer"
    >
      <Image
        src={imageUrl}
        alt={title}
        width={512}
        height={300}
        className="w-full h-48 object-cover"
      />

      <div className="p-4 space-y-2">
        <p className="text-sm text-gray-500">{date}</p>
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        <p className="text-sm text-gray-600">{description}</p>

        <div className="flex flex-wrap gap-2 pt-2">
          {tags?.map((tag) => (
            <span
              key={tag}
              className="bg-blue-100 text-blue-700 text-xs font-medium px-2 py-1 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
