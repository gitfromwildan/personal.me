import { Icons } from "@/components/icons";
import { HomeIcon, PencilLineIcon } from "lucide-react";

export const DATA = {
  name: "Wildan Nursahidan",
  initials: "WNN",
  url: "https://wildan.dev",
  location: "West Java, Indonesia",
  locationLink: "https://www.google.com/maps/place/indonesia",
  description:
    "Turning coffee into Frontend code and Open Source contributions. I build things that (mostly) work and love helping people. You can usually summon me on Telegram.",
  summary:
    `I've been diving into web design since 2019 (and yes, I spent a fortune on courses). I eventually built [DocuBook](https://docubook.pro/)—a React documentation framework—because the existing tools just didn't 'click' for me. So, I made my own! I love building tools that actually help people.`,
  avatarUrl: "/me.png",
  skills: [
    {
      name: "Tailwindcss",
      icon: "/icon/tailwindcss.svg",
    },
    {
      name: "React",
      icon: "/icon/react.svg",
    },
    {
      name: "NextJS",
      icon: "/icon/nextjs.svg",
    },
    {
      name: "Javascript",
      icon: "/icon/javascript.svg",
    },
    {
      name: "Typescript",
      icon: "/icon/typescript.svg",
    },
    {
      name: "NodeJS",
      icon: "/icon/node.svg",
    },
    {
      name: "Bun",
      icon: "/icon/bun.svg",
    },
  ],
  navbar: [
    { href: "/", icon: HomeIcon, label: "Home" },
    { href: "/blog", icon: PencilLineIcon, label: "Blog" },
  ],
  contact: {
    email: "email@wildan.dev",
    tel: "+6285186666941",
    social: {
      GitHub: {
        name: "GitHub",
        url: "https://github.com/gitfromwildan",
        icon: Icons.github,
        navbar: true,
      },
      Telegram: {
        name: "Telegram",
        url: "https://t.me/wildannrs",
        icon: Icons.x,
        navbar: false,
      },
      Youtube: {
        name: "Youtube",
        url: "https://www.youtube.com/@wildandotdev",
        icon: Icons.youtube,
        navbar: true,
      },
      Email: {
        name: "Send Email",
        url: "mailto:email@wildan.dev",
        icon: Icons.email,
        navbar: true,
      },
    },
  },

  work: [
    {
      company: "Addons Sejoli Pro",
      href: "https://addonsejoli.pro/",
      badges: [],
      location: "Remote",
      title: "Freelance User Guides",
      logoUrl: "/addonspro.png",
      start: "January 2022",
      end: "Until Now",
      description:
        "Addons Pro is an agency that operates in the field of creating WordPress plugins to complete the functions of the Sejoli plugin. My job is to create product usage documentation related to plugins.",
    },
    {
      company: "PT Albany Corona Lestari",
      href: "#",
      badges: [],
      location: "Remote",
      title: "Maintenance",
      logoUrl: "/acl.png",
      start: "March 2018",
      end: "Until Now",
      description:
        "Tasked with building maintenance and repairs for Indomaret stores including CCTV, alarms and building facilities, both electrical and civil.",
    },
    {
      company: "PT Indomarco Prismatama",
      badges: [],
      href: "#",
      location: "Remote",
      title: "Electronic Data Processing",
      logoUrl: "/indomaret.png",
      start: "July 2015",
      end: "March 2018",
      description:
        "Actually, until now I am still working under the Indomaret group company. However, my current job is managing and monitoring the network interface from the Indomaret store to the branch server.",
    },
  ],
  projects: [
    {
      title: "My Portfolio",
      href: "https://github.com/gitfromwildan/personal.me",
      active: true,
      description:
        "Developed a personal portfolio website using Next.js, TypeScript, and Tailwind CSS. This template is open source and available on GitHub.",
      technologies: [
        "Next.js",
        "Typescript",
        "TailwindCSS",
        "Shadcn UI",
        "Magic UI",
      ],
      links: [
        {
          type: "Source",
          href: "https://github.com/gitfromwildan/personal.me",
          icon: <Icons.github className="size-3" />,
        },
      ],
      image: "",
      video:
        "https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExbjNkZm93eHJlamtlamhucnB4Ym5xamdyenhqd3BrNjNmbGRjYWcwYSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/QtSyqQC5gK3mT49hdJ/giphy.mp4",
    },
    {
      title: "Ortoo Links",
      href: "https://github.com/gitfromwildan/shop.bio",
      active: true,
      description:
        "Biolink template for digital product listings such as ebooks, video courses and digital downloads complete with checkout to external links.",
      technologies: [
        "Next.js",
        "Typescript",
        "TailwindCSS",
        "Shadcn UI",
      ],
      links: [
        {
          type: "Source",
          href: "https://github.com/gitfromwildan/shop.bio",
          icon: <Icons.github className="size-3" />,
        },
      ],
      image: "",
      video: "https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExam40MXlranNrcGtydDVtcTU4d3VibXFqajJpZ3h3OGM2YjltNnYwZyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/nIoccBCOnlPvuVHzAf/giphy.mp4",
    },
  ],
} as const;
