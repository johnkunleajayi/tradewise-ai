import { MessageSquare, ScanLine, BookOpen } from "lucide-react";

const steps = [
  {
    icon: MessageSquare,
    title: "Bring a real situation",
    text: "Ask about a Forex or crypto decision, or upload a trading chart or screenshot with your question.",
  },
  {
    icon: ScanLine,
    title: "Look beyond the entry",
    text: "Explore market context, risks, and the assumptions behind your thinking with AI-powered guidance.",
  },
  {
    icon: BookOpen,
    title: "Learn the reasoning",
    text: "Understand the why, reflect on your choices, and build more disciplined trading habits.",
  },
];

export function LearningSteps() {
  return (
    <section
      id="how-it-works"
      className="scroll-mt-8 border-y border-line bg-surface/50"
    >
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-10 sm:py-16">
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
          <div>
            <p className="text-[10px] font-semibold tracking-[0.2em] text-accent">
              THE APPROACH
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.035em]">
              From a question to a clearer perspective.
            </h2>
          </div>
          <p className="max-w-xs text-xs leading-6 text-muted">
            The learning flow we’re building.
            <br />
            AI capabilities are coming soon.
          </p>
        </div>
        <ol className="mt-10 grid gap-8 lg:grid-cols-3 lg:gap-10">
          {steps.map(({ icon: Icon, title, text }, index) => (
            <li key={title} className="min-w-0 border-t border-line pt-5">
              <div className="flex items-center justify-between">
                <Icon size={21} className="text-accent" />
                <span className="text-xs text-muted">0{index + 1}</span>
              </div>
              <h3 className="mt-5 text-base font-semibold tracking-tight">
                {title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-muted">{text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
