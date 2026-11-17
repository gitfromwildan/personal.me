export const contact = {
  tel: "+6285186666941",
  title: "Get in touch.",
  body: "Want to chat? Send me a direct question on Threads and I'll respond whenever I can. I will ignore all soliciting.",
  cta: "Message me on Threads",
  // Listed in this order in the contact section; `navbar` entries also show in the dock.
  social: {
    Threads: {
      name: "Threads",
      icon: "at-sign",
      handle: "@wildan.nrs",
      url: "https://www.threads.com/@wildan.nrs",
      navbar: false,
    },
    GitHub: {
      name: "GitHub",
      icon: "github-logo",
      handle: "gitfromwildan",
      url: "https://github.com/gitfromwildan",
      navbar: true,
    },
    YouTube: {
      name: "YouTube",
      icon: "youtube-logo",
      handle: "@wildandotdev",
      url: "https://www.youtube.com/@wildandotdev",
      navbar: false,
    },
    Email: {
      name: "Email",
      icon: "mail",
      handle: "email@wildan.dev",
      url: "mailto:email@wildan.dev",
      navbar: true,
    },
  },
} as const;
