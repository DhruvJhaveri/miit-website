// Verifies Odoo external API access before enabling the CRM adapter.
// Usage: node --env-file=.env.local scripts/odoo-check.mjs
// Checks: server reachable, credentials authenticate, crm.lead is readable/creatable.
const { ODOO_URL, ODOO_DB, ODOO_USERNAME, ODOO_API_KEY } = process.env;
if (!ODOO_URL || !ODOO_DB || !ODOO_USERNAME || !ODOO_API_KEY) {
  console.error("Set ODOO_URL, ODOO_DB, ODOO_USERNAME and ODOO_API_KEY first.");
  process.exit(1);
}
async function rpc(service, method, args) {
  const res = await fetch(`${ODOO_URL.replace(/\/$/, "")}/jsonrpc`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", method: "call", params: { service, method, args }, id: 1 }),
  });
  const body = await res.json();
  if (body.error) throw new Error(body.error.data?.message || body.error.message);
  return body.result;
}
try {
  const v = await rpc("common", "version", []);
  console.log("✓ server", v.server_version);
  const uid = await rpc("common", "authenticate", [ODOO_DB, ODOO_USERNAME, ODOO_API_KEY, {}]);
  if (!uid) throw new Error("authentication failed (check database, login and API key)");
  console.log("✓ authenticated as uid", uid);
  const canCreate = await rpc("object", "execute_kw", [ODOO_DB, uid, ODOO_API_KEY, "crm.lead", "check_access_rights", ["create"], { raise_exception: false }]);
  console.log(canCreate ? "✓ crm.lead create permitted" : "✗ user cannot create crm.lead records");
  process.exit(canCreate ? 0 : 1);
} catch (e) {
  console.error("✗", e.message);
  process.exit(1);
}
