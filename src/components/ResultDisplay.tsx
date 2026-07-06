import { Card } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";

interface ResultDisplayProps {
  result: string;
}

const ResultDisplay = ({ result }: ResultDisplayProps) => {
  // Clean up the result text
  const cleanedResult = result
    .replace(/\\n/g, "<br>")
    .replace(/\\"/g, '"');

  return (
    <div className="w-full max-w-4xl mx-auto mt-8 animate-in fade-in-50 duration-500">
      <div className="flex items-center gap-2 mb-4">
        <CheckCircle2 className="w-6 h-6 text-primary" />
        <h3 className="text-xl font-semibold text-foreground">Analysis Result</h3>
      </div>
      
      <Card className="p-8 bg-muted border-primary/20 shadow-sm">
        <div
          className="prose prose-sm max-w-none text-foreground leading-relaxed"
          dangerouslySetInnerHTML={{ __html: cleanedResult }}
        />
      </Card>
    </div>
  );
};

export default ResultDisplay;
