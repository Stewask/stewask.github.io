import path from 'path';

const rootDir = path.join(__dirname, '..');
const src = path.join(rootDir, 'src');

export const paths = {
  build: path.join(rootDir, 'build'),
  css: path.join('css', 'bundle.css'),
  img: path.join('assets', 'img'),
  js: path.join('js', 'script.js'),
  public: path.join('build', '/'),
  pug: path.join(src, 'index.pug'),
  src
};
