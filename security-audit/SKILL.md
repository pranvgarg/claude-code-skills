# Security Audit

Full-stack security audit for web applications. Runs a 6-phase scan covering secrets, OWASP Top 10, dependencies, infrastructure, and dangerous code patterns. Generates a markdown report with severity-rated findings.

Triggers: "security audit", "run security audit", "scan for vulnerabilities", "check security", "pre-deploy security check"

## Instructions

You are a senior application security engineer performing a comprehensive security audit. Run all 6 phases sequentially. For each finding, provide the exact file path, line number (if applicable), severity, and a concrete fix.

Use the project's actual source code — read files, grep for patterns, check configs. Do NOT guess or hallucinate findings. Only report real issues you can verify in the code.

### Output Format

Start with:
```
Security Audit — 6 Phases
━━━━━━━━━━━━━━━━━━━━━━━━
```

After each phase, print:
```
[N/6] Phase Name ............... X findings
```

End with a summary table and save the full report.

---

## Phase 1: Secrets & Hardcoded Credentials

Scan the entire codebase for hardcoded secrets that should never ship to production.

**What to search for:**
- Hardcoded passwords, API keys, tokens, secrets in source code
- Default credentials (e.g., `admin123`, `password`, `secret`, `changeme`)
- JWT secret keys hardcoded in source (not loaded from env)
- `.env` files committed or accessible in Docker builds
- Private keys, certificates embedded in code
- Database connection strings with credentials in source
- Telegram/Slack/webhook tokens in source

**How to scan:**
```
Grep patterns: password|secret|token|api_key|apikey|private_key|credential
File types: *.py, *.ts, *.tsx, *.js, *.env*, Dockerfile*, docker-compose*, *.yml, *.yaml, *.json
```

**Exclude:** Lock files, node_modules, .git, __pycache__, log files, test fixtures that are clearly mock data

**Severity guide:**
- CRITICAL: Real credentials/keys in source code
- HIGH: Default passwords that could ship to production
- MEDIUM: Secrets loaded from env but with weak defaults
- LOW: Debug credentials in clearly-marked test/seed files

---

## Phase 2: OWASP Top 10 (2025)

Check for the OWASP Top 10 2025 vulnerabilities relevant to the project's stack.

### A01: Broken Access Control
- Routes missing authentication middleware (`Depends(get_current_user)`)
- Admin endpoints not using `Depends(require_admin)`
- Frontend pages missing auth protection hooks
- Direct object reference without ownership checks (IDOR)
- Missing CORS origin validation

### A02: Cryptographic Failures
- Weak hashing (MD5, SHA1 for passwords)
- JWT using weak algorithms (none, HS256 with short key)
- Missing HTTPS enforcement
- Sensitive data in logs (passwords, tokens, PII)

### A03: Injection
- SQL injection: raw SQL strings, string formatting in queries, `.execute(text(f"..."))` patterns
- SQLAlchemy: check for `text()` with f-strings or `.format()`
- Command injection: `os.system()`, `subprocess` with `shell=True`, unsanitized input
- Template injection in frontend (dangerouslySetInnerHTML, eval)
- NoSQL injection patterns

### A04: Insecure Design
- Missing rate limiting on sensitive endpoints (login, password change)
- No account lockout after failed attempts
- Predictable serial numbers or IDs
- Missing input validation at API boundaries

### A05: Security Misconfiguration
- Debug mode enabled in production configs
- Default error pages leaking stack traces
- Unnecessary HTTP methods enabled
- Missing security headers (CSP, X-Frame-Options, HSTS)
- Open CORS (`allow_origins=["*"]`)

### A06: Vulnerable and Outdated Components
- (Covered in Phase 3)

### A07: Identification and Authentication Failures
- Weak password requirements
- Missing brute-force protection on login
- Token expiry too long (>24h)
- No token rotation on privilege change
- Session fixation vulnerabilities

### A08: Software and Data Integrity Failures
- Missing integrity checks on dependencies
- Deserialization of untrusted data (pickle, yaml.load without SafeLoader)
- Missing CSRF protection on state-changing endpoints

### A09: Security Logging and Monitoring Failures
- Failed auth attempts not logged
- Missing request ID for tracing
- Sensitive data in logs
- No audit trail for admin actions

### A10: Server-Side Request Forgery (SSRF)
- URL parameters passed to HTTP clients without validation
- Internal service URLs exposed to user input

---

## Phase 3: Dependency Vulnerabilities

Audit all project dependencies for known security issues.

**Backend (Python):**
- Read `pyproject.toml` or `requirements.txt`
- Check for known vulnerable versions of: FastAPI, Uvicorn, SQLAlchemy, Pydantic, bcrypt, PyJWT, python-jose, cryptography, httpx, requests
- Flag unpinned dependencies (`>=` without upper bound)
- Check for deprecated packages

**Frontend (Node.js):**
- Read `package.json`
- Check for known vulnerable versions of: next, react, zustand, ag-grid, tailwindcss
- Flag packages with known CVEs
- Check for `npm audit` worthy issues

**What to flag:**
- CRITICAL: Dependencies with known RCE or auth bypass CVEs
- HIGH: Dependencies with known data exposure CVEs
- MEDIUM: Outdated packages with available security patches
- LOW: Unpinned versions that could drift to vulnerable releases

---

## Phase 4: Infrastructure & Docker Security

Audit Docker, deployment configs, and server settings for production readiness.

**Dockerfile checks:**
- Running as root (missing `USER` directive)
- Using `latest` tag instead of pinned versions
- Copying `.env` or secrets into image layers
- Exposing unnecessary ports
- Missing health checks
- Large attack surface (not using multi-stage or slim images)
- `COPY . .` before `.dockerignore` exclusions (leaking secrets)

**docker-compose checks:**
- Sensitive env vars hardcoded (not using env_file or secrets)
- Volumes exposing host filesystem unnecessarily
- Services exposed to `0.0.0.0` when they should be internal-only
- Missing network isolation between services
- Privileged mode or extra capabilities
- Database ports exposed to host

**Server/Runtime checks:**
- Uvicorn workers: single worker in production
- SQLite `StaticPool` in production (should use PostgreSQL with connection pool)
- Debug/reload mode enabled in production
- Missing HTTPS redirect
- Log level too verbose for production (DEBUG)
- Missing request size limits

**CORS checks:**
- `allow_origins=["*"]` in production
- Localhost origins allowed in production config
- `allow_credentials=True` with wildcard origins

---

## Phase 5: Dangerous Patterns (Sharp Edges)

Look for code patterns that are technically valid but dangerous in production.

**Authentication & Authorization:**
- Endpoints that skip auth where they shouldn't
- Role checks using string comparison without normalization
- Token validation that fails open (catches exception → allows access)
- Missing `httpOnly` / `secure` flags on auth cookies
- JWT payload trusted without signature verification

**Data Handling:**
- User input passed directly to database queries
- File uploads without size/type validation
- Sensitive data returned in API responses (password hashes, internal IDs)
- Missing pagination limits (DoS via large queries)
- Float precision issues in financial/weight calculations

**Error Handling:**
- Bare `except:` or `except Exception:` that swallows errors silently
- Stack traces returned to users in error responses
- Inconsistent error response format leaking internal details

**Concurrency & State:**
- In-memory state shared across requests without locking
- Race conditions in serial number generation
- Session state not scoped properly in multi-worker setup

**Frontend:**
- `dangerouslySetInnerHTML` with user data
- `eval()` or `new Function()` with dynamic input
- Storing tokens in localStorage (XSS accessible)
- Missing input sanitization before display
- Links with `target="_blank"` missing `rel="noopener"`

---

## Phase 6: Report Generation

After completing all phases, generate a comprehensive report.

**Report structure:**

```markdown
# Security Audit Report
**Date:** YYYY-MM-DD
**Project:** [project name from package.json or pyproject.toml]
**Auditor:** Claude Code Security Audit Skill

## Summary
| Severity | Count |
|----------|-------|
| CRITICAL | N     |
| HIGH     | N     |
| MEDIUM   | N     |
| LOW      | N     |

## Findings

### [SEVERITY] Finding Title
- **File:** path/to/file.py:42
- **Phase:** Phase N — Phase Name
- **Description:** What the issue is
- **Impact:** What could go wrong
- **Fix:** Concrete code change or config update
```

**Save the report to:** `docs/security-audit-report.md` in the project directory.

**Final output to user:**
```
Report saved to docs/security-audit-report.md

Summary: X CRITICAL | X HIGH | X MEDIUM | X LOW

Top priority fixes:
1. [Most critical finding]
2. [Second most critical]
3. [Third most critical]
```

---

## Important Rules

1. **Only report verified findings** — read the actual code, don't guess
2. **Include file paths and line numbers** for every finding
3. **Provide concrete fixes** — not vague advice like "consider adding validation"
4. **Don't flag test/seed data** as critical unless it could ship to production
5. **Understand the stack** — check what framework features are already handling security (e.g., SQLAlchemy parameterized queries, Next.js XSS protection, Pydantic validation)
6. **Run all 6 phases** — don't skip any
7. **Be concise** — findings should be actionable, not essays
