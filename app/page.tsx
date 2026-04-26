import ContactForm from "@/components/ContactForm";
import Link from "next/link";

export default function Home() {
  return (
    <main>

      {/* HERO */}
      <section
        className="relative text-white text-center py-28"
        style={{
          backgroundImage: "url('/hero.jpeg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/60"></div>

        <div className="relative max-w-3xl mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            Execution That Keeps Your Project Moving
          </h1>

          <p className="mt-4 text-gray-300 text-lg">
            Skilled teams, clear timelines, and reliable delivery.
          </p>

          <a href="#contact">
            <button className="mt-6 bg-[#D96A1A] px-6 py-3 rounded-md font-semibold hover:opacity-90 transition">
              Discuss Your Project
            </button>
          </a>
        </div>
      </section>

      {/* services */}



<section className="bg-[#2B2B2B] text-white py-24">
  <div className="max-w-6xl mx-auto px-6 text-center">

    <h2 className="text-3xl font-bold mb-12">
      Our Services
    </h2>

    {/* MAIN GRID (FIXED) */}
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">

      {[
        {
          title: "Electrical",
          img: "/electrical.jpeg",
          desc: "Complete electrical execution including wiring, panel installation, and maintenance.",
          link: "/services#electrical",
        },
        {
          title: "Mechanical",
          img: "/mechanical.jpeg",
          desc: "Fabrication, installation, and durable mechanical solutions.",
          link: "/services#mechanical",
        },
        {
          title: "Fire Safety",
          img: "/fire.jpeg",
          desc: "Reliable fire safety systems installation with full compliance.",
          link: "/services#fire",
        },
        {
          title: "Commercial",
          img: "/commercial.jpeg",
          desc: "Execution of office and commercial infrastructure.",
          link: "/services#commercial",
        },
      ].map((item, i) => (
        <Link href={item.link} key={i}>
          <div className="bg-[#1a1a1a] rounded-lg overflow-hidden hover:scale-105 hover:ring-1 hover:ring-[#D96A1A] transition text-left cursor-pointer flex flex-col h-full">
            <img src={item.img} className="h-44 w-full object-cover" />

            <div className="p-5">
              <h3 className="font-semibold text-lg">{item.title}</h3>
              <p className="text-base text-gray-300 mt-2">
                {item.desc}
              </p>
            </div>

          </div>
        </Link>
      ))}

    </div>

    {/* AMC (ACTUALLY BIGGER NOW) */}
    <div className="mt-16 flex justify-center">
  <Link href="/services#amc">
    <div className="w-full max-w-xl bg-[#1a1a1a] rounded-lg overflow-hidden hover:scale-105 hover:ring-1 hover:ring-[#D96A1A] transition text-left cursor-pointer">

      <img src="/amc.jpeg" className="h-52 w-full object-cover" />

      <div className="p-6">
        <h3 className="font-semibold text-xl">
          AMC (Annual Maintenance)
        </h3>
        <p className="text-base text-gray-300 mt-2">
          Annual maintenance services to ensure long-term system performance and reliability.
        </p>
      </div>

    </div>
  </Link>
</div>

    {/* CTA */}
    <div className="mt-12">
      <a href="#contact">
        <button className="bg-[#D96A1A] px-6 py-3 rounded-md font-semibold hover:opacity-90 transition">
          Get a Quote
        </button>
      </a>
    </div>

  </div>
</section>

      {/* ABOUT */}
      <section
        className="relative text-white py-24 text-center"
        style={{
          backgroundImage: "url('/about-bg.jpeg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/60"></div>

        <div className="relative max-w-4xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold">
            About Us
          </h2>

          <p className="mt-4 text-gray-300 text-lg leading-relaxed">
            Hami Infra delivers electrical and mechanical execution with precision,
            discipline, and accountability. We ensure every project is completed
            on time and built to last.
          </p>

          {/* CTA INSIDE ABOUT */}
          <div className="mt-8">
            <a href="#contact">
              <button className="bg-[#D96A1A] px-6 py-3 rounded-md font-semibold hover:opacity-90 transition">
                Contact Us
              </button>
            </a>
          </div>

        </div>
      </section>



{/* PROJECTS */}
<section className="bg-[#2B2B2B] text-white py-24">
  <div className="max-w-6xl mx-auto px-6 text-center">

    <h2 className="text-3xl font-bold mb-12">
      Our Projects
    </h2>

    <div className="grid md:grid-cols-3 gap-6">

      {[
        {
          title: "Commercial Office Setup",
          img: "/project1.jpeg",
          desc: "Complete electrical and mechanical setup for a modern office space."
        },
        {
          title: "Industrial Installation",
          img: "/project2.jpeg",
          desc: "Heavy-duty mechanical installation for industrial operations."
        },
        {
          title: "Fire Safety System",
          img: "/project3.jpeg",
          desc: "Full fire safety system implementation with compliance."
        },
        {
          title: "Retail Space Execution",
          img: "/project4.jpeg",
          desc: "Electrical and interior execution for retail environment."
        },
        {
          title: "AMC Maintenance Project",
          img: "/project5.jpeg",
          desc: "Ongoing maintenance contract ensuring system reliability."
        },
        {
          title: "Factory Setup",
          img: "/project6.jpeg",
          desc: "End-to-end infrastructure setup for manufacturing unit."
        }
      ].map((project, i) => (
        <Link href="/projects" key={i}>
          <div className="bg-[#1a1a1a] rounded-lg overflow-hidden hover:scale-105 hover:ring-1 hover:ring-[#D96A1A] transition text-left cursor-pointer">

            <img src={project.img} className="h-48 w-full object-cover" />

            <div className="p-5">
              <h3 className="font-semibold text-lg">{project.title}</h3>
              <p className="text-gray-300 mt-2 text-sm">
                {project.desc}
              </p>
            </div>

          </div>
        </Link>
      ))}

    </div>
    <br></br><br></br>
      <Link href="/projects">
  <button className="bg-[#D96A1A] px-6 py-3 rounded-md font-semibold hover:opacity-90 transition">
    View All Projects
  </button>
</Link>
  </div>
  
</section>


      {/* CONTACT */}
      <section id="contact" className="bg-[#0B1F3A] py-24 px-6 border-t border-white/10">
        <div className="max-w-4xl mx-auto">

          <h2 className="text-3xl font-bold text-white text-center mb-8">
            Contact Us
          </h2>

          <ContactForm />

        </div>
      </section>

    </main>
  );
}