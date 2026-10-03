import { copyFileSync } from 'node:fs';

const libraryRoot = 'projects/ngx-mat-hijri-adapter';

copyFileSync('README.md', `${libraryRoot}/README.md`);
copyFileSync('LICENSE', `${libraryRoot}/LICENSE`);
