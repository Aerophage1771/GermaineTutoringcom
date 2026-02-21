import { useState, type ComponentType } from "react";
import { useAuthRedirect } from "@/hooks/use-auth-redirect";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronRight, ArrowLeft, Lightbulb } from "lucide-react";
import type { SectionData, LibraryModule, LessonStub } from "@/types/studentLibrary";
import {
  SECTION_LIST,
  loadSectionData,
  type SectionKey,
} from "@/data/studentLibrary/sections";
import { SECTION_COUNTS } from "@/data/studentLibrary/manifest";

export default function LearningLibrary() {
  const { user, isLoading } = useAuthRedirect();
  const [, setLocation] = useLocation();
  const [selectedSectionKey, setSelectedSectionKey] = useState<SectionKey | null>(null);
  const [selectedSection, setSelectedSection] = useState<SectionData | null>(null);
  const [selectedModule, setSelectedModule] = useState<LibraryModule | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<LessonStub | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sectionLoadingKey, setSectionLoadingKey] = useState<SectionKey | null>(null);
  const [sectionLoadError, setSectionLoadError] = useState<string | null>(null);
  const [LessonComponent, setLessonComponent] = useState<ComponentType | null>(null);
  const [lessonLoadError, setLessonLoadError] = useState<string | null>(null);
  const [lessonLoading, setLessonLoading] = useState(false);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const handleSectionClick = async (meta: (typeof SECTION_LIST)[number]) => {
    setSectionLoadError(null);
    setSectionLoadingKey(meta.key);
    try {
      const data = await loadSectionData(meta.key);
      setSelectedSectionKey(meta.key);
      setSelectedSection(data);
      setSelectedModule(null);
      setSelectedLesson(null);
    } catch (err) {
      setSectionLoadError(err instanceof Error ? err.message : "Failed to load section");
    } finally {
      setSectionLoadingKey(null);
    }
  };

  const handleModuleClick = (module: LibraryModule) => {
    setSelectedModule(module);
    setSelectedLesson(null);
  };

  const handleLessonClick = (lesson: LessonStub) => {
    setSelectedLesson(lesson);
    setLessonLoadError(null);
    setLessonComponent(null);
    setIsModalOpen(true);
    if (!selectedSectionKey) return;
    setLessonLoading(true);
    import(
      `@/data/studentLibrary/lessons/${selectedSectionKey}/${lesson.id}.tsx`
    )
      .then((m) => {
        setLessonComponent(() => m.default);
      })
      .catch((err) => {
        setLessonLoadError(err?.message ?? "Lesson failed to load");
      })
      .finally(() => {
        setLessonLoading(false);
      });
  };

  const handleBackToSections = () => {
    setSelectedSectionKey(null);
    setSelectedSection(null);
    setSelectedModule(null);
    setSelectedLesson(null);
    setSectionLoadError(null);
  };

  const handleBackToModules = () => {
    setSelectedModule(null);
    setSelectedLesson(null);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedLesson(null);
    setLessonComponent(null);
    setLessonLoadError(null);
  };

  return (
    <main id="main-content" tabIndex={-1} className="min-h-screen bg-gray-50 p-6">
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
              ? SECTION_LIST.find((m) => m.title === selectedSection.section)
                  ?.description ?? `Explore ${selectedSection.section.toLowerCase()} topics`
              : "Comprehensive study materials organized by LSAT section"}
        </p>
        {sectionLoadError && (
          <p className="mt-2 text-sm text-red-600" role="alert">
            {sectionLoadError}
          </p>
        )}
      </div>

      {/* Main Content */}
      {!selectedSection ? (
        /* Section grid: metadata only, no content loaded */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SECTION_LIST.map((meta) => {
            const IconComponent = meta.icon;
            const counts = SECTION_COUNTS[meta.key];
            const isLoadingThis = sectionLoadingKey === meta.key;
            return (
              <Card
                key={meta.key}
                className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02] border border-gray-200 shadow-sm"
                onClick={() => handleSectionClick(meta)}
              >
                <CardContent className="p-6">
                  <div
                    className={`w-16 h-16 ${meta.color} rounded-lg flex items-center justify-center mb-4 transition-colors`}
                  >
                    {isLoadingThis ? (
                      <div className="h-8 w-8 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    ) : (
                      <IconComponent className="h-8 w-8 text-white" />
                    )}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {meta.title}
                  </h3>
                  <p className="text-gray-600 mb-4">{meta.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      {counts
                        ? `${counts.modules} modules · ${counts.lessons} lessons`
                        : "—"}
                    </span>
                    {!isLoadingThis && (
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    )}
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

      {/* Lesson content modal: lazy-loaded .tsx component per lesson */}
      <Dialog open={isModalOpen} onOpenChange={closeModal}>
        <DialogContent className="max-w-4xl max-h-[85vh]">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center">
              <Lightbulb className="h-6 w-6 mr-2 text-blue-600" />
              {selectedLesson?.title}
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[70vh] pr-4">
            {lessonLoadError && (
              <p className="text-sm text-red-600" role="alert">
                {lessonLoadError}
              </p>
            )}
            {lessonLoading && (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-10 w-10 border-2 border-blue-600 border-t-transparent" />
              </div>
            )}
            {!lessonLoading && !lessonLoadError && LessonComponent && (
              <LessonComponent />
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </main>
  );
}
