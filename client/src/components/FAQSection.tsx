import { useState } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const FAQSection = () => {
  const faqs = [
    {
      question: "How are your tutoring sessions conducted?",
      answer: "All tutoring sessions are conducted online via Google Meets, which allows for screen sharing and collaborative work. We use digital LSAT materials and a shared digital workspace where we can annotate problems together. This approach is highly effective and offers maximum flexibility regardless of your location."
    },
    {
      question: "How long does it typically take to see improvement?",
      answer: "My approach targets either the easiest wins or the most challenging areas early on to create quick, noticeable improvements, often within the first session. This initial progress builds confidence and sets the stage for tackling more entrenched issues or those requiring comprehensive strategies. While individual results vary, this focused start often allows students to feel and see positive movement quickly, motivating further engagement for deeper, sustained score growth."
    },
    {
      question: "What materials do I need to purchase?",
      answer: "You will need a Law Hub Advantage subscription from LSAC.org, which costs $120 for a year. This gives you access to official LSAT PrepTests. All other materials, including custom worksheets, strategy guides, and additional specialized resources, are provided by me as part of your tutoring program."
    },
    {
      question: "How does your approach differ from other tutors?",
      answer: "My core interest lies in argumentation—the formulation and construction of sound arguments. I focus on developing this fundamental skill set first, then applying it to the various LSAT question types. This differs from approaches that teach question-specific tactics and then try to backtrack into underlying argumentation. If you're looking for a holistic, comprehensive method that builds transferable reasoning skills applicable across the entire test, my approach is designed for you."
    },
    {
      question: "What if I need to reschedule a session?",
      answer: "I understand that schedules change. I request at least 24 hours' notice for any rescheduling. Sessions can generally be rescheduled without issue with sufficient notice. For last-minute cancellations with at least two hours' notice, I'm usually flexible. However, repeated short-notice or last-minute reschedules may result in firmer enforcement of the 24-hour rule or, in some cases, forfeiture of the missed time."
    },
    {
      question: "What if I'm not a 'logic person'?",
      answer: "You don't need to be! My system is designed to break down complex LSAT logic into straightforward, understandable patterns and formulas. I've successfully helped many students, including humanities majors with zero formal logic background, achieve 170+ scores by making logic accessible and applicable."
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-heading font-bold text-primary text-3xl md:text-4xl mb-4">Frequently Asked Questions</h2>
          <p className="text-foreground text-lg leading-relaxed">
            Find answers to common questions about my tutoring approach and programs.
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="bg-muted/30 rounded-lg"
              >
                <AccordionTrigger className="px-6 py-4 text-left font-heading font-bold text-primary hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6 text-foreground leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
