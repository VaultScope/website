import { useEffect } from 'react';

export const DocsOverview = () => {
  useEffect(() => {
    document.title = "Documentation Overview — VaultScope";
  }, []);

  return (
    <div>
      <h1 className="text-4xl md:text-5xl font-medium tracking-tighter text-foreground mb-6">VaultScope Ecosystem Documentation</h1>
      <p className="text-xl text-foreground/50 font-light mb-12">Comprehensive documentation covering the VaultScope ecosystem, including the customer-facing storefront, the VAMOS API backend, and the CAMOS administrative panel.</p>

      <h2>Introduction</h2>
      <p>VaultScope is a state-of-the-art infrastructure management and provisioning platform designed to simplify the browsing, ordering, and management of infrastructure products such as Virtual Private Servers (VPS), Dedicated Servers, and On-Demand Provisioning (ODP) configurations.</p>
      
      <h2>Core Architecture</h2>
      <p>The ecosystem is built upon three primary pillars that operate synchronously to deliver a seamless experience for both end-users and administrative staff.</p>
      
      <ul>
        <li><strong>VaultScope Storefront:</strong> The customer-facing single page application (SPA) built with React and Vite. It serves as the primary entry point for customers to configure, order, and manage their infrastructure.</li>
        <li><strong>VAMOS (API Management & Operations System):</strong> The core backend engine written in Rust using Axum and SQLx. It acts as the single source of truth, managing business logic, asynchronous provisioning tasks, and database interactions.</li>
        <li><strong>CAMOS (Control & Administrative Management Operations System):</strong> The staff-facing React portal used to manage products, oversee customer infrastructure, handle billing, and provide support.</li>
      </ul>

      <h2>Security First Approach</h2>
      <p>Security is not an afterthought in the VaultScope ecosystem. The entire architecture enforces a zero-trust model between components.</p>
      <ul>
        <li><strong>Strict Role-Based Access Control (RBAC):</strong> Managed centrally by VAMOS to ensure that only authorized personnel can access sensitive endpoints.</li>
        <li><strong>State-of-the-art Encryption:</strong> All upstream provider credentials, API keys, and sensitive customer data are encrypted at rest using AES-256-GCM.</li>
        <li><strong>Robust Session Management:</strong> Implementation of CSRF tokens, secure HTTP-only cookies, and rate limiting to prevent common attack vectors.</li>
      </ul>
      
      <p>Navigate through the sidebar to explore detailed documentation for each of the core components.</p>
    </div>
  );
};
