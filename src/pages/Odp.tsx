import { useEffect } from "react";
import { PageHero } from "../components/Shared";
import { WaitlistForm } from "../components/WaitlistForm";
import { PackageOpen, Zap, Shield, Settings2 } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

// --- How it works steps ---

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Choose a service",
    description:
      "Browse the catalogue of pre-configured services. Each entry ships with a battle-tested image and a default configuration — no setup required.",
  },
  {
    step: "02",
    title: "Configure & deploy",
    description:
      "Adjust the parameters that matter to you — server name, region, resource tier — and hit deploy. Everything else is handled automatically.",
  },
  {
    step: "03",
    title: "Up in seconds",
    description:
      "Your service starts on our infrastructure within moments. Access credentials and connection details are delivered to you instantly.",
  },
];

// --- Value pillars ---

const PILLARS = [
  {
    icon: Zap,
    title: "Instant deployment",
    description:
      "Skip the provisioning queue. Pre-built images mean your service is running in seconds, not minutes.",
  },
  {
    icon: PackageOpen,
    title: "Ready-to-run images",
    description:
      "Every service in the catalogue ships with a curated, production-grade image. No dependency hunting, no manual configuration.",
  },
  {
    icon: Settings2,
    title: "Sensible defaults",
    description:
      "Default configurations are tuned for reliability out of the box. Adjust only what you need, leave the rest to us.",
  },
  {
    icon: Shield,
    title: "Managed infrastructure",
    description:
      "Underlying servers, networking, and security patches are handled on our end. You focus on running your service.",
  },
];

// --- Component ---

export const Odp = () => {
  useEffect(() => {
    document.title = "ODP — VaultScope";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute(
        "content",
        "VaultScope One-Click Deploy — launch pre-configured services on managed infrastructure instantly, without any setup."
      );
    }
  }, []);

  return (
    <div className="flex flex-col w-full">
      {/* Hero */}
      <PageHero
        eyebrow="ONE-CLICK DEPLOY"
        title={
          <>
            Services, live
            <br />
            in seconds.
          </>
        }
        description="Pre-built images. Pre-configured settings. Deploy a fully managed service on our infrastructure with a single click — zero manual setup required."
        primaryCta="Join the waitlist"
        primaryLink="#waitlist"
        align="left"
      />

      {/* How it works */}
      <section className="py-32 relative bg-background border-t border-border/[0.05]">
        <div className="container mx-auto px-6 lg:px-12">
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-xs font-medium text-foreground/30 uppercase tracking-widest mb-16"
          >
            How it works
          </motion.p>

          <div className="grid md:grid-cols-3 gap-0 border border-border">
            {HOW_IT_WORKS.map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className={`p-10 md:p-12 flex flex-col gap-6 ${
                  i < HOW_IT_WORKS.length - 1
                    ? "border-b md:border-b-0 md:border-r border-border"
                    : ""
                }`}
              >
                <span className="text-xs font-medium text-foreground/20 tracking-widest uppercase">
                  {item.step}
                </span>
                <div>
                  <h3 className="text-xl font-medium text-foreground tracking-tight mb-3">
                    {item.title}
                  </h3>
                  <p className="text-sm text-foreground/40 font-light leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Value pillars */}
      <section className="py-32 relative bg-background border-t border-border/[0.05]">
        <div className="container mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-xl mb-20"
          >
            <p className="text-xs font-medium text-foreground/30 uppercase tracking-widest mb-6">
              What you get
            </p>
            <h2 className="text-4xl md:text-5xl font-medium tracking-tighter text-foreground leading-[0.95]">
              Everything included.
              <br />
              Nothing to configure.
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-0 border border-border">
            {PILLARS.map((pillar, i) => {
              const Icon = pillar.icon;
              return (
                <motion.div
                  key={pillar.title}
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.07 }}
                  className={`p-10 flex flex-col gap-8 ${
                    i % 2 !== 0 ? "bg-foreground/[0.015]" : "bg-background"
                  } ${
                    i < PILLARS.length - 1
                      ? "border-b lg:border-b-0 lg:border-r border-border"
                      : ""
                  }`}
                >
                  <div className="w-10 h-10 border border-border flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-foreground/60" />
                  </div>
                  <div>
                    <h3 className="text-base font-medium text-foreground tracking-tight mb-3 uppercase">
                      {pillar.title}
                    </h3>
                    <p className="text-sm text-foreground/40 font-light leading-relaxed">
                      {pillar.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Catalogue teaser */}
      <section className="py-32 relative bg-background border-t border-border/[0.05]">
        <div className="container mx-auto px-6 lg:px-12 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="border border-border p-12 md:p-16 flex flex-col md:flex-row md:items-end gap-12"
          >
            <div className="flex-1">
              <p className="text-xs font-medium text-foreground/30 uppercase tracking-widest mb-6">
                Service catalogue
              </p>
              <h2 className="text-3xl md:text-4xl font-medium tracking-tighter text-foreground mb-5">
                A growing library of
                <br />
                ready-to-deploy services.
              </h2>
              <p className="text-foreground/40 font-light leading-relaxed text-lg max-w-lg">
                The catalogue launches with a curated selection of popular services,
                each paired with a production-ready image and a sensible default
                configuration. More services will be added regularly.
              </p>
            </div>
            <div className="shrink-0">
              <div className="flex items-center gap-2 border border-border px-4 py-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-foreground/20 block" />
                <span className="text-xs font-medium text-foreground/40 uppercase tracking-widest">
                  Coming Soon
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Waitlist */}
      <section
        id="waitlist"
        className="py-32 relative bg-background border-t border-border/[0.05]"
      >
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-medium tracking-tighter text-foreground mb-4">
              Be the first to deploy.
            </h2>
            <p className="text-foreground/50 font-light mb-10 text-lg leading-relaxed">
              One-Click Deploy is currently in preparation. Leave your email and
              we&apos;ll notify you the moment the catalogue goes live.
            </p>
            <WaitlistForm />
            <div className="mt-8 pt-8 border-t border-border/[0.05]">
              <p className="text-sm text-foreground/30 font-light">
                Questions before launch?{" "}
                <Link
                  to="/contact"
                  className="text-foreground/50 hover:text-foreground transition-colors underline underline-offset-2"
                >
                  Get in touch
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
