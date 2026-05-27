// FIXED: Contact Form - submits directly to Web3Forms API from the frontend
import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { SeoHead } from "@/components/SeoHead";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Mail, Send, Loader2, MessageSquare } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function Contact() {
  const { toast } = useToast();
  const [sending, setSending] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.message.length < 20) {
      toast({ title: "Message too short", description: "Please write at least 20 characters.", variant: "destructive" });
      return;
    }
    setSending(true);
    try {
      // Step 1: fetch the Web3Forms public key from the backend
      const tokenRes = await fetch("/api/contact/token");
      if (!tokenRes.ok) throw new Error("token_unavailable");
      const { key } = await tokenRes.json() as { key?: string };
      if (!key) throw new Error("token_unavailable");

      // Step 2: submit directly to Web3Forms (public key is safe to use in frontend)
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_key: key,
          name: form.name,
          email: form.email,
          subject: form.subject,
          message: form.message,
        }),
      });

      if (!response.ok) throw new Error("submit_failed");

      toast({ title: "Message sent!", description: "We'll get back to you soon." });
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch {
      toast({
        title: "Could not send message.",
        description: "Please email us directly at support@xtoolkit.live",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  const isValid = form.name.trim() && form.email.includes("@") && form.subject.trim() && form.message.length >= 20;

  return (
    <Layout>
      <SeoHead
        title="Contact Us — X Toolkit"
        description="Have a question, found a bug, or want to suggest a tool? Get in touch with the X Toolkit team."
        path="/contact"
      />

      <div className="max-w-2xl mx-auto px-4 md:px-8 py-12 md:py-16">
        <div className="mb-8 text-center">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20 mb-4">
            <MessageSquare className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Contact Us</h1>
          <p className="text-muted-foreground">
            Have a question, found a bug, or want to suggest a tool? We'd love to hear from you.
          </p>
        </div>

        <Card className="border-border/60 bg-card shadow-sm">
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium" htmlFor="name">
                    Name <span className="text-destructive">*</span>
                  </label>
                  <Input
                    id="name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    required
                    className="bg-background/60 border-border/60 focus-visible:ring-primary/40"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium" htmlFor="email">
                    Email <span className="text-destructive">*</span>
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    required
                    className="bg-background/60 border-border/60 focus-visible:ring-primary/40"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium" htmlFor="subject">
                  Subject <span className="text-destructive">*</span>
                </label>
                <Input
                  id="subject"
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  placeholder="What's this about?"
                  required
                  className="bg-background/60 border-border/60 focus-visible:ring-primary/40"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium" htmlFor="message">
                  Message <span className="text-destructive">*</span>
                </label>
                <Textarea
                  id="message"
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Tell us more… (minimum 20 characters)"
                  required
                  minLength={20}
                  rows={6}
                  className="bg-background/60 border-border/60 focus-visible:ring-primary/40 resize-y"
                />
                <p className="text-xs text-muted-foreground text-right">
                  {form.message.length} characters {form.message.length < 20 && <span className="text-destructive">(minimum 20)</span>}
                </p>
              </div>

              <Button type="submit" disabled={sending || !isValid} className="w-full shadow-sm shadow-primary/20">
                {sending ? (
                  <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Sending…</>
                ) : (
                  <><Send className="h-4 w-4 mr-2" /> Send Message</>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="mt-8 text-center text-sm text-muted-foreground">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Mail className="h-4 w-4" />
            <span>You can also reach us at:</span>
          </div>
          <span className="font-medium text-foreground">support@xtoolkit.live</span>
        </div>

        <div className="mt-8 rounded-2xl border border-border/60 bg-card/40 p-6 space-y-3 text-left">
          <h2 className="text-sm font-semibold">What we can help with</h2>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span> <span><strong className="text-foreground/80">Bug reports</strong> — if a tool isn't working correctly, describe the issue and include your browser and operating system.</span></li>
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span> <span><strong className="text-foreground/80">Tool suggestions</strong> — ideas for new tools that would help you or your team. We build based on user demand.</span></li>
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span> <span><strong className="text-foreground/80">Feature requests</strong> — improvements or additions to existing tools. Be specific about what you'd like to see.</span></li>
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span> <span><strong className="text-foreground/80">Content corrections</strong> — if you spot an error in any of our guides, blog posts, or tool descriptions.</span></li>
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span> <span><strong className="text-foreground/80">Business inquiries</strong> — partnerships, advertising, or integration questions.</span></li>
          </ul>
          <p className="text-xs text-muted-foreground pt-1">We typically respond within 1–2 business days. For urgent issues, include "URGENT" in your subject line.</p>
        </div>
      </div>
    </Layout>
  );
}
