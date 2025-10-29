// Basic Authentication middleware for Express
const PUBLIC_PATHS = ["/api/v1/auth", "/health", "/uploads"];
const USER = process.env.BASIC_AUTH_USER || "";
const PASS = process.env.BASIC_AUTH_PASS || "";

function decodeBase64(b64) {
  try {
    if (typeof atob === "function") return atob(b64);
  } catch {}
  try {
    return Buffer.from(b64, "base64").toString("utf8");
  } catch (e) {
    return "";
  }
}

export function basicAuth(req, res, next) {
  const path = req.path;

  // Skip authentication for public paths
  if (PUBLIC_PATHS.some(p => path.startsWith(p))) {
    return next();
  }

  // Check if credentials are configured
  if (!USER || !PASS) {
    return res.status(503).send("Site temporarily unavailable (auth not configured).");
  }

  const auth = req.headers['authorization'];
  if (!auth || !auth.startsWith("Basic ")) {
    res.setHeader("WWW-Authenticate", 'Basic realm="Private Site"');
    return res.status(401).send("Authentication required");
  }

  const b64 = auth.split(" ")[1];
  const decoded = decodeBase64(b64);
  const [username = "", password = ""] = decoded.split(":");

  const valid = username === USER && password === PASS;

  if (valid) return next();

  return res.status(403).send("Forbidden");
}