export function profilePicURL(url: string | null) {
  const defaultProfilePicURL = `${process.env.NEXT_PUBLIC_AWS_S3_BUCKET_URL}/assets/images/default-profile-picture.png`;
  const profilePicURL = url || defaultProfilePicURL;
  return profilePicURL;
}
