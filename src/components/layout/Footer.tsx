import { useTheme } from "@/hooks/useTheme";
import { Link } from "react-router";

export default function Footer() {
  const { theme } = useTheme();
  const year = new Date().getFullYear();
  const footerSections = [
    {
      title: "Company",
      links: [
        { label: "About", href: "/about" },
        { label: "Contact", href: "/contact" },
      ],
    },
    {
      title: "Service",
      links: [
        { label: "Features", href: "/features" },
        { label: "FAQ", href: "/faq" },
        { label: "Help Line", href: "/help" },
      ],
    },
    {
      title: "Legal",
      links: [
        { label: "Privacy", href: "/faq" },
        { label: "Terms", href: "/faq" },
        { label: "Security", href: "/faq" },
      ],
    },
  ];
  return (
    <>

      {/* Footer */}
      <footer className={`${theme === "dark" ? "bg-gray-950 border-t border-gray-800" : "bg-gray-900 text-white"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-8">
            <div>
              <h3 className="font-bold text-xl mb-4 bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
                SwiftRide
              </h3>
              <p className={theme === "dark" ? "text-gray-400" : "text-gray-400"}>
                Your trusted ride-sharing partner
              </p>
            </div>
            {footerSections.map((col, idx) => (
              <div key={idx}>
                <h4 className="font-semibold mb-4">{col.title}</h4>
                <ul className="space-y-2">
                  {col.links.map((link, linkIdx) => (
                    <li key={linkIdx}>
                      <Link
                        to={link.href}
                        className={`${theme === "dark" ? "text-gray-400 hover:text-white" : "text-gray-400 hover:text-white"} transition-colors`}
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className={`border-t ${theme === "dark" ? "border-gray-800" : "border-gray-700"} pt-8 text-center ${theme === "dark" ? "text-gray-400" : "text-gray-400"}`}>
            <p>{year} SwiftRide. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  );
}