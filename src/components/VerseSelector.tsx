import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shuffle, Loader2, Heart, Sparkles } from 'lucide-react';
// import { useToast } from '@/components/ui/use-toast';
import { toast } from "sonner"
import { popularVerses } from '@/constants/popular-verse';

interface Verse {
  text: string;
  reference: string;
}

interface VerseSelectorProps {
  onVerseSelected: (verse: Verse) => void;
  currentVerse: Verse | null;
}

export const VerseSelector = ({ onVerseSelected, currentVerse }: VerseSelectorProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [customText, setCustomText] = useState('');
  const [customReference, setCustomReference] = useState('');
//   const { toast } = useToast();
 
  const getRandomVerse = async () => {
    setIsLoading(true);
    try {
      // Get list of available Bible versions first
      const versionsResponse = await fetch('https://cdn.jsdelivr.net/gh/wldeh/bible-api/bibles/bibles.json');
      const versions = await versionsResponse.json();
      
      // Use English ASV version
      const version = 'en-asv';
      
      // List of popular books and their chapter ranges
      const books = [
        { name: 'psalms', maxChapter: 150 },
        { name: 'proverbs', maxChapter: 31 },
        { name: 'john', maxChapter: 21 },
        { name: 'romans', maxChapter: 16 },
        { name: 'matthew', maxChapter: 28 },
        { name: 'philippians', maxChapter: 4 },
        { name: 'ephesians', maxChapter: 6 },
        { name: 'james', maxChapter: 5 },
        { name: '1peter', maxChapter: 5 }
      ];
      
      // Select random book and chapter
      const randomBook = books[Math.floor(Math.random() * books.length)];
      const randomChapter = Math.floor(Math.random() * randomBook.maxChapter) + 1;
      
      // Fetch the chapter to get available verses
      const chapterResponse = await fetch(
        `https://cdn.jsdelivr.net/gh/wldeh/bible-api/bibles/${version}/books/${randomBook.name}/chapters/${randomChapter}.json`
      );
      
      if (!chapterResponse.ok) {
        throw new Error('Failed to fetch chapter');
      }
      
      const chapterData = await chapterResponse.json();
      const verses = chapterData.verses || [];
      
      if (verses.length === 0) {
        throw new Error('No verses found in chapter');
      }
      
      // Select a random verse
      const randomVerse = verses[Math.floor(Math.random() * verses.length)];
      
      const verse = {
        text: randomVerse.text,
        reference: `${randomVerse.book} ${randomVerse.chapter}:${randomVerse.verse}`
      };
      
      onVerseSelected(verse);
    //   toast({
    //     title: "Random verse loaded!",
    //     description: verse.reference,
    //   });
    toast.success("Random verse loaded!");
      
    } catch (error) {
      console.error('Error fetching random verse:', error);
      // Fallback to a popular verse
      const fallbackVerse = popularVerses[Math.floor(Math.random() * popularVerses.length)];
      onVerseSelected(fallbackVerse);
    //   toast({
    //     title: "Using popular verse",
    //     description: "Couldn't fetch random verse, using a popular one instead",
    //   });
    toast.error("Couldn't fetch random verse, using a popular one instead");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCustomVerseSubmit = () => {
    if (!customText.trim()) {
    //   toast({
    //     title: "Please enter verse text",
    //     variant: "destructive",
    //   });
    toast.error("Please enter verse text");
      return;
    }

    const verse = {
      text: customText.trim(),
      reference: customReference.trim() || "Custom Verse"
    };

    onVerseSelected(verse);
    // toast({
    //   title: "Custom verse added!",
    //   description: verse.reference,
    // });
    toast.success("Custom verse added!");
  };

  // Update form when current verse changes
  useEffect(() => {
    if (currentVerse) {
      setCustomText(currentVerse.text);
      setCustomReference(currentVerse.reference);
    }
  }, [currentVerse]);

  return (
    <Card className="p-6 gradient-card border shadow-card hover:shadow-divine transition-all duration-500">
      <Tabs defaultValue="random" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-muted/50 p-1 rounded-lg">
          <TabsTrigger 
            value="random" 
            className="rounded-md transition-all duration-300 data-[state=active]:gradient-divine data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg"
          >
            Random
          </TabsTrigger>
          <TabsTrigger 
            value="popular"
            className="rounded-md transition-all duration-300 data-[state=active]:gradient-divine data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg"
          >
            Popular
          </TabsTrigger>
          <TabsTrigger 
            value="custom"
            className="rounded-md transition-all duration-300 data-[state=active]:gradient-divine data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg"
          >
            Custom
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="random" className="space-y-6 animate-fade-in">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 p-3 rounded-full bg-accent/10">
              <Shuffle className="h-5 w-5 text-accent" />
            </div>
            <h3 className="text-lg font-semibold">Discover Scripture</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Let the Holy Spirit guide you to a beautiful verse from God's Word
            </p>
            <Button 
              onClick={getRandomVerse} 
              disabled={isLoading}
              className="w-full gradient-divine text-primary-foreground hover:opacity-90 transition-all duration-300 hover:scale-105 hover:shadow-lg disabled:hover:scale-100"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                  Finding verse...
                </>
              ) : (
                <>
                  <Shuffle className="mr-2 h-4 w-4" />
                  Get Random Verse
                </>
              )}
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="popular" className="space-y-6 animate-fade-in">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 p-3 rounded-full bg-accent/10 mb-4">
              <Heart className="h-5 w-5 text-accent" />
            </div>
            <h3 className="text-lg font-semibold">Beloved Scriptures</h3>
            <p className="text-muted-foreground text-sm">Timeless verses that inspire millions</p>
          </div>
          <div className="space-y-3 max-h-72 overflow-y-auto pr-2 scrollbar-thin scrollbar-track-muted/20 scrollbar-thumb-muted/40">
            {popularVerses.map((verse, index) => (
              <Button
                key={index}
                variant="outline"
                className="w-full text-left p-4 h-auto hover:gradient-golden hover:text-accent-foreground transition-all duration-300 hover:scale-105 hover:shadow-md group"
                onClick={() => onVerseSelected(verse)}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="space-y-2">
                  <p className="text-sm leading-relaxed verse-text">"{verse.text.substring(0, 80)}..."</p>
                  <p className="text-xs text-muted-foreground font-semibold group-hover:text-accent-foreground/80">{verse.reference}</p>
                </div>
              </Button>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="custom" className="space-y-6 animate-fade-in">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 p-3 rounded-full bg-accent/10 mb-4">
              <Sparkles className="h-5 w-5 text-accent" />
            </div>
            <h3 className="text-lg font-semibold">Your Personal Scripture</h3>
            <p className="text-muted-foreground text-sm">Share your favorite verse or inspirational quote</p>
          </div>
          
          <div className="space-y-6">
            <div className="space-y-3">
              <label className="text-sm font-medium flex items-center gap-2">
                <span className="w-2 h-2 bg-accent rounded-full" />
                Verse Text
              </label>
              <Textarea
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                placeholder="Enter your verse text here..."
                className="min-h-24 resize-none verse-text transition-all duration-300 focus:ring-2 focus:ring-accent/50 focus:border-accent"
              />
            </div>
            
            <div className="space-y-3">
              <label className="text-sm font-medium flex items-center gap-2">
                <span className="w-2 h-2 bg-accent rounded-full" />
                Reference
              </label>
              <Textarea
                value={customReference}
                onChange={(e) => setCustomReference(e.target.value)}
                placeholder="e.g., John 3:16 or Custom Quote"
                className="min-h-12 resize-none transition-all duration-300 focus:ring-2 focus:ring-accent/50 focus:border-accent"
              />
            </div>
            
            <Button 
              onClick={handleCustomVerseSubmit}
              className="w-full gradient-divine text-primary-foreground hover:opacity-90 transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              <Sparkles className="mr-2 h-4 w-4" />
              Add Custom Verse
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
};