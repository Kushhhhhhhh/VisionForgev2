import { SITE_NAME, SITE_URL } from "@/lib/site";

export const dynamic = "force-static";

const body = `# ${SITE_NAME}

> ${SITE_NAME} is a free AI image generator. Describe an image in plain text and get a finished picture back in seconds, with no watermarks. Generated images can be downloaded, and a community gallery shows what other people have created.

## Pages

- [Home](${SITE_URL}/): What ${SITE_NAME} is and a showcase of example images.
- [Create](${SITE_URL}/create): Write a prompt, choose square, landscape or portrait, and generate an image. Requires a free account.
- [Gallery](${SITE_URL}/gallery): Community gallery of images created with ${SITE_NAME}.
- [About](${SITE_URL}/about): Features and how ${SITE_NAME} works.

## Notes

- Text-to-image only: the input is a text prompt, the output is a single image.
- Image sizes: square (1:1), landscape (16:9) and portrait (9:16).
- Generated images can be downloaded from the Create page and from your profile.
- The gallery shows images only; prompts are not displayed publicly.
`;

export function GET() {
  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
