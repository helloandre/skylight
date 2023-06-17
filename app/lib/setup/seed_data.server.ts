import type { Post } from "../posts.server";
import type { Tag } from "../tags.server";

export const TAGS: Tag[] = [
  {
    id: "645f5abac5efc800019856d7",
    name: "News",
    slug: "news",
    visibility: "public",
    description: null,
    feature_image: null,
    created_at: "2023-05-13 09:39:06",
    created_by: 1,
    updated_at: "2023-05-13 09:39:06",
    updated_by: 1,
  },
];

export const POSTS: Post[] = [
  // @ts-ignore-next
  {
    id: "abc",
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
  // @ts-ignore-next
  {
    id: "def",
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
];
