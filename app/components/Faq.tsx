import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { MinusSmallIcon, PlusSmallIcon } from "@heroicons/react/24/outline";

const faqs = [
  {
    question: "What is DocuChat?",
    answer:
      "DocuChat is an AI-powered tool that lets you upload and chat with your PDF documents. It helps you extract insights, ask questions, and understand content instantly without manually reading everything.",
  },
  {
    question: "How do I upload and chat with a PDF?",
    answer:
      "Simply drag and drop your PDF into the app, and our system will process it in seconds. After that, you can ask any question related to the content and get intelligent responses.",
  },
  {
    question: "Is my uploaded data safe and private?",
    answer:
      "Yes. We take security seriously. All files are encrypted, stored temporarily, and never shared with third parties. You can also delete your documents anytime.",
  },
  {
    question: "Can I use DocuChat for scanned PDFs or images?",
    answer:
      "Currently, DocuChat supports text-based PDFs. Support for scanned or image-based documents with OCR is coming soon.",
  },
  {
    question: "Do I need to create an account to use DocuChat?",
    answer:
      "You can try a basic demo without an account, but for full functionality—like saving chats, uploading multiple documents, or accessing your history—you'll need to sign up.",
  },
  {
    question: "Is DocuChat free?",
    answer:
      "We offer a free plan with limited features. Paid plans unlock more uploads, longer documents, and advanced features. Check our pricing section for more details.",
  },
];

export default function Example() {
  return (
    <div className="bg-white" id="faqs">
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8 lg:py-40">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
            Frequently asked questions
          </h2>
          <dl className="mt-16 divide-y divide-gray-900/10">
            {faqs.map((faq) => (
              <Disclosure
                key={faq.question}
                as="div"
                className="py-6 first:pt-0 last:pb-0"
              >
                <dt>
                  <DisclosureButton className="group flex w-full items-start justify-between text-left text-gray-900">
                    <span className="text-base/7 font-semibold">
                      {faq.question}
                    </span>
                    <span className="ml-6 flex h-7 items-center">
                      <PlusSmallIcon
                        aria-hidden="true"
                        className="size-6 group-data-open:hidden"
                      />
                      <MinusSmallIcon
                        aria-hidden="true"
                        className="size-6 group-not-data-open:hidden"
                      />
                    </span>
                  </DisclosureButton>
                </dt>
                <DisclosurePanel as="dd" className="mt-2 pr-12">
                  <p className="text-base/7 text-gray-600">{faq.answer}</p>
                </DisclosurePanel>
              </Disclosure>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
