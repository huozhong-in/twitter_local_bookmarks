import React, { useState, ReactNode, Fragment, useEffect, useRef } from "react";
import { json } from "@remix-run/node";
import { useLoaderData, useSearchParams } from "@remix-run/react";
import path from "path";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter 
} from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";
import { Avatar, AvatarImage, AvatarFallback } from "~/components/ui/avatar";

interface Media {
  type: string;
  url: string;
  thumbnail: string;
  original: string;
}

interface SearchResult {
  id?: string;
  full_text?: string;
  screen_name?: string;
  name?: string;
  profile_image_url?: string;
  url?: string;
  created_at?: string;
  media?: Media | Media[];
}

// Helper function to decode HTML entities
function decodeHTMLEntities(text: string): string {
  // Server-safe implementation that doesn't rely on document
  if (!text) return '';
  
  // Replace common HTML entities with their character equivalents
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&#x2F;/g, '/')
    .replace(/&nbsp;/g, ' ');
}

// Media Lightbox component for displaying enlarged media
function MediaLightbox({ 
  media, 
  tweetId,
  onClose 
}: { 
  media: Media, 
  tweetId?: string,
  onClose: () => void 
}) {
  const modalRef = useRef<HTMLDivElement>(null);
  
  // Close when clicking outside the content
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === modalRef.current) {
      onClose();
    }
  };
  
  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);
  
  return (
    <div 
      ref={modalRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80"
      onClick={handleBackdropClick}
    >
      <div className="relative max-w-[90vw] max-h-[90vh]">
        <button 
          onClick={onClose}
          className="absolute -top-10 right-0 text-white hover:text-gray-300"
          aria-label="Close"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        {media.type === "photo" && (
          <img 
            src={media.original} 
            alt="Enlarged photo" 
            className="max-w-full max-h-[85vh] object-contain"
          />
        )}
        
        {(media.type === "video" || media.type === "animated_gif") && tweetId && (
          <div className="relative">
            <img 
              src={media.thumbnail} 
              alt={`${media.type} thumbnail`}
              className="max-w-full max-h-[85vh]"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <a 
                href={`https://x.com/i/status/${tweetId}`}
                target="_blank"
                rel="noopener noreferrer" 
                className="bg-black bg-opacity-70 text-white px-4 py-2 rounded-full flex items-center gap-2 hover:bg-opacity-90 transition-all"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                View on Twitter
              </a>
            </div>
            <div className="mt-2 text-center text-sm text-gray-300">
              <p>Click to view the original tweet with this {media.type === "video" ? "video" : "GIF"}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Media renderer component
function MediaRenderer({ media, tweetId }: { media: Media | Media[], tweetId?: string }) {
  const [enlargedMedia, setEnlargedMedia] = useState<Media | null>(null);
  
  if (!media) return null;
  
  // Convert to array if it's a single object
  const mediaArray = Array.isArray(media) ? media : [media];
  
  if (mediaArray.length === 0) return null;
  
  const handleMediaClick = (item: Media, e: React.MouseEvent) => {
    e.preventDefault();
    setEnlargedMedia(item);
  };
  
  // For videos and GIFs, open the original tweet directly
  const handleVideoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (tweetId) {
      window.open(`https://x.com/i/status/${tweetId}`, '_blank');
    }
  };
  
  return (
    <>
      <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3">
        {mediaArray.map((item, index) => {
          const key = `media-${tweetId || ""}-${index}`;
          
          // Common wrapper for photos
          const photoWrapper = (content: ReactNode) => (
            <div key={key} className="relative overflow-hidden rounded-lg cursor-pointer">
              <div 
                onClick={(e) => handleMediaClick(item, e)}
                className="block"
              >
                {content}
              </div>
            </div>
          );
          
          // Common wrapper for videos and GIFs
          const videoWrapper = (content: ReactNode) => (
            <div key={key} className="relative overflow-hidden rounded-lg cursor-pointer">
              <div 
                onClick={handleVideoClick}
                className="block"
              >
                {content}
              </div>
            </div>
          );
          
          if (item.type === "photo") {
            return photoWrapper(
              <img 
                src={item.thumbnail || item.original} 
                alt="Photo content"
                className="w-full h-auto object-cover transition-transform duration-200 hover:scale-105"
                loading="lazy"
              />
            );
          } 
          else if (item.type === "video") {
            return videoWrapper(
              <div className="relative">
                <img 
                  src={item.thumbnail} 
                  alt="Video thumbnail"
                  className="w-full h-auto object-cover transition-transform duration-200 hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-black bg-opacity-50 rounded-full p-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs font-bold px-2 py-1 rounded">
                  Open on Twitter
                </div>
              </div>
            );
          } 
          else if (item.type === "animated_gif") {
            return videoWrapper(
              <div className="relative">
                <img 
                  src={item.thumbnail} 
                  alt="GIF thumbnail"
                  className="w-full h-auto object-cover transition-transform duration-200 hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white text-xs font-bold px-2 py-1 rounded">
                  GIF
                </div>
                <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs font-bold px-2 py-1 rounded">
                  Open on Twitter
                </div>
              </div>
            );
          }
          
          return null;
        })}
      </div>
      
      {enlargedMedia && (
        <MediaLightbox 
          media={enlargedMedia}
          tweetId={tweetId}
          onClose={() => setEnlargedMedia(null)} 
        />
      )}
    </>
  );
}

// Helper function to render text with clickable links and proper line breaks
function renderTextWithLinks(text: string): ReactNode {
  if (!text) return text;
  
  // Decode HTML entities (like -&gt; to >)
  text = decodeHTMLEntities(text);
  
  // Regular expression to match URLs
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  
  // Split the text by newlines first
  const lines = text.split('\n');
  
  // Process each line separately
  return lines.map((line, lineIndex) => {
    // Find all URL matches with their positions
    const matches: Array<{
      url: string;
      index: number;
    }> = [];
    
    let match;
    const urlRegexClone = new RegExp(urlRegex);
    while ((match = urlRegexClone.exec(line)) !== null) {
      matches.push({
        url: match[0],
        index: match.index
      });
    }
    
    // If no URLs found in this line, return the line text
    if (matches.length === 0) {
      return (
        <Fragment key={`line-${lineIndex}`}>
          {line}
          {lineIndex < lines.length - 1 && <br />}
        </Fragment>
      );
    }
    
    // Build result with text and link components for this line
    const lineResult: ReactNode[] = [];
    let lastIndex = 0;
    
    matches.forEach((match, i) => {
      // Add text before the URL
      if (match.index > lastIndex) {
        lineResult.push(
          <Fragment key={`text-${lineIndex}-${i}`}>
            {line.substring(lastIndex, match.index)}
          </Fragment>
        );
      }
      
      // Add the URL as a link
      lineResult.push(
        <a 
          key={`link-${lineIndex}-${i}`} 
          href={match.url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-blue-500 hover:underline"
        >
          {match.url}
        </a>
      );
      
      lastIndex = match.index + match.url.length;
    });
    
    // Add any remaining text after the last URL
    if (lastIndex < line.length) {
      lineResult.push(
        <Fragment key={`text-end-${lineIndex}`}>
          {line.substring(lastIndex)}
        </Fragment>
      );
    }
    
    // Add a line break after each line except the last one
    return (
      <Fragment key={`line-${lineIndex}`}>
        {lineResult}
        {lineIndex < lines.length - 1 && <br />}
      </Fragment>
    );
  });
}

export function InputWithButton({ onSearch }: { onSearch: (query: string) => void }) {
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    if (query.trim()) {
      onSearch(query);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };

  return (
    <div className="flex w-full items-center space-x-2">
      <Input 
        placeholder="Type your query here." 
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <Button onClick={handleSearch}>Search</Button>
    </div>
  );
}

// Server-side loader function
export async function loader({ request }: { request: Request }) {
  const url = new URL(request.url);
  const query = url.searchParams.get("q") || "";
  
  if (!query.trim()) {
    return json({ results: [], error: null });
  }
  
  try {
    // Connect to the SQLite database
    const dbPath = path.resolve("./sqlite.db");
    
    // Import the createRequire function to use require in ESM
    const { createRequire } = await import('module');
    const require = createRequire(import.meta.url);
    
    // Now we can use require to import better-sqlite3
    const Database = require('better-sqlite3');
    const db = Database(dbPath);
    
    // Load the libsimple extension
    const extPath = path.resolve("./lib");
    const platform = process.platform;
    if (platform === 'win32') {
      db.loadExtension(path.join(extPath, "simple"));
    } else {
      db.loadExtension(path.join(extPath, "libsimple"));
    }
    
    // Set the jieba dictionary path
    const dictPath = path.join(extPath, "dict");
    db.prepare("SELECT jieba_dict(?)").run(dictPath);
    
    // Create a virtual table for full-text search if it doesn't exist
    db.exec(`
      CREATE VIRTUAL TABLE IF NOT EXISTS twitter_bookmarks_fts 
      USING fts5(id, full_text, screen_name, name, tokenize = 'simple');
    `);
    
    // Check if the FTS table is populated
    const ftsCount = db.prepare("SELECT COUNT(*) as count FROM twitter_bookmarks_fts").get();
    
    // If FTS table is empty, populate it from the main table
    if (ftsCount.count === 0) {
      db.exec(`
        INSERT INTO twitter_bookmarks_fts(id, full_text, screen_name, name)
        SELECT id, full_text, screen_name, name FROM twitter_bookmarks;
      `);
    }
    
    // Perform the search using simple_query
    const searchResults = db.prepare(`
      SELECT tb.*
      FROM twitter_bookmarks_fts fts
      JOIN twitter_bookmarks tb ON fts.id = tb.id
      WHERE fts.full_text MATCH simple_query(?)
      ORDER BY tb.created_at DESC
      LIMIT 100
    `).all(query);
    
    // Process the results to parse JSON fields
    const processedResults = searchResults.map((result: any) => {
      // Parse JSON strings back to objects
      return {
        ...result,
        media: result.media ? JSON.parse(result.media) : null,
        in_reply_to: result.in_reply_to ? JSON.parse(result.in_reply_to) : null,
        retweeted_status: result.retweeted_status ? JSON.parse(result.retweeted_status) : null,
        quoted_status: result.quoted_status ? JSON.parse(result.quoted_status) : null,
        // Convert numeric boolean values back to booleans
        favorited: Boolean(result.favorited),
        retweeted: Boolean(result.retweeted),
        bookmarked: Boolean(result.bookmarked)
      };
    });
    
    // Close the database connection
    db.close();
    
    return json({ results: processedResults, error: null });
  } catch (error) {
    console.error("Search error:", error);
    return json({ 
      results: [], 
      error: error instanceof Error ? error.message : "An unknown error occurred" 
    });
  }
}

export default function Index() {
  const { results, error } = useLoaderData<{ results: SearchResult[], error: string | null }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>(results || []);
  
  // Get the current query from URL search params
  const currentQuery = searchParams.get("q") || "";

  const handleSearch = async (query: string) => {
    if (!query.trim()) return;
    
    setIsLoading(true);
    
    // Update the URL with the search query
    setSearchParams({ q: query });
    
    // The actual search will be performed by the loader when the URL changes
    // This is just to show loading state until the page refreshes
    
    // Reset loading state after a short delay (simulating page transition)
    setTimeout(() => {
      setIsLoading(false);
    }, 300);
  };

  // Get initials from name for avatar
  const getInitials = (name: string = ""): string => {
    return name
      .split(" ")
      .map(part => part.charAt(0))
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  // Update local state when loader data changes
  useEffect(() => {
    setSearchResults(results || []);
  }, [results]);

  return (
    <div className="flex min-h-screen flex-col items-center p-4 md:p-8 bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center gap-8 w-full max-w-4xl">
        <Card className="w-full bg-white dark:bg-gray-800 shadow-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              Twitter Local Bookmarks Search
            </CardTitle>
            <div className="h-[100px] w-[180px] mx-auto">
              <img
                src="/twitter-x.png"
                alt="Remix"
                className="block w-full dark:hidden"
              />
            </div>
          </CardHeader>
          <CardContent>
            <InputWithButton onSearch={handleSearch} />
          </CardContent>
        </Card>
        
        {isLoading && (
          <Card className="w-full p-6 text-center">
            <div className="flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-t-blue-500 border-gray-200 rounded-full animate-spin"></div>
              <span className="ml-2">Loading results...</span>
            </div>
          </Card>
        )}
        
        {error && (
          <Card className="w-full border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800">
            <CardContent className="py-4">
              <p className="text-red-500 dark:text-red-300 font-medium">Error: {error}</p>
            </CardContent>
          </Card>
        )}
        
        {!isLoading && !error && searchResults.length > 0 && (
          <div className="w-full">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                Search Results
              </h2>
              <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">
                {searchResults.length} found
              </span>
            </div>
            <div className="space-y-4">
              {searchResults.map((result, index) => (
                <Card 
                  key={result.id || index} 
                  className="w-full overflow-hidden transition-all duration-200 hover:shadow-lg"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center space-x-3">
                      {result.profile_image_url ? (
                        <div className="h-10 w-10 border-2 border-blue-100 dark:border-gray-700 rounded-full overflow-hidden">
                          <img 
                            src={result.profile_image_url.replace('_normal', '')} 
                            alt={result.name || "User avatar"}
                            className="h-full w-full object-cover"
                            referrerPolicy="no-referrer"
                            crossOrigin="anonymous"
                            onError={(e) => {
                              // If image fails to load, replace with initials
                              const target = e.currentTarget;
                              const parent = target.parentElement;
                              if (parent) {
                                // Create a div with initials
                                const fallback = document.createElement('div');
                                fallback.className = "flex h-full w-full items-center justify-center rounded-full bg-primary text-primary-foreground";
                                fallback.textContent = getInitials(result.name);
                                
                                // Replace the img with the fallback
                                parent.innerHTML = '';
                                parent.appendChild(fallback);
                              }
                            }}
                          />
                        </div>
                      ) : (
                        <Avatar 
                          className="h-10 w-10 border-2 border-blue-100 dark:border-gray-700" 
                          initials={getInitials(result.name)}
                        />
                      )}
                      <div>
                        <CardTitle className="text-base font-semibold text-gray-900 dark:text-gray-100">
                          <a 
                            href={`https://x.com/${result.screen_name}`}
                            target="_blank" 
                            rel="noopener noreferrer"
                          >{result.name}
                          </a>
                        </CardTitle>
                        <CardDescription className="text-sm text-gray-500 dark:text-gray-400">
                          <a 
                            href={`https://x.com/${result.screen_name}`}
                            target="_blank" 
                            rel="noopener noreferrer"
                          >
                          @{result.screen_name}
                          </a>
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <Separator />
                  <CardContent className="pt-4 text-gray-700 dark:text-gray-300 text-sm md:text-base leading-relaxed">
                    {renderTextWithLinks(result.full_text || '')}
                    {result.media && <MediaRenderer media={result.media} tweetId={result.id} />}
                  </CardContent>
                  <CardFooter className="text-xs text-gray-500 dark:text-gray-400 pt-2">
                    <div className="flex flex-wrap justify-between w-full">
                      <div className="flex space-x-4 mb-1">
                        <span>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Bookmarked
                        </span>
                        {result.created_at && (
                          <span>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline mr-1" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                            </svg>
                            {new Date(result.created_at).toLocaleDateString(undefined, {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </span>
                        )}
                      </div>
                      {result.url && (
                        <a 
                          href={result.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline flex items-center"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
                          </svg>
                          View on Twitter
                        </a>
                      )}
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        )}
        
        {!isLoading && !error && searchResults.length === 0 && (
          <Card className="w-full text-center p-8">
            <CardContent>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="mt-4 text-gray-500 dark:text-gray-400">No results found. Try a different search term.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
