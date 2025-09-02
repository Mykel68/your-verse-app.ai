"use client";

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Share2, Sparkles, Heart, Image, BookOpen, Palette, CheckCircle } from 'lucide-react';
import { toast } from "sonner"
import html2canvas from 'html2canvas';

// Mock ImageUpload component for demonstration
const ImageUpload = ({ onImageSelected, currentImage, onImageRemoved }: {
    onImageSelected: (imageUrl: string) => void;
    currentImage: string | null;
    onImageRemoved: () => void;
}) => {
  const handleFileSelect = (e: any) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => onImageSelected(e.target.result );
      reader.readAsDataURL(file);
    }
  };

  if (currentImage) {
    return (
      <Card className="relative p-4 gradient-card border-border shadow-card hover:shadow-divine transition-all duration-500">
        <div className="relative group overflow-hidden rounded-xl">
          <img src={currentImage} alt="Selected" className="w-full h-32 object-cover" />
          <Button
            variant="destructive"
            size="sm"
            className="absolute top-2 right-2"
            onClick={onImageRemoved}
          >
            ×
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-8 border-2 border-dashed border-border hover:border-accent/50 transition-all cursor-pointer">
      <div className="text-center space-y-4">
        <Image className="h-12 w-12 text-muted-foreground mx-auto" />
        <div>
          <h3 className="text-lg font-semibold">Upload an Image</h3>
          <p className="text-muted-foreground">Drag & drop or click to browse</p>
        </div>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="absolute inset-0 opacity-0 cursor-pointer"
        />
      </div>
    </Card>
  );
};

// Mock VerseSelector component
const VerseSelector = ({ onVerseSelected, currentVerse }: {
    onVerseSelected: (verse: { text: string; reference: string }) => void;
    currentVerse: { text: string; reference: string } | null;
}) => {
  const verses = [
    { text: "For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, to give you hope and a future.", reference: "Jeremiah 29:11" },
    { text: "Trust in the Lord with all your heart and lean not on your own understanding.", reference: "Proverbs 3:5" },
    { text: "I can do all things through Christ who strengthens me.", reference: "Philippians 4:13" }
  ];

  return (
    <Card className="p-6 gradient-card border shadow-card">
      <div className="space-y-4">
        {verses.map((verse, index) => (
          <Button
            key={index}
            variant="outline"
            className="w-full text-left p-4 h-auto hover:bg-accent/10"
            onClick={() => onVerseSelected(verse)}
          >
            <div className="space-y-2">
              <p className="text-sm">"{verse.text.substring(0, 60)}..."</p>
              <p className="text-xs text-muted-foreground">{verse.reference}</p>
            </div>
          </Button>
        ))}
      </div>
    </Card>
  );
};

// Mock VerseCard component
const VerseCard = ({ imageUrl, verse }: {
    imageUrl: string | null;
    verse: { text: string; reference: string } | null;
}) => {
  return (
    <div className="relative w-full max-w-md mx-auto aspect-[4/5] overflow-hidden rounded-3xl shadow-divine">
      {imageUrl ? (
        <img src={imageUrl} alt="Card background" className="absolute inset-0 w-full h-full object-cover" />
      ) : (
        <div className="absolute inset-0 gradient-divine" />
      )}
      
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
      
      <div className="relative h-full flex flex-col justify-end p-8">
        {verse ? (
          <div className="text-center space-y-4 text-white">
            <blockquote className="text-lg font-medium">
              "{verse.text}"
            </blockquote>
            <cite className="block text-accent text-sm font-semibold">
              {verse.reference}
            </cite>
          </div>
        ) : (
          <div className="text-center text-white/70">
            <p>Your verse card preview will appear here</p>
          </div>
        )}
      </div>
    </div>
  );
};

interface Verse {
  text: string;
  reference: string;
}

export default function CardEditor() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedVerse, setSelectedVerse] = useState<Verse | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const handleImageSelected = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setCurrentStep(2);
    toast.success("Image uploaded successfully!");
  };

  const handleImageRemoved = () => {
    setSelectedImage(null);
    setCurrentStep(1);
    toast("Image removed. Upload a new image to continue");
  };

  const handleVerseSelected = (verse: Verse) => {
    setSelectedVerse(verse);
    setCurrentStep(3);
    toast.success("Verse selected!");
  };

  const handleDownload = async () => {
    if (!selectedVerse) {
      toast.error("Please select a verse first");
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
        scale: 2,
        useCORS: true,
        allowTaint: true,
      });

      const link = document.createElement('a');
      link.download = `verse-card-${selectedVerse.reference.replace(/[^a-zA-Z0-9]/g, '-')}.png`;
      link.href = canvas.toDataURL('image/png');
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("Card downloaded successfully!");
    } catch (error) {
      console.error('Error downloading card:', error);
      toast.error("Download failed. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleShare = async () => {
    if (!selectedVerse) {
      toast.error("Please select a verse first");
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
      const shareText = `"${selectedVerse.text}" - ${selectedVerse.reference}`;
      await navigator.clipboard.writeText(shareText);
      toast.success("Copied to clipboard!");
    }
  };

  const steps = [
    { 
      number: 1, 
      title: "Choose Image", 
      icon: Image, 
      description: "Upload your background image",
      completed: !!selectedImage 
    },
    { 
      number: 2, 
      title: "Select Verse", 
      icon: BookOpen, 
      description: "Pick your favorite scripture",
      completed: !!selectedVerse 
    },
    { 
      number: 3, 
      title: "Create & Share", 
      icon: Palette, 
      description: "Download or share your card",
      completed: !!(selectedImage && selectedVerse) 
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 relative overflow-hidden">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-100 via-transparent to-purple-100 opacity-40" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-indigo-400/20 to-cyan-400/20 rounded-full blur-3xl" />
      
      {/* Floating decorative elements */}
      <div className="absolute top-20 left-20 w-4 h-4 bg-blue-400/30 rounded-full animate-pulse" />
      <div className="absolute top-40 right-32 w-3 h-3 bg-purple-400/40 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute bottom-32 left-32 w-2 h-2 bg-indigo-400/50 rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
      
      <div className="relative z-10">
        {/* Enhanced Header */}
        <header className="text-center py-16 px-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-6 mb-8">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-xl">
                <Sparkles className="h-10 w-10 text-white" />
              </div>
              <h1 className="text-5xl lg:text-7xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Verse Canvas
              </h1>
              <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-xl">
                <Heart className="h-10 w-10 text-white" />
              </div>
            </div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Transform sacred words into stunning visual masterpieces. Create inspirational cards that touch hearts and illuminate souls.
            </p>
            
            {/* Progress Steps */}
            <div className="mt-12 flex justify-center">
              <div className="flex items-center gap-4 bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20">
                {steps.map((step, index) => (
                  <div key={step.number} className="flex items-center">
                    <div className={`flex items-center gap-3 px-4 py-2 rounded-xl transition-all duration-500 ${
                      step.completed 
                        ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg' 
                        : currentStep === step.number 
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg' 
                        : 'bg-gray-100 text-gray-500'
                    }`}>
                      {step.completed ? (
                        <CheckCircle className="h-5 w-5" />
                      ) : (
                        <step.icon className="h-5 w-5" />
                      )}
                      <div className="text-sm font-semibold">
                        {step.title}
                      </div>
                    </div>
                    {index < steps.length - 1 && (
                      <div className="w-8 h-px bg-gray-300 mx-2" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-6 pb-20">
          <div className="grid lg:grid-cols-5 gap-8 items-start">
            {/* Left Panel - Enhanced Editor */}
            <div className="lg:col-span-3 space-y-8">
              {/* Step 1: Image Upload */}
              <div className="group">
                <div className="flex items-center gap-4 mb-6">
                  <div className={`p-3 rounded-xl transition-all duration-300 ${
                    selectedImage 
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500 shadow-lg' 
                      : currentStep === 1 
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg' 
                      : 'bg-gray-200'
                  }`}>
                    {selectedImage ? (
                      <CheckCircle className="h-6 w-6 text-white" />
                    ) : (
                      <Image className="h-6 w-6 text-white" />
                    )}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">Choose Your Canvas</h2>
                    <p className="text-gray-600">Select a beautiful background for your verse</p>
                  </div>
                </div>
                <ImageUpload
                  onImageSelected={handleImageSelected}
                  currentImage={selectedImage}
                  onImageRemoved={handleImageRemoved}
                />
              </div>

              {/* Step 2: Verse Selection */}
              <div className="group">
                <div className="flex items-center gap-4 mb-6">
                  <div className={`p-3 rounded-xl transition-all duration-300 ${
                    selectedVerse 
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500 shadow-lg' 
                      : currentStep === 2 
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg' 
                      : 'bg-gray-200'
                  }`}>
                    {selectedVerse ? (
                      <CheckCircle className="h-6 w-6 text-white" />
                    ) : (
                      <BookOpen className="h-6 w-6 text-white" />
                    )}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">Select Your Verse</h2>
                    <p className="text-gray-600">Choose words that inspire and uplift</p>
                  </div>
                </div>
                <VerseSelector
                  onVerseSelected={handleVerseSelected}
                  currentVerse={selectedVerse}
                />
              </div>

              {/* Step 3: Action Buttons */}
              <div className="group">
                <div className="flex items-center gap-4 mb-6">
                  <div className={`p-3 rounded-xl transition-all duration-300 ${
                    selectedImage && selectedVerse 
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500 shadow-lg' 
                      : currentStep === 3 
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg' 
                      : 'bg-gray-200'
                  }`}>
                    <Palette className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">Create & Share</h2>
                    <p className="text-gray-600">Download your masterpiece or share with others</p>
                  </div>
                </div>
                
                <Card className="p-8 bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200 shadow-xl">
                  <div className="grid gap-4">
                    <Button
                      onClick={handleDownload}
                      disabled={isDownloading || !selectedVerse}
                      size="lg"
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg transition-all duration-300 hover:scale-105 disabled:hover:scale-100 h-14"
                    >
                      {isDownloading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3" />
                          Creating Your Card...
                        </>
                      ) : (
                        <>
                          <Download className="mr-3 h-5 w-5" />
                          Download High-Quality Card
                        </>
                      )}
                    </Button>
                    
                    <Button
                      onClick={handleShare}
                      disabled={!selectedVerse}
                      variant="outline"
                      size="lg"
                      className="border-2 border-gray-300 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 hover:border-purple-300 transition-all duration-300 hover:scale-105 disabled:hover:scale-100 h-14"
                    >
                      <Share2 className="mr-3 h-5 w-5" />
                      Share Your Creation
                    </Button>
                  </div>
                  
                  {selectedImage && selectedVerse && (
                    <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <p className="text-green-800 font-medium">Your card is ready to download!</p>
                      </div>
                    </div>
                  )}
                </Card>
              </div>
            </div>

            {/* Right Panel - Enhanced Preview */}
            <div className="lg:col-span-2">
              <div className="sticky top-8">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm rounded-2xl px-6 py-3 shadow-xl border border-white/20">
                    <Sparkles className="h-5 w-5 text-purple-600" />
                    <h3 className="text-lg font-bold text-gray-800">Live Preview</h3>
                    <Sparkles className="h-5 w-5 text-purple-600" />
                  </div>
                  <p className="text-gray-600 mt-3">Watch your masterpiece come to life</p>
                </div>
                
                <div className="flex justify-center">
                  <div 
                    id="verse-card" 
                    className="transition-all duration-700 hover:scale-105"
                    style={{ 
                      filter: selectedImage && selectedVerse ? 'none' : 'grayscale(0.3) opacity(0.7)',
                    }}
                  >
                    <VerseCard
                      imageUrl={selectedImage}
                      verse={selectedVerse}
                    />
                  </div>
                </div>
                
                {/* Enhanced Progress Indicator */}
                <div className="mt-8 flex justify-center">
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-xl border border-white/20">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full transition-all duration-300 ${selectedImage ? 'bg-green-500 shadow-lg' : 'bg-gray-300'}`} />
                        <span className="text-sm font-medium text-gray-700">Image</span>
                      </div>
                      <div className="w-6 h-px bg-gray-300" />
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full transition-all duration-300 ${selectedVerse ? 'bg-green-500 shadow-lg' : 'bg-gray-300'}`} />
                        <span className="text-sm font-medium text-gray-700">Verse</span>
                      </div>
                      <div className="w-6 h-px bg-gray-300" />
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full transition-all duration-300 ${selectedImage && selectedVerse ? 'bg-green-500 shadow-lg animate-pulse' : 'bg-gray-300'}`} />
                        <span className="text-sm font-medium text-gray-700">Ready</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}