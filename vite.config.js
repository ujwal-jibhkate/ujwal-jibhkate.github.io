import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { copyFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

// GitHub Pages has no server-side rewrite rules for client-side routing.
// Its convention is to serve 404.html when a path 404s, so a byte-identical
// copy of index.html as 404.html lets deep links (e.g. /work/fraud-risk)
// boot the SPA shell and let react-router take over client-side.
function spaFallback() {
  return {
    name: 'spa-fallback-404',
    closeBundle() {
      const outDir = resolve(__dirname, 'dist')
      copyFileSync(resolve(outDir, 'index.html'), resolve(outDir, '404.html'))
    },
  }
}

// NOTE: content modules that need inline JSX (e.g. a <Sidenote> inside a
// `summary` blurb) use the .jsx extension — src/content/work/*.meta.jsx,
// *.body.jsx — specifically so they get Vite's default, fully-supported JSX
// handling. An earlier attempt to force JSX parsing on plain .js files via
// a custom `esbuild.include` override worked in the dev server (confirmed
// via vite.createServer()+transformRequest()) but silently failed in the
// real production build: Rollup's own parser runs on files the custom
// esbuild filter didn't actually reach during `vite build`, throwing
// "Expression expected" on raw `<>` syntax that was never transformed.
// `vite build` reported success regardless, because nothing imported the
// affected module at the time — this only surfaces once a page actually
// pulls the module into its import graph. Moral: don't fight the
// .jsx/.tsx-only convention, name the file .jsx instead.
export default defineConfig({
  base: '/',
  plugins: [react(), spaFallback()],
})
