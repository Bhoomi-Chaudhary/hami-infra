import Image from "next/image";

export default function AboutPage() {
  return (
    <main>

      {/* HERO BANNER */}
      <section
        className="relative h-[350px] bg-cover bg-center flex items-end"
        style={{ backgroundImage: "url('/about-banner.jpeg')" }}
      >
        <div className="absolute inset-0 bg-black/60"></div>

        <h1 className="relative text-white text-4xl font-bold px-6 pb-6">
          About Us
        </h1>
      </section>

      {/* SECTION 1 */}
      <section className="max-w-6xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-10 items-center">

        <div>
          <h2 className="text-3xl font-bold text-[#0B1F3A]">
            Who We Are
          </h2>

          <p className="mt-4 text-gray-700">
            Hami Infra delivers electrical and mechanical execution with
            precision, discipline, and accountability.
          </p>

          <p className="mt-3 text-gray-700">
            We work directly on-site, ensuring projects are completed on time
            and built to last.
          </p>

          {/* CTA */}
          <div className="mt-6">
            <a href="/#contact">
              <button className="bg-[#D96A1A] text-white px-6 py-3 rounded-md font-semibold hover:opacity-90 transition">
                Discuss Your Project
              </button>
            </a>
          </div>
        </div>

        <Image
          src="/about1.jpeg"
          alt="team"
          width={500}
          height={400}
          className="rounded-md shadow-md"
        />

      </section>

      {/* SECTION 2 (THEME FIXED) */}
      <section className="bg-[#2B2B2B] py-20 text-white">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-10 items-center">

          <Image
            src="/about2.jpeg"
            alt="work"
            width={500}
            height={400}
            className="rounded-md shadow-md"
          />

          <div>
            <h2 className="text-3xl font-bold">
              What We Do
            </h2>

            <p className="mt-4 text-gray-300">
              From electrical systems to mechanical structures and fire safety,
              we execute projects with reliability and efficiency.
            </p>

            <p className="mt-3 text-gray-300">
              Our focus is on delivering stable, long-term solutions.
            </p>

            {/* CTA */}
            <div className="mt-6">
              <a href="/#contact">
                <button className="bg-[#D96A1A] px-6 py-3 rounded-md font-semibold hover:opacity-90 transition">
                  Get a Quote
                </button>
              </a>
            </div>
          </div>

        </div>
      </section>

    </main>
  );
}