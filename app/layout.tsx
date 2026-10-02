import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "今日吃什么｜智能配餐 Agent",
  description: "根据人数、丰盛程度和食材偏好，为你搭配一桌好菜。",
  icons: { icon: "/favicon.svg" }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-CN"><body>{children}</body></html>;
}
