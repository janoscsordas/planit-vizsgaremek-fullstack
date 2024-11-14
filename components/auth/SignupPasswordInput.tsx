"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, Eye, EyeOff, X } from "lucide-react";
import { useMemo, useState } from "react";

export default function SignupPasswordInput({ name }: { name: string }) {
  const [password, setPassword] = useState("");
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const toggleVisibility = () => setIsVisible((prevState) => !prevState);

  const checkStrength = (pass: string) => {
    const requirements = [
      { regex: /.{8,}/, text: "Legalább 8 karakter" },
      { regex: /[0-9]/, text: "Legalább 1 szám" },
      { regex: /[A-Z]/, text: "Legalább 1 nagybetű" },
      { regex: /[^\w]/, text: "Legalább 1 speciális karakter" },
    ];

    return requirements.map((req) => ({
      met: req.regex.test(pass),
      text: req.text,
    }));
  };

  const strength = checkStrength(password);

  const strengthScore = useMemo(() => {
    return strength.filter((req) => req.met).length;
  }, [strength]);

  const getStrengthColor = (score: number) => {
    if (score === 0) return "bg-border";
    if (score <= 1) return "bg-red-500";
    if (score <= 2) return "bg-orange-700";
    if (score === 3) return "bg-amber-500";
    return "bg-emerald-500";
  };

  const getStrengthText = (score: number) => {
    if (score === 0) return "Jelszó megadása";
    if (score <= 2) return "Gyenge jelszó";
    if (score === 3) return "Közepes jelszó";
    return "Erős jelszó";
  };

  return (
    <div className="mb-4">
      {/* Password input field with toggle visibility button */}
      <div className="space-y-2">
        <Label htmlFor={name}>Jelszó</Label>
        <div className="relative">
          <Input
            id={name}
            name={name}
            className="pe-9"
            placeholder="Jelszó"
            type={isVisible ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            aria-invalid={strengthScore < 4}
            aria-describedby="jelszo-erossseg"
            required
            pattern="^(?=.*[A-Z])(?=.*[0-9])(?=.*[^\w]).{8,}$"
            maxLength={32}
            minLength={8}
          />
          <button
            className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-lg text-muted-foreground/80 transition-shadow hover:text-foreground focus-visible:border focus-visible:border-ring focus-visible:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
            type="button"
            onClick={toggleVisibility}
            aria-label={isVisible ? "Jelszó elrejtése" : "Jelszó mutatása"}
            aria-pressed={isVisible}
            aria-controls="password"
          >
            {isVisible ? (
              <EyeOff size={16} strokeWidth={2} aria-hidden="true" />
            ) : (
              <Eye size={16} strokeWidth={2} aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Password strength indicator */}
      <div
        className="mb-4 mt-3 h-1 w-full overflow-hidden rounded-full bg-border"
        role="progressbar"
        aria-valuenow={strengthScore}
        aria-valuemin={0}
        aria-valuemax={4}
        aria-label="Jelszó erősség"
      >
        <div
          className={`h-full ${getStrengthColor(strengthScore)} transition-all duration-500 ease-out`}
          style={{ width: `${(strengthScore / 4) * 100}%` }}
        ></div>
      </div>

      {/* Password strength description */}
      <p id="password-strength" className="mb-2 text-sm font-medium text-foreground">
        {getStrengthText(strengthScore)}
      </p>

      {/* Password requirements list */}
      <ul className="space-y-1.5" aria-label="Jelszó követelmények">
        {strength.map((req, index) => (
          <li key={index} className="flex items-center gap-2">
            {req.met ? (
              <Check size={16} className="text-emerald-500" aria-hidden="true" />
            ) : (
              <X size={16} className="text-muted-foreground/80" aria-hidden="true" />
            )}
            <span className={`text-xs ${req.met ? "text-emerald-600" : "text-muted-foreground"}`}>
              {req.text}
              <span className="sr-only">
                {req.met ? " - Követelmény teljesítve" : " - Követelmény nem teljesítve"}
              </span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
