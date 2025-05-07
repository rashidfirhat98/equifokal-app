import convertToCDNUrl from "./convertToCDNUrl";

export function profilePicURL(url: string | null) {
  const defaultProfilePicURL = `${process.env.NEXT_PUBLIC_AWS_CDN_URL}/assets/images/default-profile-picture.png`;
  const profilePicURL = url ? convertToCDNUrl(url) : defaultProfilePicURL;

  return profilePicURL;
}
