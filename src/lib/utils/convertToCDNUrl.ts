export default function convertToCDNUrl(s3Url?: string) {
  if (!s3Url) {
    return "";
  }
  const match = s3Url.match(/\.(com|net)\/(.+)/);
  const path = match?.[2];
  return `${process.env.NEXT_PUBLIC_AWS_CDN_URL}/${path}`;
}
