import type { Metadata, Viewport } from "next";
import {
  Cormorant_Garamond,
  Inter,
  Playfair_Display,
} from "next/font/google";
import "./globals.css";
import { LayoutChrome } from "@/components/layout/LayoutChrome";
import { Providers } from "@/components/layout/Providers";
import { brandLogoPath, brandName, brandSeoDescription, brandTagline } from "@/lib/brand";

const displayFont = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
});

const accentFont = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-accent",
});

const bodyFont = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
});

const metadataBase = new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase,
  title: {
    default: `${brandName} | ${brandTagline}`,
    template: `%s | ${brandName}`,
  },
  description: brandSeoDescription,
  keywords: [
    brandName,
    brandTagline,
    "half saree house",
    "Indian fashion",
    "premium ecommerce",
    "traditional wear",
  ],
  icons: {
    icon: brandLogoPath,
    shortcut: brandLogoPath,
    apple: brandLogoPath,
  },
  openGraph: {
    title: `${brandName} | ${brandTagline}`,
    description: brandSeoDescription,
    siteName: brandName,
    type: "website",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: `${brandName} | ${brandTagline}`,
    description: brandSeoDescription,
    images: ["/twitter-image"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${displayFont.variable} ${accentFont.variable} ${bodyFont.variable}`}
      suppressHydrationWarning
    >
      <body
        className="bg-[var(--color-ivory)] text-[var(--color-charcoal)]"
        suppressHydrationWarning
      >
        {/* Strip browser-extension-injected attributes (bis_skin_checked,
            data-darkreader-mode, data-extension-id, etc.) dynamically
            using MutationObserver before React hydrates. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{
              var attrs=['bis_skin_checked','data-darkreader-mode','data-darkreader-scheme','data-extension-id','data-gr-ext-installed','data-new-gr-c-s-check-loaded','data-grammarly-shadow-root','data-lt-installed'];
              var clean=function(node){
                if(!node||node.nodeType!==1)return;
                for(var i=0;i<attrs.length;i++){
                  if(node.hasAttribute(attrs[i]))node.removeAttribute(attrs[i]);
                }
                var children=node.querySelectorAll('*');
                for(var i=0;i<children.length;i++){
                  for(var j=0;j<attrs.length;j++){
                    if(children[i].hasAttribute(attrs[j]))children[i].removeAttribute(attrs[j]);
                  }
                }
              };
              clean(document.documentElement);
              var observer=new MutationObserver(function(mutations){
                for(var i=0;i<mutations.length;i++){
                  var m=mutations[i];
                  if(m.type==='attributes'){
                    if(attrs.indexOf(m.attributeName)!==-1)m.target.removeAttribute(m.attributeName);
                  }else if(m.type==='childList'){
                    for(var j=0;j<m.addedNodes.length;j++)clean(m.addedNodes[j]);
                  }
                }
              });
              observer.observe(document.documentElement,{
                attributes:true,
                childList:true,
                subtree:true,
                attributeFilter:attrs
              });
            }catch(e){}})();`,
          }}
        />
        <Providers>
          <LayoutChrome>{children}</LayoutChrome>
        </Providers>
      </body>
    </html>
  );
}
