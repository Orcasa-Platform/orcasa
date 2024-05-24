import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const publicVarKeys = Object.keys(process.env).filter((key) => key.startsWith('NEXT_PUBLIC'));
    const publicVars = publicVarKeys.reduce((acc, key) => {
      acc[key] = process.env[key];
      return acc;
    }, {});

    return NextResponse.json({
      lastCommit: {
        message: process.env.VERCEL_GIT_COMMIT_MESSAGE,
        SHA: process.env.VERCEL_GIT_COMMIT_SHA,
      },
      vars: publicVars,
    });
  } catch (error) {
    console.error(error, process.env);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
