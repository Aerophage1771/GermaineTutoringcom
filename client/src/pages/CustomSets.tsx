import { useState } from "react";
import { useAuthRedirect } from "@/hooks/use-auth-redirect";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { MainNavigation } from "@/components/MainNavigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { 
  Plus,
  Settings,
  BookOpen,
  Calendar,
  Filter,
  Star,
  Clock,
  Target,
  Users
} from "lucide-react";

interface CustomSet {
  id: number;
  name: string;
  description: string;
  questionCount: number;
  difficulty: string;
  section: string;
  createdDate: string;
  lastUsed: string;
  averageScore?: number;
}

export default function CustomSets() {
  const { user, isLoading } = useAuthRedirect();
  const [setName, setSetName] = useState("");
  const [setDescription, setSetDescription] = useState("");
  
  // Creation filters
  const [creationFilters, setCreationFilters] = useState({
    section: 'all',
    questionType: 'all',
    difficulty: 'all',
    questionCount: 20,
    ptRange: { min: '', max: '' },
    skills: []
  });

  // Mock existing sets data
  const existingSets: CustomSet[] = [
    {
      id: 1,
      name: "Assumption Questions - Practice Set 1",
      description: "20 assumption questions from PT 101-110",
      questionCount: 20,
      difficulty: "Mixed",
      section: "Logical Reasoning",
      createdDate: "2025-07-15",
      lastUsed: "2025-07-18",
      averageScore: 85
    },
    {
      id: 2,
      name: "RC Science Passages",
      description: "Challenging reading comprehension passages from science topics",
      questionCount: 15,
      difficulty: "Hard",
      section: "Reading Comprehension",
      createdDate: "2025-07-10",
      lastUsed: "2025-07-16",
      averageScore: 78
    },
    {
      id: 3,
      name: "Strengthen/Weaken Review",
      description: "Mixed strengthen and weaken questions for comprehensive review",
      questionCount: 30,
      difficulty: "Medium",
      section: "Logical Reasoning",
      createdDate: "2025-07-08",
      lastUsed: "2025-07-14",
      averageScore: 92
    }
  ];

  // Show loading spinner while checking authentication
  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const createSet = () => {
    console.log('Creating set:', {
      name: setName,
      description: setDescription,
      filters: creationFilters
    });
    // Implementation would create the set
  };

  const startPracticeSet = (setId: number) => {
    console.log('Starting practice with set:', setId);
    // Implementation would start practice session
  };

  return (
    <>
      <MainNavigation showBackButton />
      
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Custom Sets</h1>
            <p className="text-gray-600 text-lg">
              Create targeted question sets and manage your custom practice collections.
            </p>
          </div>

          <Tabs defaultValue="create-sets" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="create-sets">Create Sets</TabsTrigger>
              <TabsTrigger value="browse-sets">Browse Previous Sets</TabsTrigger>
            </TabsList>

            {/* Create Sets Tab */}
            <TabsContent value="create-sets" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="h-5 w-5" />
                    Create New Question Set
                  </CardTitle>
                  <p className="text-sm text-gray-600">
                    Design a custom question set with specific criteria and filters.
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Set Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="setName">Set Name</Label>
                      <Input
                        id="setName"
                        placeholder="e.g., Assumption Practice Set 1"
                        value={setName}
                        onChange={(e) => setSetName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="questionCount">Number of Questions</Label>
                      <Select
                        value={creationFilters.questionCount.toString()}
                        onValueChange={(value) => setCreationFilters(prev => ({
                          ...prev,
                          questionCount: parseInt(value)
                        }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="10">10 Questions</SelectItem>
                          <SelectItem value="15">15 Questions</SelectItem>
                          <SelectItem value="20">20 Questions</SelectItem>
                          <SelectItem value="25">25 Questions</SelectItem>
                          <SelectItem value="30">30 Questions</SelectItem>
                          <SelectItem value="50">50 Questions</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="setDescription">Description (Optional)</Label>
                    <Textarea
                      id="setDescription"
                      placeholder="Describe the purpose or focus of this question set..."
                      value={setDescription}
                      onChange={(e) => setSetDescription(e.target.value)}
                    />
                  </div>

                  {/* Selection Criteria */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <Filter className="h-5 w-5" />
                      Selection Criteria
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>Section</Label>
                        <Select 
                          value={creationFilters.section} 
                          onValueChange={(value) => setCreationFilters(prev => ({
                            ...prev, 
                            section: value
                          }))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Sections</SelectItem>
                            <SelectItem value="lr">Logical Reasoning</SelectItem>
                            <SelectItem value="rc">Reading Comprehension</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Question Type</Label>
                        <Select 
                          value={creationFilters.questionType} 
                          onValueChange={(value) => setCreationFilters(prev => ({
                            ...prev, 
                            questionType: value
                          }))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Types</SelectItem>
                            <SelectItem value="assumption">Assumption</SelectItem>
                            <SelectItem value="strengthen">Strengthen</SelectItem>
                            <SelectItem value="weaken">Weaken</SelectItem>
                            <SelectItem value="inference">Inference</SelectItem>
                            <SelectItem value="flaw">Flaw</SelectItem>
                            <SelectItem value="parallel">Parallel Reasoning</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Difficulty</Label>
                        <Select 
                          value={creationFilters.difficulty} 
                          onValueChange={(value) => setCreationFilters(prev => ({
                            ...prev, 
                            difficulty: value
                          }))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Levels</SelectItem>
                            <SelectItem value="1-2">Easy (1-2)</SelectItem>
                            <SelectItem value="3">Medium (3)</SelectItem>
                            <SelectItem value="4-5">Hard (4-5)</SelectItem>
                            <SelectItem value="mixed">Mixed</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* PT Range */}
                    <div className="space-y-2">
                      <Label>Practice Test Range (Optional)</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          placeholder="Min PT"
                          value={creationFilters.ptRange.min}
                          onChange={(e) => setCreationFilters(prev => ({
                            ...prev,
                            ptRange: { ...prev.ptRange, min: e.target.value }
                          }))}
                          className="w-24"
                        />
                        <span className="text-gray-500">to</span>
                        <Input
                          placeholder="Max PT"
                          value={creationFilters.ptRange.max}
                          onChange={(e) => setCreationFilters(prev => ({
                            ...prev,
                            ptRange: { ...prev.ptRange, max: e.target.value }
                          }))}
                          className="w-24"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button 
                      onClick={createSet} 
                      className="bg-blue-600 hover:bg-blue-700"
                      disabled={!setName.trim()}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Create Question Set
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Browse Previous Sets Tab */}
            <TabsContent value="browse-sets" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Your Custom Sets
                  </CardTitle>
                  <p className="text-sm text-gray-600">
                    Access and manage your previously created question sets.
                  </p>
                </CardHeader>
                <CardContent>
                  {existingSets.length > 0 ? (
                    <div className="grid gap-4">
                      {existingSets.map((set) => (
                        <Card key={set.id} className="border-2 hover:border-blue-300 transition-colors">
                          <CardContent className="p-6">
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex-1">
                                <h3 className="font-bold text-lg mb-2">{set.name}</h3>
                                <p className="text-gray-600 text-sm mb-3">{set.description}</p>
                                
                                <div className="flex flex-wrap gap-3 text-sm">
                                  <div className="flex items-center gap-1">
                                    <Target className="h-4 w-4 text-gray-500" />
                                    <span>{set.questionCount} questions</span>
                                  </div>
                                  
                                  <Badge variant="outline">{set.section}</Badge>
                                  <Badge variant={
                                    set.difficulty === 'Hard' ? 'destructive' :
                                    set.difficulty === 'Medium' ? 'default' : 'secondary'
                                  }>
                                    {set.difficulty}
                                  </Badge>
                                  
                                  {set.averageScore && (
                                    <div className="flex items-center gap-1">
                                      <Star className="h-4 w-4 text-yellow-500" />
                                      <span>{set.averageScore}% avg</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                              
                              <div className="flex flex-col gap-2 ml-4">
                                <Button 
                                  size="sm"
                                  onClick={() => startPracticeSet(set.id)}
                                  className="bg-blue-600 hover:bg-blue-700"
                                >
                                  Practice
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                >
                                  <Settings className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-4 text-xs text-gray-500 border-t pt-3">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                <span>Created {new Date(set.createdDate).toLocaleDateString()}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                <span>Last used {new Date(set.lastUsed).toLocaleDateString()}</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-600 mb-2">No Custom Sets Yet</h3>
                      <p className="text-gray-500 mb-4">
                        Create your first custom question set to get started with targeted practice.
                      </p>
                      <Button variant="outline">
                        <Plus className="h-4 w-4 mr-2" />
                        Create Your First Set
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}