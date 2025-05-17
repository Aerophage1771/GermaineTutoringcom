import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogClose
} from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const emailSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" })
});

type EmailFormData = z.infer<typeof emailSchema>;

const GuidesSection = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedGuide, setSelectedGuide] = useState<number | null>(null);
  const { toast } = useToast();
  
  const form = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      name: '',
      email: ''
    }
  });

  const guides = [
    {
      image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500",
      title: "Common LSAT Flaws & How to Fix Them",
      description: "Learn to identify and address the 7 most common logical fallacies that appear in LSAT Logical Reasoning questions.",
      type: "Four-page PDF guide"
    },
    {
      image: "https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500",
      title: "Effective Blind Review Techniques",
      description: "Master the most powerful practice method for LSAT improvement with this step-by-step guide to conducting effective blind reviews.",
      type: "Three-page PDF and worksheet"
    },
    {
      image: "https://images.unsplash.com/photo-1599687351724-dfa3c4ff81b1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500",
      title: "Strategic Reading Comp Passage Analysis",
      description: "Transform your approach to Reading Comprehension with targeted strategies for breaking down complex passages efficiently.",
      type: "Six-page PDF and annotation guide"
    }
  ];

  const emailSignupMutation = useMutation({
    mutationFn: (data: EmailFormData) => {
      return apiRequest('POST', '/api/subscribe', data);
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "Thank you for signing up! You will receive the LSAT guide shortly.",
      });
      form.reset();
      setIsSubmitting(false);
      setIsDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to subscribe. Please try again later.",
        variant: "destructive"
      });
      setIsSubmitting(false);
    }
  });

  const onSubmit = (data: EmailFormData) => {
    setIsSubmitting(true);
    emailSignupMutation.mutate(data);
  };

  const handleGuideClick = (index: number) => {
    setSelectedGuide(index);
    setIsDialogOpen(true);
  };

  return (
    <section id="guides" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-heading font-bold text-primary text-3xl md:text-4xl mb-4">
            Subscribe for Exclusive Access to Our Free LSAT Guides
          </h2>
          <p className="text-foreground text-lg leading-relaxed">
            Join our community to unlock valuable resources designed to boost your LSAT performance and preparation strategy.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {guides.map((guide, index) => (
            <div key={index} className="bg-muted/30 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow">
              <img 
                src={guide.image} 
                alt={guide.title} 
                className="w-full h-48 object-cover" 
              />
              
              <div className="p-6">
                <h3 className="font-heading font-bold text-primary text-xl mb-3">{guide.title}</h3>
                <p className="text-foreground mb-4">
                  {guide.description}
                </p>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-primary font-medium text-sm">{guide.type}</span>
                </div>
                <Button 
                  onClick={() => handleGuideClick(index)}
                  className="w-full bg-accent hover:bg-accent/90 text-primary font-bold py-2 rounded-lg transition-colors"
                >
                  Download Now
                </Button>
              </div>
            </div>
          ))}
        </div>
        
        {/* Subscription Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-center">Join Our LSAT Community for Access!</DialogTitle>
              <DialogDescription className="text-center pt-2">
                Unlock this free guide and gain access to exclusive LSAT strategies, study tips, and updates from our community.
              </DialogDescription>
            </DialogHeader>
            
            <div className="py-4">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Your Name</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter your name" 
                            className="w-full px-4 py-3 rounded-lg"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter your email" 
                            type="email"
                            className="w-full px-4 py-3 rounded-lg"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full bg-accent hover:bg-accent/90 text-primary font-bold py-3 px-6 rounded-lg transition-colors"
                  >
                    {isSubmitting ? 'Submitting...' : 'Subscribe & Download'}
                  </Button>
                  
                  <p className="text-muted-foreground text-sm text-center">
                    We respect your privacy and will never share your information.
                  </p>
                </form>
              </Form>
            </div>
            
            <div className="flex justify-center">
              <DialogClose asChild>
                <Button variant="ghost" className="text-sm">No thanks, maybe later</Button>
              </DialogClose>
            </div>
          </DialogContent>
        </Dialog>
        
        {/* Targeted Strategy Session Booking */}
        <div className="bg-primary rounded-xl shadow-lg p-8 md:p-12 mb-16">
          <div className="text-center mb-8">
            <h3 className="font-heading font-bold text-white text-2xl md:text-3xl mb-4">Book a Targeted Strategy Session</h3>
            <p className="text-white/90 leading-relaxed max-w-3xl mx-auto">
              Ready to take your LSAT preparation to the next level? Schedule a 2-hour targeted strategy session focused on your specific needs.
            </p>
          </div>
          
          <div className="flex justify-center">
            <Button 
              className="bg-accent hover:bg-accent/90 text-primary font-bold py-3 px-8 rounded-lg transition-colors text-lg"
              onClick={() => {
                // @ts-ignore
                window.Calendly?.initPopupWidget({url: 'https://calendly.com/germaine-washington-tutoring/2-hour-lsat-tutoring'});
              }}
            >
              Schedule Your Strategy Session
            </Button>
          </div>
        </div>
        
        {/* Initial Consultation Booking */}
        <div className="bg-white border border-muted/50 rounded-xl shadow-md p-8 md:p-12">
          <div className="text-center mb-8">
            <h3 className="font-heading font-bold text-primary text-2xl md:text-3xl mb-4">Initial Consultation Call</h3>
            <p className="text-foreground/80 leading-relaxed max-w-3xl mx-auto mb-8">
              Not sure where to start? Book a free consultation call to discuss your LSAT goals and how my tutoring approach can help you succeed.
            </p>
            
            <Button 
              className="bg-primary hover:bg-primary/90 text-white font-bold py-3 px-8 rounded-lg transition-colors text-lg mx-auto"
              onClick={() => {
                // @ts-ignore
                window.Calendly?.initInlineWidget({
                  url: 'https://calendly.com/germaine-washington-tutoring/initial-consultation?primary_color=d39e17',
                  parentElement: document.getElementById('calendly-consultation-container'),
                  prefill: {},
                  styles: {
                    height: '700px'
                  }
                });
              }}
            >
              Schedule Initial Consultation
            </Button>
          </div>
          
          <div id="calendly-consultation-container"></div>
        </div>
      </div>
    </section>
  );
};

export default GuidesSection;
