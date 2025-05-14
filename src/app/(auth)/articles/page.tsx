import ArticleList from "@/components/ArticleList";
import React, { Suspense } from "react";
import { unauthorized } from "next/navigation";
import { fetchUserArticleCount, fetchUserSession } from "../../article/actions";
import LoadingSpinner from "@/components/LoadingSpinner";
import ArticleListClientPage from "./ArticleListClientPage";

export default async function ArticleListPage() {
  return <ArticleListClientPage />;
}
