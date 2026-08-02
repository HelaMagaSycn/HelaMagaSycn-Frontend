import { NextRequest, NextResponse } from "next/server";

type RouteContext = { params: Promise<{ path: string[] }> };

async function proxy(request: NextRequest, context: RouteContext) {
  const { path } = await context.params;
  const gateway = process.env.HELAMAGA_GATEWAY_URL ?? "http://localhost:8080";
  const target = new URL(`/${path.join("/")}`, gateway);
  target.search = request.nextUrl.search;

  const headers = new Headers();
  for (const name of ["authorization", "content-type", "accept", "idempotency-key", "x-correlation-id"]) {
    const value = request.headers.get(name);
    if (value) headers.set(name, value);
  }

  try {
    const upstream = await fetch(target, {
      method: request.method,
      headers,
      body: request.method === "GET" || request.method === "HEAD" ? undefined : await request.arrayBuffer(),
      cache: "no-store",
      redirect: "manual",
    });
    return new NextResponse(upstream.body, {
      status: upstream.status,
      headers: {
        "content-type": upstream.headers.get("content-type") ?? "application/json",
        "x-correlation-id": upstream.headers.get("x-correlation-id") ?? "",
      },
    });
  } catch {
    return NextResponse.json(
      { code: "GATEWAY_UNAVAILABLE", message: "The booking platform is temporarily unavailable." },
      { status: 503 },
    );
  }
}

export const GET = proxy;
export const POST = proxy;
export const PUT = proxy;
export const PATCH = proxy;
export const DELETE = proxy;
