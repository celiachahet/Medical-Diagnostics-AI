import { useState } from "react";
import FileUploadSection from "@/components/FileUploadSection";
import ChatbotSection from "@/components/ChatbotSection";
import ResultDisplay from "@/components/ResultDisplay";
import medicalHero from "@/assets/medical-hero.png";
import jsPDF from "jspdf"; // <-- ajoute cette ligne en haut du fichier


const Index = () => {
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);

// ✅ Fonction complète pour télécharger le résumé en PDF

    const handleDownloadPDF = () => {
      if (!analysisResult) return;

      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      // 🩺 Titre du document
      doc.setFont("helvetica", "bold");
      doc.setFontSize(18);
      doc.text("Medical Summary", 20, 20);

      // 📝 Contenu du résumé
      doc.setFont("helvetica", "normal");
      doc.setFontSize(12);
      const textLines = doc.splitTextToSize(analysisResult, 170);
      doc.text(textLines, 20, 35);

      // 💾 Téléchargement automatique
      doc.save("Medical_Summary.pdf");
    };





  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="flex-1 container mx-auto px-6 py-12">
        {/* --- HERO SECTION --- */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-12 mb-20">
          {/* Image à gauche */}
          <div className="flex-1 flex justify-center">
            <img
              src={medicalHero}
              alt="Illustration médicale"
              className="w-80 md:w-[400px] h-auto rounded-2xl shadow-lg"
            />
          </div>

          {/* Titre et description à droite */}
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
              <span className="text-primary">MEDICAL</span> AI
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8 max-w-xl mx-auto md:mx-0">
              Analyze your <strong>medical documents</strong> with AI-powered intelligence.
              Upload a PDF and ask specific questions to get detailed summaries and insights.
              For any other health questions, use the integrated <strong>mini chatbot</strong> for quick, reliable answers.
            </p>
          </div>
        </div>

        {/* --- CONTENU PRINCIPAL --- */}
        <div className="grid md:grid-cols-2 gap-10 max-w-6xl mx-auto mb-16">

          {/* Section gauche : Upload */}
          <div className="bg-card shadow-sm rounded-2xl p-6 border border-border">
            <h2 className="text-2xl font-semibold text-foreground mb-4 text-center md:text-left">
              Upload Your Medical File
            </h2>
            <p className="text-muted-foreground mb-6 text-sm text-center md:text-left">
              Select a PDF document to analyze and extract key medical insights.
            </p>
            <FileUploadSection onAnalysisComplete={setAnalysisResult} />
          </div>

          {/* Section droite : Résultats ET Chatbot */}
          <div className="bg-card shadow-sm rounded-2xl p-6 border border-border flex flex-col">

            {/* PARTIE HAUTE : RÉSULTATS (votre snippet) */}
            <div className="flex-1 flex flex-col">
              {!analysisResult ? (
                <div className="flex-1 flex flex-col justify-center items-center text-center text-muted-foreground min-h-[200px]">
                  <p className="text-2xl">🔍</p>
                  <p className="mt-2">Upload a document and click "Analyze" to see the results here.</p>
                </div>
              ) : (
                <div className="flex-1 flex flex-col min-h-0">
                  <div className="overflow-y-auto max-h-[380px] pr-2">
                    <ResultDisplay result={analysisResult} />
                  </div>
                  <button
                    onClick={handleDownloadPDF}
                    className="mt-6 bg-primary text-white py-3 px-6 rounded-xl hover:scale-105 transition-transform shadow-md"
                  >
                    📥 Download Summary (PDF)
                  </button>
                </div>
              )}
            </div>

            {/* PARTIE BASSE : CHATBOT (la "bulle rose") */}
            <div className="mt-6 pt-6 border-t border-border">
              <ChatbotSection />
            </div>

          </div>
        </div>

        {/* --- SECTION DES RÉSULTATS (Supprimée car déplacée à droite) --- */}
        {/* {analysisResult && (
          <div className="max-w-5xl mx-auto mt-12">
            <ResultDisplay result={analysisResult} />
          </div>
        )}
        */}
      </main>

      {/* --- FOOTER --- */}
      <footer className="py-8 border-t border-border text-center text-muted-foreground text-sm">
        © 2025 <strong>Medical AI</strong> – Smart Health Insights & Chatbot Assistant
      </footer>
    </div>
  );
};

export default Index;