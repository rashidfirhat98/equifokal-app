import Image from "next/image";
import { Article } from "@/models/Article";
import ProfilePictureIcon from "./ProfilePictureIcon";
import FollowButton from "./FollowButton";

type Props = {
  article: Article;
  currentUserId?: string;
};

export default function ArticleSection({ article, currentUserId }: Props) {
  return (
    <section className="px-2 my-3">
      <div className="my-3 p-6 border-b-2">
        <div className="flex justify-between flex-col ">
          <div>
            <h1 className="heading-1 pb-3">{article.title}</h1>
            <p className="lead">{article.description}</p>
          </div>
          <div className="flex pt-6 items-center gap-4">
            <ProfilePictureIcon
              profilePic={article.user.profilePic}
              width={50}
              height={50}
            />
            <div>
              <p className="large"> By {article.user.name}</p>
              <p className="muted">{article.createdAt}</p>
            </div>
            {currentUserId && (
              <FollowButton
                followerId={article.user.id}
                followingId={currentUserId}
                isFollowingInitial={article.user.isFollowing}
              />
            )}
          </div>
        </div>
      </div>
      <div className="flex justify-center my-8">
        {article.coverImage && (
          <Image
            src={article.coverImage.src.large}
            alt={article.title}
            width={800}
            height={400}
            className="object-cover"
          />
        )}
      </div>
      <div dangerouslySetInnerHTML={{ __html: article.content }} />
    </section>
  );
}
