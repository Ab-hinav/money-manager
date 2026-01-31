import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileQuestion } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] text-center px-4">
      <div className="bg-teal-50 p-4 rounded-full mb-6">
        <FileQuestion className="h-12 w-12 text-teal-600" />
      </div>
      <h1 className="text-4xl font-bold tracking-tight mb-2">Page Not Found</h1>
      <p className="text-muted-foreground mb-8 max-w-md">
        Sorry, we couldn&apos;t find the page you&apos;re looking for. It might have been moved or deleted.
      </p>
      <Button asChild className="bg-teal-600 hover:bg-teal-700">
        <Link href="/">Go Back Home</Link>
      </Button>
    </div>
  );
}
