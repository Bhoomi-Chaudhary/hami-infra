import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#0B1F3A] text-white mt-20">

      <div className="max-w-6xl mx-auto px-6 py-12 grid md:grid-cols-3 gap-8">

        {/* BRAND */}
        <div>
          <h2 className="text-2xl font-bold">Hami Infra</h2>
          <p className="mt-3 text-gray-300">
            Reliable electrical and mechanical execution with precision and accountability.
          </p>
        </div>

        {/* LINKS */}
        <div>
          <h3 className="font-semibold mb-3">Quick Links</h3>
          
          <ul className="space-y-2 text-gray-300">
            <li>
  <Link href="/about" className="hover:text-[#D96A1A] cursor-pointer">
    About
  </Link>
</li>
            <li>
  <Link href="/services" className="hover:text-[#D96A1A] cursor-pointer">
    Services
  </Link>
</li>

<li>
  <Link href="/projects" className="hover:text-[#D96A1A] cursor-pointer">
    Projects
  </Link>
</li>

<li>
  <Link href="/contact" className="hover:text-[#D96A1A] cursor-pointer">
    Contact
  </Link>
</li>
          </ul>
        </div>

        {/* CONTACT */}
        <div>
          <h3 className="font-semibold mb-3">Contact</h3>
          <p className="text-gray-300">Phone:
            <a href="tel:+918796255342" className="hover:text-[#D96A1A] ml-2">+91 87962 55342</a>
          </p>
          <p className="text-gray-300">Email:
            <a href="mailto:info@hamiinfra.com" className="hover:text-[#D96A1A] ml-2">
              info@hamiinfra.com
            </a>
          </p>
          <p className="text-gray-300">Email:
            <a href="mailto:infohamiinfra@gmail.com" className="hover:text-[#D96A1A] ml-2">
              infohamiinfra@gmail.com
            </a>
          </p>
          <p className="text-gray-300 mt-2">Address: Govindpur, PARIKRAMMA MARG, Mathura, Mathura, Mathura- 281001, Uttar Pradesh</p>
        </div>

      </div>

      {/* BOTTOM STRIP */}
      <div className="bg-[#2B2B2B] text-center text-gray-300 text-sm py-4">
        © 2026 Hami Infra. All rights reserved.
      </div>

    </footer>
  );
}