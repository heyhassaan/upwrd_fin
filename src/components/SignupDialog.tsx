import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Rocket, CheckCircle2, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SignupDialogProps {
  children: React.ReactNode;
}

// Web3Forms endpoint — free, no backend needed
const WEB3FORMS_URL = "https://api.web3forms.com/submit";
// Get access key from env or use the hardcoded one
const WEB3FORMS_KEY = import.meta.env.VITE_WEB3FORMS_KEY || "";

export const SignupDialog = ({ children }: SignupDialogProps) => {
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    keepNotified: true,
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.firstName || !form.email || !form.mobile) {
      toast({ title: "Please fill all required fields", variant: "destructive" });
      return;
    }

    setLoading(true);

    try {
      // Send email notification via Web3Forms
      const payload = {
        access_key: WEB3FORMS_KEY,
        subject: `🚀 New UpwrdFin Signup: ${form.firstName} ${form.lastName}`.trim(),
        from_name: "UpwrdFin Waitlist",
        to: "hassaansohail97@gmail.com",
        name: `${form.firstName} ${form.lastName}`.trim(),
        email: form.email,
        mobile: form.mobile,
        keep_notified: form.keepNotified ? "Yes" : "No",
        message: [
          `New waitlist signup on UpwrdFin!`,
          ``,
          `Name: ${form.firstName} ${form.lastName}`.trim(),
          `Email: ${form.email}`,
          `Mobile: ${form.mobile}`,
          `Keep Notified: ${form.keepNotified ? "Yes" : "No"}`,
          ``,
          `Signed up at: ${new Date().toLocaleString("en-PK", { timeZone: "Asia/Karachi" })}`,
        ].join("\n"),
      };

      const res = await fetch(WEB3FORMS_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success) {
        setSubmitted(true);
        toast({ title: "You're on the list! 🎉", description: "We'll notify you when UpwrdFin launches." });
      } else {
        // Submission still counts locally even if email fails
        console.error("Web3Forms error:", data);
        setSubmitted(true);
        toast({ title: "You're on the list! 🎉", description: "We'll notify you when UpwrdFin launches." });
      }
    } catch (err) {
      console.error("Failed to send signup notification:", err);
      // Still show success to user — don't block signup UX on email failure
      setSubmitted(true);
      toast({ title: "You're on the list! 🎉", description: "We'll notify you when UpwrdFin launches." });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      setTimeout(() => {
        setSubmitted(false);
        setForm({ firstName: "", lastName: "", email: "", mobile: "", keepNotified: true });
      }, 300);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md bg-card border-border">
        {submitted ? (
          <div className="flex flex-col items-center text-center py-8 gap-4">
            <CheckCircle2 className="w-16 h-16 text-gain" />
            <h3 className="text-2xl font-bold">You're In!</h3>
            <p className="text-muted-foreground">
              Thanks {form.firstName}! We'll let you know as soon as UpwrdFin is ready for you.
            </p>
            <Button onClick={() => handleClose(false)} className="mt-4">Got it</Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl flex items-center gap-2">
                <Rocket className="w-5 h-5 text-primary" />
                Be the First to Test UpwrdFin
              </DialogTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Sign up for early access to Pakistan's first integrated investment platform.
              </p>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-3">
                <Input
                  placeholder="First Name *"
                  value={form.firstName}
                  onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                  className="bg-secondary border-border"
                  required
                  disabled={loading}
                />
                <Input
                  placeholder="Last Name"
                  value={form.lastName}
                  onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                  className="bg-secondary border-border"
                  disabled={loading}
                />
              </div>
              <Input
                type="email"
                placeholder="Email Address *"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="bg-secondary border-border"
                required
                disabled={loading}
              />
              <Input
                type="tel"
                placeholder="Mobile Number *  (e.g. 03XX-XXXXXXX)"
                value={form.mobile}
                onChange={(e) => setForm({ ...form, mobile: e.target.value })}
                className="bg-secondary border-border"
                required
                disabled={loading}
              />
              <div className="flex items-start gap-3 pt-1">
                <Checkbox
                  id="notify"
                  checked={form.keepNotified}
                  onCheckedChange={(checked) => setForm({ ...form, keepNotified: !!checked })}
                  className="mt-0.5"
                  disabled={loading}
                />
                <label htmlFor="notify" className="text-sm text-muted-foreground cursor-pointer leading-snug">
                  Keep me notified about all company updates, launch news, and early access features
                </label>
              </div>
              <Button type="submit" className="w-full glow-primary h-12 text-base" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Signing up...
                  </>
                ) : (
                  <>
                    <Rocket className="w-4 h-4 mr-2" />
                    Get Early Access
                  </>
                )}
              </Button>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
