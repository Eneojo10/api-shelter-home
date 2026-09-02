import { useState } from "react";
import { Check, Copy, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { maskValue } from "@/lib/portal-data";

export function CopyField({
  value,
  secret = false,
  label,
}: {
  value: string;
  secret?: boolean;
  label?: string;
}) {
  const [revealed, setRevealed] = useState(!secret);
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      toast.success(`${label ?? "Value"} copied to clipboard`);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error("Clipboard unavailable in this context");
    }
  };

  return (
    <div className="flex items-center gap-2 rounded-lg border border-border bg-secondary/40 px-3 py-2">
      <code className="flex-1 truncate font-mono text-xs text-foreground">
        {revealed ? value : maskValue(value)}
      </code>
      {secret ? (
        <Button
          size="icon"
          variant="ghost"
          className="size-7"
          onClick={() => setRevealed((r) => !r)}
          aria-label={revealed ? "Hide value" : "Reveal value"}
        >
          {revealed ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
        </Button>
      ) : null}
      <Button size="icon" variant="ghost" className="size-7" onClick={copy} aria-label="Copy value">
        {copied ? <Check className="size-3.5 text-success" /> : <Copy className="size-3.5" />}
      </Button>
    </div>
  );
}
