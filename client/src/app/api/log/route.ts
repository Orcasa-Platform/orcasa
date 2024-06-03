// utils/gitUtils.js
import { execSync } from 'child_process';

function getLastCommitInfo() {
  let commitInfo = '';
  try {
    commitInfo = execSync('git log -1 --format=%H%n%B').toString().trim();
  } catch (error) {
    console.error('Error getting last commit info:', error);
  }
  const [sha, message] = commitInfo?.split('\n') || [];
  return { sha, message };
}

import { NextResponse } from 'next/server';
export async function GET() {
  const publicVarKeys = Object.keys(process.env).filter((key) => key.startsWith('NEXT_PUBLIC'));
  const publicVars = publicVarKeys.reduce((acc: Record<string, string>, key) => {
    acc[key] = process.env[key] ?? '';
    return acc;
  }, {} as Record<string, string>);

  const { sha, message } = getLastCommitInfo();

  return NextResponse.json({
    lastCommit: {
      sha,
      message,
    },
    vars: publicVars,
  });
}
