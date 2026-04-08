import { NextRequest, NextResponse } from 'next/server';
import { getToken, refreshAccessToken } from '@/lib/auth';

const API_BASE =
  process.env.API_BASE_URL || 'http://localhost:3000/api';

async function forward(req: NextRequest, pathSegments: string[]) {
  const token = getToken();
  const path = pathSegments.join('/');
  const url = new URL(`${API_BASE}/${path}`);
  req.nextUrl.searchParams.forEach((v, k) => url.searchParams.set(k, v));

  // Read body once so we can replay it on retry
  let reqBody: string | undefined;
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    reqBody = await req.text();
  }

  const buildInit = (t: string | null): RequestInit => ({
    method: req.method,
    headers: {
      'Content-Type': 'application/json',
      ...(t ? { Authorization: `Bearer ${t}` } : {}),
    },
    cache: 'no-store',
    ...(reqBody !== undefined ? { body: reqBody } : {}),
  });

  let res = await fetch(url, buildInit(token));

  // On 401, attempt a silent token refresh and retry once
  if (res.status === 401) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      res = await fetch(url, buildInit(newToken));
    }
  }

  const body = await res.text();
  return new NextResponse(body, {
    status: res.status,
    headers: { 'Content-Type': res.headers.get('Content-Type') ?? 'application/json' },
  });
}

export async function GET(req: NextRequest, { params }: { params: { path: string[] } }) {
  return forward(req, params.path);
}
export async function POST(req: NextRequest, { params }: { params: { path: string[] } }) {
  return forward(req, params.path);
}
export async function PATCH(req: NextRequest, { params }: { params: { path: string[] } }) {
  return forward(req, params.path);
}
export async function DELETE(req: NextRequest, { params }: { params: { path: string[] } }) {
  return forward(req, params.path);
}
