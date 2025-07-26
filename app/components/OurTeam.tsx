import Image from "next/image";
import { AnimatedBeamMultipleOutputDemo } from "./AnimatedBeam";
import { Github, Facebook } from "lucide-react";

const people = [
  {
    name: "Sujan Khatri",
    role: "Copywriter",
    imageUrl:
      "https://res.cloudinary.com/dtr4vo1dy/image/upload/v1752818386/sujan_cixu5u.png",
    GithubUrl: "https://github.com/sujansince2003",
    FacebookUrl: "https://www.facebook.com/sujansince2003",
  },
  {
    name: "Roshan Pokharel",
    role: "Researcher",
    imageUrl:
      "https://res.cloudinary.com/dtr4vo1dy/image/upload/v1752818290/roshan_cw8zuf.png",
    GithubUrl: "https://github.com/Roshan-Pokharel",
    FacebookUrl: "https://www.facebook.com/roshan.pokhrel.522",
  },
  {
    name: "Sujal Shrestha",
    role: "Researcher",
    imageUrl:
      "https://res.cloudinary.com/dtr4vo1dy/image/upload/v1752818018/sujal_sipchg.png",
    GithubUrl: "https://github.com/sujalshrestha10",
    FacebookUrl: "https://www.facebook.com/suzolshrestha10",
  },
];

export default function Example() {
  return (
    <div className="bg-white  py-32" id="ourteams">
      <div className="mx-auto max-w-7xl px-6 text-center lg:px-8">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-4xl font-semibold tracking-tight text-balance text-gray-900 sm:text-5xl">
            Meet the minds behind DocuChat
          </h2>
          <p className="mt-6 text-lg/8 text-gray-600">
            We’re a team of builders, researchers, and creators passionate about
            transforming the way people interact with documents. Our mission is
            to bring intelligent, conversational AI to your files—so you can
            focus on what truly matters.
          </p>
        </div>
        <ul
          role="list"
          className="mx-auto mt-20 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3"
        >
          {people.map((person) => (
            <li key={person.name}>
              <Image
                alt=""
                src={person.imageUrl}
                className="mx-auto size-56 rounded-full"
                width={300}
                height={300}
              />
              <h3 className="mt-6 text-base/7 font-semibold tracking-tight text-gray-900">
                {person.name}
              </h3>
              <p className="text-sm/6 text-gray-600">{person.role}</p>
              <ul role="list" className="mt-6 flex justify-center gap-x-6">
                <li>
                  <a
                    target="_blank"
                    href={person.GithubUrl}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <span className="sr-only">X</span>
                    <Github size={20} />
                  </a>
                </li>
                <li>
                  <a
                    target="_blank"
                    href={person.FacebookUrl}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <span className="sr-only">LinkedIn</span>

                    <Facebook size={20} />
                  </a>
                </li>
              </ul>
            </li>
          ))}
        </ul>
        <AnimatedBeamMultipleOutputDemo />
      </div>
    </div>
  );
}
