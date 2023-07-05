import type { Tag } from "../tags.server";
import { DateTime } from "luxon";

const NOW_STR = DateTime.utc().toISO() as string;

export const SITE = {
  cover_image:
    "https://images.unsplash.com/photo-1557682250-33bd709cbe85?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxMTc3M3wwfDF8c2VhcmNofDI1fHxncmFkaWVudHxlbnwwfHx8fDE2NTMxOTA4NjY&ixlib=rb-1.2.1&q=80&w=2000",
  navigation: [
    { label: "Home", url: "/" },
    { label: "About", url: "/about/" },
  ],
  secondary_navigation: [{ label: "Sign up", url: "#/portal/" }],
  accent_color: "#FF1A75",
  timezone: "Etc/UTC",
  icon: "/favicon.ico",
};

export const TAGS: Tag[] = [
  {
    id: "645f5abac5efc800019856d7",
    name: "News",
    slug: "news",
    visibility: "public",
    description: null,
    feature_image: null,
    created_at: NOW_STR,
    created_by: 1,
    updated_at: NOW_STR,
    updated_by: 1,
  },
];

export const POSTS: any[] = [
  {
    title: "About",
    slug: "about",
    html: `<p>This is an independent publication. If you subscribe today, you'll get full access to the website as well as email newsletters about new content when it's available. Your subscription makes this site possible. Thank you!</p><h3 id="access-all-areas">Access all areas</h3><p>By signing up, you'll get access to the full archive of everything that's been published before and everything that's still to come. Your very own private library.</p><h3 id="fresh-content-delivered">Fresh content, delivered</h3><p>Stay up to date with new content sent straight to your inbox! No more worrying about whether you missed something because of a pesky algorithm or news feed.</p><h3 id="meet-people-like-you">Meet people like you</h3><p>Join a community of other subscribers who share the same interests.</p><hr><h3 id="start-your-own-thing">Start your own thing</h3><p>Enjoying the experience? Get started for free and set up your very own subscription business using <a href="https://ghost.org">Ghost</a>, the same platform that powers this website.</p>`,
    plaintext: `This is an independent publication. If you subscribe today, you'll get full access to the website as well as email newsletters about new content when it's available. Your subscription makes this site possible. Thank you!


    Access all areas
    
    By signing up, you'll get access to the full archive of everything that's been published before and everything that's still to come. Your very own private library.
    
    
    Fresh content, delivered
    
    Stay up to date with new content sent straight to your inbox! No more worrying about whether you missed something because of a pesky algorithm or news feed.
    
    
    Meet people like you
    
    Join a community of other subscribers who share the same interests.
    
    
    Start your own thing
    
    Enjoying the experience? Get started for free and set up your very own subscription business using Ghost, the same platform that powers this website.`,
    featured: false,
    type: "page",
    status: "published",
    visibility: "public",
  },
  {
    title: "Coming Soon",
    slug: "coming-soon",
    html: `<p>This is a brand new site that's just getting started. Things will be up and running here shortly, but you can <a href="#/portal/" rel="noopener noreferrer">subscribe</a> in the meantime if you'd like to stay up to date and receive emails when new content is published!</p>`,
    plaintext: `This is a brand new site that's just getting started. Things will be up and running here shortly, but you can subscribe in the meantime if you'd like to stay up to date and receive emails when new content is published!`,
    featured: false,
    feature_image: "https://static.ghost.org/v4.0.0/images/feature-image.jpg",
    type: "post",
    status: "published",
    visibility: "public",
  },
  {
    title: "In Draft",
    slug: "",
    html: `<p>This post is in draft<p>`,
    plaintext: `This post is in draft`,
    featured: false,
    type: "post",
    status: "draft",
    visibility: "public",
  },
];
