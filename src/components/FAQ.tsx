import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { motion } from "framer-motion";
import whenToUse from "@/assets/When-to-use.jpeg";
import useImage from "@/assets/use.png";
import disposeImage from "@/assets/dispose.png";

type FAQ = {
  q: string;
  a: string;
  image?: string;
};

const faqs: FAQ[] = [
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
    image: whenToUse,
  },
  {
    q: "How do I use PoppiGo?",
    a: "Just open the pack, unfold, step in, and pull up like regular underwear. It's that simple — no sticking, no adjusting. Wear for up to 12 hours and you're set.",
    image: useImage,
  },
  {
    q: "How do I dispose of them properly?",
    a: "Easy-peasy peel tech on the sides, roll it tight, put in the individual pouch it came in, toss it in the bin. Don't flush it, ever. One PoppiGo can replace up to 5 pads.",
    image: disposeImage,
  },
  {
    q: "Are they safe for sensitive skin?",
    a: "Absolutely! The top layer is super soft and skin-friendly. No itch, no ouch, no redness. Our rash-free material is dermatologically tested for all skin types.",
  },
  {
    q: "How long can I wear them?",
    a: "Up to 12 hours of leak-proof protection. But listen to your body — swap out sooner on heavier days if needed. PoppiGo's got you covered either way.",
  },
];

const FAQ = () => {
  return (
    <section id="faq" className="bg-white py-16 md:py-24">
      <div className="max-w-3xl mx-auto px-6">
        <motion.div
          className="text-center mb-10 md:mb-14"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="font-display font-semibold text-sm uppercase tracking-widest" style={{ color: "#4241ff" }}>
            Have a question?
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mt-3">
            Fast Answers, Quick Scrolls
          </h2>
          <p className="text-foreground/50 text-lg mt-3 font-body">
            No essays. No BS. Just facts.
          </p>
        </motion.div>

        <Accordion type="single" collapsible className="space-y-3">
          {faqs.map((faq, i) => (
            <AccordionItem
              key={i}
              value={`faq-${i}`}
              className="bg-[#fafff0] border border-lime/20 rounded-2xl px-6 overflow-hidden"
            >
              <AccordionTrigger className="text-left font-display font-semibold text-foreground text-lg py-5 hover:no-underline">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-foreground/60 text-base leading-relaxed pb-5 font-body">
                {faq.a}
                {faq.image && (
                  <img
                    src={faq.image}
                    alt={faq.q}
                    className="mt-4 w-full rounded-xl object-contain border border-lime/20"
                  />
                )}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FAQ;
