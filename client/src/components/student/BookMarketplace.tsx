import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Search, BookOpenCheck, BookPlus, Tag, Trash2, 
  ShoppingBag, MapPin, MessageSquare, ArrowDownUp, Plus 
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

type Book = {
  id: number;
  title: string;
  author: string;
  edition: string;
  condition: string;
  originalPrice?: number;
  price: number;
  description?: string;
  subject: string;
  imageUrl?: string;
  seller: {
    id: number;
    name: string;
    location?: string;
  };
  createdAt: string;
  status: 'available' | 'sold' | 'reserved';
};

export default function BookMarketplace() {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('browse');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [bookForm, setBookForm] = useState({
    title: '',
    author: '',
    edition: '',
    condition: 'good',
    originalPrice: '',
    price: '',
    subject: '',
    description: '',
    imageUrl: ''
  });
  const [isAddBookOpen, setIsAddBookOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Sample books data that would normally come from API
  const [books, setBooks] = useState<Book[]>([
    {
      id: 1,
      title: "Calculus: Early Transcendentals",
      author: "James Stewart",
      edition: "8th Edition",
      condition: "good",
      originalPrice: 12000,
      price: 4500,
      description: "Barely used, includes all practice problem sets and solutions.",
      subject: "Mathematics",
      imageUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
      seller: {
        id: 1,
        name: "Sarah Johnson",
        location: "West Campus"
      },
      createdAt: "2023-09-10T12:00:00Z",
      status: "available"
    },
    {
      id: 2,
      title: "Physics for Scientists and Engineers",
      author: "Serway & Jewett",
      edition: "10th Edition",
      condition: "like-new",
      originalPrice: 15000,
      price: 5500,
      description: "Perfect condition, no markings or highlights. Includes access code (unused).",
      subject: "Physics",
      imageUrl: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
      seller: {
        id: 2,
        name: "Michael Chen",
        location: "East Residence Hall"
      },
      createdAt: "2023-09-08T10:30:00Z",
      status: "available"
    },
    {
      id: 3,
      title: "Introduction to Algorithms",
      author: "Cormen, Leiserson, Rivest",
      edition: "3rd Edition",
      condition: "fair",
      originalPrice: 9000,
      price: 4000,
      description: "Some highlighting in first few chapters, otherwise in good condition.",
      subject: "Computer Science",
      imageUrl: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
      seller: {
        id: 3,
        name: "Alex Williams",
        location: "Computer Science Building"
      },
      createdAt: "2023-09-05T14:20:00Z",
      status: "available"
    },
    {
      id: 4,
      title: "The Norton Anthology of English Literature",
      author: "Stephen Greenblatt",
      edition: "10th Edition",
      condition: "good",
      originalPrice: 8500,
      price: 3500,
      description: "Some dog-eared pages, but text is clean.",
      subject: "Literature",
      imageUrl: "https://images.unsplash.com/photo-1541963463532-d68292c34b19?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
      seller: {
        id: 4,
        name: "Emma Thompson",
        location: "Arts and Humanities Building"
      },
      createdAt: "2023-09-01T09:45:00Z",
      status: "available"
    },
    {
      id: 5,
      title: "Organic Chemistry",
      author: "Paula Bruice",
      edition: "8th Edition",
      condition: "good",
      originalPrice: 13000,
      price: 6000,
      description: "With solution manual and study guide.",
      subject: "Chemistry",
      imageUrl: "https://images.unsplash.com/photo-1532003885409-ed84d334f6cc?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
      seller: {
        id: 5,
        name: "Jessica Lee",
        location: "Science Building"
      },
      createdAt: "2023-08-28T16:15:00Z",
      status: "available"
    }
  ]);
  
  const [myListings, setMyListings] = useState<Book[]>([
    {
      id: 6,
      title: "Principles of Economics",
      author: "N. Gregory Mankiw",
      edition: "9th Edition",
      condition: "like-new",
      originalPrice: 11000,
      price: 5000,
      description: "Pristine condition, no markings.",
      subject: "Economics",
      imageUrl: "https://images.unsplash.com/photo-1551269901-5c5e14c25df7?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
      seller: {
        id: currentUser?.uid ? parseInt(currentUser.uid.substring(0, 5), 16) : 0,
        name: currentUser?.displayName || "You",
        location: "Business School"
      },
      createdAt: "2023-09-12T11:30:00Z",
      status: "available"
    }
  ]);

  const handleAddBook = () => {
    if (!bookForm.title || !bookForm.author || !bookForm.price) {
      toast({
        title: "Missing information",
        description: "Please fill out all required fields.",
        variant: "destructive"
      });
      return;
    }

    // Validate price
    const price = parseFloat(bookForm.price);
    if (isNaN(price) || price <= 0) {
      toast({
        title: "Invalid price",
        description: "Please enter a valid price.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    // In a real app, this would be an API call
    setTimeout(() => {
      const newBook: Book = {
        id: Date.now(),
        title: bookForm.title,
        author: bookForm.author,
        edition: bookForm.edition,
        condition: bookForm.condition,
        originalPrice: bookForm.originalPrice ? parseFloat(bookForm.originalPrice) * 100 : undefined,
        price: parseFloat(bookForm.price) * 100,
        description: bookForm.description,
        subject: bookForm.subject,
        imageUrl: bookForm.imageUrl || "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
        seller: {
          id: currentUser?.uid ? parseInt(currentUser.uid.substring(0, 5), 16) : 0,
          name: currentUser?.displayName || "You",
          location: "Campus Center"
        },
        createdAt: new Date().toISOString(),
        status: "available"
      };

      setMyListings([newBook, ...myListings]);
      setBooks([newBook, ...books]);
      
      // Reset form
      setBookForm({
        title: '',
        author: '',
        edition: '',
        condition: 'good',
        originalPrice: '',
        price: '',
        subject: '',
        description: '',
        imageUrl: ''
      });
      
      setIsAddBookOpen(false);
      setLoading(false);
      
      toast({
        title: "Book listed",
        description: "Your book has been added to the marketplace.",
      });
    }, 1000);
  };

  const handleDeleteListing = (id: number) => {
    setMyListings(myListings.filter(book => book.id !== id));
    setBooks(books.filter(book => book.id !== id));
    
    toast({
      title: "Listing removed",
      description: "Your book has been removed from the marketplace.",
    });
  };

  const handleContactSeller = (book: Book) => {
    toast({
      title: "Message sent",
      description: `Your inquiry about "${book.title}" has been sent to ${book.seller.name}.`,
    });
  };

  // Apply filters and sorting
  const filteredBooks = books.filter(book => {
    // Apply subject filter
    if (subjectFilter !== 'all' && book.subject !== subjectFilter) {
      return false;
    }
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        book.title.toLowerCase().includes(query) ||
        book.author.toLowerCase().includes(query) ||
        book.description?.toLowerCase().includes(query) ||
        book.subject.toLowerCase().includes(query)
      );
    }
    
    return true;
  });
  
  // Apply sorting
  const sortedBooks = [...filteredBooks].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'oldest':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'discount':
        const discountA = a.originalPrice ? (a.originalPrice - a.price) / a.originalPrice : 0;
        const discountB = b.originalPrice ? (b.originalPrice - b.price) / b.originalPrice : 0;
        return discountB - discountA;
      default:
        return 0;
    }
  });

  // Format price as currency
  const formatPrice = (cents: number) => {
    return `$${(cents / 100).toFixed(2)}`;
  };
  
  // Calculate discount percentage
  const calculateDiscount = (original: number | undefined, current: number) => {
    if (!original) return null;
    const discount = ((original - current) / original) * 100;
    return discount.toFixed(0) + '%';
  };
  
  // Get condition badge class
  const getConditionClass = (condition: string) => {
    switch (condition) {
      case 'new':
        return 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100';
      case 'like-new':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100';
      case 'good':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100';
      case 'fair':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-800 dark:text-orange-100';
      case 'poor':
        return 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100';
    }
  };

  return (
    <>
      <div className="md:flex md:items-center md:justify-between mb-6">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white sm:text-3xl">
            Book Marketplace
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Buy, sell, and exchange textbooks with other students
          </p>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <Button onClick={() => setIsAddBookOpen(true)}>
            <BookPlus className="h-4 w-4 mr-2" />
            List a Book
          </Button>
        </div>
      </div>

      <Tabs defaultValue="browse" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="browse" className="flex items-center">
            <BookOpenCheck className="h-4 w-4 mr-2" />
            Browse Books
          </TabsTrigger>
          <TabsTrigger value="my-listings" className="flex items-center">
            <ShoppingBag className="h-4 w-4 mr-2" />
            My Listings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="browse" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="col-span-1 md:col-span-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Input 
                      className="pl-10" 
                      placeholder="Search by title, author, subject..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Select value={subjectFilter} onValueChange={setSubjectFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Subject" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Subjects</SelectItem>
                      <SelectItem value="Mathematics">Mathematics</SelectItem>
                      <SelectItem value="Physics">Physics</SelectItem>
                      <SelectItem value="Chemistry">Chemistry</SelectItem>
                      <SelectItem value="Biology">Biology</SelectItem>
                      <SelectItem value="Computer Science">Computer Science</SelectItem>
                      <SelectItem value="Literature">Literature</SelectItem>
                      <SelectItem value="Economics">Economics</SelectItem>
                      <SelectItem value="History">History</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest</SelectItem>
                      <SelectItem value="oldest">Oldest</SelectItem>
                      <SelectItem value="price-low">Price: Low to High</SelectItem>
                      <SelectItem value="price-high">Price: High to Low</SelectItem>
                      <SelectItem value="discount">Best Discount</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {sortedBooks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sortedBooks.map(book => (
                <Card key={book.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <div className="aspect-w-4 aspect-h-3 w-full h-48 overflow-hidden">
                    <img 
                      src={book.imageUrl || "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"} 
                      alt={book.title}
                      className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-200"
                    />
                  </div>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold line-clamp-1">{book.title}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{book.author}</p>
                      </div>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getConditionClass(book.condition)}`}>
                        {book.condition.replace('-', ' ')}
                      </span>
                    </div>
                    
                    <div className="mt-2 flex items-center space-x-2">
                      <span className="text-xl font-bold text-gray-900 dark:text-white">
                        {formatPrice(book.price)}
                      </span>
                      {book.originalPrice && (
                        <>
                          <span className="text-sm text-gray-500 dark:text-gray-400 line-through">
                            {formatPrice(book.originalPrice)}
                          </span>
                          <span className="text-sm font-medium text-green-600 dark:text-green-400">
                            {calculateDiscount(book.originalPrice, book.price)} off
                          </span>
                        </>
                      )}
                    </div>
                    
                    <div className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <Tag className="h-4 w-4 mr-1" />
                      {book.subject}
                    </div>
                    
                    <div className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <MapPin className="h-4 w-4 mr-1" />
                      {book.seller.location || 'On Campus'}
                    </div>
                    
                    <div className="mt-4 flex justify-between">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex items-center"
                        onClick={() => handleContactSeller(book)}
                      >
                        <MessageSquare className="h-4 w-4 mr-1" />
                        Contact
                      </Button>
                      <p className="text-xs text-gray-500 dark:text-gray-400 self-end">
                        Posted by {book.seller.name}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <BookOpenCheck className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">No books found</h3>
                <p className="mt-2 text-gray-500 dark:text-gray-400">
                  {searchQuery ? 'Try adjusting your search or filters' : 'Be the first to list a book!'}
                </p>
                {!searchQuery && (
                  <Button className="mt-4" onClick={() => setIsAddBookOpen(true)}>
                    <BookPlus className="h-4 w-4 mr-2" />
                    List a Book
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="my-listings" className="space-y-4">
          {myListings.length > 0 ? (
            <div className="space-y-4">
              {myListings.map(book => (
                <Card key={book.id} className="overflow-hidden">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="md:col-span-1">
                      <div className="h-full w-full">
                        <img 
                          src={book.imageUrl || "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"} 
                          alt={book.title}
                          className="w-full h-40 md:h-full object-cover"
                        />
                      </div>
                    </div>
                    <div className="md:col-span-3 p-4 md:p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-semibold">{book.title}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{book.author}</p>
                        </div>
                        <div className="flex space-x-2">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getConditionClass(book.condition)}`}>
                            {book.condition.replace('-', ' ')}
                          </span>
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">
                            {book.status}
                          </span>
                        </div>
                      </div>
                      
                      <div className="mt-2 flex items-center space-x-2">
                        <span className="text-xl font-bold text-gray-900 dark:text-white">
                          {formatPrice(book.price)}
                        </span>
                        {book.originalPrice && (
                          <>
                            <span className="text-sm text-gray-500 dark:text-gray-400 line-through">
                              {formatPrice(book.originalPrice)}
                            </span>
                            <span className="text-sm font-medium text-green-600 dark:text-green-400">
                              {calculateDiscount(book.originalPrice, book.price)} off
                            </span>
                          </>
                        )}
                      </div>
                      
                      <div className="mt-2 flex flex-wrap gap-y-2 gap-x-4">
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <Tag className="h-4 w-4 mr-1" />
                          {book.subject}
                        </div>
                        
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <MapPin className="h-4 w-4 mr-1" />
                          {book.seller.location || 'On Campus'}
                        </div>
                      </div>
                      
                      {book.description && (
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                          {book.description}
                        </p>
                      )}
                      
                      <div className="mt-4 flex justify-between items-center">
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              // Edit book functionality would go here
                              toast({
                                title: "Edit mode",
                                description: "Editing functionality coming soon.",
                              });
                            }}
                          >
                            Edit
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => handleDeleteListing(book.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Remove
                          </Button>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Posted on {new Date(book.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <ShoppingBag className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">No listings yet</h3>
                <p className="mt-2 text-gray-500 dark:text-gray-400">
                  You haven't listed any books for sale yet
                </p>
                <Button className="mt-4" onClick={() => setIsAddBookOpen(true)}>
                  <BookPlus className="h-4 w-4 mr-2" />
                  List a Book
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      <Dialog open={isAddBookOpen} onOpenChange={setIsAddBookOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>List a Book</DialogTitle>
            <DialogDescription>
              Enter the details of the book you want to sell or exchange
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label htmlFor="title">Title *</Label>
                <Input 
                  id="title" 
                  placeholder="Book title" 
                  value={bookForm.title}
                  onChange={(e) => setBookForm({...bookForm, title: e.target.value})}
                />
              </div>
              <div className="col-span-2 md:col-span-1">
                <Label htmlFor="author">Author *</Label>
                <Input 
                  id="author" 
                  placeholder="Author name" 
                  value={bookForm.author}
                  onChange={(e) => setBookForm({...bookForm, author: e.target.value})}
                />
              </div>
              <div className="col-span-2 md:col-span-1">
                <Label htmlFor="edition">Edition</Label>
                <Input 
                  id="edition" 
                  placeholder="e.g. 10th Edition" 
                  value={bookForm.edition}
                  onChange={(e) => setBookForm({...bookForm, edition: e.target.value})}
                />
              </div>
              <div className="col-span-2 md:col-span-1">
                <Label htmlFor="subject">Subject</Label>
                <Select 
                  value={bookForm.subject} 
                  onValueChange={(value) => setBookForm({...bookForm, subject: value})}
                >
                  <SelectTrigger id="subject">
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Mathematics">Mathematics</SelectItem>
                    <SelectItem value="Physics">Physics</SelectItem>
                    <SelectItem value="Chemistry">Chemistry</SelectItem>
                    <SelectItem value="Biology">Biology</SelectItem>
                    <SelectItem value="Computer Science">Computer Science</SelectItem>
                    <SelectItem value="Literature">Literature</SelectItem>
                    <SelectItem value="Economics">Economics</SelectItem>
                    <SelectItem value="History">History</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2 md:col-span-1">
                <Label htmlFor="condition">Condition</Label>
                <Select 
                  value={bookForm.condition} 
                  onValueChange={(value) => setBookForm({...bookForm, condition: value})}
                >
                  <SelectTrigger id="condition">
                    <SelectValue placeholder="Select condition" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="like-new">Like New</SelectItem>
                    <SelectItem value="good">Good</SelectItem>
                    <SelectItem value="fair">Fair</SelectItem>
                    <SelectItem value="poor">Poor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2 md:col-span-1">
                <Label htmlFor="original-price">Original Price ($)</Label>
                <Input 
                  id="original-price" 
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="e.g. 120.00" 
                  value={bookForm.originalPrice}
                  onChange={(e) => setBookForm({...bookForm, originalPrice: e.target.value})}
                />
              </div>
              <div className="col-span-2 md:col-span-1">
                <Label htmlFor="price">Your Price ($) *</Label>
                <Input 
                  id="price" 
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="e.g. 45.00" 
                  value={bookForm.price}
                  onChange={(e) => setBookForm({...bookForm, price: e.target.value})}
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  placeholder="Add details about the book's condition, included materials, etc." 
                  rows={3}
                  value={bookForm.description}
                  onChange={(e) => setBookForm({...bookForm, description: e.target.value})}
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="image-url">Image URL (optional)</Label>
                <Input 
                  id="image-url" 
                  placeholder="https://example.com/book-image.jpg" 
                  value={bookForm.imageUrl}
                  onChange={(e) => setBookForm({...bookForm, imageUrl: e.target.value})}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddBookOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" onClick={handleAddBook} disabled={loading}>
              {loading ? 'Listing...' : 'List Book'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
