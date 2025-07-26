import {
  ArrowPathIcon,
  CloudArrowUpIcon,
  FingerPrintIcon,
  LockClosedIcon,
} from "@heroicons/react/24/outline";

const features = [
  {
    name: "Instant PDF Upload",
    description:
      "Just drag, drop, and start chatting. No complex setup or waiting — your PDF is ready to talk in seconds.",
    icon: CloudArrowUpIcon,
  },
  {
    name: "End-to-End Encryption",
    description:
      "Your documents and chats are private by default. We use secure encryption and never store data without consent.",
    icon: LockClosedIcon,
  },
  {
    name: "Context-Aware Conversations",
    description:
      "Ask follow-ups, get summaries, or dig deeper — the AI remembers context and responds intelligently every time.",
    icon: ArrowPathIcon,
  },
  {
    name: "Smart Document Parsing",
    description:
      "Our AI understands tables, charts, and technical language. Perfect for legal contracts, academic papers, and more.",
    icon: FingerPrintIcon,
  },
];

export default function Example() {
  return (
    <div className="bg-white py-24 sm:py-32" id="features">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base/7 font-semibold text-indigo-600">
            AI-powered document analysis
          </h2>
          <p className="mt-2 text-4xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-5xl lg:text-balance">
            Smart features designed for seamless PDF interaction
          </p>
          <p className="mt-6 text-lg/8 text-gray-700">
            Whether you&apos;re studying, researching, or reviewing legal docs —
            DocuChat makes it easy to ask questions, extract insights, and stay
            productive by chatting directly with your PDFs.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
            {features.map((feature) => (
              <div key={feature.name} className="relative pl-16">
                <dt className="text-base/7 font-semibold text-gray-900">
                  <div className="absolute top-0 left-0 flex size-10 items-center justify-center rounded-lg bg-indigo-600">
                    <feature.icon
                      aria-hidden="true"
                      className="size-6 text-white"
                    />
                  </div>
                  {feature.name}
                </dt>
                <dd className="mt-2 text-base/7 text-gray-600">
                  {feature.description}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
