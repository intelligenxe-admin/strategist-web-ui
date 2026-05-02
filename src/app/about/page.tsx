import { Briefcase, Building2, ShieldCheck } from "lucide-react";

export default function About() {
  return (
    <div className="max-w-3xl">
      <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-gray-900 mb-6">About</h1>

      <p className="text-lg text-gray-700 leading-relaxed mb-10">
        <a
          href="https://intelligenxe.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-brand hover:underline"
        >
          INTELLIGENXE
        </a>
        ’s Strategist platform uses AI to design corporate strategies for publicly traded companies worldwide.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
        <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-brand/10 text-brand">
              <Briefcase className="h-5 w-5" />
            </div>
            <h2 className="text-base font-semibold text-gray-900">For institutional investors</h2>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">
            Mutual fund managers, VC fund managers, and investment bankers use Strategist to assess the gaps between
            human-designed (current) and AI-generated corporate strategies across their companies and industries of
            interest.
          </p>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-brand/10 text-brand">
              <Building2 className="h-5 w-5" />
            </div>
            <h2 className="text-base font-semibold text-gray-900">For C-suite executives</h2>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">
            Executives and experienced entrepreneurs use Strategist to validate and uncover corporate strategies that
            can position their organizations to thrive in their industries.
          </p>
        </div>
      </div>

      <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-5">
        <div className="flex items-start gap-3">
          <ShieldCheck className="h-5 w-5 shrink-0 mt-0.5 text-yellow-700" />
          <div className="text-sm text-yellow-900 leading-relaxed">
            INTELLIGENXE invites the above professionals to test Strategist&rsquo;s{" "}
            <strong className="font-semibold">experimental version</strong> offered on this website. Accepting this
            invitation automatically <strong className="font-semibold">binds</strong> users to{" "}
            <a
              href="https://intelligenxe.com/?page_id=177"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-brand hover:underline"
            >
              INTELLIGENXE&rsquo;s Terms of Use | User Agreement
            </a>
            .
          </div>
        </div>
      </div>
    </div>
  );
}
