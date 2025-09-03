"use client";

import { ArrowRight, Star } from "lucide-react";
import { Button } from "./ui/button";

export const Hero = () => {
  const scrollToProducts = () => {
    const element = document.getElementById("products");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };
  return (
    <>
      <section
        id="home"
        className="relative min-h-[70vh] flex items-center justify-center overflow-hidden"
      >
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-fade-in">
            {/* Badge */}
            <div className="border inline-flex items-center space-x-2 bg-white backdrop-blur-md rounded-full px-6 py-2 mb-8">
              <Star className="w-4 h-4 text-accent" fill="brown" />
              <span className="font-medium">Trusted by 50,000+ creators</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight tracking-tight">
              Discover Premium
              <br />
              <span>Digital Products</span>
            </h1>

            <p className="text-muted-foreground text-lg md:text-xl mb-8 max-w-3xl mx-auto leading-snug tracking-tight">
              Explore thousands of high-quality digital products from software
              tools to educational courses, templates, and more. Everything you
              need to succeed.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                onClick={scrollToProducts}
                size="lg"
                className="group flex items-center uppercase"
              >
                Start Shopping
                <ArrowRight className="size-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-8 mt-16 max-w-2xl mx-auto divide-x divide-accent">
              <div className="text-center">
                <div className="text-xl md:text-2xl font-bold mb-2">50K+</div>
                <div className="80">Happy Customers</div>
              </div>
              <div className="text-center">
                <div className="text-xl md:text-2xl font-bold mb-2">10K+</div>
                <div className="80">Digital Products</div>
              </div>
              <div className="text-center">
                <div className="text-xl md:text-2xl font-bold mb-2">99%</div>
                <div className="80">Satisfaction Rate</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
