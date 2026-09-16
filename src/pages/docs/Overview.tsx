import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Layers, Zap, Shield, ArrowRight, Download, RefreshCw, Trash2, CheckCircle2 } from 'lucide-react';

export const DocsOverview = () => {
  const location = useLocation();
  const isGerman = location.pathname.startsWith('/de');
  const getPath = (path: string) => isGerman ? `/de${path}` : path;

  useEffect(() => {
    document.title = "Documentation Overview — VaultScope";
  }, []);

  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-4xl md:text-5xl font-medium tracking-tighter text-foreground mb-6">
          VaultScope Ecosystem Documentation
        </h1>
        <p className="text-xl text-foreground/50 font-light mb-8 max-w-3xl leading-relaxed">
          Comprehensive documentation covering the VaultScope ecosystem, including the customer-facing storefront, the VAMOS API backend, and the CAMOS administrative panel.
        </p>
      </div>

      {/* Component Lifecycle Cards */}
      <div className="grid md:grid-cols-3 gap-6 not-prose">
        {/* Storefront Card */}
        <div className="p-6 rounded-xl border border-border bg-foreground/[0.01] hover:border-foreground/20 transition-all flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-lg bg-foreground/5 flex items-center justify-center mb-4">
              <Layers className="w-5 h-5 text-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-1">Customer Storefront</h3>
            <p className="text-xs text-foreground/60 mb-4">
              Customer web application built with React 19, Vite 8, Tailwind 4, and served with Caddy.
            </p>
            <div className="space-y-1.5 text-xs text-foreground/70 mb-6">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-green-500" /> Automated installer
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-green-500" /> Caddy static & SPA fallback
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-green-500" /> Stripe & Authentik OIDC
              </div>
            </div>
          </div>
          <Link
            to={getPath('/docs/projects/storefront')}
            className="inline-flex items-center justify-between px-3 py-2 text-xs font-medium border border-border rounded-lg hover:bg-foreground/5 transition-colors text-foreground"
          >
            <span>View Storefront Guide</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* VAMOS Card */}
        <div className="p-6 rounded-xl border border-border bg-foreground/[0.01] hover:border-foreground/20 transition-all flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-lg bg-foreground/5 flex items-center justify-center mb-4">
              <Zap className="w-5 h-5 text-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-1">VAMOS Backend API</h3>
            <p className="text-xs text-foreground/60 mb-4">
              High-performance backend engine written in Rust (Axum, SQLx, Tokio, PostgreSQL, Redis).
            </p>
            <div className="space-y-1.5 text-xs text-foreground/70 mb-6">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-green-500" /> Async JobRunner daemon
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-green-500" /> SQLx database migrations
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-green-500" /> AES-256-GCM encryption
              </div>
            </div>
          </div>
          <Link
            to={getPath('/docs/projects/vamos')}
            className="inline-flex items-center justify-between px-3 py-2 text-xs font-medium border border-border rounded-lg hover:bg-foreground/5 transition-colors text-foreground"
          >
            <span>View VAMOS Guide</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* CAMOS Card */}
        <div className="p-6 rounded-xl border border-border bg-foreground/[0.01] hover:border-foreground/20 transition-all flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-lg bg-foreground/5 flex items-center justify-center mb-4">
              <Shield className="w-5 h-5 text-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-1">CAMOS Admin Panel</h3>
            <p className="text-xs text-foreground/60 mb-4">
              Staff and operations portal built with React 19, TipTap, and Recharts, served with Nginx.
            </p>
            <div className="space-y-1.5 text-xs text-foreground/70 mb-6">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-green-500" /> Product catalog mapping
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-green-500" /> Ticketing & support desk
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-green-500" /> Role-based access control
              </div>
            </div>
          </div>
          <Link
            to={getPath('/docs/projects/camos')}
            className="inline-flex items-center justify-between px-3 py-2 text-xs font-medium border border-border rounded-lg hover:bg-foreground/5 transition-colors text-foreground"
          >
            <span>View CAMOS Guide</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      <h2>Introduction</h2>
      <p>
        VaultScope is a state-of-the-art infrastructure management and provisioning platform designed to simplify the browsing, ordering, and management of infrastructure products such as Virtual Private Servers (VPS), Dedicated Servers, and On-Demand Provisioning (ODP) configurations.
      </p>
      
      <h2>Core Architecture</h2>
      <p>
        The ecosystem is built upon three primary pillars that operate synchronously to deliver a seamless experience for both end-users and administrative staff:
      </p>
      
      <ul>
        <li>
          <strong>VaultScope Storefront:</strong> The customer-facing single page application (SPA) built with React and Vite. It serves as the primary entry point for customers to configure, order, and manage their infrastructure.
        </li>
        <li>
          <strong>VAMOS (API Management & Operations System):</strong> The core backend engine written in Rust using Axum and SQLx. It acts as the single source of truth, managing business logic, asynchronous provisioning tasks, and database interactions.
        </li>
        <li>
          <strong>CAMOS (Control & Administrative Management Operations System):</strong> The staff-facing React portal used to manage products, oversee customer infrastructure, handle billing, and provide support.
        </li>
      </ul>

      <h2>Security First Approach</h2>
      <p>
        Security is not an afterthought in the VaultScope ecosystem. The entire architecture enforces a zero-trust model between components:
      </p>
      <ul>
        <li>
          <strong>Strict Role-Based Access Control (RBAC):</strong> Managed centrally by VAMOS to ensure that only authorized personnel can access sensitive endpoints.
        </li>
        <li>
          <strong>State-of-the-art Encryption:</strong> All upstream provider credentials, API keys, and sensitive customer data are encrypted at rest using AES-256-GCM.
        </li>
        <li>
          <strong>Robust Session Management:</strong> Implementation of CSRF tokens, secure HTTP-only cookies, and rate limiting to prevent common attack vectors.
        </li>
      </ul>
      
      <h2>Quick Reference: System Lifecycle Actions</h2>
      <div className="overflow-x-auto not-prose">
        <table className="w-full text-left text-xs border-collapse border border-border">
          <thead>
            <tr className="bg-foreground/5 border-b border-border">
              <th className="p-3 font-medium text-foreground">Action</th>
              <th className="p-3 font-medium text-foreground">Command / Script</th>
              <th className="p-3 font-medium text-foreground">Documentation</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            <tr>
              <td className="p-3 font-medium text-foreground flex items-center gap-1.5">
                <Download className="w-3.5 h-3.5 text-foreground/60" /> Full Stack Install
              </td>
              <td className="p-3 font-mono">curl -fsSL https://raw.githubusercontent.com/VaultScope/website/dev/installer.sh | sudo bash</td>
              <td className="p-3">
                <Link to={getPath('/docs/projects/storefront')} className="text-foreground underline">Storefront</Link> / <Link to={getPath('/docs/projects/vamos')} className="text-foreground underline">VAMOS</Link> / <Link to={getPath('/docs/projects/camos')} className="text-foreground underline">CAMOS</Link>
              </td>
            </tr>
            <tr>
              <td className="p-3 font-medium text-foreground flex items-center gap-1.5">
                <RefreshCw className="w-3.5 h-3.5 text-foreground/60" /> Full Stack Upgrade
              </td>
              <td className="p-3 font-mono">sudo /opt/vaultscope/update.sh --branch=dev</td>
              <td className="p-3">
                <Link to={getPath('/docs/projects/vamos')} className="text-foreground underline">Upgrading VAMOS</Link>
              </td>
            </tr>
            <tr>
              <td className="p-3 font-medium text-foreground flex items-center gap-1.5">
                <Trash2 className="w-3.5 h-3.5 text-foreground/60" /> Full Stack Uninstall
              </td>
              <td className="p-3 font-mono">sudo /opt/vaultscope/uninstall.sh</td>
              <td className="p-3">
                <Link to={getPath('/docs/projects/storefront')} className="text-foreground underline">Teardown Guide</Link>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <p>Navigate through the sidebar to explore detailed documentation for each of the core components.</p>
    </div>
  );
};
