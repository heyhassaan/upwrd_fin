import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Rocket, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SignupDialogProps {
  children: React.ReactNode;
}

export const SignupDialog = ({ children }: SignupDialogProps) => {
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    keepNotified: true,
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.firstName || !form.email || !form.mobile) {
      toast({ title: "Please fill all required fields", variant: "destructive" });
      return;
    }
    setSubmitted(true);
    toast({ title: "You're on the list! 🎉", description: "We'll notify you when UpwrdFin launches." });
  };

  const handleClose = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      setTimeout(() => setSubmitted(false), 300);
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
                />
                <Input
                  placeholder="Last Name"
                  value={form.lastName}
                  onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                  className="bg-secondary border-border"
                />
              </div>
              <Input
                type="email"
                placeholder="Email Address *"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="bg-secondary border-border"
                required
              />
              <Input
                type="tel"
                placeholder="Mobile Number *  (e.g. 03XX-XXXXXXX)"
                value={form.mobile}
                onChange={(e) => setForm({ ...form, mobile: e.target.value })}
                className="bg-secondary border-border"
                required
              />
              <div className="flex items-start gap-3 pt-1">
                <Checkbox
                  id="notify"
                  checked={form.keepNotified}
                  onCheckedChange={(checked) => setForm({ ...form, keepNotified: !!checked })}
                  className="mt-0.5"
                />
                <label htmlFor="notify" className="text-sm text-muted-foreground cursor-pointer leading-snug">
                  Keep me notified about all company updates, launch news, and early access features
                </label>
              </div>
              <Button type="submit" className="w-full glow-primary h-12 text-base">
                <Rocket className="w-4 h-4 mr-2" />
                Get Early Access
              </Button>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
