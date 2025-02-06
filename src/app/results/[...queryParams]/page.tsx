import Gallery from "@/components/Gallery";

type Props = {
  params: Promise<{
    queryParams: (string | undefined)[];
  }>;
};

export async function generateMetadata(props: Props) {
  const params = await props.params;

  const { queryParams } = params;

  const topic = queryParams?.[0] ?? "curated";
  const page = queryParams?.[1] ?? "1";

  return {
    title: `Results for ${topic} - Page ${page}`,
  };
}

export default async function SearchResults(props: Props) {
  const params = await props.params;

  const { queryParams } = params;

  const topic = queryParams?.[0] ?? "curated";
  const page = queryParams?.[1] ?? "1";

  return <Gallery topic={topic} page={page} />;
}
