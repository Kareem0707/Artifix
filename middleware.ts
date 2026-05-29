export { auth as middleware } from "@/lib/auth"

export const config = {
  matcher: [
    "/article-forge/:path*",
    "/font-fixer/:path*",
    "/content-architect/:path*",
    "/visual-transformer/:path*",
    "/prompt-vault/:path*",
    "/audio-denoise/:path*",
    "/image-upscaler/:path*",
    "/video-upscaler/:path*",
  ],
}
