"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useDebounce } from "./use-debounce"; // pastikan path-nya sesuai

export function useArticleQuery() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [titleInput, setTitleInput] = useState(searchParams.get("title") || "");
  const debouncedTitle = useDebounce(titleInput, 500); // 500ms delay

  const query = useMemo(
    () => ({
      page: Number(searchParams.get("page") || 1),
      limit: Number(searchParams.get("limit") || 10),
      categoryId: searchParams.get("categoryId") || "",
      title: searchParams.get("title") || "",
    }),
    [searchParams]
  );

  const setQuery = (newValues: Partial<typeof query>) => {
    const params = new URLSearchParams(searchParams);
    Object.entries(newValues).forEach(([key, value]) => {
      if (value === "" || value === undefined || value === null) {
        params.delete(key);
      } else {
        params.set(key, String(value));
      }
    });
    router.push(`${pathname}?${params.toString()}`);
  };

  useEffect(() => {
    if (debouncedTitle !== query.title) {
      setQuery({ title: debouncedTitle, page: 1 });
    }
  }, [debouncedTitle]);

  return {
    query,
    setQuery,
    titleInput,
    setTitleInput,
  };
}

export function useCategoryQuery() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const query = useMemo(
    () => ({
      page: Number(searchParams.get("page") || 1),
      limit: Number(searchParams.get("limit") || 10),
      name: searchParams.get("name") || "",
    }),
    [searchParams]
  );

  const setQuery = (newValues: Partial<typeof query>) => {
    const params = new URLSearchParams(searchParams);
    Object.entries(newValues).forEach(([key, value]) => {
      if (value === "" || value === undefined || value === null) {
        params.delete(key);
      } else {
        params.set(key, String(value));
      }
    });
    router.push(`${pathname}?${params.toString()}`);
  };

  return {
    query,
    setQuery,
  };
}
