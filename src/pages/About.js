import React, { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Film, Gamepad, BookOpen, Music, Tv, Globe, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

export default function PixoviaAboutPage() {
  useEffect(() => {
    // --- SEO + Meta Tags Setup ---
    document.title = "About Pixovia LLC | Free Apps, Movies, Music, TV, Sports & Learning";

    const metaTags = [
      { name: "description", content: "Learn more about Pixovia LLC — a unified digital platform offering free and verified access to apps, games, movies, TV, sports, music, and learning materials. Safe, fast, and completely free for everyone." },
      { name: "keywords", content: "Pixovia, Pixovia LLC, free apps, free movies, live TV, free sports streaming, free music, Pixovia Library, digital content, free learning platform, verified downloads" },
      { name: "author", content: "Pixovia LLC" },
      { property: "og:title", content: "About Pixovia LLC — Everything Digital, Completely Free" },
      { property: "og:description", content: "Pixovia LLC brings together apps, games, movies, music, TV, sports, and learning in one trusted, free platform." },
      { property: "og:url", content: "https://pixovia.pages.dev/about" },
      { property: "og:type", content: "website" },
      { name: "theme-color", content: "#4F46E5" }
    ];

    metaTags.forEach(tag => {
      const meta = document.createElement("meta");
      Object.keys(tag).forEach(key => meta.setAttribute(key, tag[key]));
      document.head.appendChild(meta);
    });

    const linkTags = [
      { rel: "canonical", href: "https://pixovia.pages.dev/about" },
      { rel: "icon", type: "image/png", sizes: "32x32", href: "https://pixovia.pages.dev/favicon-32x32.png" },
      { rel: "icon", type: "image/png", sizes: "16x16", href: "https://pixovia.pages.dev/favicon-16x16.png" },
      { rel: "apple-touch-icon", sizes: "180x180", href: "https://pixovia.pages.dev/apple-touch-icon.png" },
      { rel: "manifest", href: "https://pixovia.pages.dev/site.webmanifest" }
    ];

    linkTags.forEach(link => {
      const l = document.createElement("link");
      Object.keys(link).forEach(key => l.setAttribute(key, link[key]));
      document.head.appendChild(l);
    });
  }, []);

  const navigateTo = (url) => {
    window.open(url, "_blank");
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* HERO SECTION */}
      <header className="bg-gradient-to-r from-indigo-600 to-indigo-400 text-white">
        <div className="max-w-6xl mx-auto px-6 py-20 lg:py-28">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <motion.h1
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45 }}
                className="text-4xl lg:text-5xl font-extrabold leading-tight"
              >
                Pixovia LLC — Everything Digital, Completely Free
              </motion.h1>

              <p className="mt-4 text-lg lg:text-xl opacity-90 max-w-2xl">
                Pixovia is a complete free digital platform offering verified apps, games, movies, music, TV, sports, and learning tools. Every content here is safe, trusted, and available without ads or payments.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Button className="px-5 py-3 bg-white text-indigo-600 hover:opacity-95" onClick={() => navigateTo('https://pixovia.pages.dev/store')}>
                  Explore Store
                </Button>
                <Button className="px-5 py-3 text-white border-white/40" onClick={() => navigateTo('https://pixovia.pages.dev/library')}>
                  Upload to Library
                </Button>
              </div>

              <div className="mt-8 flex gap-4 items-center">
                <span className="inline-flex items-center gap-2 bg-white/10 px-3 py-2 rounded-full">
                  <ShieldCheck size={18} /> <strong>Verified &amp; Trusted</strong>
                </span>
                <span className="inline-flex items-center gap-2 bg-white/10 px-3 py-2 rounded-full">
                  <CheckCircle size={18} /> <strong>Completely Free</strong>
                </span>
              </div>
            </div>

            <div className="hidden lg:block">
              <div className="rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="https://pixovia.pages.dev/about-banner.jpg"
                  alt="Pixovia services collage"
                  className="w-full h-96 object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="max-w-6xl mx-auto px-6 -mt-12">
        <section className="grid lg:grid-cols-3 gap-6">
          <ServiceCard title="Pixovia Store" description="Verified free games, apps, browser themes, and extensions. Safe and hosted at Pixovia Store." icon={<Gamepad size={20} />} link="https://pixovia.pages.dev/store" />
          <ServiceCard title="Pixovia Movies" description="Stream movies instantly and ad-free with smooth playback and trusted hosting." icon={<Film size={20} />} link="https://pixovia.pages.dev/movies" />
          <ServiceCard title="Pixovia Library" description="Upload, explore, and download all types of digital files up to 2GB, with free direct file URLs." icon={<BookOpen size={20} />} link="https://pixovia.pages.dev/library" />
          <ServiceCard title="Pixovia TV" description="Watch live TV channels directly from your browser — fast, free, and reliable." icon={<Tv size={20} />} link="https://pixovia.pages.dev/tv" />
          <ServiceCard title="Pixovia Sports" description="Stream high-quality live sports and highlights with zero subscription." icon={<Globe size={20} />} link="https://pixovia.pages.dev/sports" />
          <ServiceCard title="Pixovia Music" description="All your music at one place — listen ad-free and on-demand anytime." icon={<Music size={20} />} link="https://pixovia.pages.dev/music" />
        </section>

        <section className="mt-12 grid lg:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-2xl font-bold">Our Promise</h2>
            <p className="mt-3 text-lg opacity-90">
              Pixovia stands for open access, verified content, and community-driven innovation. Every file hosted in our Library has a permanent direct link like https://pixovia.pages.dev/file_name for free sharing worldwide.
            </p>

            <ul className="mt-6 space-y-3">
              <li className="flex items-start gap-3">
                <CheckCircle className="mt-1" />
                <div>
                  <strong>Free & Transparent</strong>
                  <div className="opacity-80">All Pixovia services are 100% free with no hidden fees.</div>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <ShieldCheck className="mt-1" />
                <div>
                  <strong>Verified Content</strong>
                  <div className="opacity-80">All files are checked for copyright and safety.</div>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="mt-1" />
                <div>
                  <strong>Community Driven</strong>
                  <div className="opacity-80">Creators and users together build a trusted digital world.</div>
                </div>
              </li>
            </ul>

            <div className="mt-6">
              <Button className="px-6 py-3" onClick={() => navigateTo('https://pixovia.pages.dev')}>Get Started — It's Free</Button>
            </div>
          </div>

          <div>
            <Card className="overflow-hidden">
              <CardContent>
                <h3 className="text-xl font-semibold">Upload Guidelines</h3>
                <p className="mt-2 opacity-90">
                  Every upload is verified for security and copyright. Once approved, you’ll receive a permanent direct link like https://pixovia.pages.dev/file_name for global access.
                </p>
                <div className="mt-4 grid gap-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">File size</div>
                      <div className="opacity-80 text-sm">Up to 2GB per file</div>
                    </div>
                    <div className="text-sm">Unlimited uploads</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">File types</div>
                      <div className="opacity-80 text-sm">Documents, videos, audio, and apps</div>
                    </div>
                    <div className="text-sm">Reviewed by staff</div>
                  </div>
                </div>
                <div className="mt-6">
                  <Button variant="ghost" onClick={() => navigateTo('https://pixovia.pages.dev/library')}>
                    Upload Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <footer className="mt-16 py-10 border-t">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
            <div>
              <strong>Pixovia LLC</strong>
              <div className="opacity-80 text-sm">Freedom • Creativity • Trust</div>
            </div>
            <div className="flex gap-4 items-center">
              <a className="text-sm opacity-90">Privacy</a>
              <a className="text-sm opacity-90">Terms</a>
              <a className="text-sm opacity-90" href="https://pixovia.pages.dev/contact">Contact</a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}

function ServiceCard({ title, description, icon, link }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="bg-white rounded-2xl shadow p-6 flex flex-col"
    >
      <div className="inline-flex items-center gap-3">
        <div className="bg-indigo-50 rounded-lg p-2">{icon}</div>
        <div>
          <h4 className="font-semibold">{title}</h4>
          <div className="text-sm opacity-80">{description}</div>
        </div>
      </div>
      <div className="mt-4 self-start">
        <Button variant="link" className="px-0 py-0" onClick={() => window.open(link, '_blank')}>
          Visit {title.replace('Pixovia ', '')}
        </Button>
      </div>
    </motion.div>
  );
}
