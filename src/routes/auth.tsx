import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, KeyRound, Loader2, Mail, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Brand, ThemeToggle } from "@/components/site/chrome";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { ROLES, type Role } from "@/data/mock";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — ResQNet Disaster Response Platform" },
      {
        name: "description",
        content:
          "Sign in or register for ResQNet as a citizen, volunteer, NGO, hospital, government authority or administrator.",
      },
      { property: "og:title", content: "Sign in — ResQNet" },
      { property: "og:description", content: "Role-based access to the ResQNet disaster response platform." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const [role, setRole] = useState<Role>("citizen");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"login" | "signup" | "forgot">("login");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (mode === "forgot") toast.success("Reset link sent", { description: "Check your inbox for the password reset email." });
      else if (mode === "signup")
        toast.success("Verification email sent", { description: "Confirm your email to activate the account." });
      else toast.success("Signed in", { description: `JWT issued for role: ${role}` });
    }, 900);
  };

  return (
    <div className="relative grid min-h-screen lg:grid-cols-2">
      <div className="pointer-events-none absolute inset-0 hero-aurora" />
      <div className="relative hidden flex-col justify-between border-r border-border/60 p-10 lg:flex">
        <Brand />
        <div>
          <h2 className="font-display text-4xl font-bold leading-tight">
            One credential. <span className="text-gradient">Six command surfaces.</span>
          </h2>
          <p className="mt-4 max-w-md text-muted-foreground">
            ResQNet uses JWT access + refresh tokens with strict role-based access control. Every
            request, mission and inventory movement is signed and auditable.
          </p>
          <ul className="mt-8 space-y-3 text-sm text-muted-foreground">
            {["Email verification & password reset flows", "Role scoped API permissions", "Session revocation and full audit trail"].map((t) => (
              <li key={t} className="flex items-center gap-2">
                <ShieldCheck className="size-4 text-primary" /> {t}
              </li>
            ))}
          </ul>
        </div>
        <p className="text-xs text-muted-foreground">Emergency: 112 · Ambulance 108 · Disaster helpline 1078</p>
      </div>

      <div className="relative flex items-center justify-center p-6">
        <div className="absolute right-6 top-6 flex items-center gap-2">
          <ThemeToggle />
          <Button asChild variant="ghost" size="sm">
            <Link to="/"><ArrowLeft className="mr-1 size-4" /> Home</Link>
          </Button>
        </div>

        <Card className="w-full max-w-md border-border/60 bg-card/80 backdrop-blur rise-in">
          <CardHeader>
            <CardTitle className="font-display text-2xl">
              {mode === "forgot" ? "Reset your password" : "Welcome to ResQNet"}
            </CardTitle>
            <CardDescription>
              {mode === "forgot"
                ? "We'll email you a secure reset link valid for 15 minutes."
                : "Select your role and continue to your workspace."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {mode !== "forgot" && (
              <Tabs value={mode} onValueChange={(v) => setMode(v as "login" | "signup")}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="login">Login</TabsTrigger>
                  <TabsTrigger value="signup">Sign up</TabsTrigger>
                </TabsList>
                <TabsContent value="login" />
                <TabsContent value="signup" />
              </Tabs>
            )}

            {mode !== "forgot" && (
              <div>
                <Label className="text-xs uppercase tracking-wider text-muted-foreground">Role</Label>
                <div className="mt-2 grid grid-cols-3 gap-2">
                  {ROLES.map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setRole(r.id)}
                      className={cn(
                        "rounded-lg border px-2 py-2 text-xs font-medium transition-colors",
                        role === r.id
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border text-muted-foreground hover:text-foreground",
                      )}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <form className="space-y-4" onSubmit={submit}>
              {mode === "signup" && (
                <div className="space-y-1.5">
                  <Label htmlFor="name">Full name / Organisation</Label>
                  <Input id="name" placeholder="Anita Pradhan" required />
                </div>
              )}
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="you@agency.gov.in" required />
              </div>
              {mode !== "forgot" && (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    {mode === "login" && (
                      <button
                        type="button"
                        onClick={() => setMode("forgot")}
                        className="text-xs text-primary hover:underline"
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <Input id="password" type="password" placeholder="••••••••" required />
                </div>
              )}

              <Button type="submit" className="w-full gradient-signal border-0 text-primary-foreground" disabled={loading}>
                {loading ? (
                  <><Loader2 className="mr-2 size-4 animate-spin" /> Working…</>
                ) : mode === "forgot" ? (
                  <><Mail className="mr-2 size-4" /> Send reset link</>
                ) : mode === "signup" ? (
                  <><KeyRound className="mr-2 size-4" /> Create account</>
                ) : (
                  <>Sign in</>
                )}
              </Button>
            </form>

            {mode === "forgot" ? (
              <button className="w-full text-center text-sm text-muted-foreground hover:text-foreground" onClick={() => setMode("login")}>
                Back to login
              </button>
            ) : (
              <div className="rounded-lg border border-border/60 bg-secondary/50 p-3 text-xs text-muted-foreground">
                <Badge variant="outline" className="mr-2 text-[10px]">Demo</Badge>
                Auth is UI-complete and wired for a FastAPI JWT backend. Jump straight into a workspace:{" "}
                <Link to={`/dashboard/${role}`} className="font-medium text-primary hover:underline">
                  open {role} dashboard
                </Link>
                .
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
