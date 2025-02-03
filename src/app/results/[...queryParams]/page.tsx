import Gallery from "@/components/Gallery";

type Props = {
  params: {
    queryParams: (string | undefined)[];
  };
};

export function generateMetadata({ params: { queryParams } }: Props) {
  const topic = queryParams?.[0] ?? "curated";
  const page = queryParams?.[1] ?? "1";

  return {
    title: `Results for ${topic} - Page ${page}`,
  };
}

export default function SearchResults({ params: { queryParams } }: Props) {
  const topic = queryParams?.[0] ?? "curated";
  const page = queryParams?.[1] ?? "1";

  return <Gallery topic={topic} page={page} />;
}
