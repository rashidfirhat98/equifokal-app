"use client"

import { Article } from "@/models/Article";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function ArticleList() {

	const [articles, setArticles] = useState<Article[]>([]);
	const [nextCursor, setNextCursor] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);
	const loaderRef = useRef<HTMLDivElement | null>(null);
	const hasFetched = useRef(false);

	const fetchMoreArticles = async () => {
		setLoading(true);
		try {
			const res = await fetch(`/api/articles?cursor=${nextCursor ?? ""}&limit=10`);
			const data = await res.json();
			console.log(data)
			setArticles((prev) => [...prev, ...data.articles]);
			setNextCursor(data.nextCursor);
		} catch (error) {
			console.error("Error fetching images:", error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (!hasFetched.current && !articles.length) {
			hasFetched.current = true;
			fetchMoreArticles();
		}
	}, [articles.length]);

	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				const first = entries[0];
				if (first.isIntersecting && nextCursor && !loading) {
					fetchMoreArticles();
				}
			},
			{ threshold: 1 }
		);

		if (loaderRef.current) {
			observer.observe(loaderRef.current);
		}

		return () => {
			if (loaderRef.current) observer.unobserve(loaderRef.current);
		};
	}, [nextCursor, loading]);
	return (
		<>
			<div className="">
				{articles &&
					articles.map((article: any) => (
						<Link key={article.id} href={`/article/${article.id}`}>
							<div><h1>{article.title}</h1></div>
						</Link>
					))}
			</div>
			<div ref={loaderRef} className="loader">
				{loading && <Loader2 className="animate-spin text-gray-500 w-8 h-8 mx-auto" />}
			</div>
		</>

	);
}
