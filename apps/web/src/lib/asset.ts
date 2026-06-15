// Static assets live under the GitHub Pages basePath. Plain <img> tags do not
// get the basePath rewritten automatically (unlike next/image), so prefix it.
export const BASE_PATH = '/qr-attendance';

export const asset = (p: string) =>
  `${BASE_PATH}${p.startsWith('/') ? '' : '/'}${p}`;
