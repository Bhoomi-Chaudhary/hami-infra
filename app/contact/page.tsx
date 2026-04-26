import ContactForm from "@/components/ContactForm";

export default function ContactPage() {
  return (
    <main>

      {/* HERO */}
      <section className="bg-[#0B1F3A] text-white py-20 text-center">
        <h1 className="text-4xl font-bold">Contact Us</h1>
      </section>

      {/* FORM */}
      <section className="py-20 px-6 bg-[#0B1F3A]">
        <div className="max-w-4xl mx-auto">

          <ContactForm />

        </div>
      </section>

    </main>
  );
}