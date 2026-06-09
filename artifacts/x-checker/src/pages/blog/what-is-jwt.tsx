import { BlogLayout } from "@/components/layout/BlogLayout";
import { Key, Lock, Code, Shield } from "lucide-react";

export default function WhatIsJwt() {
  return (
    <BlogLayout
      seoTitle="What is a JWT Token? JSON Web Tokens Explained for Developers (2026)"
      seoDescription="What is a JWT? Learn how JSON Web Tokens work, their header-payload-signature structure, when to use JWT vs sessions, security best practices, and how to decode JWTs."
      title="What is a JWT Token? JSON Web Tokens Explained for Developers"
      description="JWTs are the standard for stateless authentication in modern web apps and APIs. Here's how they work, when to use them, and how to avoid the common security pitfalls."
      icon={Key}
      readTime="8 min read"
      publishDate="2026"
      category="Developer"
      relatedArticles={[
        { title: "What Is Base64?", href: "/blog/what-is-base64", description: "Base64 encoding explained — JWTs use Base64URL internally.", readTime: "6 min" },
        { title: "What Is a UUID?", href: "/blog/what-is-uuid", description: "UUIDs explained: format, versions, and use cases.", readTime: "6 min" },
        { title: "Regular Expressions Guide", href: "/blog/what-is-regex", description: "Regex explained with 10 practical examples.", readTime: "9 min" },
      ]}
      relatedTools={[
        { title: "JWT Decoder", href: "/tools/jwt-decoder", description: "Decode and inspect JWT tokens instantly.", icon: Key },
        { title: "Base64 Encoder", href: "/tools/base64", description: "Encode and decode Base64 and Base64URL strings.", icon: Code },
        { title: "JSON Formatter", href: "/tools/json-formatter", description: "Format and validate JSON payloads.", icon: Lock },
        { title: "Password Generator", href: "/tools/password-generator", description: "Generate strong random secrets for JWT signing.", icon: Shield },
      ]}
    >
      <h2>What Is a JWT?</h2>
      <p>
        A <strong>JSON Web Token</strong> (JWT, pronounced "jot") is a compact, URL-safe token format used to securely transmit information between parties as a JSON object. JWTs are most commonly used for <strong>authentication</strong> and <strong>authorization</strong> in web applications and APIs.
      </p>
      <p>
        When a user logs in to an application, the server creates a JWT containing claims about the user (like their user ID and role), signs it with a secret or private key, and sends it to the client. The client then includes the JWT in subsequent requests — typically in the <code>Authorization</code> HTTP header — and the server can verify the token's authenticity without needing to look up the user in a database on every request.
      </p>
      <p>
        JWTs are defined in <strong>RFC 7519</strong> and are widely used in OAuth 2.0, OpenID Connect, and as standalone authentication tokens in REST and GraphQL APIs.
      </p>

      <h2>JWT Structure: Header, Payload, Signature</h2>
      <p>
        A JWT consists of three Base64URL-encoded parts separated by dots:
      </p>
      <p><code>header.payload.signature</code></p>
      <p>
        A real JWT looks like this:
      </p>
      <p><code>eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c</code>
      </p>

      <h3>1. Header</h3>
      <p>
        The header contains metadata about the token type and the signing algorithm used:
      </p>
      <p><code>{`{ "alg": "HS256", "typ": "JWT" }`}</code></p>
      <p>
        Common algorithms: <code>HS256</code> (HMAC-SHA256 — symmetric, one shared secret), <code>RS256</code> (RSA-SHA256 — asymmetric, public/private key pair), <code>ES256</code> (ECDSA — faster than RSA, same security level).
      </p>

      <h3>2. Payload</h3>
      <p>
        The payload contains <strong>claims</strong> — statements about the user or the token itself. There are three types of claims:
      </p>
      <ul>
        <li><strong>Registered claims</strong> (standard, optional but recommended): <code>iss</code> (issuer), <code>sub</code> (subject — usually the user ID), <code>aud</code> (audience), <code>exp</code> (expiration time, as a Unix timestamp), <code>iat</code> (issued at), <code>nbf</code> (not before), <code>jti</code> (JWT ID — unique identifier).</li>
        <li><strong>Public claims</strong>: Custom claims registered in the IANA JWT Registry to avoid collisions.</li>
        <li><strong>Private claims</strong>: Custom claims agreed upon between the parties, like <code>{`{"role": "admin"}`}</code> or <code>{`{"plan": "pro"}`}</code>.</li>
      </ul>
      <p>
        A typical payload:
      </p>
      <p><code>{`{ "sub": "user_abc123", "email": "alice@example.com", "role": "admin", "iat": 1700000000, "exp": 1700003600 }`}</code></p>
      <p>
        <strong>Important:</strong> The payload is Base64URL-encoded, not encrypted. Anyone can decode a JWT and read its contents. Never put sensitive data (passwords, credit cards, SSNs) in a JWT payload.
      </p>

      <h3>3. Signature</h3>
      <p>
        The signature is computed by taking the Base64URL-encoded header and payload, concatenating them with a dot, and signing the result with the algorithm and key specified in the header:
      </p>
      <p><code>HMACSHA256(base64url(header) + "." + base64url(payload), secret)</code></p>
      <p>
        The signature ensures two things: (1) the token was issued by a trusted party who knows the secret, and (2) the token has not been tampered with — changing even one character of the header or payload would produce a completely different signature.
      </p>

      <h2>How JWT Authentication Works</h2>
      <p>The typical JWT authentication flow:</p>
      <ol>
        <li>User submits credentials (username and password) to the login endpoint.</li>
        <li>Server validates credentials, creates a JWT with the user's claims and an expiration time, signs it with a secret key, and returns it to the client.</li>
        <li>Client stores the JWT (in memory, localStorage, or an HttpOnly cookie) and includes it in subsequent requests: <code>Authorization: Bearer &lt;token&gt;</code>.</li>
        <li>Server receives the request, extracts the JWT, verifies the signature using the secret key, checks the expiration, and extracts the user claims — all without a database query.</li>
        <li>If the token is valid, the server processes the request. If invalid or expired, it returns a 401 Unauthorized response.</li>
      </ol>

      <h2>JWT vs Session Tokens</h2>
      <p>
        Traditional session-based authentication stores session data on the server (in memory or a database) and gives the client a session ID stored in a cookie. JWT authentication is <strong>stateless</strong> — all the information is in the token itself, and the server doesn't need to store anything.
      </p>
      <ul>
        <li><strong>JWTs are better for:</strong> microservices and distributed systems (no shared session store needed), APIs consumed by mobile apps or third parties, horizontal scaling (any server can validate any token).</li>
        <li><strong>Sessions are better for:</strong> applications that need immediate token revocation (you can delete a session from the store; you can't "un-issue" a JWT until it expires), traditional server-rendered web apps with strict security requirements.</li>
      </ul>
      <p>
        The biggest operational challenge with JWTs is revocation. Because JWTs are self-contained, a server can't "invalidate" a token early without maintaining a blocklist — which partially defeats the purpose of stateless authentication. Short expiration times (15 minutes for access tokens) combined with refresh tokens is the standard mitigation.
      </p>

      <h2>When to Use JWT</h2>
      <ul>
        <li><strong>API authentication:</strong> REST and GraphQL APIs where the client is a mobile app, SPA, or another service.</li>
        <li><strong>Microservices:</strong> Service-to-service authentication where each service needs to verify the caller's identity without a central auth database.</li>
        <li><strong>Single Sign-On (SSO):</strong> JWTs carry identity claims across multiple applications and domains.</li>
        <li><strong>Temporary, scoped access tokens:</strong> Issue a short-lived JWT for a specific operation (e.g., a one-time file download link).</li>
      </ul>
      <p>
        Avoid JWTs for storing large amounts of data (tokens are included in every request — keep payloads small), for situations requiring immediate revocation without a blocklist, or when you need to store server-side state anyway.
      </p>

      <h2>JWT Security Best Practices</h2>
      <ul>
        <li><strong>Always verify the signature.</strong> Never trust a JWT without verifying it. Use a well-maintained library; don't implement verification yourself.</li>
        <li><strong>Validate the <code>alg</code> header.</strong> Some libraries historically accepted <code>"alg": "none"</code>, which bypasses signature verification entirely. Always specify the expected algorithm explicitly.</li>
        <li><strong>Set short expiration times.</strong> Use short-lived access tokens (15 minutes to 1 hour) and refresh tokens for persistence. Store the refresh token in an HttpOnly cookie.</li>
        <li><strong>Use strong secrets.</strong> For HS256, use a randomly generated secret of at least 256 bits. For RS256 or ES256, use a proper key pair generated by a cryptographic library.</li>
        <li><strong>Don't store JWTs in localStorage if you can avoid it.</strong> LocalStorage is accessible by JavaScript and vulnerable to XSS. HttpOnly cookies are immune to XSS (though vulnerable to CSRF if not properly configured with SameSite).</li>
        <li><strong>Include the <code>aud</code> (audience) claim</strong> and validate it on the server — this prevents tokens issued for one service from being reused with another.</li>
        <li><strong>Don't put sensitive data in the payload.</strong> The payload is readable by anyone who has the token. Encrypt the entire JWT (using JWE) if you need to store sensitive claims.</li>
      </ul>

      <h2>Decode and Inspect JWTs</h2>
      <p>
        Use our free <a href="/tools/jwt-decoder"><strong>JWT Decoder</strong></a> to decode any JWT token and inspect its header, payload, and signature. Paste a token to see all claims including the user ID, email, role, expiration time, and any custom claims — instantly, with no server calls.
      </p>
    </BlogLayout>
  );
}
