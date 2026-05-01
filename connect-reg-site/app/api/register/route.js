export async function POST(req) {
  const data = await req.json();

  const response = await fetch("YOUR_GOOGLE_SCRIPT_URL", {
    method: "POST",
    body: JSON.stringify(data),
  });

  return Response.json({ success: true });
} 