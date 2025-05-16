import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const consultationSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  phone: z.string().min(10, { message: "Please enter a valid phone number" }),
  currentScore: z.string().optional(),
  goalScore: z.string().min(1, { message: "Please enter your target score" }),
  testDate: z.string().optional()
});

type ConsultationFormData = z.infer<typeof consultationSchema>;

const CTASection = () => {
  const { toast } = useToast();
  
  const form = useForm<ConsultationFormData>({
    resolver: zodResolver(consultationSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      currentScore: '',
      goalScore: '',
      testDate: ''
    }
  });

  const consultationMutation = useMutation({
    mutationFn: (data: ConsultationFormData) => {
      return apiRequest('POST', '/api/consultation', data);
    },
    onSuccess: () => {
      toast({
        title: "Consultation Requested",
        description: "Thank you for requesting a consultation! Germaine will contact you shortly to schedule your session.",
      });
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to request consultation. Please try again later.",
        variant: "destructive"
      });
    }
  });

  const onSubmit = (data: ConsultationFormData) => {
    consultationMutation.mutate(data);
  };

  return (
    <section id="consultation" className="py-20 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden">
          <div className="md:flex">
            {/* Princeton University campus image */}
            <div className="md:w-1/2 relative">
              <img 
                src="https://pixabay.com/get/g472bcf764fad77edf8cc7db4eb49b01bfbe9db1b758e777f12c3fe83afff78bb94cd0acd15c834174bd368d305209e05f843aae3567ea0b454a526b63c7ad4c2_1280.jpg" 
                alt="Princeton University campus" 
                className="w-full h-full object-cover" 
              />
              <div className="absolute inset-0 bg-primary/30"></div>
            </div>
            
            <div className="md:w-1/2 p-8 md:p-12">
              <h2 className="font-heading font-bold text-primary text-3xl md:text-4xl mb-4">
                Ready to Transform Your LSAT Score? Let's Strategize.
              </h2>
              <p className="text-foreground leading-relaxed mb-8">
                Schedule a free 20-minute consultation to discuss your current performance, target score, 
                and how my methodology can help you achieve your goals.
              </p>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Your Name</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Enter your name" 
                              className="w-full px-4 py-3 rounded-lg border border-muted focus:outline-none focus:ring-2 focus:ring-primary/50"
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
                              className="w-full px-4 py-3 rounded-lg border border-muted focus:outline-none focus:ring-2 focus:ring-primary/50"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter your phone number" 
                            type="tel"
                            className="w-full px-4 py-3 rounded-lg border border-muted focus:outline-none focus:ring-2 focus:ring-primary/50"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="currentScore"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Current LSAT Score (or Diagnostic)</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="If you've taken the LSAT or a practice test" 
                            className="w-full px-4 py-3 rounded-lg border border-muted focus:outline-none focus:ring-2 focus:ring-primary/50"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="goalScore"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Target LSAT Score</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="What score are you aiming for?" 
                            className="w-full px-4 py-3 rounded-lg border border-muted focus:outline-none focus:ring-2 focus:ring-primary/50"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="testDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Planned Test Date (if known)</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="When do you plan to take the LSAT?" 
                            className="w-full px-4 py-3 rounded-lg border border-muted focus:outline-none focus:ring-2 focus:ring-primary/50"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    disabled={consultationMutation.isPending}
                    className="w-full bg-accent hover:bg-accent/90 text-primary font-bold py-3 px-6 rounded-lg transition-colors"
                  >
                    {consultationMutation.isPending ? 'Submitting...' : 'Book Your Free Consultation Now'}
                  </Button>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
