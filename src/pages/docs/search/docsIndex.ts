export interface DocSection {
  id: string;
  title: string;
  content: string;
}

export interface DocArticle {
  id: string;
  title: string;
  category: 'Overview' | 'Account & Login' | 'SFTP Storage';
  path: string;
  description: string;
  keywords: string[];
  sections: DocSection[];
}

export const DOCS_INDEX: DocArticle[] = [
  {
    id: 'overview',
    title: 'VaultScope Documentation',
    category: 'Overview',
    path: '/docs',
    description: 'Clear, step-by-step guides for signing in to your VaultScope account and connecting to your SFTP Storage.',
    keywords: ['overview', 'documentation', 'sftp', 'login', 'port 2022', 'web file manager', 'fthr'],
    sections: [
      { id: 'user-login', title: 'User Login & Account', content: 'Registering an account, verifying your email, signing in at /login, and enabling 2FA.' },
      { id: 'sftp-storage', title: 'SFTP Storage Guide', content: 'Connecting to sftp.vaultscope.de on port 2022, using the Web File Manager (/web/client), and copying the FTHR preset.' },
    ],
  },
  {
    id: 'customer-getting-started',
    title: 'User Login & Account Guide',
    category: 'Account & Login',
    path: '/docs/customer/getting-started',
    description: 'How to create your VaultScope account (with address autofill, company, and EU VAT ID), verify your email address, sign in to the customer dashboard, and protect your account with Two-Factor Authentication (2FA).',
    keywords: ['login', 'sign in', 'register', 'account', 'address', 'autofill', 'company', 'vat id', '2fa', 'mfa', 'totp', 'authenticator', 'verify email', 'password'],
    sections: [
      { id: 'create-account', title: '1. Create an Account', content: 'Register at /register with your Username, Full Name, Email, Password, Billing Address (with live street/PLZ/city autofill), and optional Company and EU VAT ID.' },
      { id: 'verify-email', title: '2. Verify Your Email', content: 'Click the verification link sent to your email address or resend from Dashboard -> Profile.' },
      { id: 'sign-in', title: '3. Sign In to Your Dashboard', content: 'Sign in at /login with your Email, Password, and optional 6-digit 2FA authenticator code.' },
      { id: 'two-factor-auth', title: '4. Two-Factor Authentication (2FA)', content: 'Enable TOTP 2FA in Dashboard -> Profile -> 2FA (/dashboard/profile/mfa) using any authenticator app.' },
    ],
  },
  {
    id: 'customer-sftp',
    title: 'SFTP Storage Guide',
    category: 'SFTP Storage',
    path: '/docs/customer/sftp',
    description: 'How to find your SFTP credentials in the dashboard, manage files in your browser using the Web File Manager, copy your FTHR clipping preset, or connect with any SFTP client on port 2022.',
    keywords: ['sftp', 'storage', 'port 2022', 'sftp.vaultscope.de', 'web file manager', '/web/client', 'fthr', 'clipping', 'filezilla', 'winscp', 'cyberduck'],
    sections: [
      { id: 'connection-details', title: '1. Your Connection Details', content: 'Host: sftp.vaultscope.de, Port: 2022, Username & Password in Dashboard -> SFTP Storage (/dashboard/sftp).' },
      { id: 'web-file-manager', title: '2. Built-in Web File Manager', content: 'Open /web/client directly from your SFTP Storage card to upload, download, and manage files in your browser.' },
      { id: 'fthr-integration', title: '3. FTHR Clipping Software Preset', content: 'Click Configurations -> FTHR on your active storage card to copy the ready-to-use JSON config.' },
      { id: 'sftp-clients', title: '4. Connecting via FileZilla, WinSCP & CLI', content: 'Connect with FileZilla, WinSCP, Cyberduck, or sftp -P 2022 <username>@sftp.vaultscope.de.' },
    ],
  },
];

export interface SearchMatch {
  article: DocArticle;
  matchedSection?: DocSection;
  matchedField: 'title' | 'description' | 'section-title' | 'section-content' | 'keyword';
  matchSnippet: string;
  score: number;
}

export function searchDocs(query: string): SearchMatch[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const terms = q.split(/\s+/).filter(Boolean);
  const results: SearchMatch[] = [];

  for (const article of DOCS_INDEX) {
    let highestScore = 0;
    let bestSection: DocSection | undefined;
    let matchedField: SearchMatch['matchedField'] = 'title';
    let snippet = article.description;

    const titleLower = article.title.toLowerCase();
    const descLower = article.description.toLowerCase();

    if (terms.every(t => titleLower.includes(t))) {
      highestScore += 100;
      matchedField = 'title';
      snippet = article.description;
    } else if (terms.some(t => titleLower.includes(t))) {
      highestScore += 50;
      matchedField = 'title';
      snippet = article.description;
    }

    const matchedKw = article.keywords.filter(k => terms.some(t => k.includes(t)));
    if (matchedKw.length > 0) {
      highestScore += 30 * matchedKw.length;
      if (highestScore < 100) {
        matchedField = 'keyword';
        snippet = `Matches tags: ${matchedKw.join(', ')}`;
      }
    }

    if (terms.some(t => descLower.includes(t))) {
      highestScore += 25;
      if (highestScore < 80) {
        matchedField = 'description';
        snippet = article.description;
      }
    }

    for (const sec of article.sections) {
      const secTitleLower = sec.title.toLowerCase();
      const secContentLower = sec.content.toLowerCase();

      if (terms.some(t => secTitleLower.includes(t))) {
        highestScore += 40;
        bestSection = sec;
        matchedField = 'section-title';
        snippet = sec.content;
      } else if (terms.some(t => secContentLower.includes(t))) {
        highestScore += 20;
        if (!bestSection) {
          bestSection = sec;
          matchedField = 'section-content';
          snippet = sec.content;
        }
      }
    }

    if (highestScore > 0) {
      results.push({
        article,
        matchedSection: bestSection,
        matchedField,
        matchSnippet: snippet,
        score: highestScore,
      });
    }
  }

  return results.sort((a, b) => b.score - a.score);
}
