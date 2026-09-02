export type AppEnv = "sandbox" | "production";

export type Application = {
  id: string;
  name: string;
  description: string;
  env: AppEnv;
  status: "active" | "pending" | "suspended";
  createdAt: string;
  requests30d: number;
  owner: string;
};

export const applications: Application[] = [
  {
    id: "app_9f3c21",
    name: "Checkout Widget",
    description: "Embedded card + wallet checkout for merchant storefronts.",
    env: "production",
    status: "active",
    createdAt: "2026-03-14",
    requests30d: 1_284_402,
    owner: "payments-team",
  },
  {
    id: "app_44ba07",
    name: "Ledger Sync",
    description: "Nightly reconciliation jobs pulling settlement reports.",
    env: "production",
    status: "active",
    createdAt: "2026-01-08",
    requests30d: 318_902,
    owner: "core-banking",
  },
  {
    id: "app_7d1e55",
    name: "KYC Prototype",
    description: "Identity verification experiment against the sandbox tier.",
    env: "sandbox",
    status: "pending",
    createdAt: "2026-08-21",
    requests30d: 4_120,
    owner: "risk-lab",
  },
  {
    id: "app_2ce8b0",
    name: "Partner Payouts",
    description: "Bulk disbursement API for marketplace sellers.",
    env: "production",
    status: "suspended",
    createdAt: "2025-11-02",
    requests30d: 0,
    owner: "payouts",
  },
];

export type Credential = {
  id: string;
  label: string;
  kind: "client_id" | "client_secret" | "api_key" | "webhook_secret" | "auth_token";
  value: string;
  masked: boolean;
  app: string;
  env: AppEnv;
  createdAt: string;
  lastRotated: string;
  expiresAt: string | null;
  status: "active" | "rotating" | "revoked";
};

export const credentials: Credential[] = [
  {
    id: "cred_01",
    label: "Checkout Widget — Client ID",
    kind: "client_id",
    value: "cid_live_8f21ba90c7d34e19a0b5",
    masked: false,
    app: "Checkout Widget",
    env: "production",
    createdAt: "2026-03-14",
    lastRotated: "2026-07-02",
    expiresAt: null,
    status: "active",
  },
  {
    id: "cred_02",
    label: "Checkout Widget — Client Secret",
    kind: "client_secret",
    value: "csec_live_4Kq9Zt1pXw83Lm0RvB6yHn2Ud5Sa7Ge",
    masked: true,
    app: "Checkout Widget",
    env: "production",
    createdAt: "2026-03-14",
    lastRotated: "2026-07-02",
    expiresAt: "2026-10-02",
    status: "active",
  },
  {
    id: "cred_03",
    label: "Ledger Sync — API Key",
    kind: "api_key",
    value: "sk_live_9Ha2Cd7Fj4Ke1Lm8Np3Qr6St0Uv5Wx",
    masked: true,
    app: "Ledger Sync",
    env: "production",
    createdAt: "2026-01-08",
    lastRotated: "2026-06-18",
    expiresAt: "2026-12-18",
    status: "active",
  },
  {
    id: "cred_04",
    label: "Checkout Widget — Webhook Signing Secret",
    kind: "webhook_secret",
    value: "whsec_3Zx8Qm2Vb9Nc1Kd7Lf4Gh6Jp0Rt5Yw",
    masked: true,
    app: "Checkout Widget",
    env: "production",
    createdAt: "2026-03-15",
    lastRotated: "2026-08-11",
    expiresAt: null,
    status: "active",
  },
  {
    id: "cred_05",
    label: "KYC Prototype — OAuth Auth Token",
    kind: "auth_token",
    value: "at_sbx_1Qw2Er3Ty4Ui5Op6As7Df8Gh9Jk0Lz",
    masked: true,
    app: "KYC Prototype",
    env: "sandbox",
    createdAt: "2026-08-21",
    lastRotated: "2026-08-21",
    expiresAt: "2026-09-20",
    status: "rotating",
  },
  {
    id: "cred_06",
    label: "Partner Payouts — API Key (legacy)",
    kind: "api_key",
    value: "sk_live_0Ab1Cd2Ef3Gh4Ij5Kl6Mn7Op8Qr9St",
    masked: true,
    app: "Partner Payouts",
    env: "production",
    createdAt: "2025-11-02",
    lastRotated: "2025-11-02",
    expiresAt: "2026-05-02",
    status: "revoked",
  },
];

export const credentialKindLabel: Record<Credential["kind"], string> = {
  client_id: "Client ID",
  client_secret: "Client Secret",
  api_key: "API Key",
  webhook_secret: "Webhook Secret",
  auth_token: "Auth Token",
};

export type ApiKey = {
  id: string;
  name: string;
  prefix: string;
  env: AppEnv;
  scopes: string[];
  lastUsed: string;
  createdAt: string;
  status: "active" | "revoked";
  rateLimit: string;
};

export const apiKeys: ApiKey[] = [
  {
    id: "key_a1",
    name: "Checkout server key",
    prefix: "sk_live_8f21…9c4d",
    env: "production",
    scopes: ["payments:read", "payments:write", "customers:read"],
    lastUsed: "3 minutes ago",
    createdAt: "2026-03-14",
    status: "active",
    rateLimit: "2,000 req/min",
  },
  {
    id: "key_a2",
    name: "Ledger batch key",
    prefix: "sk_live_9Ha2…5Wx1",
    env: "production",
    scopes: ["settlements:read", "reports:read"],
    lastUsed: "2 hours ago",
    createdAt: "2026-01-08",
    status: "active",
    rateLimit: "600 req/min",
  },
  {
    id: "key_a3",
    name: "Sandbox playground",
    prefix: "sk_test_1Qw2…0Lz9",
    env: "sandbox",
    scopes: ["*"],
    lastUsed: "yesterday",
    createdAt: "2026-08-21",
    status: "active",
    rateLimit: "100 req/min",
  },
  {
    id: "key_a4",
    name: "Payouts legacy key",
    prefix: "sk_live_0Ab1…9St0",
    env: "production",
    scopes: ["payouts:write"],
    lastUsed: "4 months ago",
    createdAt: "2025-11-02",
    status: "revoked",
    rateLimit: "—",
  },
];

export type Permission = {
  scope: string;
  description: string;
  category: "Payments" | "Customers" | "Webhooks" | "Reporting" | "Admin";
  granted: boolean;
  sensitive: boolean;
};

export const permissions: Permission[] = [
  { scope: "payments:read", description: "Read payment intents, charges and refunds.", category: "Payments", granted: true, sensitive: false },
  { scope: "payments:write", description: "Create and capture payments, issue refunds.", category: "Payments", granted: true, sensitive: true },
  { scope: "payouts:write", description: "Initiate disbursements to external accounts.", category: "Payments", granted: false, sensitive: true },
  { scope: "customers:read", description: "Read customer profiles and stored methods.", category: "Customers", granted: true, sensitive: false },
  { scope: "customers:write", description: "Create or update customer records.", category: "Customers", granted: false, sensitive: true },
  { scope: "webhooks:manage", description: "Register, edit and replay webhook endpoints.", category: "Webhooks", granted: true, sensitive: false },
  { scope: "reports:read", description: "Download settlement and reconciliation reports.", category: "Reporting", granted: true, sensitive: false },
  { scope: "team:manage", description: "Invite teammates and change portal roles.", category: "Admin", granted: false, sensitive: true },
];

export type Webhook = {
  id: string;
  url: string;
  events: string[];
  status: "healthy" | "degraded" | "disabled";
  successRate: number;
  lastDelivery: string;
  env: AppEnv;
};

export const webhooks: Webhook[] = [
  {
    id: "wh_01",
    url: "https://api.acme.dev/hooks/payments",
    events: ["payment.succeeded", "payment.failed", "refund.created"],
    status: "healthy",
    successRate: 99.8,
    lastDelivery: "12 seconds ago",
    env: "production",
  },
  {
    id: "wh_02",
    url: "https://api.acme.dev/hooks/settlements",
    events: ["settlement.completed"],
    status: "degraded",
    successRate: 91.2,
    lastDelivery: "6 minutes ago",
    env: "production",
  },
  {
    id: "wh_03",
    url: "https://staging.acme.dev/hooks/all",
    events: ["*"],
    status: "disabled",
    successRate: 0,
    lastDelivery: "3 weeks ago",
    env: "sandbox",
  },
];

export type LogEntry = {
  id: string;
  time: string;
  method: "GET" | "POST" | "DELETE" | "PATCH";
  path: string;
  status: number;
  latency: number;
  app: string;
  env: AppEnv;
};

export const logs: LogEntry[] = [
  { id: "req_9812", time: "06:04:51", method: "POST", path: "/v1/payments", status: 201, latency: 142, app: "Checkout Widget", env: "production" },
  { id: "req_9811", time: "06:04:49", method: "GET", path: "/v1/customers/cus_81a", status: 200, latency: 38, app: "Checkout Widget", env: "production" },
  { id: "req_9810", time: "06:04:41", method: "POST", path: "/v1/payments/pi_77c/capture", status: 402, latency: 210, app: "Checkout Widget", env: "production" },
  { id: "req_9809", time: "06:03:58", method: "GET", path: "/v1/settlements", status: 200, latency: 512, app: "Ledger Sync", env: "production" },
  { id: "req_9808", time: "06:03:22", method: "POST", path: "/v1/identity/verify", status: 422, latency: 88, app: "KYC Prototype", env: "sandbox" },
  { id: "req_9807", time: "06:02:10", method: "DELETE", path: "/v1/webhooks/wh_03", status: 204, latency: 61, app: "Ledger Sync", env: "production" },
  { id: "req_9806", time: "06:01:44", method: "PATCH", path: "/v1/customers/cus_44z", status: 500, latency: 1_204, app: "Checkout Widget", env: "production" },
  { id: "req_9805", time: "06:00:07", method: "GET", path: "/v1/payments?limit=50", status: 200, latency: 96, app: "Ledger Sync", env: "production" },
];

export const usageSeries = [
  { day: "Aug 27", requests: 182_400, errors: 640 },
  { day: "Aug 28", requests: 201_120, errors: 712 },
  { day: "Aug 29", requests: 168_990, errors: 402 },
  { day: "Aug 30", requests: 121_305, errors: 288 },
  { day: "Aug 31", requests: 134_770, errors: 351 },
  { day: "Sep 1", requests: 219_845, errors: 903 },
  { day: "Sep 2", requests: 236_010, errors: 512 },
];

export const endpointUsage = [
  { endpoint: "POST /v1/payments", calls: 412_330, share: 34 },
  { endpoint: "GET /v1/customers", calls: 288_140, share: 24 },
  { endpoint: "GET /v1/settlements", calls: 190_002, share: 16 },
  { endpoint: "POST /v1/refunds", calls: 121_884, share: 10 },
  { endpoint: "POST /v1/identity/verify", calls: 92_411, share: 8 },
];

export type DocSection = {
  id: string;
  title: string;
  method: "GET" | "POST" | "DELETE";
  path: string;
  summary: string;
  sample: string;
};

export const docSections: DocSection[] = [
  {
    id: "create-payment",
    title: "Create a payment",
    method: "POST",
    path: "/v1/payments",
    summary: "Creates a payment intent and returns a client token for confirmation.",
    sample: `curl -X POST https://api.acme.dev/v1/payments \\
  -H "Authorization: Bearer $API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{ "amount": 4500, "currency": "usd", "capture": true }'`,
  },
  {
    id: "list-payments",
    title: "List payments",
    method: "GET",
    path: "/v1/payments",
    summary: "Returns a paginated list of payments for the authenticated application.",
    sample: `curl https://api.acme.dev/v1/payments?limit=50 \\
  -H "Authorization: Bearer $API_KEY"`,
  },
  {
    id: "verify-webhook",
    title: "Verify a webhook signature",
    method: "POST",
    path: "/your-endpoint",
    summary: "Compute an HMAC-SHA256 over the raw body and compare it to the signature header.",
    sample: `const expected = createHmac("sha256", process.env.WEBHOOK_SECRET)
  .update(rawBody)
  .digest("hex");
if (expected !== req.headers["x-acme-signature"]) return res.status(401).end();`,
  },
  {
    id: "revoke-key",
    title: "Revoke an API key",
    method: "DELETE",
    path: "/v1/keys/{id}",
    summary: "Immediately invalidates a key. In-flight requests fail with 401.",
    sample: `curl -X DELETE https://api.acme.dev/v1/keys/key_a4 \\
  -H "Authorization: Bearer $ADMIN_KEY"`,
  },
];

export const supportTickets = [
  { id: "SUP-2041", subject: "Webhook retries stop after 3 attempts", status: "open", priority: "high", updated: "2h ago" },
  { id: "SUP-2032", subject: "Sandbox card 4000 0000 declines unexpectedly", status: "waiting", priority: "medium", updated: "1d ago" },
  { id: "SUP-1998", subject: "Increase rate limit for Ledger Sync", status: "resolved", priority: "low", updated: "6d ago" },
];

export function maskValue(value: string) {
  if (value.length <= 10) return "•".repeat(value.length);
  return `${value.slice(0, 8)}${"•".repeat(16)}${value.slice(-4)}`;
}
