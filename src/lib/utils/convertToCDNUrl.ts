import env from "../env";

export function convertToCDNUrl(s3Url: string) {
  const path = s3Url.split(".com/")[1];
  return `${env.NEXT_PUBLIC_AWS_CDN_URL}/${path}`;
}
