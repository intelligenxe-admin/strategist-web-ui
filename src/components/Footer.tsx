import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-gray-200 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Strategist</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              AI-powered corporate strategy analysis for publicly traded companies worldwide.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Product</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-gray-600 hover:text-brand transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/rag" className="text-gray-600 hover:text-brand transition-colors">
                  Knowledge
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-600 hover:text-brand transition-colors">
                  About
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="https://intelligenxe.com/?page_id=177"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-brand transition-colors"
                >
                  Terms of Use
                </a>
              </li>
              <li>
                <a
                  href="https://intelligenxe.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-brand transition-colors"
                >
                  Intelligenxe
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-gray-200 text-xs text-gray-500">
          © {new Date().getFullYear()} INTELLIGENXE. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
