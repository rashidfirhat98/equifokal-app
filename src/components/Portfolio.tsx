import fetchImages from "@/lib/fetchImages";
import type { ImagesResults } from "@/models/Images";
import ImgContainer from "./ImgContainer";
import addBlurredDataUrls from "@/lib/getBase64";
import getPrevNextPages from "@/lib/getPrevNextPages";
import Footer from "./Footer";
import { getUserImages } from "@/app/portfolio/actions";

type Props = {
  topic?: string | undefined;
  page?: string | undefined;
};

export default async function Portfolio({ topic = "curated", page }: Props) {
  const photos: ImagesResults | undefined = await getUserImages();

  if (!photos || photos.per_page === 0)
    return <h2 className="m-4 text-2xl font-bold">No Images Found</h2>;
  const photosWithBlur = await addBlurredDataUrls(photos);

  return (
    <>
      <section className="px-2 my-3 grid grid-cols-gallery auto-rows-[10px]">
        {photosWithBlur.map((photo) => (
          <ImgContainer key={photo.id} photo={photo} />
        ))}
      </section>
    </>
  );
}
