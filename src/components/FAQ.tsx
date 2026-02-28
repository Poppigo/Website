import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "So… is PoppiGo a pad or a panty?",
    a: "Neither. PoppiGo is India's slimmest disposable period panty. Wear it like your regular undies on period days – no pads, no wings, no stress. It's single-use, so wear it, love it, toss it.",
  },
  {
    q: "How is it different from other pads or panties?",
    a: "It's built for blood (not just leaks), way slimmer than pads or other period panties, and totally disposable. Our Japanese gel tech locks it in – no leaks, no bulk, no weird diaper vibes.",
  },
  {
    q: "Can I sleep in it? Work out in it? Live my life in it?",
    a: "Yes, yes, and yes. PoppiGo is made for all of it – sleeping, stretching, running, and showing up strong. You can use it up to 12 hours. It's leak-proof, and stays snug through whatever your day (or night) throws at you.",
  },
  {
    q: "Will anyone know I'm wearing it? Is it rash-free?",
    a: "Only if you tell them. It's ultra-slim, no bulges, no rustling – just sleek, silent support. And big yes – the top layer is super soft and skin-friendly. No itch, no ouch, no redness.",
  },
  {
    q: "How do I dispose of it?",
    a: "Easy-peasy peel tech on the sides, roll it tight, put in the individual pouch it came in, toss it in the bin. Don't flush it, ever. One PoppiGo can replace up to 5 pads.",
  },
  {
    q: "What size should I buy?",
    a: "Made in India. Built for every body. S-M fits 25″–35″ waist, L-XL fits 35″–45″, and 2XL-3XL fits 45″–55″. Our 2.5x stretch waistband moves with you – fits like a hug, not a squeeze.",
  },
];

const FAQ = () => {
  return (
    <section id="faq" className="bg-background py-20 md:py-28">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-14">
          <span className="text-coral font-display font-semibold text-sm uppercase tracking-widest">
            Have a question?
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mt-3">
            Fast Answers, Quick Scrolls
          </h2>
          <p className="text-muted-foreground text-lg mt-3">
            No BS. Just facts.
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-3">
          {faqs.map((faq, i) => (
            <AccordionItem
              key={i}
              value={`faq-${i}`}
              className="bg-card border border-border rounded-2xl px-6 overflow-hidden"
            >
              <AccordionTrigger className="text-left font-display font-semibold text-foreground text-lg py-5 hover:no-underline">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-base leading-relaxed pb-5">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FAQ;
