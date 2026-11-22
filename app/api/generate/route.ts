import { validateBrief } from "@/lib/brief";
import { generateCaption } from "@/lib/generate-caption";

const failureMessage =
  "Postra could not write a caption just now. Please try again.";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json(
      { error: "Check the form and try again." },
      { status: 400 },
    );
  }

  const result = validateBrief(body);
  if (!result.ok) {
    return Response.json(
      { error: "Check the form and try again.", fields: result.errors },
      { status: 400 },
    );
  }

  const fresh =
    typeof body === "object" &&
    body !== null &&
    "fresh" in body &&
    (body as { fresh?: unknown }).fresh === true;

  try {
    const generation = await generateCaption(result.value, { fresh });
    return Response.json(generation);
  } catch (error) {
    console.error("Caption generation failed", error instanceof Error ? error.name : "UnknownError");
    return Response.json({ error: failureMessage }, { status: 502 });
  }
}
