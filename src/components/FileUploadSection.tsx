import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Upload, FileText, Loader2, Download } from "lucide-react";
import { toast } from "sonner";
import { jsPDF } from "jspdf";

interface FileUploadSectionProps {
  onAnalysisComplete: (result: string) => void;
}

const downloadPDF = (summary: string, fileName: string) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margins = 20;
  const maxWidth = pageWidth - (margins * 2);
  
  doc.setFontSize(16);
  doc.text("Medical Document Summary", margins, 20);
  
  doc.setFontSize(11);
  const lines = doc.splitTextToSize(summary, maxWidth);
  doc.text(lines, margins, 35);
  
  doc.save(fileName);
};

const FileUploadSection = ({ onAnalysisComplete }: FileUploadSectionProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [question, setQuestion] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const WEBHOOK_URL = "http://localhost:5678/webhook/medical-summary";

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
      toast.success("PDF uploaded successfully");
    } else {
      toast.error("Please upload a PDF file");
    }
  };

  const handleAnalysis = async () => {
    if (!file || !question.trim()) {
      toast.error("Please upload a file and enter a question");
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("question", question);

      const response = await fetch(WEBHOOK_URL, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        const summary = result[0]?.output || "No response received.";
        onAnalysisComplete(summary);
        
        // Show success with download option
        toast.success("Analysis completed successfully", {
          action: {
            label: "Download PDF",
            onClick: () => downloadPDF(summary, "resume.pdf")
          }
        });
      } else {
        toast.error(`Error: ${response.status}`);
      }
    } catch (error) {
      toast.error("Connection error. Please try again.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-6 bg-card border-border shadow-sm">
      <div className="space-y-5">
          {/* File Upload */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-3">
              1. Upload Your PDF Document
            </label>
            <div className="relative">
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="flex items-center justify-center gap-3 p-6 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary transition-colors bg-muted/30"
              >
                {file ? (
                  <>
                    <FileText className="w-6 h-6 text-primary" />
                    <span className="text-foreground font-medium">{file.name}</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-6 h-6 text-muted-foreground" />
                    <span className="text-muted-foreground">Click to upload PDF</span>
                  </>
                )}
              </label>
            </div>
          </div>

          {/* Question Input */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-3">
              2. Ask Your Specific Question
            </label>
            <Textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ex: 'What are the symptoms mentioned?' or 'Summarize this document.'"
              className="min-h-[150px] resize-none bg-background"
            />
          </div>

          {/* Submit Button */}
          <Button
            onClick={handleAnalysis}
            disabled={isLoading}
            variant="medical"
            size="lg"
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Analyzing...
              </>
            ) : (
              "Start Analysis"
            )}
          </Button>
      </div>
    </Card>
  );
};

export default FileUploadSection;
