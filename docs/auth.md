# Storefront Authentication Flow

## Mechanism
- Authentication starts by calling `POST /api/auth/init-login` which returns a state parameter.
- Upon returning from the OIDC provider (or dev-login bypass), the API issues a JWT with `Audience::Storefront`.
- The token is stored in localStorage as `vs_token`.
- Every request using `src/lib/api.ts` automatically attaches the token as a Bearer header.
- Cross-Site Request Forgery (CSRF) protection is also implemented via an `x-csrf-token` fetched from `/api/csrf` on non-GET requests.

## Security Constraints
- The token contains the customer's UUID in the `sub` claim.
- Storefront tokens CANNOT be used on `/api/admin/*` routes.
