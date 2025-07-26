import {
  ArrowPathIcon,
  CloudArrowUpIcon,
  Cog6ToothIcon,
  FingerPrintIcon,
  LockClosedIcon,
  ServerIcon,
} from "@heroicons/react/20/solid";
import Image from "next/image";

const features = [
  {
    name: "Instant PDF Uploads",
    description:
      "Easily drag and drop any PDF to start chatting with it in seconds — no setup required.",
    icon: CloudArrowUpIcon,
  },
  {
    name: "Secure & Private",
    description:
      "Your documents are protected with top-grade encryption. We never store your data without permission.",
    icon: LockClosedIcon,
  },
  {
    name: "Smart Contextual Chat",
    description:
      "Ask follow-up questions and get answers that understand the full context of your PDF.",
    icon: ArrowPathIcon,
  },
  {
    name: "AI-Powered Understanding",
    description:
      "Advanced language models analyze content deeply — from legal documents to scientific papers.",
    icon: FingerPrintIcon,
  },
  {
    name: "Developer-Friendly API",
    description:
      "Integrate DocuChat into your own tools with a clean, powerful REST API (coming soon).",
    icon: Cog6ToothIcon,
  },
  {
    name: "Auto-Backup & Versioning",
    description:
      "Keep track of different PDF uploads and restore past sessions — your work is always safe.",
    icon: ServerIcon,
  },
];

export default function Example() {
  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl sm:text-center">
          <h2 className="text-base/7 font-semibold text-indigo-600">
            Built for seamless PDF interactions
          </h2>
          <p className="mt-2 text-4xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-5xl sm:text-balance">
            Everything you need to turn documents into conversations
          </p>
          <p className="mt-6 text-lg/8 text-gray-600">
            DocuChat makes it incredibly easy to upload, analyze, and chat with
            your PDFs in real time. Whether you&apos;re a student, researcher,
            or professional — get instant answers from your documents, powered
            by AI.
          </p>
        </div>
      </div>
      <div className="relative overflow-hidden pt-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <Image
            alt="App screenshot"
            src="https://tailwindui.com/plus-assets/img/component-images/project-app-screenshot.png"
            width={2432}
            height={1442}
            className="mb-[-12%] rounded-xl ring-1 shadow-2xl ring-gray-900/10"
          />
          <div aria-hidden="true" className="relative">
            <div className="absolute -inset-x-20 bottom-0 bg-linear-to-t from-white pt-[7%]" />
          </div>
        </div>
      </div>
      <div className="mx-auto mt-16 max-w-7xl px-6 sm:mt-20 md:mt-24 lg:px-8">
        <dl className="mx-auto grid max-w-2xl grid-cols-1 gap-x-6 gap-y-10 text-base/7 text-gray-600 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3 lg:gap-x-8 lg:gap-y-16">
          {features.map((feature) => (
            <div key={feature.name} className="relative pl-9">
              <dt className="inline font-semibold text-gray-900">
                <feature.icon
                  aria-hidden="true"
                  className="absolute top-1 left-1 size-5 text-indigo-600"
                />
                {feature.name}
              </dt>{" "}
              <dd className="inline">{feature.description}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
