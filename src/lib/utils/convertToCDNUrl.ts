export default function convertToCDNUrl(s3Url: string) {
  const path = s3Url.split(".com/")[1];
  return `${process.env.NEXT_PUBLIC_AWS_CDN_URL}/${path}`;
}
