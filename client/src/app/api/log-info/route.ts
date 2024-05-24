import { NextResponse } from 'next/server';
export async function GET() {
  const publicVarKeys = Object.keys(process.env).filter((key) => key.startsWith('NEXT_PUBLIC'));
  const publicVars = publicVarKeys.reduce((acc: Record<string, string>, key) => {
    acc[key] = process.env[key] ?? '';
    return acc;
  }, {} as Record<string, string>);

  return NextResponse.json({
    lastCommit: {
      message: process.env.VERCEL_GIT_COMMIT_MESSAGE,
      SHA: process.env.VERCEL_GIT_COMMIT_SHA,
    },
    vars: publicVars,
  });
}
