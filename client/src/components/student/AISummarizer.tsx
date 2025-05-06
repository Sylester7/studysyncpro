import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { apiRequest } from '@/lib/queryClient';

export default function AISummarizer() {
  const [text, setText] = useState('');
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSummarize = async () => {
    if (!text.trim()) {
      toast({
        title: "Error",
        description: "Please enter some text to summarize",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiRequest.post('/api/summarize', { content: text });
      setSummary(response.data.summary);
      toast({
        title: "Success",
        description: "Text summarized successfully"
      });
    } catch (error) {
      console.error('Error summarizing text:', error);
      toast({
        title: "Error",
        description: "Failed to summarize text. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>AI Text Summarizer</CardTitle>
            <CardDescription>
              Enter your text below and get an AI-generated summary
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Textarea
                placeholder="Enter your text here..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="min-h-[200px]"
              />
              <Button 
                onClick={handleSummarize} 
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Summarizing...
                  </>
                ) : (
                  'Summarize Text'
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {summary && (
          <Card>
            <CardHeader>
              <CardTitle>Summary</CardTitle>
              <CardDescription>
                AI-generated summary of your text
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="prose dark:prose-invert max-w-none">
                {summary}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
} 