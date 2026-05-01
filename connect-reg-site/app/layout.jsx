import "./global.css";

export const metadata = {
  title: "The Connect Retreat",
  description: "Ministers and Workers Retreat Registration",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="app-wrapper">
          {children}
        </div>
      </body>
    </html>
  );
} 
