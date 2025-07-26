import React from "react";
import {
  Upload,
  MessageSquare,
  Database,
  Brain,
  Zap,
  Shield,
  ArrowRight,
  CheckCircle,
  Clock,
  Server,
} from "lucide-react";
import { AnimatedShinyText } from "@/components/magicui/animated-shiny-text";
import { SparklesText } from "@/components/magicui/sparkles-text";

const HowItWorksPage = () => {
  const steps = [
    {
      id: 1,
      title: "Sign In Securely",
      subtitle: "Authentication & Security",
      description:
        "Start your journey with enterprise-grade security. Sign in seamlessly with Google OAuth or create your secure account with email credentials.",
      icon: <Shield className="w-8 h-8" />,
      features: [
        "Google OAuth integration",
        "Secure JWT session management",
        "Enterprise-grade encryption",
        "Multi-factor authentication ready",
      ],
    },
    {
      id: 2,
      title: "Upload Your PDF",
      subtitle: "Intelligent Document Processing",
      description:
        "Experience lightning-fast PDF upload with our advanced processing pipeline. Your documents are handled with care and processed instantly.",
      icon: <Upload className="w-8 h-8" />,
      features: [
        "Drag & drop interface",
        "Real-time upload progress",
        "Automatic metadata extraction",
        "Secure cloud storage",
      ],
    },
    {
      id: 3,
      title: "AI Processing Magic",
      subtitle: "Neural Network Analysis",
      description:
        "Watch as our AI breaks down your PDF into intelligent chunks, creates semantic embeddings, and stores them in our lightning-fast vector database.",
      icon: <Brain className="w-8 h-8" />,
      features: [
        "Advanced text chunking",
        "Semantic vector embeddings",
        "Qdrant vector database",
        "Optimized retrieval system",
      ],
    },
    {
      id: 4,
      title: "Chat & Discover",
      subtitle: "Conversational Intelligence",
      description:
        "Engage in natural conversations with your documents. Ask questions, get insights, and discover information with context-aware AI responses.",
      icon: <MessageSquare className="w-8 h-8" />,
      features: [
        "Context-aware responses",
        "Conversation memory",
        "Real-time interaction",
        "Intelligent document search",
      ],
    },
  ];

  const techStack = [
    {
      name: "Next.js",
      description: "React framework with App Router",
      icon: "⚡",
    },
    { name: "Node.js", description: "High-performance backend", icon: "🟢" },
    {
      name: "PostgreSQL",
      description: "Robust relational database",
      icon: "🐘",
    },
    { name: "Qdrant", description: "Vector similarity search", icon: "🔍" },
    { name: "Google AI", description: "Gemini language models", icon: "🤖" },
    { name: "BullMQ", description: "Distributed job processing", icon: "⚙️" },
  ];

  const features = [
    {
      title: "Military-Grade Security",
      description: "Advanced encryption and secure authentication protocols",
      icon: <Shield className="w-6 h-6" />,
    },
    {
      title: "Lightning Processing",
      description: "Process documents in seconds with our optimized pipeline",
      icon: <Zap className="w-6 h-6" />,
    },
    {
      title: "Smart Conversations",
      description: "Context-aware AI that understands your documents deeply",
      icon: <Brain className="w-6 h-6" />,
    },
    {
      title: "Instant Search",
      description: "Find any information across all your documents instantly",
      icon: <Database className="w-6 h-6" />,
    },
    {
      title: "Conversation History",
      description: "Never lose track of your important document discussions",
      icon: <Clock className="w-6 h-6" />,
    },
    {
      title: "Enterprise Scale",
      description: "Built to handle thousands of documents and users",
      icon: <Server className="w-6 h-6" />,
    },
  ];

  return (
    <div className="bg-white">
      {/* Decorative Background Elements */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
      >
        <div
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
          className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
        />
      </div>

      {/* Hero Section */}
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
          <div className="hidden sm:mb-8 sm:flex sm:justify-center">
            <AnimatedShinyText className="relative rounded-full px-3 py-1 text-sm/6 text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
              Powered by Advanced AI Technology
              <a href="#steps" className="font-semibold text-indigo-600">
                <span aria-hidden="true" className="absolute inset-0" />
                See how it works <span aria-hidden="true">&rarr;</span>
              </a>
            </AnimatedShinyText>
          </div>
          <div className="text-center">
            <h1 className="text-5xl font-semibold tracking-tight text-balance text-gray-900 sm:text-7xl">
              How DocuChat
              <SparklesText>transforms your PDFs</SparklesText>
            </h1>
            <p className="mt-8 text-lg font-medium text-pretty text-gray-500 sm:text-xl/8">
              Discover the simple 4-step process that turns your static
              documents into intelligent, interactive conversations powered by
              cutting-edge AI technology.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <a
                href="#steps"
                className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500  focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Explore the process
              </a>
              <a href="#demo" className="text-sm/6 font-semibold text-gray-900">
                Watch demo <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Steps Section */}
      <div id="steps" className="relative isolate px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
              Four Simple Steps
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              From upload to conversation in minutes
            </p>
          </div>

          <div className="space-y-24">
            {steps.map((step, index) => (
              <div key={step.id} className="relative">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                  {/* Step Content */}
                  <div className={`${index % 2 === 1 ? "lg:order-2" : ""}`}>
                    <div className="flex items-center mb-6">
                      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 font-semibold text-lg mr-4">
                        {step.id}
                      </div>
                      <div>
                        <h3 className="text-3xl font-semibold text-gray-900">
                          {step.title}
                        </h3>
                        <p className="text-indigo-600 font-medium">
                          {step.subtitle}
                        </p>
                      </div>
                    </div>

                    <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                      {step.description}
                    </p>

                    <div className="grid sm:grid-cols-2 gap-4">
                      {step.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center">
                          <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                          <span className="text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Step Visual */}
                  <div className={`${index % 2 === 1 ? "lg:order-1" : ""}`}>
                    <div className="relative">
                      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-8 shadow-sm ring-1 ring-gray-900/5">
                        <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 rounded-xl bg-indigo-600 text-white">
                          {step.icon}
                        </div>
                        <div className="text-center">
                          <h4 className="text-xl font-semibold text-gray-900 mb-2">
                            {step.title}
                          </h4>
                          <p className="text-gray-600">{step.subtitle}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Arrow connector */}
                {index < steps.length - 1 && (
                  <div className="flex justify-center mt-12">
                    <ArrowRight className="w-8 h-8 text-gray-300" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Technology Stack Section */}
      <div className="bg-gray-50 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
              Built with Modern Technology
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Powered by industry-leading tools and frameworks
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {techStack.map((tech, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-sm ring-1 ring-gray-900/5 p-8 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center mb-4">
                  <span className="text-3xl mr-3">{tech.icon}</span>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {tech.name}
                  </h3>
                </div>
                <p className="text-gray-600">{tech.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
              Why Choose DocuChat?
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Experience the next generation of document interaction
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-sm ring-1 ring-gray-900/5 p-8 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-indigo-100 mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-indigo-600">
        <div className="px-6 py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              Ready to transform your documents?
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg/8 text-indigo-200">
              Join thousands of users who have revolutionized their document
              workflow with DocuChat&apos;s AI-powered technology.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <a
                href="#"
                className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-indigo-600 shadow-sm hover:bg-indigo-50  focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Start free trial
              </a>
              <a href="#" className="text-sm/6 font-semibold text-white">
                Learn more <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom decorative element */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
      >
        <div
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
          className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
        />
      </div>
    </div>
  );
};

export default HowItWorksPage;
