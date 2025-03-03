import { jsx, jsxs, Fragment as Fragment$1 } from "react/jsx-runtime";
import { PassThrough } from "node:stream";
import { createReadableStreamFromReadable } from "@remix-run/node";
import { RemixServer, Outlet, Meta, Links, ScrollRestoration, Scripts, useLoaderData, useActionData, useSearchParams, useSubmit, Form } from "@remix-run/react";
import { isbot } from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import * as React from "react";
import { useState, useRef, useEffect, Fragment } from "react";
import path from "path";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
const ABORT_DELAY = 5e3;
function handleRequest(request, responseStatusCode, responseHeaders, remixContext, loadContext) {
  return isbot(request.headers.get("user-agent") || "") ? handleBotRequest(
    request,
    responseStatusCode,
    responseHeaders,
    remixContext
  ) : handleBrowserRequest(
    request,
    responseStatusCode,
    responseHeaders,
    remixContext
  );
}
function handleBotRequest(request, responseStatusCode, responseHeaders, remixContext) {
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    const { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(
        RemixServer,
        {
          context: remixContext,
          url: request.url,
          abortDelay: ABORT_DELAY
        }
      ),
      {
        onAllReady() {
          shellRendered = true;
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html");
          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          );
          pipe(body);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500;
          if (shellRendered) {
            console.error(error);
          }
        }
      }
    );
    setTimeout(abort, ABORT_DELAY);
  });
}
function handleBrowserRequest(request, responseStatusCode, responseHeaders, remixContext) {
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    const { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(
        RemixServer,
        {
          context: remixContext,
          url: request.url,
          abortDelay: ABORT_DELAY
        }
      ),
      {
        onShellReady() {
          shellRendered = true;
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html");
          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          );
          pipe(body);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500;
          if (shellRendered) {
            console.error(error);
          }
        }
      }
    );
    setTimeout(abort, ABORT_DELAY);
  });
}
const entryServer = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: handleRequest
}, Symbol.toStringTag, { value: "Module" }));
const links = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous"
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap"
  }
];
function Layout({ children }) {
  return /* @__PURE__ */ jsxs("html", { lang: "en", children: [
    /* @__PURE__ */ jsxs("head", { children: [
      /* @__PURE__ */ jsx("meta", { charSet: "utf-8" }),
      /* @__PURE__ */ jsx("meta", { name: "viewport", content: "width=device-width, initial-scale=1" }),
      /* @__PURE__ */ jsx(Meta, {}),
      /* @__PURE__ */ jsx(Links, {})
    ] }),
    /* @__PURE__ */ jsxs("body", { children: [
      children,
      /* @__PURE__ */ jsx(ScrollRestoration, {}),
      /* @__PURE__ */ jsx(Scripts, {})
    ] })
  ] });
}
function App() {
  return /* @__PURE__ */ jsx(Outlet, {});
}
const route0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Layout,
  default: App,
  links
}, Symbol.toStringTag, { value: "Module" }));
function cn(...inputs) {
  return twMerge(clsx(inputs));
}
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline"
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
const Button = React.forwardRef(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return /* @__PURE__ */ jsx(
      Comp,
      {
        className: cn(buttonVariants({ variant, size, className })),
        ref,
        ...props
      }
    );
  }
);
Button.displayName = "Button";
const Input = React.forwardRef(
  ({ className, type, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "input",
      {
        type,
        className: cn(
          "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        ),
        ref,
        ...props
      }
    );
  }
);
Input.displayName = "Input";
const Card = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "div",
  {
    ref,
    className: cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm",
      className
    ),
    ...props
  }
));
Card.displayName = "Card";
const CardHeader = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "div",
  {
    ref,
    className: cn("flex flex-col space-y-1.5 p-6", className),
    ...props
  }
));
CardHeader.displayName = "CardHeader";
const CardTitle = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "h3",
  {
    ref,
    className: cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    ),
    ...props
  }
));
CardTitle.displayName = "CardTitle";
const CardDescription = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "p",
  {
    ref,
    className: cn("text-sm text-muted-foreground", className),
    ...props
  }
));
CardDescription.displayName = "CardDescription";
const CardContent = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx("div", { ref, className: cn("p-6 pt-0", className), ...props }));
CardContent.displayName = "CardContent";
const CardFooter = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "div",
  {
    ref,
    className: cn("flex items-center p-6 pt-0", className),
    ...props
  }
));
CardFooter.displayName = "CardFooter";
const Separator = React.forwardRef(
  ({ className, orientation = "horizontal", decorative = true, ...props }, ref) => /* @__PURE__ */ jsx(
    "div",
    {
      ref,
      role: decorative ? "none" : "separator",
      "aria-orientation": decorative ? void 0 : orientation,
      className: cn(
        "shrink-0 bg-border",
        orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
        className
      ),
      ...props
    }
  )
);
Separator.displayName = "Separator";
const Avatar = React.forwardRef(({ className, initials, ...props }, ref) => /* @__PURE__ */ jsx(
  "div",
  {
    ref,
    className: cn(
      "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
      className
    ),
    ...props,
    children: initials ? /* @__PURE__ */ jsx("div", { className: "flex h-full w-full items-center justify-center rounded-full bg-primary text-primary-foreground", children: initials }) : /* @__PURE__ */ jsx("div", { className: "flex h-full w-full items-center justify-center rounded-full bg-muted", children: /* @__PURE__ */ jsxs(
      "svg",
      {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        className: "h-6 w-6",
        children: [
          /* @__PURE__ */ jsx("path", { d: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" }),
          /* @__PURE__ */ jsx("circle", { cx: "12", cy: "7", r: "4" })
        ]
      }
    ) })
  }
));
Avatar.displayName = "Avatar";
const AvatarImage = React.forwardRef(({ className, alt, ...props }, ref) => /* @__PURE__ */ jsx(
  "img",
  {
    ref,
    className: cn("aspect-square h-full w-full", className),
    alt,
    ...props
  }
));
AvatarImage.displayName = "AvatarImage";
const AvatarFallback = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "div",
  {
    ref,
    className: cn(
      "flex h-full w-full items-center justify-center rounded-full bg-muted",
      className
    ),
    ...props
  }
));
AvatarFallback.displayName = "AvatarFallback";
async function action({ request }) {
  try {
    const formData = await request.formData();
    const bookmarksFile = formData.get("bookmarksFile");
    if (!bookmarksFile) {
      return Response.json({ success: false, error: "No file uploaded" }, { status: 400 });
    }
    if (!bookmarksFile.name.endsWith(".json")) {
      return Response.json({ success: false, error: "Only JSON files are supported" }, { status: 400 });
    }
    const fileContent = await bookmarksFile.text();
    let bookmarks;
    try {
      bookmarks = JSON.parse(fileContent);
      if (!Array.isArray(bookmarks)) {
        return Response.json({ success: false, error: "Invalid JSON format: Expected an array of bookmarks" }, { status: 400 });
      }
    } catch (error) {
      return Response.json({ success: false, error: "Invalid JSON format" }, { status: 400 });
    }
    const result = await importBookmarks(bookmarks);
    return Response.json(result);
  } catch (error) {
    console.error("Error processing upload:", error);
    return Response.json({
      success: false,
      error: error instanceof Error ? error.message : "An unknown error occurred"
    }, { status: 500 });
  }
}
async function importBookmarks(bookmarks) {
  try {
    const { createRequire } = await import("module");
    const require2 = createRequire(import.meta.url);
    const Database = require2("better-sqlite3");
    const db = new Database("./sqlite.db");
    const extPath = path.resolve("./lib");
    const platform = process.platform;
    if (platform === "win32") {
      db.loadExtension(path.join(extPath, "simple"));
    } else {
      db.loadExtension(path.join(extPath, "libsimple"));
    }
    const dictPath = path.join(extPath, "dict");
    db.prepare("SELECT jieba_dict(?)").run(dictPath);
    const transaction = db.transaction((bookmarks2) => {
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
      for (const bookmark of bookmarks2) {
        stmt.run({
          id: bookmark.id,
          created_at: bookmark.created_at,
          full_text: bookmark.full_text,
          media: JSON.stringify(bookmark.media || []),
          screen_name: bookmark.screen_name,
          name: bookmark.name,
          profile_image_url: bookmark.profile_image_url,
          in_reply_to: JSON.stringify(bookmark.in_reply_to || null),
          retweeted_status: JSON.stringify(bookmark.retweeted_status || null),
          quoted_status: JSON.stringify(bookmark.quoted_status || null),
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
    transaction(bookmarks);
    console.log(`Successfully imported ${bookmarks.length} bookmarks into the database.`);
    db.exec(`DELETE FROM twitter_bookmarks_fts`);
    db.exec(`
      INSERT INTO twitter_bookmarks_fts(id, full_text, screen_name, name)
      SELECT id, full_text, screen_name, name FROM twitter_bookmarks;
    `);
    console.log(`Updated full-text search index with ${bookmarks.length} bookmarks.`);
    db.close();
    return { success: true, count: bookmarks.length };
  } catch (error) {
    console.error("Error importing bookmarks:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unknown error occurred"
    };
  }
}
function decodeHTMLEntities(text) {
  if (!text) return "";
  return text.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#039;/g, "'").replace(/&#x2F;/g, "/").replace(/&nbsp;/g, " ");
}
function MediaLightbox({
  media,
  tweetId,
  onClose
}) {
  const modalRef = useRef(null);
  const handleBackdropClick = (e) => {
    if (e.target === modalRef.current) {
      onClose();
    }
  };
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose]);
  return /* @__PURE__ */ jsx(
    "div",
    {
      ref: modalRef,
      className: "fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80",
      onClick: handleBackdropClick,
      children: /* @__PURE__ */ jsxs("div", { className: "relative max-w-[90vw] max-h-[90vh]", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: onClose,
            className: "absolute -top-10 right-0 text-white hover:text-gray-300",
            "aria-label": "Close",
            children: /* @__PURE__ */ jsx("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-8 w-8", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }) })
          }
        ),
        media.type === "photo" && /* @__PURE__ */ jsx(
          "img",
          {
            src: media.original,
            alt: "Enlarged photo",
            className: "max-w-full max-h-[85vh] object-contain"
          }
        ),
        (media.type === "video" || media.type === "animated_gif") && tweetId && /* @__PURE__ */ jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsx(
            "img",
            {
              src: media.thumbnail,
              alt: `${media.type} thumbnail`,
              className: "max-w-full max-h-[85vh]"
            }
          ),
          /* @__PURE__ */ jsx("div", { className: "absolute inset-0 flex items-center justify-center", children: /* @__PURE__ */ jsxs(
            "a",
            {
              href: `https://x.com/i/status/${tweetId}`,
              target: "_blank",
              rel: "noopener noreferrer",
              className: "bg-black bg-opacity-70 text-white px-4 py-2 rounded-full flex items-center gap-2 hover:bg-opacity-90 transition-all",
              children: [
                /* @__PURE__ */ jsx("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-6 w-6", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" }) }),
                "View on Twitter"
              ]
            }
          ) }),
          /* @__PURE__ */ jsx("div", { className: "mt-2 text-center text-sm text-gray-300", children: /* @__PURE__ */ jsxs("p", { children: [
            "Click to view the original tweet with this ",
            media.type === "video" ? "video" : "GIF"
          ] }) })
        ] })
      ] })
    }
  );
}
function MediaRenderer({ media, tweetId }) {
  const [enlargedMedia, setEnlargedMedia] = useState(null);
  if (!media) return null;
  const mediaArray = Array.isArray(media) ? media : [media];
  if (mediaArray.length === 0) return null;
  const handleMediaClick = (item, e) => {
    e.preventDefault();
    setEnlargedMedia(item);
  };
  const handleVideoClick = (e) => {
    e.preventDefault();
    if (tweetId) {
      window.open(`https://x.com/i/status/${tweetId}`, "_blank");
    }
  };
  return /* @__PURE__ */ jsxs(Fragment$1, { children: [
    /* @__PURE__ */ jsx("div", { className: "mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3", children: mediaArray.map((item, index) => {
      const key = `media-${tweetId || ""}-${index}`;
      const photoWrapper = (content) => /* @__PURE__ */ jsx("div", { className: "relative overflow-hidden rounded-lg cursor-pointer", children: /* @__PURE__ */ jsx(
        "div",
        {
          onClick: (e) => handleMediaClick(item, e),
          className: "block",
          children: content
        }
      ) }, key);
      const videoWrapper = (content) => /* @__PURE__ */ jsx("div", { className: "relative overflow-hidden rounded-lg cursor-pointer", children: /* @__PURE__ */ jsx(
        "div",
        {
          onClick: handleVideoClick,
          className: "block",
          children: content
        }
      ) }, key);
      if (item.type === "photo") {
        return photoWrapper(
          /* @__PURE__ */ jsx(
            "img",
            {
              src: item.thumbnail || item.original,
              alt: "Photo content",
              className: "w-full h-auto object-cover transition-transform duration-200 hover:scale-105",
              loading: "lazy"
            }
          )
        );
      } else if (item.type === "video") {
        return videoWrapper(
          /* @__PURE__ */ jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsx(
              "img",
              {
                src: item.thumbnail,
                alt: "Video thumbnail",
                className: "w-full h-auto object-cover transition-transform duration-200 hover:scale-105",
                loading: "lazy"
              }
            ),
            /* @__PURE__ */ jsx("div", { className: "absolute inset-0 flex items-center justify-center", children: /* @__PURE__ */ jsx("div", { className: "bg-black bg-opacity-50 rounded-full p-3", children: /* @__PURE__ */ jsx("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-8 w-8 text-white", viewBox: "0 0 20 20", fill: "currentColor", children: /* @__PURE__ */ jsx("path", { fillRule: "evenodd", d: "M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z", clipRule: "evenodd" }) }) }) }),
            /* @__PURE__ */ jsx("div", { className: "absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs font-bold px-2 py-1 rounded", children: "Open on Twitter" })
          ] })
        );
      } else if (item.type === "animated_gif") {
        return videoWrapper(
          /* @__PURE__ */ jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsx(
              "img",
              {
                src: item.thumbnail,
                alt: "GIF thumbnail",
                className: "w-full h-auto object-cover transition-transform duration-200 hover:scale-105",
                loading: "lazy"
              }
            ),
            /* @__PURE__ */ jsx("div", { className: "absolute top-2 right-2 bg-black bg-opacity-70 text-white text-xs font-bold px-2 py-1 rounded", children: "GIF" }),
            /* @__PURE__ */ jsx("div", { className: "absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs font-bold px-2 py-1 rounded", children: "Open on Twitter" })
          ] })
        );
      }
      return null;
    }) }),
    enlargedMedia && /* @__PURE__ */ jsx(
      MediaLightbox,
      {
        media: enlargedMedia,
        tweetId,
        onClose: () => setEnlargedMedia(null)
      }
    )
  ] });
}
function renderTextWithLinks(text) {
  if (!text) return text;
  text = decodeHTMLEntities(text);
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const lines = text.split("\n");
  return lines.map((line, lineIndex) => {
    const matches = [];
    let match;
    const urlRegexClone = new RegExp(urlRegex);
    while ((match = urlRegexClone.exec(line)) !== null) {
      matches.push({
        url: match[0],
        index: match.index
      });
    }
    if (matches.length === 0) {
      return /* @__PURE__ */ jsxs(Fragment, { children: [
        line,
        lineIndex < lines.length - 1 && /* @__PURE__ */ jsx("br", {})
      ] }, `line-${lineIndex}`);
    }
    const lineResult = [];
    let lastIndex = 0;
    matches.forEach((match2, i) => {
      if (match2.index > lastIndex) {
        lineResult.push(
          /* @__PURE__ */ jsx(Fragment, { children: line.substring(lastIndex, match2.index) }, `text-${lineIndex}-${i}`)
        );
      }
      lineResult.push(
        /* @__PURE__ */ jsx(
          "a",
          {
            href: match2.url,
            target: "_blank",
            rel: "noopener noreferrer",
            className: "text-blue-500 hover:underline",
            children: match2.url
          },
          `link-${lineIndex}-${i}`
        )
      );
      lastIndex = match2.index + match2.url.length;
    });
    if (lastIndex < line.length) {
      lineResult.push(
        /* @__PURE__ */ jsx(Fragment, { children: line.substring(lastIndex) }, `text-end-${lineIndex}`)
      );
    }
    return /* @__PURE__ */ jsxs(Fragment, { children: [
      lineResult,
      lineIndex < lines.length - 1 && /* @__PURE__ */ jsx("br", {})
    ] }, `line-${lineIndex}`);
  });
}
function InputWithButton({ onSearch }) {
  const [query, setQuery] = useState("");
  const handleSearch = () => {
    if (query.trim()) {
      onSearch(query);
    }
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "flex w-full items-center space-x-2", children: [
    /* @__PURE__ */ jsx(
      Input,
      {
        placeholder: "输入搜索关键词...",
        value: query,
        onChange: (e) => setQuery(e.target.value),
        onKeyDown: handleKeyDown
      }
    ),
    /* @__PURE__ */ jsx(Button, { onClick: handleSearch, children: "搜索" })
  ] });
}
async function loader({ request }) {
  const url = new URL(request.url);
  const query = url.searchParams.get("q") || "";
  if (!query.trim()) {
    return Response.json({ results: [], error: null });
  }
  try {
    const dbPath = path.resolve("./sqlite.db");
    const { createRequire } = await import("module");
    const require2 = createRequire(import.meta.url);
    const Database = require2("better-sqlite3");
    const db = Database(dbPath);
    const extPath = path.resolve("./lib");
    const platform = process.platform;
    if (platform === "win32") {
      db.loadExtension(path.join(extPath, "simple"));
    } else {
      db.loadExtension(path.join(extPath, "libsimple"));
    }
    const dictPath = path.join(extPath, "dict");
    db.prepare("SELECT jieba_dict(?)").run(dictPath);
    db.exec(`
      CREATE VIRTUAL TABLE IF NOT EXISTS twitter_bookmarks_fts 
      USING fts5(id, full_text, screen_name, name, tokenize = 'simple');
    `);
    const ftsCount = db.prepare("SELECT COUNT(*) as count FROM twitter_bookmarks_fts").get();
    if (ftsCount.count === 0) {
      db.exec(`
        INSERT INTO twitter_bookmarks_fts(id, full_text, screen_name, name)
        SELECT id, full_text, screen_name, name FROM twitter_bookmarks;
      `);
    }
    const searchResults = db.prepare(`
      SELECT tb.*
      FROM twitter_bookmarks_fts fts
      JOIN twitter_bookmarks tb ON fts.id = tb.id
      WHERE fts.full_text MATCH simple_query(?)
      ORDER BY tb.created_at DESC
      LIMIT 100
    `).all(query);
    const processedResults = searchResults.map((result) => {
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
    db.close();
    return Response.json({ results: processedResults, error: null });
  } catch (error) {
    console.error("Search error:", error);
    return Response.json({
      results: [],
      error: error instanceof Error ? error.message : "An unknown error occurred"
    });
  }
}
function Index() {
  const { results, error } = useLoaderData();
  const actionData = useActionData();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState(results || []);
  const [isImporting, setIsImporting] = useState(false);
  const [importFeedback, setImportFeedback] = useState({ show: false, success: false, message: "" });
  const fileInputRef = useRef(null);
  const submit = useSubmit();
  searchParams.get("q") || "";
  const handleSearch = async (query) => {
    if (!query.trim()) return;
    setIsLoading(true);
    setSearchParams({ q: query });
    setTimeout(() => {
      setIsLoading(false);
    }, 300);
  };
  const handleFileUpload = (event) => {
    var _a;
    const file = (_a = event.target.files) == null ? void 0 : _a[0];
    if (!file) return;
    if (!file.name.endsWith(".json")) {
      setImportFeedback({
        show: true,
        success: false,
        message: "Only JSON files are supported"
      });
      return;
    }
    setIsImporting(true);
    const formData = new FormData();
    formData.append("bookmarksFile", file);
    submit(formData, { method: "post", encType: "multipart/form-data" });
  };
  const resetFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  const getInitials = (name = "") => {
    return name.split(" ").map((part) => part.charAt(0)).join("").toUpperCase().substring(0, 2);
  };
  useEffect(() => {
    setSearchResults(results || []);
  }, [results]);
  useEffect(() => {
    if (actionData) {
      setIsImporting(false);
      if (actionData.success) {
        setImportFeedback({
          show: true,
          success: true,
          message: `Successfully imported ${actionData.count} bookmarks`
        });
      } else {
        setImportFeedback({
          show: true,
          success: false,
          message: actionData.error || "Failed to import bookmarks"
        });
      }
      resetFileInput();
      const timer = setTimeout(() => {
        setImportFeedback((prev) => ({ ...prev, show: false }));
      }, 5e3);
      return () => clearTimeout(timer);
    }
  }, [actionData]);
  return /* @__PURE__ */ jsx("div", { className: "flex min-h-screen flex-col items-center p-4 md:p-8 bg-gray-50 dark:bg-gray-900", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-8 w-full max-w-4xl", children: [
    /* @__PURE__ */ jsxs(Card, { className: "w-full bg-white dark:bg-gray-800 shadow-md", children: [
      /* @__PURE__ */ jsxs(CardHeader, { className: "text-center pb-2", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row items-center justify-center gap-4 mb-2", children: [
          /* @__PURE__ */ jsx("div", { className: "h-[80px] w-[80px]", children: /* @__PURE__ */ jsx(
            "img",
            {
              src: "/twitter-x.png",
              alt: "Twitter/X",
              className: "block w-full dark:hidden"
            }
          ) }),
          /* @__PURE__ */ jsx(CardTitle, { className: "text-3xl font-bold text-gray-800 dark:text-gray-100 bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent", children: "Twitter Local Bookmarks" })
        ] }),
        /* @__PURE__ */ jsx(CardDescription, { className: "text-gray-600 dark:text-gray-400 text-sm", children: "本地存储和搜索您的Twitter书签" })
      ] }),
      /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
        /* @__PURE__ */ jsx("div", { className: "bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800", children: /* @__PURE__ */ jsxs("p", { className: "text-sm text-blue-800 dark:text-blue-300 leading-relaxed", children: [
          "使用说明：首先用",
          /* @__PURE__ */ jsx("a", { href: "https://github.com/prinsss/twitter-web-exporter", target: "_blank", rel: "noopener noreferrer", className: "text-blue-600 dark:text-blue-400 hover:underline font-medium", children: "twitter-web-exporter" }),
          " 的“导出数据”功能导出JSON格式文件，然后使用本界面的“导入书签”功能。"
        ] }) }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm", children: [
            /* @__PURE__ */ jsx("h3", { className: "text-sm font-medium mb-3 text-gray-700 dark:text-gray-300", children: "搜索书签" }),
            /* @__PURE__ */ jsx(InputWithButton, { onSearch: handleSearch })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm", children: [
            /* @__PURE__ */ jsx("h3", { className: "text-sm font-medium mb-3 text-gray-700 dark:text-gray-300", children: "导入书签" }),
            /* @__PURE__ */ jsxs(Form, { method: "post", encType: "multipart/form-data", className: "flex-1", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsx(
                  Input,
                  {
                    ref: fileInputRef,
                    type: "file",
                    name: "bookmarksFile",
                    accept: ".json",
                    onChange: handleFileUpload,
                    className: "flex-1"
                  }
                ),
                isImporting && /* @__PURE__ */ jsx("div", { className: "w-6 h-6 border-2 border-t-blue-500 border-gray-200 rounded-full animate-spin" })
              ] }),
              /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500 mt-2", children: "上传Twitter书签的JSON文件以导入到数据库中" })
            ] }),
            importFeedback.show && /* @__PURE__ */ jsx("div", { className: `mt-3 p-2 text-sm rounded ${importFeedback.success ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300" : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300"}`, children: importFeedback.message })
          ] })
        ] })
      ] }) })
    ] }),
    isLoading && /* @__PURE__ */ jsx(Card, { className: "w-full p-6 text-center", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center", children: [
      /* @__PURE__ */ jsx("div", { className: "w-8 h-8 border-4 border-t-blue-500 border-gray-200 rounded-full animate-spin" }),
      /* @__PURE__ */ jsx("span", { className: "ml-2", children: "加载结果中..." })
    ] }) }),
    error && /* @__PURE__ */ jsx(Card, { className: "w-full border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800", children: /* @__PURE__ */ jsx(CardContent, { className: "py-4", children: /* @__PURE__ */ jsxs("p", { className: "text-red-500 dark:text-red-300 font-medium", children: [
      "Error: ",
      error
    ] }) }) }),
    !isLoading && !error && searchResults.length > 0 && /* @__PURE__ */ jsxs("div", { className: "w-full", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-4", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold text-gray-800 dark:text-gray-100", children: "搜索结果" }),
        /* @__PURE__ */ jsxs("span", { className: "bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300", children: [
          "找到 ",
          searchResults.length,
          " 条结果"
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "space-y-4", children: searchResults.map((result, index) => /* @__PURE__ */ jsxs(
        Card,
        {
          className: "w-full overflow-hidden transition-all duration-200 hover:shadow-lg",
          children: [
            /* @__PURE__ */ jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-3", children: [
              result.profile_image_url ? /* @__PURE__ */ jsx("div", { className: "h-10 w-10 border-2 border-blue-100 dark:border-gray-700 rounded-full overflow-hidden", children: /* @__PURE__ */ jsx(
                "img",
                {
                  src: result.profile_image_url.replace("_normal", ""),
                  alt: result.name || "User avatar",
                  className: "h-full w-full object-cover",
                  referrerPolicy: "no-referrer",
                  crossOrigin: "anonymous",
                  onError: (e) => {
                    const target = e.currentTarget;
                    const parent = target.parentElement;
                    if (parent) {
                      const fallback = document.createElement("div");
                      fallback.className = "flex h-full w-full items-center justify-center rounded-full bg-primary text-primary-foreground";
                      fallback.textContent = getInitials(result.name);
                      parent.innerHTML = "";
                      parent.appendChild(fallback);
                    }
                  }
                }
              ) }) : /* @__PURE__ */ jsx(
                Avatar,
                {
                  className: "h-10 w-10 border-2 border-blue-100 dark:border-gray-700",
                  initials: getInitials(result.name)
                }
              ),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(CardTitle, { className: "text-base font-semibold text-gray-900 dark:text-gray-100", children: /* @__PURE__ */ jsx(
                  "a",
                  {
                    href: `https://x.com/${result.screen_name}`,
                    target: "_blank",
                    rel: "noopener noreferrer",
                    children: result.name
                  }
                ) }),
                /* @__PURE__ */ jsx(CardDescription, { className: "text-sm text-gray-500 dark:text-gray-400", children: /* @__PURE__ */ jsxs(
                  "a",
                  {
                    href: `https://x.com/${result.screen_name}`,
                    target: "_blank",
                    rel: "noopener noreferrer",
                    children: [
                      "@",
                      result.screen_name
                    ]
                  }
                ) })
              ] })
            ] }) }),
            /* @__PURE__ */ jsx(Separator, {}),
            /* @__PURE__ */ jsxs(CardContent, { className: "pt-4 text-gray-700 dark:text-gray-300 text-sm md:text-base leading-relaxed", children: [
              renderTextWithLinks(result.full_text || ""),
              result.media && /* @__PURE__ */ jsx(MediaRenderer, { media: result.media, tweetId: result.id })
            ] }),
            /* @__PURE__ */ jsx(CardFooter, { className: "text-xs text-gray-500 dark:text-gray-400 pt-2", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap justify-between w-full", children: [
              /* @__PURE__ */ jsx("div", { className: "flex space-x-4 mb-1", children: result.created_at && /* @__PURE__ */ jsxs("span", { children: [
                /* @__PURE__ */ jsx("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-4 w-4 inline mr-1", viewBox: "0 0 20 20", fill: "currentColor", children: /* @__PURE__ */ jsx("path", { fillRule: "evenodd", d: "M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z", clipRule: "evenodd" }) }),
                "收藏于",
                new Date(result.created_at).toLocaleDateString(void 0, {
                  year: "numeric",
                  month: "short",
                  day: "numeric"
                })
              ] }) }),
              result.url && /* @__PURE__ */ jsxs(
                "a",
                {
                  href: result.url,
                  target: "_blank",
                  rel: "noopener noreferrer",
                  className: "text-blue-500 hover:underline flex items-center",
                  children: [
                    /* @__PURE__ */ jsx("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-4 w-4 inline mr-1", viewBox: "0 0 20 20", fill: "currentColor", children: /* @__PURE__ */ jsx("path", { fillRule: "evenodd", d: "M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z", clipRule: "evenodd" }) }),
                    "在Twitter上查看"
                  ]
                }
              )
            ] }) })
          ]
        },
        result.id || index
      )) })
    ] }),
    !isLoading && !error && searchResults.length === 0 && /* @__PURE__ */ jsx(Card, { className: "w-full text-center p-8", children: /* @__PURE__ */ jsxs(CardContent, { children: [
      /* @__PURE__ */ jsx("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-12 w-12 mx-auto text-gray-400", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" }) }),
      /* @__PURE__ */ jsx("p", { className: "mt-4 text-gray-500 dark:text-gray-400", children: "未找到结果，请尝试其他搜索词。" })
    ] }) })
  ] }) });
}
const route1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  InputWithButton,
  action,
  default: Index,
  loader
}, Symbol.toStringTag, { value: "Module" }));
const serverManifest = { "entry": { "module": "/assets/entry.client-BFUHhWbe.js", "imports": ["/assets/components-DUmxP91T.js"], "css": [] }, "routes": { "root": { "id": "root", "parentId": void 0, "path": "", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/root-ChiZtCtX.js", "imports": ["/assets/components-DUmxP91T.js"], "css": ["/assets/root-CWGzOS0i.css"] }, "routes/_index": { "id": "routes/_index", "parentId": "root", "path": void 0, "index": true, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/_index-BNT3nnFR.js", "imports": ["/assets/components-DUmxP91T.js"], "css": [] } }, "url": "/assets/manifest-b7f5f07f.js", "version": "b7f5f07f" };
const mode = "production";
const assetsBuildDirectory = "build/client";
const basename = "/";
const future = { "v3_fetcherPersist": true, "v3_relativeSplatPath": true, "v3_throwAbortReason": true, "v3_routeConfig": false, "v3_singleFetch": true, "v3_lazyRouteDiscovery": true, "unstable_optimizeDeps": false };
const isSpaMode = false;
const publicPath = "/";
const entry = { module: entryServer };
const routes = {
  "root": {
    id: "root",
    parentId: void 0,
    path: "",
    index: void 0,
    caseSensitive: void 0,
    module: route0
  },
  "routes/_index": {
    id: "routes/_index",
    parentId: "root",
    path: void 0,
    index: true,
    caseSensitive: void 0,
    module: route1
  }
};
export {
  serverManifest as assets,
  assetsBuildDirectory,
  basename,
  entry,
  future,
  isSpaMode,
  mode,
  publicPath,
  routes
};
