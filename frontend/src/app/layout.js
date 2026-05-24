import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin", "vietnamese"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "vietnamese"],
  display: "swap",
});

export const metadata = {
  title: "Mộc Craft | Tượng Phật Móc Len Thủ Công Cao Cấp",
  description: "Tượng Phật móc len thủ công organic từ sợi bông hữu cơ, mũi khâu tay tỉ mỉ. Thích hợp trang trí taplo ô tô, bàn làm việc, mang lại sự bình an, tĩnh tại cho tâm hồn.",
  openGraph: {
    title: "Mộc Craft | Tượng Phật Móc Len Thủ Công Cao Cấp",
    description: "Tượng Phật móc len thủ công organic mang lại sự bình an, tĩnh tại.",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="vi"
      className={`${playfair.variable} ${inter.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full bg-[#FDFBF7] text-[#2D2D2D] font-sans flex flex-col">
        {children}
      </body>
    </html>
  );
}
