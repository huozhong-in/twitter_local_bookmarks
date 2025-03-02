import fs from 'fs';
import path from 'path';
import Database from 'better-sqlite3';

interface Media {
  type: string;
  url: string;
  thumbnail?: string;
  original?: string;
}

interface TwitterBookmark {
  id: string;
  created_at: string;
  full_text: string;
  media: Media[];
  screen_name: string;
  name: string;
  profile_image_url: string;
  in_reply_to: any;
  retweeted_status: any;
  quoted_status: any;
  favorite_count: number;
  retweet_count: number;
  bookmark_count: number;
  quote_count: number;
  reply_count: number;
  views_count: number | null;
  favorited: boolean;
  retweeted: boolean;
  bookmarked: boolean;
  url: string;
}

async function importBookmarks() {
  try {
    // Read the JSON file
    const filePath = path.resolve('./twitter-书签-1739844785372.json');
    const jsonData = fs.readFileSync(filePath, 'utf8');
    const bookmarks: TwitterBookmark[] = JSON.parse(jsonData);

    // Connect to the SQLite database
    const db = new Database('/Users/dio/workspace/claude/mcp_01/sqlite_mcp_server.db');
    
    // Begin a transaction for better performance
    const transaction = db.transaction((bookmarks: TwitterBookmark[]) => {
      const stmt = db.prepare(`
        INSERT OR REPLACE INTO twitter_bookmarks (
          id, created_at, full_text, media, screen_name, name, profile_image_url,
          in_reply_to, retweeted_status, quoted_status, favorite_count, retweet_count,
          bookmark_count, quote_count, reply_count, views_count, favorited, retweeted,
          bookmarked, url
        ) VALUES (
          @id, @created_at, @full_text, @media, @screen_name, @name, @profile_image_url,
          @in_reply_to, @retweeted_status, @quoted_status, @favorite_count, @retweet_count,
          @bookmark_count, @quote_count, @reply_count, @views_count, @favorited, @retweeted,
          @bookmarked, @url
        )
      `);

      for (const bookmark of bookmarks) {
        stmt.run({
          id: bookmark.id,
          created_at: bookmark.created_at,
          full_text: bookmark.full_text,
          media: JSON.stringify(bookmark.media),
          screen_name: bookmark.screen_name,
          name: bookmark.name,
          profile_image_url: bookmark.profile_image_url,
          in_reply_to: JSON.stringify(bookmark.in_reply_to),
          retweeted_status: JSON.stringify(bookmark.retweeted_status),
          quoted_status: JSON.stringify(bookmark.quoted_status),
          favorite_count: bookmark.favorite_count,
          retweet_count: bookmark.retweet_count,
          bookmark_count: bookmark.bookmark_count,
          quote_count: bookmark.quote_count,
          reply_count: bookmark.reply_count,
          views_count: bookmark.views_count,
          favorited: bookmark.favorited ? 1 : 0,
          retweeted: bookmark.retweeted ? 1 : 0,
          bookmarked: bookmark.bookmarked ? 1 : 0,
          url: bookmark.url
        });
      }
    });

    // Execute the transaction
    transaction(bookmarks);
    
    console.log(`Successfully imported ${bookmarks.length} bookmarks into the database.`);
    
    // Close the database connection
    db.close();
    
  } catch (error) {
    console.error('Error importing bookmarks:', error);
  }
}

// Run the import function
importBookmarks();
