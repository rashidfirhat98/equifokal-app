export default function convertToCDNUrl(s3Url: string) {
  const match = s3Url.match(/\.(com|net)\/(.+)/);
  const path = match?.[2];
  return `${process.env.NEXT_PUBLIC_AWS_CDN_URL}/${path}`;
}
