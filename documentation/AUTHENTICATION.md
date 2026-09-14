# Authentication Guide

This document explains the authentication system used in the VaultScope Storefront.

## Overview

VaultScope uses **OpenID Connect (OIDC)** via Authentik for authentication. This provides:

- ✅ Industry-standard OAuth2/OIDC flow
- ✅ Single Sign-On (SSO) capability
- ✅ Secure token-based authentication
- ✅ Automatic token expiration
- ✅ CSRF protection for auth flow

## Authentication Flow

### Complete Flow Diagram

```
┌──────────┐                                                          
│  User    │                                                          
└────┬─────┘                                                          
     │ 1. Clicks "Login"                                             
     ▼                                                                
┌────────────────┐                                                   
│  Storefront    │                                                   
│  (Browser)     │                                                   
└────┬───────────┘                                                   
     │ 2. POST /api/auth/init-login                                 
     ▼                                                                
┌────────────────┐                                                   
│   VAMOS API    │                                                   
└────┬───────────┘                                                   
     │ 3. Generate random state token                               
     │ 4. Store in Redis with TTL                                   
     │ 5. Return { state }                                          
     ▼                                                                
┌────────────────┐                                                   
│  Storefront    │                                                   
└────┬───────────┘                                                   
     │ 6. Store state in sessionStorage                             
     │ 7. Redirect to Authentik with:                               
     │    - client_id                                               
     │    - redirect_uri                                            
     │    - state                                                   
     │    - scope: openid profile email                            
     ▼                                                                
┌────────────────┐                                                   
│   Authentik    │                                                   
└────┬───────────┘                                                   
     │ 8. User authenticates (username/password)                    
     │ 9. Redirect back to redirect_uri with:                      
     │    - code                                                    
     │    - state                                                   
     ▼                                                                
┌────────────────┐                                                   
│  Storefront    │                                                   
│  /auth/callback│                                                   
└────┬───────────┘                                                   
     │ 10. Verify state matches sessionStorage                      
     │ 11. POST /api/auth/callback/storefront                       
     │     { code, redirect_uri, state }                            
     ▼                                                                
┌────────────────┐                                                   
│   VAMOS API    │                                                   
└────┬───────────┘                                                   
     │ 12. Verify state from Redis                                  
     │ 13. Exchange code for tokens with Authentik                  
     │ 14. Validate ID token                                        
     │ 15. Create JWT with claims                                   
     │ 16. Return { token, claims }                                 
     ▼                                                                
┌────────────────┐                                                   
│  Storefront    │                                                   
└────┬───────────┘                                                   
     │ 17. Store token & claims in localStorage                     
     │ 18. Redirect to /dashboard                                   
     ▼                                                                
┌────────────────┐                                                   
│  Dashboard     │  ← User is now authenticated                     
└────────────────┘                                                   
```

## Implementation

### Step 1: Initialize Login

When user clicks "Login":

```typescript
// src/lib/auth.ts
export async function redirectToLogin() {
  // Fetch state token from backend
  const res = await fetch(`${API_BASE}/auth/init-login`, {
    method: 'POST',
  });

  const { state } = await res.json();

  // Store state for callback verification
  sessionStorage.setItem('oidc_state', state);

  // Build authorization URL
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    scope: 'openid profile email',
    state,
  });

  // Redirect to Authentik
  window.location.href = `${AUTHENTIK_URL}/application/o/authorize/?${params}`;
}
```

### Step 2: Handle Callback

When Authentik redirects back:

```typescript
// src/pages/AuthCallback.tsx
export default function AuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const code = searchParams.get('code');
    const state = searchParams.get('state');

    if (!code || !state) {
      toast.error('Missing authorization code or state');
      navigate('/');
      return;
    }

    handleCallback(code, state)
      .then(claims => {
        toast.success(`Welcome back, ${claims.email}!`);
        navigate('/dashboard');
      })
      .catch(error => {
        toast.error(`Authentication failed: ${error.message}`);
        navigate('/');
      });
  }, []);

  return <div>Authenticating...</div>;
}
```

```typescript
// src/lib/auth.ts
export async function handleCallback(code: string, state: string): Promise<AuthClaims> {
  // Verify state (defense in depth)
  const savedState = sessionStorage.getItem('oidc_state');
  if (state !== savedState) {
    throw new Error('Invalid state parameter');
  }
  sessionStorage.removeItem('oidc_state');

  // Send to backend for token exchange
  const res = await fetch(`${API_BASE}/auth/callback/storefront`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code, redirect_uri: REDIRECT_URI, state }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || 'Authentication failed');
  }

  const { token, claims } = await res.json();

  // Store in localStorage
  localStorage.setItem('vs_token', token);
  localStorage.setItem('vs_claims', JSON.stringify(claims));

  return claims;
}
```

### Step 3: Using Authentication

#### Check Authentication Status

```typescript
import { isAuthenticated, getStoredClaims } from '../lib/auth';

function MyComponent() {
  if (!isAuthenticated()) {
    return <LoginPrompt />;
  }

  const claims = getStoredClaims();
  return <div>Welcome, {claims.email}!</div>;
}
```

#### Protected Routes

```typescript
import { isAuthenticated } from '../lib/auth';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  if (!isAuthenticated()) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

// Usage
<Route path="/dashboard" element={
  <ProtectedRoute>
    <Dashboard />
  </ProtectedRoute>
} />
```

#### Accessing User Claims

```typescript
import { getStoredClaims } from '../lib/auth';

const claims = getStoredClaims();
if (claims) {
  console.log('User ID:', claims.sub);
  console.log('Email:', claims.email);
  console.log('Role:', claims.role);
  console.log('Audience:', claims.audience); // 'storefront'
}
```

### Step 4: Logout

```typescript
import { logout } from '../lib/auth';

function handleLogout() {
  logout(); // Clears localStorage
  navigate('/');
  toast.success('Logged out successfully');
}
```

## Security Features

### 1. State Parameter (CSRF Protection)

The `state` parameter prevents CSRF attacks:

1. Backend generates random state token
2. Frontend stores it in sessionStorage
3. Authentik echoes it back in redirect
4. Frontend and backend both verify it matches

This ensures the auth flow was initiated by our application.

### 2. Token Expiration

JWT tokens have an `exp` (expiration) claim:

```typescript
export function getStoredClaims(): AuthClaims | null {
  const raw = localStorage.getItem('vs_claims');
  if (!raw) return null;

  const claims: AuthClaims = JSON.parse(raw);

  // Check expiration
  if (claims.exp * 1000 < Date.now()) {
    logout(); // Auto-logout expired sessions
    return null;
  }

  return claims;
}
```

### 3. Automatic Logout on 401

The API client automatically logs out on 401:

```typescript
if (res.status === 401) {
  localStorage.removeItem('vs_token');
  localStorage.removeItem('vs_claims');
  window.location.href = '/dashboard';
  throw new Error('Unauthorized');
}
```

### 4. Secure Token Storage

Tokens are stored in localStorage, not sessionStorage:

- ✅ Survives browser refresh
- ✅ Survives tab close/reopen
- ✅ Can't be accessed by other domains
- ⚠️ Accessible to JavaScript (XSS risk mitigated by React)

Alternative: Use httpOnly cookies (requires API changes).

## Claims Structure

```typescript
interface AuthClaims {
  sub: string;        // Subject (user ID)
  email: string;      // User email
  role: string;       // User role (customer, admin, etc.)
  audience: 'admin' | 'storefront'; // Which app the token is for
  exp: number;        // Expiration timestamp (Unix epoch)
  iat: number;        // Issued at timestamp (Unix epoch)
}
```

Example:

```json
{
  "sub": "user_01H2X3Y4Z5",
  "email": "customer@example.com",
  "role": "customer",
  "audience": "storefront",
  "exp": 1726502400,
  "iat": 1726498800
}
```

## Authentik Configuration

### Required Settings

In Authentik, create an OAuth2/OIDC provider with:

**Basic Settings:**
- Name: VaultScope Storefront
- Client ID: `vaultscope-storefront`
- Client Secret: Generate a secure secret
- Redirect URIs: 
  - `http://localhost:5174/auth/callback` (dev)
  - `https://vaultscope.de/auth/callback` (prod)

**Flow Settings:**
- Authorization flow: Default (implicit consent)
- Authentication flow: Default

**Scopes:**
- `openid` (required)
- `profile` (required)
- `email` (required)

### API Configuration

The API needs these environment variables:

```bash
AUTHENTIK_ISSUER=https://auth.vaultscope.de
AUTHENTIK_CLIENT_ID_STOREFRONT=vaultscope-storefront
AUTHENTIK_CLIENT_SECRET_STOREFRONT=<secret>
```

## Troubleshooting

### "Invalid state parameter"

**Cause**: State mismatch between frontend and backend

**Solutions**:
1. Ensure Redis is running (backend stores state in Redis)
2. Check state isn't expiring too quickly (default: 5 minutes)
3. Verify clock sync between servers
4. Clear sessionStorage and try again

### "Authentication failed"

**Cause**: Token exchange failed

**Solutions**:
1. Verify Authentik is reachable from API server
2. Check client ID and secret match Authentik
3. Ensure redirect_uri exactly matches Authentik config
4. Check Authentik logs for details

### "Unauthorized" after login

**Cause**: Token not being sent with requests

**Solutions**:
1. Verify token is in localStorage: `localStorage.getItem('vs_token')`
2. Check API client is including Authorization header
3. Ensure API JWT_SECRET is correct
4. Verify token hasn't expired

### Redirect Loop

**Cause**: Protected route keeps redirecting to login

**Solutions**:
1. Check `isAuthenticated()` is working correctly
2. Verify token and claims are in localStorage
3. Clear localStorage and start fresh
4. Check for JavaScript errors in console

## Best Practices

### 1. Always Check Authentication

```typescript
// ✅ Good - Check before rendering
function Dashboard() {
  if (!isAuthenticated()) {
    return <Navigate to="/" />;
  }
  
  return <DashboardContent />;
}

// ❌ Bad - Assume user is authenticated
function Dashboard() {
  const claims = getStoredClaims(); // Could be null!
  return <div>Welcome {claims.email}</div>; // Crash!
}
```

### 2. Handle Expiration Gracefully

```typescript
useEffect(() => {
  const interval = setInterval(() => {
    const claims = getStoredClaims();
    if (!claims) {
      // Token expired, redirect to login
      navigate('/');
      toast.info('Your session has expired. Please log in again.');
    }
  }, 60000); // Check every minute

  return () => clearInterval(interval);
}, []);
```

### 3. Clear Sensitive Data on Logout

```typescript
function logout() {
  // Clear tokens
  localStorage.removeItem('vs_token');
  localStorage.removeItem('vs_claims');
  
  // Clear any cached user data
  // ... clear other sensitive state ...
}
```

### 4. Use Separate Audiences

The storefront uses `audience: 'storefront'`. The admin panel uses `audience: 'admin'`. This prevents tokens from being used across applications.

```typescript
// Verify audience
const claims = getStoredClaims();
if (claims.audience !== 'storefront') {
  logout();
  throw new Error('Invalid token audience');
}
```

## Token Refresh (Future Enhancement)

Currently, tokens expire and users must re-authenticate. A future enhancement could add refresh tokens:

```typescript
// Pseudocode for token refresh
async function refreshToken() {
  const refreshToken = localStorage.getItem('vs_refresh_token');
  
  const res = await fetch('/api/auth/refresh', {
    method: 'POST',
    body: JSON.stringify({ refresh_token: refreshToken }),
  });

  const { token, claims } = await res.json();
  
  localStorage.setItem('vs_token', token);
  localStorage.setItem('vs_claims', JSON.stringify(claims));
}
```

This would require backend support for refresh tokens.

## Related Documentation

- [API Integration](API_INTEGRATION.md) - How authentication integrates with API requests
- [Security](../SECURITY.md) - Overall security practices
- [Configuration](CONFIGURATION.md) - Environment variables for auth
