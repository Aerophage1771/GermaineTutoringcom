import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
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
      type: "20-page PDF Guide"
    },
    {
      image: "https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500",
      title: "Effective Blind Review Techniques",
      description: "Master the most powerful practice method for LSAT improvement with this step-by-step guide to conducting effective blind reviews.",
      type: "15-page PDF + Worksheet"
    },
    {
      image: "https://images.unsplash.com/photo-1599687351724-dfa3c4ff81b1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500",
      title: "Strategic Reading Comp Passage Analysis",
      description: "Transform your approach to Reading Comprehension with targeted strategies for breaking down complex passages efficiently.",
      type: "18-page PDF + Annotation Guide"
    }
  ];

  const emailSignupMutation = useMutation({
    mutationFn: (data: EmailFormData) => {
      return apiRequest('POST', '/api/subscribe', data);
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "Thank you for signing up! You will receive the LSAT guides shortly.",
      });
      form.reset();
      setIsSubmitting(false);
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

  return (
    <section id="guides" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-heading font-bold text-primary text-3xl md:text-4xl mb-4">Free LSAT Guides</h2>
          <p className="text-foreground text-lg leading-relaxed">
            Access premium LSAT resources to jumpstart your preparation. Join our community to receive these guides and regular tips.
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
                <div className="flex justify-between items-center">
                  <span className="text-primary font-medium text-sm">{guide.type}</span>
                  <i className="fas fa-lock text-accent"></i>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Email Sign-up */}
        <div className="bg-primary rounded-xl shadow-lg p-8 md:p-12">
          <div className="md:flex items-center">
            <div className="md:w-7/12 mb-8 md:mb-0 md:pr-8">
              <h3 className="font-heading font-bold text-white text-2xl md:text-3xl mb-4">Join Our LSAT Community for Access</h3>
              <p className="text-white/90 leading-relaxed">
                Subscribe to receive these premium guides plus regular LSAT tips, strategy updates, and exclusive content to support your preparation journey.
              </p>
            </div>
            
            <div className="md:w-5/12">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white/90">Your Name</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter your name" 
                            className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50"
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
                        <FormLabel className="text-white/90">Email Address</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter your email" 
                            type="email"
                            className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50"
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
                    {isSubmitting ? 'Submitting...' : 'Get Free LSAT Guides'}
                  </Button>
                  
                  <p className="text-white/70 text-sm">
                    We respect your privacy and will never share your information. You can unsubscribe at any time.
                  </p>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GuidesSection;
