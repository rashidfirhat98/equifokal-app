-- CreateIndex
CREATE INDEX "Article_userId_idx" ON "Article"("userId");

-- CreateIndex
CREATE INDEX "ArticleGallery_articleId_idx" ON "ArticleGallery"("articleId");

-- CreateIndex
CREATE INDEX "ArticleGallery_galleryId_idx" ON "ArticleGallery"("galleryId");

-- CreateIndex
CREATE INDEX "Follow_followerId_idx" ON "Follow"("followerId");

-- CreateIndex
CREATE INDEX "Follow_followingId_idx" ON "Follow"("followingId");

-- CreateIndex
CREATE INDEX "Gallery_userId_idx" ON "Gallery"("userId");

-- CreateIndex
CREATE INDEX "GalleryImage_galleryId_idx" ON "GalleryImage"("galleryId");

-- CreateIndex
CREATE INDEX "GalleryImage_imageId_idx" ON "GalleryImage"("imageId");

-- CreateIndex
CREATE INDEX "Image_userId_idx" ON "Image"("userId");
