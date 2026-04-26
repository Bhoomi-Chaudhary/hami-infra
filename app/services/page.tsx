export default function ServicesPage() {
  const services = [
    {
      id: "electrical",
      title: "Electrical",
      desc: "Complete electrical execution including wiring, panel installation, and maintenance.",
      images: [
        "/services/electrical/1.jpeg",
        "/services/electrical/2.jpeg",
        "/services/electrical/3.jpeg",
      ],
    },
    {
      id: "mechanical",
      title: "Mechanical",
      desc: "Fabrication, installation, and durable mechanical solutions.",
      images: [
        "/services/mechanical/1.jpeg",
        "/services/mechanical/2.jpeg",
        "/services/mechanical/3.jpeg",
      ],
    },
    {
      id: "fire",
      title: "Fire Safety",
      desc: "Reliable fire safety systems installation with full compliance.",
      images: [
        "/services/fire/1.jpeg",
        "/services/fire/2.jpeg",
        "/services/fire/3.jpeg",
      ],
    },
    {
      id: "commercial",
      title: "Commercial",
      desc: "Execution of office and commercial infrastructure efficiently.",
      images: [
        "/services/commercial/1.jpeg",
        "/services/commercial/2.jpeg",
        "/services/commercial/3.jpeg",
      ],
    },
    {
      id: "amc",
      title: "AMC (Annual Maintenance)",
      desc: "Annual maintenance services ensuring long-term system performance and reliability.",
      images: [
        "/services/amc/1.jpeg",
        "/services/amc/2.jpeg",
        "/services/amc/3.jpeg",
      ],
    },
  ];

  return (
    <main>

      {/* HERO */}
      <section className="bg-[#0B1F3A] text-white py-20 text-center">
        <h1 className="text-4xl font-bold">Our Services</h1>
      </section>

      {/* SERVICES SECTIONS */}
      {services.map((s, i) => (
        <section
          key={i}
          id={s.id}
          className={`py-20 ${
            i % 2 === 0 ? "bg-[#2B2B2B] text-white" : "bg-white text-black"
          }`}
        >
          <div className="max-w-6xl mx-auto px-6">

            {/* TEXT */}
            <div className="mb-10">
              <h2 className="text-3xl font-bold">{s.title}</h2>
              <p className="mt-4 max-w-2xl text-gray-400">
                {s.desc}
              </p>
            </div>

            {/* IMAGE GRID */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {s.images.map((img, idx) => (
                <div key={idx} className="overflow-hidden rounded-lg">
                  <img
                    src={img}
                    className="w-full h-56 object-cover hover:scale-110 transition"
                  />
                </div>
              ))}
            </div>

          </div>
        </section>
      ))}

    </main>
  );
}