import ContactForm from "@/components/ContactForm";

export default function Home() {
  return (
    <main>

      {/* HERO */}
      <section style={{
  background: "#0B1F3A",
  color: "white",
  padding: "60px 20px",
  textAlign: "center"
}}>
        <h1 style={{ fontSize: "42px", fontWeight: "bold" }}>
          Execution That Keeps Your Project Moving
        </h1>

        <p style={{ marginTop: "10px" }}>
          Skilled teams, clear timelines, and reliable delivery.
        </p>

        <button style={{
  marginTop: "25px",
  background: "#D96A1A",
  color: "white",
  padding: "12px 24px",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: "bold"
}}>
          Discuss Your Project
        </button>
      </section>

      {/* SERVICES */}
      <section style={{ padding: "60px 20px" }}>
        <h2 style={{
          textAlign: "center",
          marginBottom: "30px",
          color: "#0B1F3A"
        }}>
          Our Services
        </h2>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "20px"
        }}>

          <div style={{
            background: "white",
            padding: "20px",
            borderRadius: "10px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)"
          }}>
            <h3>Electrical Work</h3>
            <p>Complete electrical execution from wiring to maintenance.</p>
          </div>

          <div style={{
            background: "white",
            padding: "20px",
            borderRadius: "10px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)"
          }}>
            <h3>Mechanical Work</h3>
            <p>Fabrication, installation, and reliable mechanical solutions.</p>
          </div>

          <div style={{
            background: "white",
            padding: "20px",
            borderRadius: "10px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)"
          }}>
            <h3>Fire Safety</h3>
            <p>Fire systems installation and safety compliance services.</p>
          </div>

          <div style={{
            background: "white",
            padding: "20px",
            borderRadius: "10px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)"
          }}>
            <h3>Commercial Projects</h3>
            <p>Execution of office and commercial infrastructure work.</p>
          </div>

        </div>
      </section>

      {/* CONTACT */}
      <ContactForm />

    </main>
  );
}