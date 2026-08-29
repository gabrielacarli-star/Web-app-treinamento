import Link from "next/link";
import { DEFAULT_LOCALE } from "@/lib/config";

export default function NotFound() {
  return (
    <html lang="pt-BR">
      <body>
        <div className="funnel-shell items-center justify-center gap-4 px-6 text-center">
          <p className="headline">404</p>
          <Link href={`/${DEFAULT_LOCALE}`} className="cta max-w-xs">
            DogFlow
          </Link>
        </div>
      </body>
    </html>
  );
}
