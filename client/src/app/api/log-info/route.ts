// utils/gitUtils.js
import { execSync } from 'child_process';

export function getLastCommitInfo() {
  try {
    // Fetch the last commit SHA and message
    const commitInfo = execSync('git log -1 --format=%H%n%B').toString().trim();
    const [sha, message] = commitInfo.split('\n');
    return { sha, message };
  } catch (error) {
    console.error('Failed to get last commit info:', error);
    throw error;
  }
}

import { NextResponse } from 'next/server';
export async function GET() {
  const publicVarKeys = Object.keys(process.env).filter((key) => key.startsWith('NEXT_PUBLIC'));
  const publicVars = publicVarKeys.reduce((acc: Record<string, string>, key) => {
    acc[key] = process.env[key] ?? '';
    return acc;
  }, {} as Record<string, string>);

  try {
    // Find the last commit message and SHA
    const { sha, message } = getLastCommitInfo();

    return NextResponse.json({
      lastCommit: {
        sha,
        message,
      },
      vars: publicVars,
    });
  } catch (error) {
    console.error('Failed to get info');
    return NextResponse.error();
  }
}
