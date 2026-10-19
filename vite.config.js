import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import {createHash} from 'node:crypto';
function offlineShell(){return {name:'ag-fit-offline-shell',generateBundle(_,bundle){const files=Object.keys(bundle).filter(name=>/\.(js|css)$/.test(name));const version=createHash('sha256').update(files.join('|')).digest('hex').slice(0,16);const assets=['/','/favicon.svg','/manifest.webmanifest','/icon-192.png','/icon-512.png','/food/meal-photos.png',...files.map(name=>'/'+name)];this.emitFile({type:'asset',fileName:'sw.js',source:`const CACHE='ag-fit-public-${version}';
const ASSETS=${JSON.stringify(assets)};
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS))));
self.addEventListener('message',event=>{if(event.data?.type==='SKIP_WAITING')self.skipWaiting()});
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith('ag-fit-public-')&&key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{const url=new URL(event.request.url);if(event.request.method!=='GET'||url.origin!==self.location.origin||url.pathname.startsWith('/api/'))return;
if(event.request.mode==='navigate'){event.respondWith(caches.open(CACHE).then(cache=>cache.match('/')).then(cached=>cached||fetch(event.request)));return}
if(ASSETS.includes(url.pathname))event.respondWith(caches.open(CACHE).then(async cache=>(await cache.match(url.pathname))||fetch(event.request)));
});`})}}}
export default defineConfig({plugins:[react(),offlineShell()],server:{proxy:{'/api':'http://127.0.0.1:8080'}}});
