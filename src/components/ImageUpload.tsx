import { useCallback, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, Image, X } from "lucide-react";
// import { useToast } from '@/components/ui/use-toast';
import { toast } from "sonner";

interface ImageUploadProps {
  onImageSelected: (imageUrl: string) => void;
  currentImage: string | null;
  onImageRemoved: () => void;
}

export const ImageUpload = ({
  onImageSelected,
  currentImage,
  onImageRemoved,
}: ImageUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  //   const { toast } = useToast();

  const handleFileSelect = useCallback(
    (file: File) => {
      if (!file.type.startsWith("image/")) {
        //   toast({
        //     title: "Invalid file type",
        //     description: "Please select an image file (JPG, PNG, etc.)",
        //     variant: "destructive",
        //   });
        toast.error("Please select an image file (JPG, PNG, etc.)");
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        // 10MB limit
        //   toast({
        //     title: "File too large",
        //     description: "Please select an image smaller than 10MB",
        //     variant: "destructive",
        //   });
        toast.error("Please select an image smaller than 10MB");
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        onImageSelected(result);
      };
      reader.readAsDataURL(file);
    },
    [onImageSelected, toast]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) {
        handleFileSelect(files[0]);
      }
    },
    [handleFileSelect]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  if (currentImage) {
    return (
      <Card className="relative p-4 gradient-card border-border shadow-card hover:shadow-divine transition-all duration-500 animate-scale-in">
        <div className="relative group overflow-hidden rounded-lg">
          <img
            src={currentImage}
            alt="Selected image"
            className="w-full h-70 object-contain transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <Button
            variant="destructive"
            size="sm"
            className="absolute top-2 right-2 opacity-80 hover:opacity-100 transition-all duration-200 hover:scale-110"
            onClick={onImageRemoved}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="text-center mt-3">
          <p className="text-muted-foreground text-sm flex items-center justify-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            Image ready for your card
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card
      className={`group p-8 text-center border-2 border-dashed transition-all duration-500 cursor-pointer hover:shadow-card ${
        isDragging
          ? "border-accent bg-accent/10 scale-105 shadow-lg animate-pulse-glow"
          : "border-border hover:border-accent/50 hover:bg-accent/5"
      }`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onClick={() => document.getElementById("image-input")?.click()}
    >
      <div className="space-y-6">
        <div className="flex justify-center">
          <div
            className={`p-4 rounded-full transition-all duration-300 ${
              isDragging
                ? "bg-accent/20 scale-110"
                : "bg-muted/50 group-hover:bg-accent/10 group-hover:scale-105"
            }`}
          >
            {isDragging ? (
              <Upload className="h-12 w-12 text-accent animate-bounce" />
            ) : (
              <Image className="h-12 w-12 text-muted-foreground group-hover:text-accent transition-colors duration-300" />
            )}
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-foreground transition-colors duration-300 group-hover:text-accent">
            {isDragging ? "Drop your image here" : "Upload an Image"}
          </h3>
          <p className="text-muted-foreground transition-colors duration-300 group-hover:text-foreground">
            Drag & drop an image or click to browse
          </p>
          <p className="text-xs text-muted-foreground">
            Supports JPG, PNG up to 10MB
          </p>
        </div>

        <Button
          variant="outline"
          className="mt-6 transition-all duration-300 hover:gradient-golden hover:text-accent-foreground hover:scale-105 hover:shadow-md"
        >
          Browse Files
        </Button>
      </div>

      <input
        id="image-input"
        type="file"
        accept="image/*"
        onChange={handleFileInput}
        className="hidden"
      />
    </Card>
  );
};
