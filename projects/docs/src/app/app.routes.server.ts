import { RenderMode, type ServerRoute } from '@angular/ssr';

/** Every docs URL is written to HTML at build time. GitHub Pages serves those files. */
export const serverRoutes: ServerRoute[] = [{ path: '**', renderMode: RenderMode.Prerender }];
