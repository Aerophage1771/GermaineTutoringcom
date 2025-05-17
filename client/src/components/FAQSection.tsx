import { useState } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const FAQSection = () => {
  const faqs = [
    {
      question: "How are your tutoring sessions conducted?",
      answer: "All tutoring sessions are conducted online via Zoom, which allows for screen sharing and collaborative document work. We use digital LSAT materials and a shared workspace where we can annotate problems together. This approach has proven highly effective and allows for maximum flexibility regardless of your location."
    },
    {
      question: "How long does it typically take to see improvement?",
      answer: "Most students begin to see meaningful improvement after 8-10 hours of tutoring, combined with consistent independent practice. For significant improvements (10+ points), I typically recommend 3-4 months of preparation. The Premium Mastery Program is designed to be completed over 2-4 months for optimal results."
    },
    {
      question: "What materials do I need to purchase?",
      answer: "You'll need access to official LSAT PrepPlus questions through LSAC.org ($120 annual subscription). I provide all custom materials, worksheets, and strategy guides as part of your program. For Premium program students, I also provide additional specialized resources tailored to your specific needs."
    },
    {
      question: "How does your approach differ from other tutors?",
      answer: "My Princeton background in Philosophy of Logic gives me unique insight into the underlying reasoning patterns of the LSAT. Rather than teaching memorization or shortcuts, I focus on developing your fundamental logical reasoning abilities. My structured \"Describe, Demonstrate, Duplicate\" teaching model ensures you not only understand concepts but can apply them independently on test day."
    },
    {
      question: "What if I need to reschedule a session?",
      answer: "I understand that schedules can change. I request 24 hours notice for any rescheduling. Sessions can be rescheduled without penalty with sufficient notice. For last-minute cancellations (less than 24 hours), there may be a partial session fee, depending on circumstances."
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
