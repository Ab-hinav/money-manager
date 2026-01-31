import { Button } from "@/components/ui/button";


export function Hero() {
  return (
    <section className="relative bg-[#0A1A14] overflow-hidden">
      <div className="mx-auto container px-4 sm:px-6 relative z-10 flex flex-col items-center py-12 text-center lg:flex-row lg:text-left lg:py-32 lg:gap-12">
        <div className="lg:w-1/2 space-y-6 lg:space-y-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Master Your <br />
            <span className="text-green-500">Financial Life</span>
          </h1>
          <p className="text-base sm:text-lg text-gray-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
            The all-in-one tool to track spending, set budgets, and grow your
            wealth with confidence. Join over 2M+ users today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <form action="/register">
            <Button
              size="lg"
              className="bg-green-500 text-white hover:bg-green-600 rounded-full px-6 sm:px-8 text-base sm:text-lg h-10 sm:h-12"
              
            >
              Sign Up
            </Button>
            </form>
            <Button
              size="lg"
              variant="outline"
              className="bg-transparent border-white text-white hover:bg-white/10 hover:text-white rounded-full px-6 sm:px-8 text-base sm:text-lg h-10 sm:h-12"
            >
              Learn More
            </Button>
          </div>
        </div>

        {/* Hero Image / Placeholder */}
        <div className="lg:w-1/2 mt-10 lg:mt-0 relative w-full px-4 sm:px-0">
           {/* Decorative elements */}
           <div className="absolute top-0 right-0 -mr-20 -mt-20 w-72 h-72 sm:w-96 sm:h-96 bg-green-500/20 rounded-full blur-3xl"></div>
           
           <div className="relative z-10 mx-auto w-full max-w-md lg:max-w-full">
            {/* 
              Using a placeholder div that mimics the phone mockup in the design.
              In a real scenario, this would be an <Image /> of the screen.png
            */}
             <div className="relative aspect-auto min-h-[300px] sm:min-h-[400px] w-full bg-[#E8DCD5] rounded-3xl p-4 shadow-2xl rotate-[-5deg] hover:rotate-0 transition-transform duration-500">
                <div className="absolute inset-4 bg-white rounded-2xl shadow-inner border border-gray-100 flex items-center justify-center overflow-hidden">
                    {/* Placeholder for Screen Content */}
                     <div className="text-center p-6">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                            <span className="text-xl sm:text-2xl">📱</span>
                        </div>
                        <h3 className="text-lg sm:text-xl font-bold text-gray-800">Financial Pulse</h3>
                        <p className="text-sm sm:text-base text-gray-500 mt-2">Your dashboard screen goes here</p>
                     </div>
                </div>
             </div>
             {/* Second card for depth */}
             <div className="absolute top-8 sm:top-12 right-[-10px] sm:right-[-20px] -z-10 w-full h-full bg-[#E8DCD5]/80 rounded-3xl rotate-[10deg]"></div>
           </div>
        </div>
      </div>
    </section>
  );
}
