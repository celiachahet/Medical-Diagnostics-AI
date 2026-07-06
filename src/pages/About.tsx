import { Card } from "@/components/ui/card";
import { Sparkles, ShieldAlert, Bot } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-6 py-16 max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 text-center">
          About <span className="text-primary">Medical AI</span>
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed text-center max-w-2xl mx-auto mb-12">
          Medical AI is a document analysis and assistant tool built to make sense
          of medical reports faster, using retrieval-augmented AI grounded in
          reliable data sources.
        </p>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="p-6 bg-card border-border text-center">
            <Sparkles className="w-8 h-8 text-primary mx-auto mb-3" />
            <h3 className="font-semibold text-foreground mb-2">AI-Powered Analysis</h3>
            <p className="text-sm text-muted-foreground">
              Upload a medical PDF and ask specific questions — the assistant reads
              the document and answers based only on its content.
            </p>
          </Card>

          <Card className="p-6 bg-card border-border text-center">
            <Bot className="w-8 h-8 text-primary mx-auto mb-3" />
            <h3 className="font-semibold text-foreground mb-2">Grounded Chatbot</h3>
            <p className="text-sm text-muted-foreground">
              For general health questions, the built-in assistant draws on
              official WHO medical data to reduce hallucinated answers.
            </p>
          </Card>

          <Card className="p-6 bg-card border-border text-center">
            <ShieldAlert className="w-8 h-8 text-primary mx-auto mb-3" />
            <h3 className="font-semibold text-foreground mb-2">Not a Diagnostic Tool</h3>
            <p className="text-sm text-muted-foreground">
              This project is an educational portfolio piece. It does not replace
              professional medical advice, diagnosis, or treatment.
            </p>
          </Card>
        </div>


      </main>
    </div>
  );
};

export default About;