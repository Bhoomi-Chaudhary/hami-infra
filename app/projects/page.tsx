export default function ProjectsPage() {
  const projects = [
    {
      title: "Commercial Office Setup",
      desc: "Complete electrical and mechanical setup for a modern office space.",
      images: [
        "/projects/office/1.jpeg",
        "/projects/office/2.jpeg",
        "/projects/office/3.jpeg",
      ],
    },
    {
      title: "Industrial Installation",
      desc: "Heavy-duty mechanical installation for industrial operations.",
      images: [
        "/projects/industrial/1.jpeg",
        "/projects/industrial/2.jpeg",
        "/projects/industrial/3.jpeg",
      ],
    },
    {
      title: "Fire Safety System",
      desc: "Full fire safety system implementation with compliance.",
      images: [
        "/projects/fire/1.jpeg",
        "/projects/fire/2.jpeg",
        "/projects/fire/3.jpeg",
      ],
    },
    {
      title: "Retail Space Execution",
      desc: "Electrical and interior execution for retail environment.",
      images: [
        "/projects/retail/1.jpeg",
        "/projects/retail/2.jpeg",
        "/projects/retail/3.jpeg",
      ],
    },
    {
      title: "AMC Maintenance Project",
      desc: "Ongoing maintenance contract ensuring system reliability.",
      images: [
        "/projects/amc/1.jpeg",
        "/projects/amc/2.jpeg",
        "/projects/amc/3.jpeg",
      ],
    },
    {
      title: "Factory Setup",
      desc: "End-to-end infrastructure setup for manufacturing unit.",
      images: [
        "/projects/factory/1.jpeg",
        "/projects/factory/2.jpeg",
        "/projects/factory/3.jpeg",
      ],
    },
  ];

  return (
    <main>

      {/* HERO */}
      <section className="bg-[#0B1F3A] text-white py-20 text-center">
        <h1 className="text-4xl font-bold">Our Projects</h1>
      </section>

      {/* PROJECT SECTIONS */}
      {projects.map((project, i) => (
        <section
          key={i}
          className={`py-20 ${
            i % 2 === 0 ? "bg-[#2B2B2B] text-white" : "bg-white text-black"
          }`}
        >
          <div className="max-w-6xl mx-auto px-6">

            {/* TEXT */}
            <div className="mb-10">
              <h2 className="text-3xl font-bold">
                {project.title}
              </h2>
              <p className="mt-4 max-w-2xl text-gray-400">
                {project.desc}
              </p>
            </div>

            {/* IMAGE GRID */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {project.images.map((img, idx) => (
                <div key={idx} className="overflow-hidden rounded-lg">
                  <img
                    src={img}
                    className="w-full h-64 object-cover hover:scale-110 transition"
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