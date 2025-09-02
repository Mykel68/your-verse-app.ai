"use client";

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Share2, Sparkles, Heart } from 'lucide-react';
// import { ImageUpload } from './ImageUpload';
// import { VerseSelector } from './VerseSelector';
// import { VerseCard } from './VerseCard';
// import { useToast } from '@/components/ui/use-toast';
import { toast } from "sonner"
import html2canvas from 'html2canvas';
import { ImageUpload } from './ImageUpload';
import { VerseSelector } from './VerseSelector';
import { VerseCard } from './VerseCard';

interface Verse {
  text: string;
  reference: string;
}

export const CardEditor = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedVerse, setSelectedVerse] = useState<Verse | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
//   const { toast } = useToast();

  const handleImageSelected = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    // toast({
    //   title: "Image uploaded successfully!",
    //   description: "Your image is ready to use",
    // });
    toast.success("Image uploaded successfully!");
  };

  const handleImageRemoved = () => {
    setSelectedImage(null);
    // toast({
    //   title: "Image removed",
    //   description: "Upload a new image to continue",
    // });
    toast("Image removed. Upload a new image to continue");
  };

  const handleVerseSelected = (verse: Verse) => {
    setSelectedVerse(verse);
  };

  const handleDownload = async () => {
    if (!selectedVerse) {
    //   toast({
    //     title: "Please select a verse",
    //     description: "Add a verse to your card before downloading",
    //     variant: "destructive",
    //   });
    toast.error("Please select a verse. Add a verse to your card before downloading");
      return;
    }

    setIsDownloading(true);
    
    try {
      const cardElement = document.getElementById('verse-card');
      if (!cardElement) {
        throw new Error('Card element not found');
      }

      const canvas = await html2canvas(cardElement, {
        backgroundColor: null,
        scale: 2, // Higher quality
        useCORS: true,
        allowTaint: true,
      });

      // Create download link
      const link = document.createElement('a');
      link.download = `verse-card-${selectedVerse.reference.replace(/[^a-zA-Z0-9]/g, '-')}.png`;
      link.href = canvas.toDataURL('image/png');
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

    //   toast({
    //     title: "Card downloaded!",
    //     description: "Your verse card has been saved to your device",
    //   });
    toast.success("Card downloaded! Your verse card has been saved to your device");
    } catch (error) {
      console.error('Error downloading card:', error);
    //   toast({
    //     title: "Download failed",
    //     description: "There was an error creating your card. Please try again.",
    //     variant: "destructive",
    //   });
    toast.error("Download failed. There was an error creating your card. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleShare = async () => {
    if (!selectedVerse) {
    //   toast({
    //     title: "Please select a verse",
    //     description: "Add a verse to your card before sharing",
    //     variant: "destructive",
    //   });
    toast.error("Please select a verse. Add a verse to your card before sharing");
      return;
    }

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Beautiful Bible Verse Card',
          text: `"${selectedVerse.text}" - ${selectedVerse.reference}`,
          url: window.location.href,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      const shareText = `"${selectedVerse.text}" - ${selectedVerse.reference}`;
      await navigator.clipboard.writeText(shareText);
    //   toast({
    //     title: "Copied to clipboard!",
    //     description: "Verse text has been copied for sharing",
    //   });
    toast.success("Copied to clipboard! Verse text has been copied for sharing");
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-primary/5 pointer-events-none" />
      <div className="absolute top-1/4 -right-32 w-64 h-64 bg-accent/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -left-32 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      
      <div className="relative z-10 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 animate-fade-in">
            <div className="inline-flex items-center gap-2 mb-4">
              <Sparkles className="h-8 w-8 text-accent animate-pulse-glow" />
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold gradient-divine bg-clip-text text-transparent">
                Bible Verse Card Creator
              </h1>
              <Heart className="h-8 w-8 text-accent animate-float" />
            </div>
            <p className="text-muted-foreground text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
              Transform your favorite scriptures into stunning visual cards that inspire and uplift
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 xl:gap-12 items-start">
            {/* Left Panel - Editor */}
            <div className="space-y-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
              {/* Image Upload */}
              <div className="group">
                <h2 className="text-xl font-semibold mb-6 flex items-center transition-transform group-hover:translate-x-1">
                  <span className="w-10 h-10 rounded-xl gradient-divine text-primary-foreground flex items-center justify-center text-sm font-bold mr-4 shadow-lg transition-transform group-hover:scale-110">
                    1
                  </span>
                  Upload Your Image
                </h2>
                <ImageUpload
                  onImageSelected={handleImageSelected}
                  currentImage={selectedImage}
                  onImageRemoved={handleImageRemoved}
                />
              </div>

              {/* Verse Selection */}
              <div className="group">
                <h2 className="text-xl font-semibold mb-6 flex items-center transition-transform group-hover:translate-x-1">
                  <span className="w-10 h-10 rounded-xl gradient-divine text-primary-foreground flex items-center justify-center text-sm font-bold mr-4 shadow-lg transition-transform group-hover:scale-110">
                    2
                  </span>
                  Choose Your Verse
                </h2>
              <VerseSelector
                onVerseSelected={handleVerseSelected}
                currentVerse={selectedVerse}
              />
            </div>

              {/* Action Buttons */}
              <div className="group">
                <Card className="p-6 gradient-card border shadow-card hover:shadow-divine transition-all duration-500">
                  <h3 className="text-lg font-semibold mb-6 text-center flex items-center justify-center gap-2">
                    <span className="w-10 h-10 rounded-xl gradient-divine text-primary-foreground flex items-center justify-center text-sm font-bold shadow-lg">
                      3
                    </span>
                    Download & Share
                  </h3>
                  <div className="flex gap-4">
                    <Button
                      onClick={handleDownload}
                      disabled={isDownloading || !selectedVerse}
                      className="flex-1 gradient-divine text-primary-foreground hover:opacity-90 transition-all duration-300 hover:scale-105 hover:shadow-lg disabled:hover:scale-100"
                    >
                      {isDownloading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                          Creating...
                        </>
                      ) : (
                        <>
                          <Download className="mr-2 h-4 w-4" />
                          Download
                        </>
                      )}
                    </Button>
                    <Button
                      onClick={handleShare}
                      disabled={!selectedVerse}
                      variant="outline"
                      className="flex-1 hover:gradient-golden hover:text-accent-foreground transition-all duration-300 hover:scale-105 hover:shadow-lg disabled:hover:scale-100"
                    >
                      <Share2 className="mr-2 h-4 w-4" />
                      Share
                    </Button>
                  </div>
                </Card>
              </div>
            </div>

            {/* Right Panel - Preview */}
            <div className="sticky top-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <div className="text-center mb-6">
                <h2 className="text-xl font-semibold mb-2 flex items-center justify-center gap-2">
                  <Sparkles className="h-5 w-5 text-accent" />
                  Live Preview
                  <Sparkles className="h-5 w-5 text-accent" />
                </h2>
                <p className="text-muted-foreground text-sm">Your card updates in real-time</p>
              </div>
              <div className="flex justify-center">
                <div 
                  id="verse-card" 
                  className="w-full max-w-sm transition-all duration-500 hover:scale-105"
                  style={{ 
                    filter: selectedImage && selectedVerse ? 'none' : 'grayscale(0.3) opacity(0.7)',
                    transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                >
                  <VerseCard
                    imageUrl={selectedImage}
                    verse={selectedVerse}
                    className="mx-auto animate-scale-in"
                  />
                </div>
              </div>
              
              {/* Progress indicator */}
              <div className="mt-6 flex justify-center">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full transition-all duration-300 ${selectedImage ? 'bg-accent' : 'bg-muted-foreground/30'}`} />
                  <div className="w-8 h-px bg-muted-foreground/20" />
                  <div className={`w-2 h-2 rounded-full transition-all duration-300 ${selectedVerse ? 'bg-accent' : 'bg-muted-foreground/30'}`} />
                  <div className="w-8 h-px bg-muted-foreground/20" />
                  <div className={`w-2 h-2 rounded-full transition-all duration-300 ${selectedImage && selectedVerse ? 'bg-accent animate-pulse-glow' : 'bg-muted-foreground/30'}`} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};