import { useState } from "react";
import { useAuthRedirect } from "@/hooks/use-auth-redirect";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronRight, ArrowLeft, BookOpen, Brain, FileText, Lightbulb } from "lucide-react";
import type { SectionData, LibraryModule, Lesson } from "@/types/studentLibrary";
import { studentLibrarySections } from "@/data/studentLibraryData";
import { ContentBlockRenderer } from "@/components/LearningLibrary/ContentBlockRenderer";

const SECTION_META: Record<
  string,
  { description: string; icon: React.ComponentType<{ className?: string }>; color: string }
> = {
  "Logical Reasoning": {
    description: "Master argument analysis and logical thinking",
    icon: Brain,
    color: "bg-emerald-600 hover:bg-emerald-700",
  },
  "Reading Comprehension": {
    description: "Develop advanced reading and analysis skills",
    icon: BookOpen,
    color: "bg-purple-600 hover:bg-purple-700",
  },
  "Advanced Passages": {
    description: "Practice with advanced passage types and questions",
    icon: FileText,
    color: "bg-slate-600 hover:bg-slate-700",
  },
};

export default function LearningLibrary() {
  const { user, isLoading } = useAuthRedirect();
  const [, setLocation] = useLocation();
  const [selectedSection, setSelectedSection] = useState<SectionData | null>(null);
  const [selectedModule, setSelectedModule] = useState<LibraryModule | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const handleSectionClick = (section: SectionData) => {
    setSelectedSection(section);
    setSelectedModule(null);
    setSelectedLesson(null);
  };

  const handleModuleClick = (module: LibraryModule) => {
    setSelectedModule(module);
    setSelectedLesson(null);
  };

  const handleLessonClick = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    setIsModalOpen(true);
  };

  const handleBackToSections = () => {
    setSelectedSection(null);
    setSelectedModule(null);
    setSelectedLesson(null);
  };

  const handleBackToModules = () => {
    setSelectedModule(null);
    setSelectedLesson(null);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedLesson(null);
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
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            {selectedSection && (
              <Button
                variant="outline"
                onClick={selectedModule ? handleBackToModules : handleBackToSections}
                className="flex items-center"
              >
                <ChevronRight className="h-4 w-4 mr-2 rotate-180" />
                Back to {selectedModule ? selectedSection.section : "Library"}
              </Button>
            )}
            <h1 className="text-3xl font-bold text-gray-900">
              {selectedModule
                ? selectedModule.title
                : selectedSection
                  ? selectedSection.section
                  : "LSAT Learning Library"}
            </h1>
          </div>
        </div>
        <p className="text-gray-600">
          {selectedModule
            ? selectedModule.description
            : selectedSection
              ? SECTION_META[selectedSection.section]?.description ??
                `Explore ${selectedSection.section.toLowerCase()} topics`
              : "Comprehensive study materials organized by LSAT section"}
        </p>
      </div>

      {/* Main Content */}
      {!selectedSection ? (
        /* Section grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {studentLibrarySections.map((section, index) => {
            const meta = SECTION_META[section.section] ?? {
              description: `Explore ${section.section}`,
              icon: FileText,
              color: "bg-gray-600 hover:bg-gray-700",
            };
            const IconComponent = meta.icon;
            const moduleCount = section.modules.reduce(
              (acc, m) => acc + m.lessons.length,
              0
            );
            return (
              <Card
                key={index}
                className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02] border border-gray-200 shadow-sm"
                onClick={() => handleSectionClick(section)}
              >
                <CardContent className="p-6">
                  <div
                    className={`w-16 h-16 ${meta.color} rounded-lg flex items-center justify-center mb-4 transition-colors`}
                  >
                    <IconComponent className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {section.section}
                  </h3>
                  <p className="text-gray-600 mb-4">{meta.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      {section.modules.length} modules · {moduleCount} lessons
                    </span>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : !selectedModule ? (
        /* Module list for selected section */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {selectedSection.modules.map((module) => (
            <Card
              key={module.id}
              className="cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-[1.01] border border-gray-200"
              onClick={() => handleModuleClick(module)}
            >
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-gray-500 mb-1">
                      {module.unit}
                    </p>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      {module.title}
                    </h4>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {module.description}
                    </p>
                    <p className="text-xs text-gray-400 mt-2">
                      {module.lessons.length} lessons
                    </p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400 flex-shrink-0 ml-2 mt-1" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        /* Lesson list for selected module */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {selectedModule.lessons.map((lesson) => (
            <Card
              key={lesson.id}
              className="cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-[1.01] border border-gray-200"
              onClick={() => handleLessonClick(lesson)}
            >
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-gray-900">{lesson.title}</h4>
                    <p className="text-xs text-gray-500 mt-1">Lesson {lesson.id}</p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400 flex-shrink-0 ml-2" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Lesson content modal */}
      <Dialog open={isModalOpen} onOpenChange={closeModal}>
        <DialogContent className="max-w-4xl max-h-[85vh]">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center">
              <Lightbulb className="h-6 w-6 mr-2 text-blue-600" />
              {selectedLesson?.title}
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[70vh] pr-4">
            <div className="space-y-1">
              {selectedLesson?.content.map((block, index) => (
                <ContentBlockRenderer key={index} block={block} />
              ))}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}
