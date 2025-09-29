import { useState } from "react";
import { Heart, Sparkles, Quote } from "lucide-react";

interface VerseCardProps {
  imageUrl: string | null;
  verse: {
    text: string;
    reference: string;
  } | null;
  className?: string;
}

export const VerseCard = ({ imageUrl, verse, className }: VerseCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`relative w-full max-w-md mx-auto aspect-[4/5] overflow-hidden rounded-3xl shadow-divine transition-all duration-700 hover:shadow-2xl hover:shadow-accent/20 group cursor-pointer ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background Image */}
      {imageUrl ? (
        <>
          <img
            src={`/api/image-proxy?url=${encodeURIComponent(imageUrl ?? "")}`}
            alt="Card background"
            crossOrigin="anonymous"
            className="absolute inset-0 w-full h-full object-cover transition-all duration-1000 group-hover:scale-110 group-hover:brightness-110"
          />

          {/* Enhanced overlay with multiple gradients for depth */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10 transition-all duration-500 group-hover:from-black/85 group-hover:via-black/45" />
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-accent/10 transition-opacity duration-500 group-hover:to-accent/15" />
        </>
      ) : (
        <div className="absolute inset-0 gradient-divine opacity-90 group-hover:opacity-100 transition-opacity duration-500" />
      )}

      {/* Decorative Elements */}
      <div className="absolute top-6 right-6 opacity-30 group-hover:opacity-60 transition-all duration-500">
        <Sparkles className="h-6 w-6 text-white animate-pulse-glow" />
      </div>

      <div className="absolute top-6 left-6 opacity-20 group-hover:opacity-40 transition-all duration-500">
        <Quote className="h-8 w-8 text-white/60 transform rotate-180" />
      </div>

      <div className="absolute bottom-32 right-6 opacity-20 group-hover:opacity-40 transition-all duration-500 animate-float">
        <Heart className="h-5 w-5 text-accent" />
      </div>

      {/* Content Container */}
      <div className="relative h-full flex flex-col justify-end p-8 transition-all duration-500 group-hover:p-10">
        {verse ? (
          <div className="text-center space-y-6 animate-fade-in">
            {/* Quote Icon */}
            <div className="flex justify-center mb-4">
              <div className="p-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 transition-all duration-500 group-hover:bg-white/15 group-hover:scale-110 group-hover:rotate-6">
                <Quote className="h-6 w-6 text-white" />
              </div>
            </div>

            {/* Verse Text */}
            <div className="relative">
              <blockquote className="verse-elegant text-white text-lg md:text-xl leading-relaxed font-medium drop-shadow-xl transition-all duration-500 group-hover:scale-105 group-hover:drop-shadow-2xl">
                "{verse.text}"
              </blockquote>

              {/* Subtle glow effect behind text */}
              <div className="absolute inset-0 verse-elegant text-lg md:text-xl leading-relaxed font-medium text-white/20 blur-sm scale-105 -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                "{verse.text}"
              </div>
            </div>

            {/* Reference with enhanced styling */}
            <div className="relative">
              <div className="h-px w-16 bg-gradient-to-r from-transparent via-accent to-transparent mx-auto mb-4 transition-all duration-500 group-hover:w-24 group-hover:via-yellow-300" />

              <cite className="block text-accent text-sm md:text-base font-bold drop-shadow-lg transition-all duration-500 group-hover:text-yellow-300 group-hover:scale-105 group-hover:drop-shadow-xl tracking-wide">
                {verse.reference}
              </cite>

              {/* Decorative underline */}
              <div className="h-0.5 w-12 bg-accent/60 mx-auto mt-2 rounded-full transition-all duration-500 group-hover:w-16 group-hover:bg-yellow-300/80" />
            </div>

            {/* Floating particles effect */}
            {isHovered && (
              <>
                <div
                  className="absolute top-1/4 left-1/4 w-1 h-1 bg-white/60 rounded-full animate-float"
                  style={{ animationDelay: "0s" }}
                />
                <div
                  className="absolute top-1/3 right-1/3 w-1.5 h-1.5 bg-accent/60 rounded-full animate-float"
                  style={{ animationDelay: "0.5s" }}
                />
                <div
                  className="absolute bottom-1/2 left-1/5 w-1 h-1 bg-white/40 rounded-full animate-float"
                  style={{ animationDelay: "1s" }}
                />
              </>
            )}
          </div>
        ) : (
          <div className="text-center text-white/70 animate-fade-in space-y-6">
            {/* Empty state with better visual hierarchy */}
            <div className="flex justify-center mb-6">
              <div className="p-4 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 transition-all duration-500 group-hover:bg-white/10">
                <Sparkles className="h-8 w-8 text-white/50" />
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="verse-elegant text-xl font-semibold text-white/80 transition-all duration-300 group-hover:text-white/95">
                Your Masterpiece Awaits
              </h3>
              <p className="verse-elegant text-base leading-relaxed transition-all duration-300 group-hover:text-white/85 max-w-xs mx-auto">
                Upload an image and choose a verse to create your inspiring card
              </p>
            </div>

            {/* Progress indicators */}
            <div className="flex justify-center items-center gap-3 mt-8">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
                <div className="w-2 h-2 rounded-full bg-white/40" />
                <span className="text-xs text-white/60 font-medium">Image</span>
              </div>
              <div className="w-4 h-px bg-white/20" />
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
                <div className="w-2 h-2 rounded-full bg-white/40" />
                <span className="text-xs text-white/60 font-medium">Verse</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Corner accent */}
      <div className="absolute bottom-0 right-0 w-16 h-16 bg-gradient-to-tl from-accent/20 to-transparent rounded-tl-full transition-all duration-500 group-hover:w-20 group-hover:h-20 group-hover:from-accent/30" />

      {/* Border glow effect */}
      <div className="absolute inset-0 rounded-3xl border border-white/10 transition-all duration-500 group-hover:border-accent/30 group-hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)]" />
    </div>
  );
};
