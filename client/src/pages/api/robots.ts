import type { NextApiRequest, NextApiResponse } from 'next';

import env from '@/env.mjs';

export default function handler(req: NextApiRequest, res: NextApiResponse<string>) {
  if (env.NEXT_USE_RESTRICTIVE_ROBOTS_TXT === 'true') {
    res.status(200).send(`User-agent: *\nDisallow: /`);
  } else {
    res.status(200).send(`User-agent: *\nDisallow: /cms/`);
  }
}
