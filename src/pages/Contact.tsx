import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Linkedin, Github, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import emailjs from "@emailjs/browser";

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

const Contact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !message.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
      toast.error("Email service not configured yet (missing EmailJS keys in .env)");
      return;
    }

    setIsSending(true);

    try {
      await emailjs.send(
        SERVICE_ID,
        TEMPLATE_ID,
        {
          from_name: name,
          from_email: email,
          message: message,
        },
        { publicKey: PUBLIC_KEY }
      );

      toast.success("Message sent! I'll get back to you soon.");
      setName("");
      setEmail("");
      setMessage("");
    } catch (error) {
      console.error(error);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-6 py-16 max-w-3xl">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 text-center">
          Get in <span className="text-primary">Touch</span>
        </h1>
        <p className="text-lg text-muted-foreground text-center mb-12">
          Questions about the project, feedback, or a collaboration idea?
          Reach out.
        </p>

    <div className="flex justify-center">
            <Card className="w-full max-w-xl p-6 bg-card border-border">
            <h2 className="text-xl font-semibold text-foreground mb-4">Send a message</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isSending}
              />
              <Input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSending}
              />
              <Textarea
                placeholder="Your message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="min-h-[120px] resize-none"
                disabled={isSending}
              />
              <Button type="submit" variant="medical" className="w-full" disabled={isSending}>
                {isSending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Sending...
                  </>
                ) : (
                  "Send Message"
                )}
              </Button>
            </form>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Contact;