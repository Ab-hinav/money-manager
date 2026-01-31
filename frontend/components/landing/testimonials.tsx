import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Quote } from "lucide-react";

export function Testimonials() {
  return (
    <section className="py-16 lg:py-24 bg-white dark:bg-[#0A1A14]">
      <div className="container px-4 sm:px-6">
        <h2 className="text-3xl font-bold text-center mb-16 text-gray-900 dark:text-white">
          What Our Users Say
        </h2>

        <Card className="max-w-4xl mx-auto border-none shadow-2xl overflow-hidden">
            <div className="flex flex-col md:flex-row">
                <div className="md:w-1/3 bg-gray-100 relative min-h-[200px] md:min-h-[300px]">
                    {/* Placeholder for user image */}
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                         <span className="text-4xl">👩🏻‍💼</span>
                    </div>
                </div>
                <div className="md:w-2/3 p-6 sm:p-8 md:p-12 flex flex-col justify-center">
                    <Quote className="h-6 w-6 sm:h-8 sm:w-8 text-green-400 mb-4 sm:mb-6" />
                    <blockquote className="text-lg sm:text-2xl font-medium text-gray-900 leading-relaxed mb-6">
                        "Money Manager changed the way I look at my savings. I've
                        saved over $5k in three months without changing my
                        lifestyle!"
                    </blockquote>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <div className="font-bold text-lg dark:text-gray-800">Sarah J.</div>
                            <div className="text-sm text-green-600 font-medium">Verified Premium User</div>
                        </div>
                        <Button className="bg-green-500 text-white hover:bg-green-600 rounded-full">
                            Read More Stories
                        </Button>
                    </div>
                </div>
            </div>
        </Card>
      </div>
    </section>
  );
}
