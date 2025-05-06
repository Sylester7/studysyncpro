import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Plus, Search, BookOpen, Paperclip, Check, Edit2, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { summarizeText, generateFlashcards } from '@/lib/gemini';

export default function Notes() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('notes');
  const [notes, setNotes] = useState([
    {
      id: 1,
      title: 'Calculus Notes - Integration by Parts',
      content: 'Integration by parts is a technique of integration where we use the formula: ∫u(x)v′(x)dx = u(x)v(x) − ∫v(x)u′(x)dx',
      subject: 'Mathematics',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      color: 'primary'
    },
    {
      id: 2,
      title: 'Physics - Quantum Mechanics Fundamentals',
      content: 'Quantum mechanics is the branch of physics relating to the very small. It describes how energy, matter, and light work at the atomic level.',
      subject: 'Physics',
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      color: 'green'
    },
    {
      id: 3,
      title: 'Literature Analysis - Modernist Poetry',
      content: 'Modernist poetry is characterized by a break with traditional verse forms and structures, free verse, fragmentation, and experimentation.',
      subject: 'Literature',
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
      color: 'accent'
    }
  ]);
  
  const [flashcards, setFlashcards] = useState([
    {
      id: 1,
      question: 'What is integration by parts?',
      answer: 'A technique of integration where we use the formula: ∫u(x)v′(x)dx = u(x)v(x) − ∫v(x)u′(x)dx',
      subject: 'Mathematics',
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
    },
    {
      id: 2,
      question: 'What is quantum mechanics?',
      answer: 'The branch of physics relating to the very small, describing how energy, matter, and light work at the atomic level.',
      subject: 'Physics',
      createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000)
    },
    {
      id: 3,
      question: 'What are characteristics of modernist poetry?',
      answer: 'Break with traditional verse forms, free verse, fragmentation, and experimentation.',
      subject: 'Literature',
      createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000)
    }
  ]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [selectedNote, setSelectedNote] = useState<number | null>(null);
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteContent, setNewNoteContent] = useState('');
  const [newNoteSubject, setNewNoteSubject] = useState('');
  const [isGeneratingFlashcards, setIsGeneratingFlashcards] = useState(false);
  const [showFlashcardAnswer, setShowFlashcardAnswer] = useState<number | null>(null);
  
  const handleAddNote = () => {
    if (!newNoteTitle.trim()) {
      toast({
        title: "Error",
        description: "Please enter a title for your note.",
        variant: "destructive"
      });
      return;
    }
    
    const newNote = {
      id: Date.now(),
      title: newNoteTitle,
      content: newNoteContent,
      subject: newNoteSubject || 'Uncategorized',
      createdAt: new Date(),
      color: 'primary'
    };
    
    setNotes([newNote, ...notes]);
    setNewNoteTitle('');
    setNewNoteContent('');
    setNewNoteSubject('');
    setIsEditing(false);
    
    toast({
      title: "Success",
      description: "Your note has been saved.",
    });
  };
  
  const handleDeleteNote = (id: number) => {
    setNotes(notes.filter(note => note.id !== id));
    toast({
      title: "Note deleted",
      description: "Your note has been deleted.",
    });
  };
  
  const handleSummarize = async (noteId: number) => {
    const note = notes.find(n => n.id === noteId);
    if (!note) return;
    
    try {
      toast({
        title: "Summarizing",
        description: "Please wait while we summarize your note...",
      });
      
      const response = await fetch('/api/summarize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: note.content }),
      });

      if (!response.ok) {
        throw new Error('Failed to summarize note');
      }

      const { summary } = await response.json();
      
      const summaryNote = {
        id: Date.now(),
        title: `Summary: ${note.title}`,
        content: summary,
        subject: note.subject,
        createdAt: new Date(),
        color: 'accent'
      };
      
      setNotes([summaryNote, ...notes]);
      
      toast({
        title: "Summary created",
        description: "Your note has been summarized successfully.",
      });
    } catch (error) {
      console.error('Error summarizing note:', error);
      toast({
        title: "Error",
        description: "Failed to summarize note. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const handleGenerateFlashcards = async (noteId: number) => {
    const note = notes.find(n => n.id === noteId);
    if (!note) return;
    
    try {
      setIsGeneratingFlashcards(true);
      toast({
        title: "Generating flashcards",
        description: "Please wait while we create flashcards from your note...",
      });
      
      // Use Gemini AI to generate flashcards from the note content
      const generatedFlashcards = await generateFlashcards(note.content, 3);
      
      const newFlashcards = generatedFlashcards.map((fc, index) => ({
        id: Date.now() + index,
        question: fc.question,
        answer: fc.answer,
        subject: note.subject,
        createdAt: new Date()
      }));
      
      setFlashcards([...newFlashcards, ...flashcards]);
      setActiveTab('flashcards');
      
      toast({
        title: "Flashcards created",
        description: `${newFlashcards.length} flashcards have been created from your note.`,
      });
    } catch (error) {
      console.error('Error generating flashcards:', error);
      toast({
        title: "Error",
        description: "Failed to generate flashcards. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingFlashcards(false);
    }
  };
  
  const formatDate = (date: Date) => {
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} ${Math.floor(diffDays / 7) === 1 ? 'week' : 'weeks'} ago`;
    return date.toLocaleDateString();
  };
  
  const getColorClass = (color: string) => {
    switch (color) {
      case 'primary':
        return 'bg-primary-100 dark:bg-primary-800 text-primary-600 dark:text-primary-300';
      case 'green':
        return 'bg-green-100 dark:bg-green-800 text-green-600 dark:text-green-300';
      case 'accent':
        return 'bg-accent-100 dark:bg-accent-800 text-accent-600 dark:text-accent-300';
      default:
        return 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300';
    }
  };
  
  const filteredNotes = notes.filter(note => 
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const filteredFlashcards = flashcards.filter(card => 
    card.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
    card.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    card.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="md:flex md:items-center md:justify-between mb-6">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white sm:text-3xl">
            Notes & Flashcards
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Organize your study materials and create flashcards automatically
          </p>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <Button onClick={() => setIsEditing(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Note
          </Button>
        </div>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input 
            className="pl-10" 
            placeholder="Search notes and flashcards..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Tabs defaultValue="notes" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="notes" className="flex items-center">
            <FileText className="h-4 w-4 mr-2" />
            Notes
          </TabsTrigger>
          <TabsTrigger value="flashcards" className="flex items-center">
            <BookOpen className="h-4 w-4 mr-2" />
            Flashcards
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="notes">
          {isEditing && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>New Note</CardTitle>
                <CardDescription>Create a new note to organize your study material</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Input 
                      placeholder="Note Title" 
                      value={newNoteTitle}
                      onChange={(e) => setNewNoteTitle(e.target.value)}
                    />
                  </div>
                  <div>
                    <Input 
                      placeholder="Subject (optional)" 
                      value={newNoteSubject}
                      onChange={(e) => setNewNoteSubject(e.target.value)}
                    />
                  </div>
                  <div>
                    <Textarea 
                      placeholder="Write your note content here..." 
                      rows={5}
                      value={newNoteContent}
                      onChange={(e) => setNewNoteContent(e.target.value)}
                    />
                  </div>
                  <div className="flex space-x-2">
                    <Button onClick={handleAddNote}>Save Note</Button>
                    <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredNotes.length > 0 ? (
              filteredNotes.map(note => (
                <Card key={note.id} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div className={`flex-shrink-0 h-10 w-10 rounded-lg ${getColorClass(note.color)} flex items-center justify-center`}>
                        <FileText className="h-5 w-5" />
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleGenerateFlashcards(note.id)}
                          disabled={isGeneratingFlashcards}
                        >
                          <BookOpen className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleSummarize(note.id)}
                        >
                          <FileText className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleDeleteNote(note.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                    <CardTitle className="mt-2">{note.title}</CardTitle>
                    <div className="flex space-x-2 text-sm text-gray-500 dark:text-gray-400">
                      <span>{note.subject}</span>
                      <span>•</span>
                      <span>Updated {formatDate(note.createdAt)}</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3">
                      {note.content}
                    </p>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center p-8 text-center">
                <div className="h-16 w-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
                  <FileText className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">No notes found</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {searchTerm ? 'Try adjusting your search term' : 'Start by creating your first note'}
                </p>
                {!searchTerm && (
                  <Button className="mt-4" onClick={() => setIsEditing(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Note
                  </Button>
                )}
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="flashcards">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredFlashcards.length > 0 ? (
              filteredFlashcards.map(card => (
                <Card key={card.id} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-primary-100 dark:bg-primary-800 text-primary-600 dark:text-primary-300 flex items-center justify-center">
                        <BookOpen className="h-5 w-5" />
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        <span>{card.subject}</span>
                        <span className="mx-2">•</span>
                        <span>Created {formatDate(card.createdAt)}</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">Question:</h3>
                        <p className="mt-1 text-gray-600 dark:text-gray-300">{card.question}</p>
                      </div>
                      
                      {showFlashcardAnswer === card.id ? (
                        <div>
                          <h3 className="font-medium text-gray-900 dark:text-white">Answer:</h3>
                          <p className="mt-1 text-gray-600 dark:text-gray-300">{card.answer}</p>
                          <Button
                            variant="outline"
                            className="mt-2 w-full"
                            onClick={() => setShowFlashcardAnswer(null)}
                          >
                            Hide Answer
                          </Button>
                        </div>
                      ) : (
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() => setShowFlashcardAnswer(card.id)}
                        >
                          Show Answer
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center p-8 text-center">
                <div className="h-16 w-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
                  <BookOpen className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">No flashcards found</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {searchTerm 
                    ? 'Try adjusting your search term' 
                    : 'Generate flashcards from your notes to study more effectively'}
                </p>
                {!searchTerm && (
                  <Button 
                    className="mt-4" 
                    onClick={() => setActiveTab('notes')}
                  >
                    Go to Notes
                  </Button>
                )}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </>
  );
}
