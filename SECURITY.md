# Security Policy

**English** · [Español](SECURITY.es.md)

## Supported Versions

Only the latest minor release gets security fixes. Fixes ship as a new patch release on npm; the hosted Worker is redeployed from `master`.

| Version | Supported          |
| ------- | ------------------ |
| 2.1.x   | :white_check_mark: |
| < 2.1   | :x:                |

## Reporting a Vulnerability

**Do not open a public issue for a vulnerability.**

Report it privately through GitHub Security Advisories:

<https://github.com/georgegiosue/mcp-emtrafesa/security/advisories/new>

If you cannot use GitHub, email <peraldonamoc@gmail.com> with `[security] mcp-emtrafesa` in the subject.

Include what you can: affected version or endpoint, steps to reproduce, the request/response involved, and the impact you believe it has. A minimal reproduction is worth more than a scanner report.

What to expect:

- **Acknowledgement** within 5 business days.
- **Assessment** — accepted or declined, with reasons — within 14 days.
- **Fix** for an accepted report as soon as practical, then a patch release and a published advisory. You are credited unless you ask otherwise.
- **Declined** reports get an explanation. Common reasons: out of scope (see below), no realistic impact on a read-only public-data server, or the behaviour belongs to Emtrafesa's own site.

Please give a reasonable window before disclosing publicly.

## Scope

In scope:

- This repository's source code.
- The `mcp-emtrafesa` npm package and the binary it publishes.
- The hosted MCP endpoint at `https://mcp-emtrafesa.georgegiosue.dev/mcp`.

Out of scope:

- **`www.emtrafesa.pe` and any Emtrafesa system.** This project is an unaffiliated client that reads their public website. Do not test, fuzz, or attack Emtrafesa infrastructure — that is not mine to authorize, and volume against their site is the one thing that can get this project's access cut. Vulnerabilities in Emtrafesa's own site belong to Emtrafesa; report them there.
- Cloudflare Workers platform issues (report to Cloudflare).
- Findings that depend on a compromised host, a malicious MCP client the user installed themselves, or on running the server with modified source.
- Missing rate limiting or denial of service against the hosted endpoint through ordinary request volume.
- Reports produced by automated scanners with no demonstrated impact.

## What this server handles

Context for judging impact:

- The server is **read-only**. Every tool is a GET or a lookup POST; nothing creates, modifies, or cancels a booking.
- There is **no authentication and no session state**. The Worker runs stateless, with CORS open to `*` and no credentials — it serves public transport data.
- **Nothing is persisted.** No database, no logs of tool arguments, no caching layer.
- `get-latest-purchased-tickets` takes a **DNI and an email** and `get-ticket-pdf` takes a ticket code. These are forwarded to Emtrafesa's own lookup endpoint and the result is returned to the caller. The server neither stores nor logs them. Anyone holding those values can already run the same query on Emtrafesa's public site — but treat them as personal data when writing a report, and **never include a real third party's DNI, email, or ticket code** in one.
- Passenger sex per occupied seat is returned by the upstream seat-map endpoint and is deliberately stripped before the response leaves this server. If you find a path where it — or any other third-party personal field — reaches a tool result, that is a valid report.

## Note on `certs/sectigo-r46.pem`

That file is a **public CA root certificate**, checked in because workerd's trust store lacks it and `wrangler dev` cannot otherwise reach `www.emtrafesa.pe`. It is not a secret, holds no private key, is npm-ignored, and is never used by a deployed Worker. A scanner flagging it as a committed certificate is a false positive.
