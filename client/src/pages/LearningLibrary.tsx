import { useState } from "react";
import { useAuthRedirect } from "@/hooks/use-auth-redirect";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { 
  Home, 
  BookOpen, 
  Brain, 
  FileText, 
  Target, 
  Lightbulb,
  ChevronRight,
  GraduationCap,
  PenTool
} from "lucide-react";

interface Subsection {
  title: string;
  content: string;
  icon?: string;
}

interface AccordionFamily {
  title: string;
  subtitle: string;
  modules: Subsection[];
}

interface Section {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  subsections?: Subsection[];
  accordionFamilies?: AccordionFamily[];
}

const sections: Section[] = [
  {
    title: "Fundamental Skills",
    description: "Build core reasoning and logic foundation",
    icon: GraduationCap,
    color: "bg-blue-600 hover:bg-blue-700",
    subsections: [
      {
        title: "Intro to Grammar",
        content: "Understand how sentence structure, punctuation, and clarity affect logical reasoning. LSAT questions assume precision in language. Master proper grammar usage, sentence construction, and how language precision affects legal reasoning. Learn to identify ambiguous statements and grammatical structures that can impact logical analysis."
      },
      {
        title: "Intro to Arguments",
        content: "Learn how to identify premises and conclusions. Understand how arguments are structured and how roles support logic. Develop skills in recognizing the building blocks of reasoning, distinguishing between supporting evidence and main claims, and understanding how different argument components work together to form logical conclusions."
      },
      {
        title: "Conditional Logic",
        content: "Master common logical indicators like 'if,' 'only if,' 'unless.' Learn to form contrapositives and distinguish sufficiency from necessity. Practice translating natural language into logical form, understanding the relationship between sufficient and necessary conditions, and applying contrapositive reasoning to complex scenarios."
      },
      {
        title: "Advanced Conditional Logic",
        content: "Dive into chains of conditionals, nested structures, and exception cases. Explore complex logical relationships involving multiple conditional statements, learn to navigate intricate logical chains, and master handling exceptions and special cases within conditional reasoning frameworks."
      },
      {
        title: "Logic Flaws",
        content: "Review frequent fallacies like circular reasoning, ad hominem, and equivocation. Understand how to spot flawed argumentation. Learn to identify common logical errors, recognize patterns of faulty reasoning, and develop skills in distinguishing between valid and invalid argument structures."
      },
      {
        title: "Causation",
        content: "Learn to differentiate correlation from causation. Understand alternative explanations and counterfactuals. Master the analysis of causal relationships, learn to identify when correlation does not imply causation, and develop skills in evaluating alternative explanations for observed phenomena."
      }
    ]
  },
  {
    title: "Logical Reasoning",
    description: "Master argument analysis and logical thinking",
    icon: Brain,
    color: "bg-emerald-600 hover:bg-emerald-700",
    accordionFamilies: [
      {
        title: "Section 1: Argument Structure and Reasoning Types",
        subtitle: "Build a foundation by learning how arguments are constructed and how their parts function.",
        modules: [
          {
            title: "Main Conclusion",
            icon: "🎯",
            content: "Find the statement that is supported by the others. Avoid confusing it with intermediate conclusions. Learn to identify the primary claim an argument is trying to establish, distinguish between main and subsidiary conclusions, and recognize how supporting premises work together to establish the central point."
          },
          {
            title: "Argument Part",
            icon: "🔧",
            content: "Classify parts of the stimulus: is it a premise, background, counterclaim, or conclusion? Develop skills in parsing complex arguments, identifying the role each statement plays, and understanding how different components contribute to the overall argumentative structure."
          },
          {
            title: "Method of Reasoning",
            icon: "🗂️",
            content: "Describe how the argument is built. Is it analogical, conditional, or comparative? Learn to recognize different argumentative strategies, understand how authors construct their reasoning, and identify the logical techniques used to support conclusions."
          },
          {
            title: "Parallel Reasoning",
            icon: "↔️",
            content: "Match the logical form of the argument across different topics. Master the skill of identifying underlying logical structures, recognizing when different arguments share the same reasoning pattern despite having different subject matter."
          },
          {
            title: "Agree/Disagree",
            icon: "💬",
            content: "Contrast speaker positions. What do they actually agree or disagree on? Develop skills in identifying points of convergence and divergence between different viewpoints, understanding nuanced positions, and recognizing areas of agreement within broader disagreements."
          }
        ]
      },
      {
        title: "Section 2: Argument Flaws and Evaluation",
        subtitle: "Focus on weaknesses in reasoning and how to assess argument quality.",
        modules: [
          {
            title: "Flaw",
            icon: "🔍",
            content: "Identify the logical weakness. Are assumptions unstated? Are causal leaps unjustified? Learn to spot errors in reasoning, recognize unsupported assumptions, and identify gaps in logic that undermine argument validity."
          },
          {
            title: "Parallel Flaw",
            icon: "🔄",
            content: "Match flawed reasoning patterns, not just valid forms. Develop the ability to recognize when different arguments share the same type of logical error, regardless of their content area or specific claims."
          },
          {
            title: "Evaluate",
            icon: "⚖️",
            content: "Choose the piece of info that would most strengthen or weaken the argument's reasoning. Learn to assess what additional information would be most relevant to determining an argument's validity and strength."
          }
        ]
      },
      {
        title: "Section 3: Strengthening, Weakening, and Assumption Types",
        subtitle: "Reinforce or challenge arguments and understand the assumptions they rely on.",
        modules: [
          {
            title: "Weaken",
            icon: "🛡️",
            content: "Identify info that would undercut the argument's support for its conclusion. Master techniques for recognizing what evidence or reasoning would damage an argument's persuasive force and logical foundation."
          },
          {
            title: "Strengthen",
            icon: "💪",
            content: "Identify info that would reinforce the link between premise and conclusion. Learn to recognize what additional support would make an argument more convincing and logically sound."
          },
          {
            title: "Principle–Rule",
            icon: "📋",
            content: "Match an abstract rule to the case given. Develop skills in applying general principles to specific situations and recognizing how broad rules apply to particular circumstances."
          },
          {
            title: "Principle–Application",
            icon: "📝",
            content: "Match the correct case to the abstract rule. Learn to identify which specific situations exemplify or violate general principles and abstract guidelines."
          },
          {
            title: "Sufficient Assumption",
            icon: "✅",
            content: "Identify a claim that, if added, guarantees the conclusion. Master finding assumptions that would make an argument logically valid, ensuring the conclusion follows necessarily from the premises."
          },
          {
            title: "Necessary Assumption",
            icon: "🔗",
            content: "Identify a claim that must be true for the conclusion to follow. Learn to recognize unstated assumptions that arguments depend upon, without which the reasoning would fail."
          }
        ]
      },
      {
        title: "Section 4: Inference and Completion",
        subtitle: "Focus on what logically follows or completes an argument based on available information.",
        modules: [
          {
            title: "Fill in the Blank",
            icon: "📝",
            content: "Complete an argument logically based on surrounding context. Develop skills in understanding argument flow and identifying what conclusion or premise would best complete the logical structure."
          },
          {
            title: "Most Strongly Supported",
            icon: "📊",
            content: "Identify the answer most supported by the provided info. Learn to evaluate which conclusions have the strongest evidentiary support from the given premises."
          },
          {
            title: "Must Be True",
            icon: "✔️",
            content: "Deduce a conclusion that must follow from the stimulus. Master logical deduction skills to identify what necessarily follows from the given information."
          },
          {
            title: "Must Be False",
            icon: "❌",
            content: "Eliminate conclusions that contradict the stimulus. Learn to identify statements that are incompatible with the given information and cannot be true."
          },
          {
            title: "Resolve / Reconcile / Explain",
            icon: "❓",
            content: "Clarify an apparent contradiction or puzzling result. Develop skills in finding explanations that make seemingly contradictory information coherent and understandable."
          }
        ]
      }
    ]
  },
  {
    title: "Reading Comprehension",
    description: "Develop advanced reading and analysis skills",
    icon: BookOpen,
    color: "bg-purple-600 hover:bg-purple-700",
    subsections: [
      {
        title: "Informational Passages",
        content: "Just the facts; tone is neutral. Learn to navigate objective, fact-based passages that present information without taking a particular stance. Master extracting key details, understanding organizational structure, and identifying the author's informational purpose."
      },
      {
        title: "Debate Passages",
        content: "Two views; author's position may be unclear. Develop skills in analyzing passages that present multiple perspectives, understanding how different viewpoints are contrasted, and identifying when authors remain neutral versus when they subtly favor one position."
      },
      {
        title: "Argumentative Passages",
        content: "Clear opinion backed by reasoning. Master analyzing passages where authors take definitive stances, understanding how evidence supports conclusions, and recognizing the structure of persuasive arguments in academic and legal contexts."
      },
      {
        title: "Comparative Passages",
        content: "Two passages that must be contrasted and compared. Learn to analyze relationships between paired passages, identify areas of agreement and disagreement, and understand how different authors approach similar topics."
      },
      {
        title: "Main Point Questions",
        content: "Central thesis identification. Develop skills in distinguishing between main ideas and supporting details, recognizing how authors structure their central arguments, and identifying the overarching purpose of complex passages."
      },
      {
        title: "Detail Questions",
        content: "Specific fact identification. Master locating specific information within passages, understanding how details support larger arguments, and avoiding trap answers that distort the original information."
      },
      {
        title: "Inference Questions",
        content: "What must be or is likely true. Learn to make logical deductions from passage content, distinguish between what is stated and what can be reasonably concluded, and avoid unsupported inferences."
      },
      {
        title: "Author's Attitude",
        content: "Tone and viewpoint analysis. Develop skills in recognizing subtle indicators of author perspective, understanding how word choice reveals attitude, and distinguishing between different degrees of support or criticism."
      },
      {
        title: "Purpose Questions",
        content: "Why a sentence/paragraph exists. Master understanding the functional role of passage components, recognizing how different sections contribute to the overall argument, and identifying rhetorical strategies."
      },
      {
        title: "Analogy Questions",
        content: "Similar situation or structure identification. Learn to recognize when situations or reasoning patterns from the passage apply to new contexts, understanding the underlying principles that make analogies valid."
      },
      {
        title: "Organization Questions",
        content: "Structure and purpose of content blocks. Develop skills in analyzing how passages are organized, understanding the logical flow of ideas, and recognizing common structural patterns in academic writing."
      },
      {
        title: "Strengthen/Weaken (RC)",
        content: "How new info impacts passage claims. Master evaluating how additional information would affect the strength of arguments presented in passages, understanding what evidence would support or undermine the author's position."
      }
    ]
  },
  {
    title: "Writing Section",
    description: "Master persuasive writing and argumentation",
    icon: PenTool,
    color: "bg-orange-600 hover:bg-orange-700",
    subsections: [
      {
        title: "Overview & Format",
        content: "One dilemma; choose a side and justify it. Understand the writing section structure: you'll be presented with a scenario requiring a decision between two options, each with distinct advantages and disadvantages. Learn to analyze the competing considerations and make a reasoned choice."
      },
      {
        title: "Structure & Timing",
        content: "Intro, body paragraphs, conclusion. 35 minutes. Master effective essay organization: opening paragraph that introduces the issue and your position, body paragraphs that develop your reasoning with specific examples, and a conclusion that reinforces your argument. Learn to manage time effectively within the constraints."
      },
      {
        title: "Balanced Argument",
        content: "Acknowledge the other side respectfully. Develop skills in presenting fair and nuanced arguments that recognize the merits of opposing viewpoints while still making a clear case for your chosen position. Learn to address counterarguments constructively."
      },
      {
        title: "Effective Response",
        content: "Clear stance, logical flow, specific examples. Master the elements of persuasive writing: taking a definitive position, organizing ideas logically, supporting claims with concrete examples, and maintaining consistency throughout your argument."
      },
      {
        title: "Common Mistakes",
        content: "Vague claims, poor structure, lack of support. Learn to avoid typical pitfalls: making unsupported generalizations, organizing ideas poorly, failing to provide specific evidence, and switching positions mid-argument. Understand what weakens persuasive writing."
      },
      {
        title: "Sample Essays",
        content: "Examples of high-scoring vs low-scoring responses. Study model essays to understand what distinguishes excellent writing from poor performance. Analyze successful argumentative strategies, effective organization patterns, and compelling use of evidence and reasoning."
      }
    ]
  },
  {
    title: "Strategies and Advanced Techniques",
    description: "Optimize performance and test-taking approach",
    icon: Target,
    color: "bg-red-600 hover:bg-red-700",
    subsections: [
      {
        title: "Reasonableness Standard",
        content: "Think like a test writer; eliminate implausible options. Learn to approach questions from the test creator's perspective, understanding what makes answer choices attractive but wrong, and developing intuition for identifying unreasonable options quickly."
      },
      {
        title: "Inverting Stimulus/Answer",
        content: "Flip the question: what must be false? What if X isn't true? Master reverse-engineering techniques that help clarify logical relationships by considering what would happen if premises or conclusions were negated."
      },
      {
        title: "Graded Removal",
        content: "Eliminate answers in degrees from least to most wrong. Develop systematic approaches to answer choice elimination, learning to identify and remove obviously incorrect options first, then distinguishing between remaining choices."
      },
      {
        title: "Assumption Comparison",
        content: "Compare assumptions between choices, use negation test. Master techniques for evaluating unstated assumptions in arguments, learning to test assumptions by considering what happens when they are denied."
      },
      {
        title: "Pattern Recognition",
        content: "Spot argument types quickly to anticipate question type. Develop skills in rapidly identifying common argument structures and question patterns, allowing for more efficient and accurate responses."
      },
      {
        title: "Time Management",
        content: "Segment your time per question and section. Learn effective pacing strategies, understanding how to allocate time across different question types, when to move on from difficult questions, and how to maintain steady progress throughout each section."
      },
      {
        title: "Advanced Review",
        content: "Use post-test reflection like 'If I wrote the LSAT, how would I trick myself?' Develop sophisticated review techniques that help identify personal weaknesses, understand common trap patterns, and build immunity to typical mistakes through strategic self-analysis."
      }
    ]
  }
];

export default function LearningLibrary() {
  const { user, isLoading } = useAuthRedirect();
  const [, setLocation] = useLocation();
  const [selectedSection, setSelectedSection] = useState<Section | null>(null);
  const [selectedSubsection, setSelectedSubsection] = useState<Subsection | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Show loading spinner while checking authentication
  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const handleSectionClick = (section: Section) => {
    setSelectedSection(section);
    setSelectedSubsection(null);
  };

  const handleSubsectionClick = (subsection: Subsection) => {
    setSelectedSubsection(subsection);
    setIsModalOpen(true);
  };

  const handleBackToSections = () => {
    setSelectedSection(null);
    setSelectedSubsection(null);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedSubsection(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={() => setLocation("/dashboard")}
              className="flex items-center"
            >
              <Home className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            {selectedSection && (
              <Button
                variant="outline"
                onClick={handleBackToSections}
                className="flex items-center"
              >
                <ChevronRight className="h-4 w-4 mr-2 rotate-180" />
                Back to Library
              </Button>
            )}
            <h1 className="text-3xl font-bold text-gray-900">
              {selectedSection ? selectedSection.title : "LSAT Learning Library"}
            </h1>
          </div>
        </div>
        <p className="text-gray-600">
          {selectedSection 
            ? `Explore ${selectedSection.title.toLowerCase()} topics and concepts`
            : "Comprehensive study materials organized by LSAT section and skill level"
          }
        </p>
      </div>

      {/* Main Content */}
      {!selectedSection ? (
        // Section Selection View
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sections.map((section, index) => {
            const IconComponent = section.icon;
            return (
              <Card 
                key={index}
                className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 border-0 shadow-md"
                onClick={() => handleSectionClick(section)}
              >
                <CardContent className="p-6">
                  <div className={`w-16 h-16 ${section.color} rounded-lg flex items-center justify-center mb-4 transition-colors duration-200`}>
                    <IconComponent className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {section.title}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {section.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="text-sm">
                      {section.subsections?.length || section.accordionFamilies?.reduce((acc, family) => acc + family.modules.length, 0) || 0} topics
                    </Badge>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : selectedSection.accordionFamilies ? (
        // Accordion Families View (Logical Reasoning)
        <div className="space-y-6">
          <Accordion type="multiple" className="w-full space-y-4">
            {selectedSection.accordionFamilies.map((family, familyIndex) => (
              <AccordionItem 
                key={familyIndex} 
                value={`family-${familyIndex}`}
                className="border border-gray-200 rounded-lg px-6 py-2 bg-white shadow-sm"
              >
                <AccordionTrigger className="hover:no-underline py-4">
                  <div className="text-left">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {family.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {family.subtitle}
                    </p>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                    {family.modules.map((module, moduleIndex) => (
                      <Card 
                        key={moduleIndex}
                        className="cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-[1.02] border border-gray-100 bg-gray-50"
                        onClick={() => handleSubsectionClick(module)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start space-x-3">
                            <span className="text-xl flex-shrink-0 mt-0.5">
                              {module.icon}
                            </span>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-gray-900 mb-1 text-sm">
                                {module.title}
                              </h4>
                              <p className="text-xs text-gray-600 line-clamp-2">
                                {module.content.substring(0, 80)}...
                              </p>
                            </div>
                            <ChevronRight className="h-4 w-4 text-gray-400 flex-shrink-0 mt-1" />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      ) : (
        // Traditional Subsection List View
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {selectedSection.subsections?.map((subsection, index) => (
              <Card 
                key={index}
                className="cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-[1.02] border border-gray-200"
                onClick={() => handleSubsectionClick(subsection)}
              >
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center justify-between">
                    <span>{subsection.title}</span>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-gray-600 text-sm">
                    {subsection.content.substring(0, 120)}...
                  </p>
                </CardContent>
              </Card>
            )) || []}
          </div>
        </div>
      )}

      {/* Content Modal */}
      <Dialog open={isModalOpen} onOpenChange={closeModal}>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center">
              <Lightbulb className="h-6 w-6 mr-2 text-blue-600" />
              {selectedSubsection?.title}
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh] pr-4">
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {selectedSubsection?.content}
              </p>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}