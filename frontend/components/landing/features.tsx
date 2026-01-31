import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, BarChart3, ShieldCheck } from "lucide-react";

const features = [
  {
    title: "Real-time Tracking",
    description:
      "Monitor every penny as it happens with instant notifications and automatic bank sync across all your accounts.",
    icon: Activity,
  },
  {
    title: "Smart Analytics",
    description:
      "Visual insights into your spending habits with AI-powered forecasting that helps you predict future savings.",
    icon: BarChart3,
  },
  {
    title: "Secure & Private",
    description:
      "Bank-level 256-bit encryption and strict privacy controls ensure your data never leaves your hands.",
    icon: ShieldCheck,
  },
];

export function Features() {
  return (
    <section id="features" className="py-16 lg:py-24 bg-gray-50 dark:bg-[#0A1A14]/95">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Engineered for Your Growth
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            Experience the future of personal finance with our advanced feature
            set, designed to keep you ahead of your bills.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {features.map((feature) => (
            <Card
              key={feature.title}
              className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <CardTitle className="text-xl font-semibold">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
