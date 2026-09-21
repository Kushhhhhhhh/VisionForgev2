import Link from "next/link";
import { navItems } from "@/data/data";

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-100 mt-auto">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

          {/* Brand */}
          <div className="flex flex-col gap-3">
            <Link href="/" className="w-fit">
              <span className="font-extrabold text-2xl bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                VisionForge
              </span>
            </Link>
            <p className="text-sm text-gray-500 leading-relaxed max-w-[240px]">
              Turn your imagination into stunning visuals — free, fast, and powered by AI.
            </p>
          </div>

          {/* Navigation */}
          <div className="flex flex-col gap-3">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-widest">
              Navigate
            </h3>
            <ul className="flex flex-col gap-2">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-gray-600 hover:text-purple-600 transition-colors duration-200"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} VisionForge. All rights reserved.
          </p>
          <p className="text-xs text-gray-500">
            Free to use · No watermarks · No credit card required
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
