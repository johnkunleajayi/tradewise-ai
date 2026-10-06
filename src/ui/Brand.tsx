import { ChartNoAxesCombined } from "lucide-react";
export function Brand() {
  return (
    <a className="brand" href="#dashboard" aria-label="TradeWise AI dashboard">
      <span className="brand-mark">
        <ChartNoAxesCombined size={23} />
      </span>
      <span>
        TradeWise<span className="brand-ai">AI</span>
      </span>
    </a>
  );
}
