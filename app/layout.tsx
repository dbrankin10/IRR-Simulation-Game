import type { Metadata, Viewport } from 'next';
import '@fontsource/cormorant-garamond/latin-400.css';
import '@fontsource/cormorant-garamond/latin-500.css';
import '@fontsource/dm-sans/latin-400.css';
import '@fontsource/dm-sans/latin-600.css';
import './style.css';
export const metadata: Metadata = { title:'IMPERIUM — The Council', description:'A persistent world. Your decisions. Their consequences.', manifest:'/manifest.webmanifest', appleWebApp:{capable:true,title:'Imperium',statusBarStyle:'black-translucent'}, icons:{icon:'/icon.svg',apple:'/apple-touch-icon.png'} };
export const viewport: Viewport = { width:'device-width', initialScale:1, viewportFit:'cover', themeColor:'#181b1b' };
export default function Layout({children}:{children:React.ReactNode}) { return <html lang="en"><body>{children}</body></html>; }
