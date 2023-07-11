export const THEME = {
  name: "casper",
  templates: {
    author: `{{!< default}}
    {{!-- The tag above means - insert everything in this file into the {body} of the default.hbs template --}}
    
    <main id="site-main" class="site-main outer">
    <div class="inner posts">
    
        <div class="post-feed">
    
            {{#author}}
            <section class="post-card post-card-large">
    
                {{#if feature_image}}
                <div class="post-card-image-link">
                    {{!-- This is a responsive image, it loads different sizes depending on device
                    https://medium.freecodecamp.org/a-guide-to-responsive-images-with-ready-to-use-templates-c400bd65c433 --}}
                    <img class="post-card-image"
                        srcset="{{img_url feature_image size="s"}} 300w,
                                {{img_url feature_image size="m"}} 600w,
                                {{img_url feature_image size="l"}} 1000w,
                                {{img_url feature_image size="xl"}} 2000w"
                        sizes="(max-width: 1000px) 400px, 800px"
                        src="{{img_url feature_image size="m"}}"
                        alt="{{title}}"
                    />
                </div>
                {{/if}}
    
                <div class="post-card-content">
                <div class="post-card-content-link">
    
                    {{#if profile_image}}
                        <img class="author-profile-pic" src="{{profile_image}}" alt="{{name}}" />
                    {{/if}}
    
                    <header class="post-card-header">
                        <h2 class="post-card-title">{{name}}</h2>
                    </header>
    
                    {{#if bio}}
                        <div class="post-card-excerpt">{{bio}}</div>
                    {{/if}}
    
                    <footer class="author-profile-footer">
                        {{#if location}}
                            <div class="author-profile-location">{{location}}</div>
                        {{/if}}
                        <div class="author-profile-meta">
                            {{#if website}}
                                <a class="author-profile-social-link" href="{{website}}" target="_blank" rel="noopener">{{website}}</a>
                            {{/if}}
                            {{#if twitter}}
                                <a class="author-profile-social-link" href="{{twitter_url}}" target="_blank" rel="noopener">{{> "icons/twitter"}}</a>
                            {{/if}}
                            {{#if facebook}}
                                <a class="author-profile-social-link" href="{{facebook_url}}" target="_blank" rel="noopener">{{> "icons/facebook"}}</a>
                            {{/if}}
                        </div>
                    </footer>
    
                </div>
                </div>
    
            </section>
            {{/author}}
    
            {{#foreach posts}}
                {{!-- The tag below includes the markup for each post - partials/post-card.hbs --}}
                {{> "post-card"}}
            {{/foreach}}
    
        </div>
    
        {{pagination}}
        
    </div>
    </main>
    `,
    default: `<!DOCTYPE html>
<html lang="{{@site.locale}}"{{#match @custom.color_scheme "Dark"}} class="dark-mode"{{else match @custom.color_scheme "Auto"}} class="auto-color"{{/match}}>
<head>

    {{!-- Basic meta - advanced meta is output with {ghost_head} below --}}
    <title>{{meta_title}}</title>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="HandheldFriendly" content="True" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    {{!-- Theme assets - use the {asset} helper to reference styles & scripts,
    this will take care of caching and cache-busting automatically --}}
    <link rel="stylesheet" type="text/css" href="{{asset "built/screen.css"}}" />

    {{!-- This tag outputs all your advanced SEO meta, structured data, and other important settings,
    it should always be the last tag before the closing head tag --}}
    {{ghost_head}}

</head>
<body class="{{body_class}} {{{block "body_class"}}} is-head-{{#match @custom.navigation_layout "Logo on cover"}}left-logo{{else match @custom.navigation_layout "Logo in the middle"}}middle-logo{{else}}stacked{{/match}}{{#match @custom.title_font "=" "Elegant serif"}} has-serif-title{{/match}}{{#match @custom.body_font "=" "Modern sans-serif"}} has-sans-body{{/match}}{{#if @custom.show_publication_cover}} has-cover{{/if}}">
<div class="viewport">

    <header id="gh-head" class="gh-head outer{{#match @custom.header_style "Hidden"}} is-header-hidden{{/match}}">
        <div class="gh-head-inner inner">
            <div class="gh-head-brand">
                <a class="gh-head-logo{{#unless @site.logo}} no-image{{/unless}}" href="{{@site.url}}">
                    {{#if @site.logo}}
                        <img src="{{@site.logo}}" alt="{{@site.title}}">
                    {{else}}
                        {{@site.title}}
                    {{/if}}
                </a>
                <button class="gh-search gh-icon-btn" data-ghost-search>{{> "icons/search"}}</button>
                <button class="gh-burger"></button>
            </div>

            <nav class="gh-head-menu">
                {{navigation}}
                {{#unless @site.members_enabled}}
                    {{#match @custom.navigation_layout "Stacked"}}
                        <button class="gh-search gh-icon-btn" data-ghost-search>{{> "icons/search"}}</button>
                    {{/match}}
                {{/unless}}
            </nav>

            <div class="gh-head-actions">
                {{#unless @site.members_enabled}}
                    {{^match @custom.navigation_layout "Stacked"}}
                        <button class="gh-search gh-icon-btn" data-ghost-search>{{> "icons/search"}}</button>
                    {{/match}}
                {{else}}
                    <button class="gh-search gh-icon-btn" data-ghost-search>{{> "icons/search"}}</button>
                    <div class="gh-head-members">
                        {{#unless @member}}
                            {{#unless @site.members_invite_only}}
                                <a class="gh-head-link" href="#/portal/signin" data-portal="signin">Sign in</a>
                                <a class="gh-head-button" href="#/portal/signup" data-portal="signup">Subscribe</a>
                            {{else}}
                                <a class="gh-head-button" href="#/portal/signin" data-portal="signin">Sign in</a>
                            {{/unless}}
                        {{else}}
                            <a class="gh-head-button" href="#/portal/account" data-portal="account">Account</a>
                        {{/unless}}
                    </div>
                {{/unless}}
            </div>
        </div>
    </header>

    <div class="site-content">
        {{!-- All other templates get inserted here, index.hbs, post.hbs, etc --}}
        {{{body}}}
    </div>

    {{!-- The global footer at the very bottom of the screen --}}
    <footer class="site-footer outer">
        <div class="inner">
            <section class="copyright"><a href="{{@site.url}}">{{@site.title}}</a> &copy; {{date format="YYYY"}}</section>
            <nav class="site-footer-nav">
                {{navigation type="secondary"}}
            </nav>
            <div><a href="https://ghost.org/" target="_blank" rel="noopener">Powered by Ghost</a></div>
        </div>
    </footer>

</div>
{{!-- /.viewport --}}


{{!-- Scripts - handle member signups, responsive videos, infinite scroll, floating headers, and galleries --}}
<script
    src="https://code.jquery.com/jquery-3.5.1.min.js"
    integrity="sha256-9/aliU8dGd2tb6OSsuzixeV4y/faTqgFtohetphbbj0="
    crossorigin="anonymous">
</script>
<script src="{{asset "built/casper.js"}}"></script>
<script>
$(document).ready(function () {
    // Mobile Menu Trigger
    $('.gh-burger').click(function () {
        $('body').toggleClass('gh-head-open');
    });
    // FitVids - Makes video embeds responsive
    $(".gh-content").fitVids();
});
</script>

{{!-- Ghost outputs required functional scripts with this tag - it should always be the last thing before the closing body tag --}}
{{ghost_foot}}

</body>
</html>`,
    error404: `{{!< default}}

{{!--

There are two error files in this theme, one for 404s and one for all other errors.
This file is the former, and handles all 404 Page Not Found errors.

The 404 error is the most common error that a visitor might see, for example when
following a broken link

Keep this template as lightweight as you can!

--}}

<section class="outer error-content">
    <div class="inner">
        <section class="error-message">
            <h1 class="error-code">{{statusCode}}</h1>
            <p class="error-description">{{message}}</p>
            <a class="error-link" href="{{@site.url}}">Go to the front page →</a>
        </section>
    </div>
</section>

{{!-- Given that people landing on this page didn't find what they
were looking for, let's give them some alternative stuff to read. --}}
<aside class="read-more-wrap outer">
    <div class="read-more inner">
        {{#get "posts" include="authors" limit="3" as |more_posts|}}
            {{#if more_posts}}
                {{#foreach more_posts}}
                    {{> "post-card"}}
                {{/foreach}}
            {{/if}}
        {{/get}}
    </div>
</aside>`,
    error: `{{!--

  There are two error files in this theme, one for 404s and one for all other errors.
  This file is the latter, and handle all 400/500 errors that might occur.
  
  Because 500 errors in particular usuall happen when a server is struggling, this
  template is as simple as possible. No template dependencies, no JS, no API calls.
  This is to prevent rendering the error-page itself compounding the issue causing
  the error in the first place.
  
  Keep this template as lightweight as you can!
  
  --}}
  
  <!DOCTYPE html>
  <html>
  <head>
      <meta charset="utf-8" />
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      <title>{{meta_title}}</title>
      <meta name="HandheldFriendly" content="True" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link rel="stylesheet" type="text/css" href="{{asset "built/screen.css"}}" />
  </head>
  <body>
      <div class="site-wrapper">
  
          <header class="site-header no-image">
              <div class="site-nav-main outer">
                  <div class="inner">
                      <nav class="site-nav-center">
                          {{#if @site.logo}}
                          <a class="site-nav-logo" href="{{@site.url}}"><img src="{{img_url @site.logo size="xs"}}"
                                  alt="{{@site.title}}" /></a>
                          {{else}}
                          <a class="site-nav-logo" href="{{@site.url}}">{{@site.title}}</a>
                          {{/if}}
                      </nav>
                  </div>
              </div>
          </header>
  
          <main class="outer error-content">
              <div class="inner">
  
                  <section class="error-message">
                      <h1 class="error-code">{{statusCode}}</h1>
                      <p class="error-description">{{message}}</p>
                      <a class="error-link" href="{{@site.url}}">Go to the front page →</a>
                  </section>
  
                  {{#if errorDetails}}
                  <section class="error-stack">
                      <h3>Theme errors</h3>
                      <ul class="error-stack-list">
                          {{#foreach errorDetails}}
                              <li>
                                  <em class="error-stack-function">{{{rule}}}</em>
  
                                  {{#foreach failures}}
                                      <p><span class="error-stack-file">Ref: {{ref}}</span></p>
                                      <p><span class="error-stack-file">Message: {{message}}</span></p>
                                  {{/foreach}}
                              </li>
                          {{/foreach}}
                      </ul>
                  </section>
                  {{/if}}
  
              </div>
          </main>
      </div>
  </body>
  </html>
  `,
    index: `{{!< default}}
  {{!-- The tag above means: insert everything in this file
  into the {body} of the default.hbs template --}}
  
  <div class="site-header-content outer{{#match @custom.header_style "Left aligned"}} left-aligned{{/match}}{{#unless @custom.show_publication_cover}}{{#match @custom.header_style "Hidden"}} no-content{{/match}}{{/unless}}">
  
      {{#if @custom.show_publication_cover}}
          {{#if @site.cover_image}}
              {{!-- This is a responsive image, it loads different sizes depending on device
              https://medium.freecodecamp.org/a-guide-to-responsive-images-with-ready-to-use-templates-c400bd65c433 --}}
              <img class="site-header-cover"
                  srcset="{{img_url @site.cover_image size="s"}} 300w,
                          {{img_url @site.cover_image size="m"}} 600w,
                          {{img_url @site.cover_image size="l"}} 1000w,
                          {{img_url @site.cover_image size="xl"}} 2000w"
                  sizes="100vw"
                  src="{{img_url @site.cover_image size="xl"}}"
                  alt="{{@site.title}}"
              />
          {{/if}}
      {{/if}}
  
      {{#match @custom.header_style "!=" "Hidden"}}
          <div class="site-header-inner inner">
              {{#match @custom.navigation_layout "Logo on cover"}}
                  {{#if @site.logo}}
                      <img class="site-logo" src="{{@site.logo}}" alt="{{@site.title}}">
                  {{else}}
                      <h1 class="site-title">{{@site.title}}</h1>
                  {{/if}}
              {{/match}}
              {{#if @site.description}}
                  <p class="site-description">{{@site.description}}</p>
              {{/if}}
          </div>
      {{/match}}
  
  </div>
  
  {{!-- The main content area --}}
  <main id="site-main" class="site-main outer">
  <div class="inner posts">
  
      <div class="post-feed">
          {{#foreach posts}}
              {{!-- The tag below includes the markup for each post - partials/post-card.hbs --}}
              {{> "post-card"}}
          {{/foreach}}
      </div>
  
      {{pagination}}
  
  </div>
  </main>
  {{#contentFor "body_class"}}{{#match @custom.header_section_layout "Side by side"}} has-side-about{{/match}}{{#match @custom.header_section_layout "Large background"}}{{#if @site.cover_image}} is-head-transparent has-background-about{{else}} has-side-about{{/if}}{{/match}}{{#match @custom.header_section_layout "Typographic profile"}}{{#if @site.icon}} has-typographic-about{{else}} has-side-about{{/if}}{{/match}}{{/contentFor}}
  `,
    page: `{{!< default}}

  {{!-- The tag above means: insert everything in this file
  into the {body} tag of the default.hbs template --}}
  
  
  {{#post}}
  {{!-- Everything inside the #post block pulls data from the page --}}
  
  <main id="site-main" class="site-main">
  <article class="article {{post_class}}">
  
      <header class="article-header gh-canvas">
  
          <h1 class="article-title">{{title}}</h1>
  
          {{#if feature_image}}
              <figure class="article-image">
                  {{!-- This is a responsive image, it loads different sizes depending on device
                  https://medium.freecodecamp.org/a-guide-to-responsive-images-with-ready-to-use-templates-c400bd65c433 --}}
                  <img
                      srcset="{{img_url feature_image size="s"}} 300w,
                              {{img_url feature_image size="m"}} 600w,
                              {{img_url feature_image size="l"}} 1000w,
                              {{img_url feature_image size="xl"}} 2000w"
                      sizes="(min-width: 1400px) 1400px, 92vw"
                      src="{{img_url feature_image size="xl"}}"
                      alt="{{#if feature_image_alt}}{{feature_image_alt}}{{else}}{{title}}{{/if}}"
                  />
                  {{#if feature_image_caption}}
                      <figcaption>{{feature_image_caption}}</figcaption>
                  {{/if}}
              </figure>
          {{/if}}
  
      </header>
  
      <section class="gh-content gh-canvas">
          {{content}}
      </section>
  
  </article>
  </main>
  
  {{/post}}`,
    post: `{{!< default}}

  {{!-- The tag above means: insert everything in this file
  into the {body} tag of the default.hbs template --}}
  
  
  {{#post}}
  {{!-- Everything inside the #post block pulls data from the post --}}
  
  <main id="site-main" class="site-main">
  <article class="article {{post_class}} {{#match @custom.post_image_style "Full"}}image-full{{else match @custom.post_image_style "=" "Small"}}image-small{{/match}}">
  
      <header class="article-header gh-canvas">
  
          <div class="article-tag post-card-tags">
              {{#primary_tag}}
                  <span class="post-card-primary-tag">
                      <a href="{{url}}">{{name}}</a>
                  </span>
              {{/primary_tag}}
              {{#if featured}}
                  <span class="post-card-featured">{{> "icons/fire"}} Featured</span>
              {{/if}}
          </div>
  
          <h1 class="article-title">{{title}}</h1>
  
          {{#if custom_excerpt}}
              <p class="article-excerpt">{{custom_excerpt}}</p>
          {{/if}}
  
          <div class="article-byline">
          <section class="article-byline-content">
  
              <ul class="author-list">
                  {{#foreach authors}}
                  <li class="author-list-item">
                      {{#if profile_image}}
                      <a href="{{url}}" class="author-avatar">
                          <img class="author-profile-image" src="{{img_url profile_image size="xs"}}" alt="{{name}}" />
                      </a>
                      {{else}}
                      <a href="{{url}}" class="author-avatar author-profile-image">{{> "icons/avatar"}}</a>
                      {{/if}}
                  </li>
                  {{/foreach}}
              </ul>
  
              <div class="article-byline-meta">
                  <h4 class="author-name">{{authors}}</h4>
                  <div class="byline-meta-content">
                      <time class="byline-meta-date" datetime="{{date format="y-MM-DD"}}">{{date}}</time>
                      {{#if reading_time}}
                          <span class="byline-reading-time"><span class="bull">&bull;</span> {{reading_time}}</span>
                      {{/if}}
                  </div>
              </div>
  
          </section>
          </div>
  
          {{#match @custom.post_image_style "!=" "Hidden"}}
          {{#if feature_image}}
              <figure class="article-image">
                  {{!-- This is a responsive image, it loads different sizes depending on device
                  https://medium.freecodecamp.org/a-guide-to-responsive-images-with-ready-to-use-templates-c400bd65c433 --}}
                  <img
                      srcset="{{img_url feature_image size="s"}} 300w,
                              {{img_url feature_image size="m"}} 600w,
                              {{img_url feature_image size="l"}} 1000w,
                              {{img_url feature_image size="xl"}} 2000w"
                      sizes="(min-width: 1400px) 1400px, 92vw"
                      src="{{img_url feature_image size="xl"}}"
                      alt="{{#if feature_image_alt}}{{feature_image_alt}}{{else}}{{title}}{{/if}}"
                  />
                  {{#if feature_image_caption}}
                      <figcaption>{{feature_image_caption}}</figcaption>
                  {{/if}}
              </figure>
          {{/if}}
          {{/match}}
  
      </header>
  
      <section class="gh-content gh-canvas">
          {{content}}
      </section>
  
      {{#if comments}}
          <section class="article-comments gh-canvas">
              {{comments}}
          </section>
      {{/if}}
  
  </article>
  </main>
  
  {{!-- A signup call to action is displayed here, unless viewed as a logged-in member --}}
  {{#if @site.members_enabled}}
  {{#unless @member}}
  {{#unless @site.comments_enabled}}
  {{#if access}}
      <section class="footer-cta outer">
          <div class="inner">
              {{#if @custom.email_signup_text}}<h2 class="footer-cta-title">{{@custom.email_signup_text}}</h2>{{/if}}
              <a class="footer-cta-button" href="#/portal" data-portal>
                  <div class="footer-cta-input">Enter your email</div>
                  <span>Subscribe</span>
              </a>
          </div>
      </section>
  {{/if}}
  {{/unless}}
  {{/unless}}
  {{/if}}
  
  
  {{!-- Read more links, just above the footer --}}
  {{#if @custom.show_recent_posts_footer}}
      {{!-- The {#get} helper below fetches some of the latest posts here
      so that people have something else to read when they finish this one.
  
      This query gets the latest 3 posts on the site, but adds a filter to
      exclude the post we're currently on from being included. --}}
      {{#get "posts" filter="id:-{{id}}" limit="3" as |more_posts|}}
  
          {{#if more_posts}}
              <aside class="read-more-wrap outer">
                  <div class="read-more inner">
                      {{#foreach more_posts}}
                          {{> "post-card"}}
                      {{/foreach}}
                  </div>
              </aside>
          {{/if}}
  
      {{/get}}
  {{/if}}
  
  {{/post}}`,
    tag: `{{!< default}}
  {{!-- The tag above means - insert everything in this file into the {body} of the default.hbs template --}}
  
  <main id="site-main" class="site-main outer">
  <div class="inner posts">
      <div class="post-feed">
  
          {{#tag}}
          <section class="post-card post-card-large">
  
              {{#if feature_image}}
              <div class="post-card-image-link">
                  {{!-- This is a responsive image, it loads different sizes depending on device
                  https://medium.freecodecamp.org/a-guide-to-responsive-images-with-ready-to-use-templates-c400bd65c433 --}}
                  <img class="post-card-image"
                      srcset="{{img_url feature_image size="s"}} 300w,
                              {{img_url feature_image size="m"}} 600w,
                              {{img_url feature_image size="l"}} 1000w,
                              {{img_url feature_image size="xl"}} 2000w"
                      sizes="(max-width: 1000px) 400px, 800px"
                      src="{{img_url feature_image size="m"}}"
                      alt="{{title}}"
                  />
              </div>
              {{/if}}
  
              <div class="post-card-content">
              <div class="post-card-content-link">
                  <header class="post-card-header">
                      <h2 class="post-card-title">{{name}}</h2>
                  </header>
                  <div class="post-card-excerpt">
                      {{#if description}}
                          {{description}}
                      {{else}}
                          A collection of {{plural ../pagination.total empty='zero posts' singular='% post' plural='% posts'}}
                      {{/if}}
                  </div>
              </div>
              </div>
  
          </section>
          {{/tag}}
  
          {{#foreach posts}}
              {{!-- The tag below includes the markup for each post - partials/post-card.hbs --}}
              {{> "post-card"}}
          {{/foreach}}
  
      </div>
  
      {{pagination}}
      
  </div>
  </main>
  `,
  },
  partials: {
    "post-card": `{{!-- This is a partial file used to generate a post "card"
    which templates loop over to generate a list of posts. --}}
    
    <article class="post-card {{post_class}}{{#match @custom.feed_layout "Classic"}}{{#is "home"}}{{#has index="0"}} post-card-large{{/has}}{{#has index="1,2"}} dynamic{{/has}}{{/is}}{{/match}}{{#match @custom.feed_layout "Grid"}} keep-ratio{{/match}}{{#match @custom.feed_layout "List"}}{{#is "home, paged"}} post-card-large{{/is}}{{/match}}{{#unless access}} post-access-{{visibility}}{{/unless}}">
    
        {{#if feature_image}}
        <a class="post-card-image-link" href="{{url}}">
    
            {{!-- This is a responsive image, it loads different sizes depending on device
            https://medium.freecodecamp.org/a-guide-to-responsive-images-with-ready-to-use-templates-c400bd65c433 --}}
            <img class="post-card-image"
                srcset="{{img_url feature_image size="s"}} 300w,
                        {{img_url feature_image size="m"}} 600w,
                        {{img_url feature_image size="l"}} 1000w,
                        {{img_url feature_image size="xl"}} 2000w"
                sizes="(max-width: 1000px) 400px, 800px"
                src="{{img_url feature_image size="m"}}"
                alt="{{#if feature_image_alt}}{{feature_image_alt}}{{else}}{{title}}{{/if}}"
                loading="lazy"
            />
    
            {{#unless access}}
            {{^has visibility="public"}}
                <div class="post-card-access">
                    {{> "icons/lock"}}
                    {{#has visibility="members"}}
                        Members only
                    {{else}}
                        Paid-members only
                    {{/has}}
                </div>
            {{/has}}
            {{/unless}}
    
        </a>
        {{/if}}
    
        <div class="post-card-content">
    
            <a class="post-card-content-link" href="{{url}}">
                <header class="post-card-header">
                    <div class="post-card-tags">
                        {{#primary_tag}}
                            <span class="post-card-primary-tag">{{name}}</span>
                        {{/primary_tag}}
                        {{#if featured}}
                            <span class="post-card-featured">{{> "icons/fire"}} Featured</span>
                        {{/if}}
                    </div>
                    <h2 class="post-card-title">
                        {{#unless access}}
                        {{^has visibility="public"}}
                            {{#unless feature_image}}
                                {{> "icons/lock"}}
                            {{/unless}}
                        {{/has}}
                        {{/unless}}
                        {{title}}
                    </h2>
                </header>
                {{#if excerpt}}
                    <div class="post-card-excerpt">{{excerpt}}</div>
                {{/if}}
            </a>
    
            <footer class="post-card-meta">
                <time class="post-card-meta-date" datetime="{{date format="YYYY-MM-DD"}}">{{date}}</time>
                {{#if reading_time}}
                    <span class="post-card-meta-length">{{reading_time}}</span>
                {{/if}}
                {{#if @site.comments_enabled}}
                    {{comment_count}}
                {{/if}}
            </footer>
    
        </div>
    
    </article>
    `,
    "icons/avatar": `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><path d="M3.513 18.998C4.749 15.504 8.082 13 12 13s7.251 2.504 8.487 5.998C18.47 21.442 15.417 23 12 23s-6.47-1.558-8.487-4.002zM12 12c2.21 0 4-2.79 4-5s-1.79-4-4-4-4 1.79-4 4 1.79 5 4 5z" fill="#FFF"/></g></svg>
    `,
    "icons/facebook": `<svg class="icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor"><path d="M23.9981 11.9991C23.9981 5.37216 18.626 0 11.9991 0C5.37216 0 0 5.37216 0 11.9991C0 17.9882 4.38789 22.9522 10.1242 23.8524V15.4676H7.07758V11.9991H10.1242V9.35553C10.1242 6.34826 11.9156 4.68714 14.6564 4.68714C15.9692 4.68714 17.3424 4.92149 17.3424 4.92149V7.87439H15.8294C14.3388 7.87439 13.8739 8.79933 13.8739 9.74824V11.9991H17.2018L16.6698 15.4676H13.8739V23.8524C19.6103 22.9522 23.9981 17.9882 23.9981 11.9991Z"/></svg>`,
    "icons/fire": `<svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4.49365 4.58752C3.53115 6.03752 2.74365 7.70002 2.74365 9.25002C2.74365 10.6424 3.29678 11.9778 4.28134 12.9623C5.26591 13.9469 6.60127 14.5 7.99365 14.5C9.38604 14.5 10.7214 13.9469 11.706 12.9623C12.6905 11.9778 13.2437 10.6424 13.2437 9.25002C13.2437 6.00002 10.9937 3.50002 9.16865 1.68127L6.99365 6.25002L4.49365 4.58752Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
</svg>`,
    "icons/loader": `<svg version="1.1" id="loader-1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px"
y="0px" width="40px" height="40px" viewBox="0 0 40 40" enable-background="new 0 0 40 40" xml:space="preserve">
<path opacity="0.2" fill="#000" d="M20.201,5.169c-8.254,0-14.946,6.692-14.946,14.946c0,8.255,6.692,14.946,14.946,14.946
s14.946-6.691,14.946-14.946C35.146,11.861,28.455,5.169,20.201,5.169z M20.201,31.749c-6.425,0-11.634-5.208-11.634-11.634
c0-6.425,5.209-11.634,11.634-11.634c6.425,0,11.633,5.209,11.633,11.634C31.834,26.541,26.626,31.749,20.201,31.749z" />
<path fill="#000" d="M26.013,10.047l1.654-2.866c-2.198-1.272-4.743-2.012-7.466-2.012h0v3.312h0
C22.32,8.481,24.301,9.057,26.013,10.047z">
    <animateTransform attributeType="xml" attributeName="transform" type="rotate" from="0 20 20" to="360 20 20"
        dur="0.5s" repeatCount="indefinite" />
</path>
</svg>`,
    "icons/lock": `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M16.25 6.875H3.75C3.40482 6.875 3.125 7.15482 3.125 7.5V16.25C3.125 16.5952 3.40482 16.875 3.75 16.875H16.25C16.5952 16.875 16.875 16.5952 16.875 16.25V7.5C16.875 7.15482 16.5952 6.875 16.25 6.875Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
<path d="M7.1875 6.875V4.0625C7.1875 3.31658 7.48382 2.60121 8.01126 2.07376C8.53871 1.54632 9.25408 1.25 10 1.25C10.7459 1.25 11.4613 1.54632 11.9887 2.07376C12.5162 2.60121 12.8125 3.31658 12.8125 4.0625V6.875" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
<path d="M10 13.125C10.6904 13.125 11.25 12.5654 11.25 11.875C11.25 11.1846 10.6904 10.625 10 10.625C9.30964 10.625 8.75 11.1846 8.75 11.875C8.75 12.5654 9.30964 13.125 10 13.125Z" fill="currentColor"></path>
</svg>`,
    "icons/rss": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle cx="6.18" cy="17.82" r="2.18"/><path d="M4 4.44v2.83c7.03 0 12.73 5.7 12.73 12.73h2.83c0-8.59-6.97-15.56-15.56-15.56zm0 5.66v2.83c3.9 0 7.07 3.17 7.07 7.07h2.83c0-5.47-4.43-9.9-9.9-9.9z"/></svg>
`,
    "icons/search": `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" width="20" height="20"><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>`,
    "icons/twitter": `<svg class="icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor"><path d="M23.954 4.569c-.885.389-1.83.654-2.825.775 1.014-.611 1.794-1.574 2.163-2.723-.951.555-2.005.959-3.127 1.184-.896-.959-2.173-1.559-3.591-1.559-2.717 0-4.92 2.203-4.92 4.917 0 .39.045.765.127 1.124C7.691 8.094 4.066 6.13 1.64 3.161c-.427.722-.666 1.561-.666 2.475 0 1.71.87 3.213 2.188 4.096-.807-.026-1.566-.248-2.228-.616v.061c0 2.385 1.693 4.374 3.946 4.827-.413.111-.849.171-1.296.171-.314 0-.615-.03-.916-.086.631 1.953 2.445 3.377 4.604 3.417-1.68 1.319-3.809 2.105-6.102 2.105-.39 0-.779-.023-1.17-.067 2.189 1.394 4.768 2.209 7.557 2.209 9.054 0 13.999-7.496 13.999-13.986 0-.209 0-.42-.015-.63.961-.689 1.8-1.56 2.46-2.548l-.047-.02z"/></svg>`,
  },
  assets: {
    "built/casper.js": `!function(e,t){"function"==typeof define&&define.amd?define("ev-emitter/ev-emitter",t):"object"==typeof module&&module.exports?module.exports=t():e.EvEmitter=t()}("undefined"!=typeof window?window:this,function(){function e(){}var t=e.prototype;return t.on=function(e,t){if(e&&t){var i=this._events=this._events||{},e=i[e]=i[e]||[];return-1==e.indexOf(t)&&e.push(t),this}},t.once=function(e,t){if(e&&t){this.on(e,t);var i=this._onceEvents=this._onceEvents||{};return(i[e]=i[e]||{})[t]=!0,this}},t.off=function(e,t){e=this._events&&this._events[e];if(e&&e.length){t=e.indexOf(t);return-1!=t&&e.splice(t,1),this}},t.emitEvent=function(e,t){var i=this._events&&this._events[e];if(i&&i.length){i=i.slice(0),t=t||[];for(var n=this._onceEvents&&this._onceEvents[e],o=0;o<i.length;o++){var r=i[o];n&&n[r]&&(this.off(e,r),delete n[r]),r.apply(this,t)}return this}},t.allOff=function(){delete this._events,delete this._onceEvents},e}),function(t,i){"use strict";"function"==typeof define&&define.amd?define(["ev-emitter/ev-emitter"],function(e){return i(t,e)}):"object"==typeof module&&module.exports?module.exports=i(t,require("ev-emitter")):t.imagesLoaded=i(t,t.EvEmitter)}("undefined"!=typeof window?window:this,function(t,e){function r(e,t){for(var i in t)e[i]=t[i];return e}function s(e,t,i){if(!(this instanceof s))return new s(e,t,i);var n,o=e;return(o="string"==typeof e?document.querySelectorAll(e):o)?(this.elements=(n=o,Array.isArray(n)?n:"object"==typeof n&&"number"==typeof n.length?h.call(n):[n]),this.options=r({},this.options),"function"==typeof t?i=t:r(this.options,t),i&&this.on("always",i),this.getImages(),d&&(this.jqDeferred=new d.Deferred),void setTimeout(this.check.bind(this))):void a.error("Bad element for imagesLoaded "+(o||e))}function i(e){this.img=e}function n(e,t){this.url=e,this.element=t,this.img=new Image}var d=t.jQuery,a=t.console,h=Array.prototype.slice;(s.prototype=Object.create(e.prototype)).options={},s.prototype.getImages=function(){this.images=[],this.elements.forEach(this.addElementImages,this)},s.prototype.addElementImages=function(e){"IMG"==e.nodeName&&this.addImage(e),!0===this.options.background&&this.addElementBackgroundImages(e);var t=e.nodeType;if(t&&c[t]){for(var i=e.querySelectorAll("img"),n=0;n<i.length;n++){var o=i[n];this.addImage(o)}if("string"==typeof this.options.background)for(var r=e.querySelectorAll(this.options.background),n=0;n<r.length;n++){var s=r[n];this.addElementBackgroundImages(s)}}};var c={1:!0,9:!0,11:!0};return s.prototype.addElementBackgroundImages=function(e){var t=getComputedStyle(e);if(t)for(var i=/url((['"])?(.*?)1)/gi,n=i.exec(t.backgroundImage);null!==n;){var o=n&&n[2];o&&this.addBackground(o,e),n=i.exec(t.backgroundImage)}},s.prototype.addImage=function(e){e=new i(e);this.images.push(e)},s.prototype.addBackground=function(e,t){t=new n(e,t);this.images.push(t)},s.prototype.check=function(){function t(e,t,i){setTimeout(function(){n.progress(e,t,i)})}var n=this;return this.progressedCount=0,this.hasAnyBroken=!1,this.images.length?void this.images.forEach(function(e){e.once("progress",t),e.check()}):void this.complete()},s.prototype.progress=function(e,t,i){this.progressedCount++,this.hasAnyBroken=this.hasAnyBroken||!e.isLoaded,this.emitEvent("progress",[this,e,t]),this.jqDeferred&&this.jqDeferred.notify&&this.jqDeferred.notify(this,e),this.progressedCount==this.images.length&&this.complete(),this.options.debug&&a&&a.log("progress: "+i,e,t)},s.prototype.complete=function(){var e=this.hasAnyBroken?"fail":"done";this.isComplete=!0,this.emitEvent(e,[this]),this.emitEvent("always",[this]),this.jqDeferred&&(e=this.hasAnyBroken?"reject":"resolve",this.jqDeferred[e](this))},(i.prototype=Object.create(e.prototype)).check=function(){return this.getIsImageComplete()?void this.confirm(0!==this.img.naturalWidth,"naturalWidth"):(this.proxyImage=new Image,this.proxyImage.addEventListener("load",this),this.proxyImage.addEventListener("error",this),this.img.addEventListener("load",this),this.img.addEventListener("error",this),void(this.proxyImage.src=this.img.src))},i.prototype.getIsImageComplete=function(){return this.img.complete&&this.img.naturalWidth},i.prototype.confirm=function(e,t){this.isLoaded=e,this.emitEvent("progress",[this,this.img,t])},i.prototype.handleEvent=function(e){var t="on"+e.type;this[t]&&this[t](e)},i.prototype.onload=function(){this.confirm(!0,"onload"),this.unbindEvents()},i.prototype.onerror=function(){this.confirm(!1,"onerror"),this.unbindEvents()},i.prototype.unbindEvents=function(){this.proxyImage.removeEventListener("load",this),this.proxyImage.removeEventListener("error",this),this.img.removeEventListener("load",this),this.img.removeEventListener("error",this)},(n.prototype=Object.create(i.prototype)).check=function(){this.img.addEventListener("load",this),this.img.addEventListener("error",this),this.img.src=this.url,this.getIsImageComplete()&&(this.confirm(0!==this.img.naturalWidth,"naturalWidth"),this.unbindEvents())},n.prototype.unbindEvents=function(){this.img.removeEventListener("load",this),this.img.removeEventListener("error",this)},n.prototype.confirm=function(e,t){this.isLoaded=e,this.emitEvent("progress",[this,this.element,t])},(s.makeJQueryPlugin=function(e){(e=e||t.jQuery)&&((d=e).fn.imagesLoaded=function(e,t){return new s(this,e,t).jqDeferred.promise(d(this))})})(),s}),function(r){"use strict";r.fn.fitVids=function(e){var t,i,o={customSelector:null,ignore:null};return document.getElementById("fit-vids-style")||(t=document.head||document.getElementsByTagName("head")[0],(i=document.createElement("div")).innerHTML='<p>x</p><style id="fit-vids-style">.fluid-width-video-container{flex-grow: 1;width:100%;}.fluid-width-video-wrapper{width:100%;position:relative;padding:0;}.fluid-width-video-wrapper iframe,.fluid-width-video-wrapper object,.fluid-width-video-wrapper embed {position:absolute;top:0;left:0;width:100%;height:100%;}</style>',t.appendChild(i.childNodes[1])),e&&r.extend(o,e),this.each(function(){var e=['iframe[src*="player.vimeo.com"]','iframe[src*="youtube.com"]','iframe[src*="youtube-nocookie.com"]','iframe[src*="kickstarter.com"][src*="video.html"]',"object","embed"];o.customSelector&&e.push(o.customSelector);var n=".fitvidsignore";o.ignore&&(n=n+", "+o.ignore);e=r(this).find(e.join(","));(e=(e=e.not("object object")).not(n)).each(function(){var e,t,i=r(this);0<i.parents(n).length||"embed"===this.tagName.toLowerCase()&&i.parent("object").length||i.parent(".fluid-width-video-wrapper").length||(i.css("height")||i.css("width")||!isNaN(i.attr("height"))&&!isNaN(i.attr("width"))||(i.attr("height",9),i.attr("width",16)),e=("object"===this.tagName.toLowerCase()||i.attr("height")&&!isNaN(parseInt(i.attr("height"),10))?parseInt(i.attr("height"),10):i.height())/(isNaN(parseInt(i.attr("width"),10))?i.width():parseInt(i.attr("width"),10)),i.attr("name")||(t="fitvid"+r.fn.fitVids._count,i.attr("name",t),r.fn.fitVids._count++),i.wrap('<div class="fluid-width-video-container"><div class="fluid-width-video-wrapper"></div></div>').parent(".fluid-width-video-wrapper").css("padding-top",100*e+"%"),i.removeAttr("height").removeAttr("width"))})})},r.fn.fitVids._count=0}(window.jQuery||window.Zepto),function(){var n=window.matchMedia("(max-width: 767px)");const e=document.querySelector(".gh-head"),o=e.querySelector(".gh-head-menu"),r=o.querySelector(".nav");if(r){document.querySelector(".gh-head-logo");var t=r.innerHTML;if(n.matches){const s=r.querySelectorAll("li");s.forEach(function(e,t){e.style.transitionDelay=.03*(t+1)+"s"})}function i(){if(!n.matches){const e=[];for(;r.offsetWidth+64>o.offsetWidth;){if(!r.lastElementChild)return;e.unshift(r.lastElementChild),r.lastElementChild.remove()}if(e.length){const t=document.createElement("button");t.setAttribute("class","nav-more-toggle"),t.setAttribute("aria-label","More"),t.innerHTML='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="currentColor"><path d="M21.333 16c0-1.473 1.194-2.667 2.667-2.667v0c1.473 0 2.667 1.194 2.667 2.667v0c0 1.473-1.194 2.667-2.667 2.667v0c-1.473 0-2.667-1.194-2.667-2.667v0zM13.333 16c0-1.473 1.194-2.667 2.667-2.667v0c1.473 0 2.667 1.194 2.667 2.667v0c0 1.473-1.194 2.667-2.667 2.667v0c-1.473 0-2.667-1.194-2.667-2.667v0zM5.333 16c0-1.473 1.194-2.667 2.667-2.667v0c1.473 0 2.667 1.194 2.667 2.667v0c0 1.473-1.194 2.667-2.667 2.667v0c-1.473 0-2.667-1.194-2.667-2.667v0z"></path></svg>';const i=document.createElement("div");i.setAttribute("class","gh-dropdown"),10<=e.length?(document.body.classList.add("is-dropdown-mega"),i.style.gridTemplateRows="repeat("+Math.ceil(e.length/2)+", 1fr)"):document.body.classList.remove("is-dropdown-mega"),e.forEach(function(e){i.appendChild(e)}),t.appendChild(i),r.appendChild(t),document.body.classList.add("is-dropdown-loaded"),t.addEventListener("click",function(){document.body.classList.toggle("is-dropdown-open")}),window.addEventListener("click",function(e){!t.contains(e.target)&&document.body.classList.contains("is-dropdown-open")&&document.body.classList.remove("is-dropdown-open")})}else document.body.classList.add("is-dropdown-loaded")}}imagesLoaded(e,function(){i()}),window.addEventListener("resize",function(){setTimeout(function(){r.innerHTML=t,i()},1)})}}(),function(t,i){var n,o,r,s,d,a,h,c;function l(){if(404===this.status)return t.removeEventListener("scroll",m),void t.removeEventListener("resize",p);this.response.querySelectorAll("article.post-card").forEach(function(e){o.appendChild(i.importNode(e,!0))});var e=this.response.querySelector("link[rel=next]");e?n.href=e.href:(t.removeEventListener("scroll",m),t.removeEventListener("resize",p)),c=i.documentElement.scrollHeight,d=s=!1}function e(){var e;d||(a+h<=c-r?s=!1:(d=!0,(e=new t.XMLHttpRequest).responseType="document",e.addEventListener("load",l),e.open("GET",n.href),e.send(null)))}function u(){s||t.requestAnimationFrame(e),s=!0}function m(){a=t.scrollY,u()}function p(){h=t.innerHeight,c=i.documentElement.scrollHeight,u()}i.documentElement.classList.contains("no-infinite-scroll")||(!(n=i.querySelector("link[rel=next]"))||(o=i.querySelector(".post-feed"))&&(d=s=!(r=300),a=t.scrollY,h=t.innerHeight,c=i.documentElement.scrollHeight,t.addEventListener("scroll",m,{passive:!0}),t.addEventListener("resize",p),u()))}(window,document);`,
    "built/screen.css": `a,abbr,acronym,address,applet,article,aside,audio,big,blockquote,body,canvas,caption,cite,code,dd,del,details,dfn,div,dl,dt,em,embed,fieldset,figcaption,figure,footer,form,h1,h2,h3,h4,h5,h6,header,hgroup,html,iframe,img,ins,kbd,label,legend,li,mark,menu,nav,object,ol,output,p,pre,q,ruby,s,samp,section,small,span,strike,strong,sub,summary,sup,table,tbody,td,tfoot,th,thead,time,tr,tt,ul,var,video{border:0;font:inherit;font-size:100%;margin:0;padding:0;vertical-align:baseline}body{line-height:1}ol,ul{list-style:none}blockquote,q{quotes:none}blockquote:after,blockquote:before,q:after,q:before{content:"";content:none}img{display:block;height:auto;max-width:100%}html{-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;box-sizing:border-box;font-family:sans-serif}*,:after,:before{box-sizing:inherit}a{background-color:transparent}a:active,a:hover{outline:0}b,strong{font-weight:700}dfn,em,i{font-style:italic}h1{font-size:2em;margin:.67em 0}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sup{top:-.5em}sub{bottom:-.25em}img{border:0}svg:not(:root){overflow:hidden}mark{background-color:#fdffb6}code,kbd,pre,samp{font-family:monospace,monospace;font-size:1em}kbd{background:#f6f8fa;border:1px solid rgba(124,139,154,.25);border-radius:6px;box-shadow:inset 0 -1px 0 rgba(124,139,154,.25);font-family:var(--font-mono);font-size:1.5rem;padding:3px 5px}@media (max-width:600px){kbd{font-size:1.3rem}}button,input,optgroup,select,textarea{color:inherit;font:inherit;margin:0}button{border:none;overflow:visible}button,select{text-transform:none}button,html input[type=button],input[type=reset],input[type=submit]{-webkit-appearance:button;cursor:pointer}button[disabled],html input[disabled]{cursor:default}button::-moz-focus-inner,input::-moz-focus-inner{border:0;padding:0}input{line-height:normal}input:focus{outline:none}input[type=checkbox],input[type=radio]{box-sizing:border-box;padding:0}input[type=number]::-webkit-inner-spin-button,input[type=number]::-webkit-outer-spin-button{height:auto}input[type=search]{-webkit-appearance:textfield;box-sizing:content-box}input[type=search]::-webkit-search-cancel-button,input[type=search]::-webkit-search-decoration{-webkit-appearance:none}legend{border:0;padding:0}textarea{overflow:auto}table{border-collapse:collapse;border-spacing:0}td,th{padding:0}html{-webkit-tap-highlight-color:rgba(0,0,0,0);font-size:62.5%}body{text-rendering:optimizeLegibility;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;-moz-font-feature-settings:"liga" on;background:#fff;color:var(--color-darkgrey);font-family:var(--font-sans);font-size:1.6rem;font-style:normal;font-weight:400;letter-spacing:0;line-height:1.6em}::-moz-selection{background:#daf2fd;text-shadow:none}::selection{background:#daf2fd;text-shadow:none}hr{border:0;border-top:1px solid #f0f0f0;display:block;height:1px;margin:2.5em 0 3.5em;padding:0;position:relative;width:100%}audio,canvas,iframe,img,svg,video{vertical-align:middle}fieldset{border:0;margin:0;padding:0}textarea{resize:vertical}::not(.gh-content) blockquote,::not(.gh-content) dl,::not(.gh-content) ol,::not(.gh-content) p,::not(.gh-content) ul{margin:0 0 1.5em}ol,ul{padding-left:1.3em;padding-right:1.5em}ol ol,ol ul,ul ol,ul ul{margin:.5em 0 1em}ul{list-style:disc}ol{list-style:decimal}ol,ul{max-width:100%}li{line-height:1.6em;padding-left:.3em}li+li{margin-top:.5em}dt{color:#daf2fd;float:left;font-weight:500;margin:0 20px 0 0;text-align:right;width:120px}dd{margin:0 0 5px;text-align:left}blockquote{border-left:#daf2fd;margin:1.5em 0;padding:0 1.6em}blockquote small{display:inline-block;font-size:.9em;margin:.8em 0 .8em 1.5em;opacity:.8}blockquote small:before{content:"\x2014 \x00A0"}blockquote cite{font-weight:700}blockquote cite a{font-weight:400}a{color:#15171a;text-decoration:none}h1,h2,h3,h4,h5,h6{text-rendering:optimizeLegibility;font-weight:600;letter-spacing:-.01em;line-height:1.15;margin-top:0}h1{font-size:4.8rem;font-weight:700;letter-spacing:-.015em;margin:0 0 .5em}@media (max-width:600px){h1{font-size:2.8rem}}h2{font-size:2.8rem;font-weight:700;margin:1.5em 0 .5em}@media (max-width:600px){h2{font-size:2.3rem}}h3{font-size:2.4rem;font-weight:600;margin:1.5em 0 .5em}@media (max-width:600px){h3{font-size:1.7rem}}h4{font-size:2rem;margin:1.5em 0 .5em}@media (max-width:600px){h4{font-size:1.7rem}}h5{font-size:2rem}h5,h6{margin:1.5em 0 .5em}h6{font-size:1.8rem}:root{--color-green:#a4d037;--color-yellow:#fecd35;--color-red:#f05230;--color-darkgrey:#15171a;--color-midgrey:#738a94;--color-lightgrey:#f1f1f1;--color-secondary-text:#979797;--color-border:#e1e1e1;--color-wash:#e5eff5;--color-darkmode:#151719;--font-sans:-apple-system,BlinkMacSystemFont,"Segoe UI","Roboto","Oxygen","Ubuntu","Cantarell","Fira Sans","Droid Sans","Helvetica Neue",sans-serif;--font-serif:Georgia,Times,serif;--font-mono:Menlo,Courier,monospace}.viewport{display:flex;flex-direction:column;min-height:100vh}.site-content{flex-grow:1}.outer{padding:0 max(4vmin,20px);position:relative}.inner{margin:0 auto;max-width:1200px;width:100%}.site-header{background:var(--ghost-accent-color);color:#fff;position:relative}.site-header-cover{bottom:0;height:100%;left:0;-o-object-fit:cover;object-fit:cover;position:absolute;right:0;top:0;width:100%}.site-header-content{align-items:center;color:var(--color-darkgrey);display:flex;padding-bottom:19vmin;padding-top:calc(19vmin + 44px);position:relative;text-align:center;z-index:100}.has-cover .site-header-content{background-color:var(--ghost-accent-color);color:#fff;min-height:560px}.site-header-content.left-aligned{padding-bottom:0;text-align:left}.has-cover .site-header-content.left-aligned{align-items:flex-end;padding-bottom:max(4vmin,32px)}.site-header-content.no-content{padding-bottom:2vmin;padding-top:0}.site-header-inner{position:relative}.site-header-content.left-aligned .site-header-inner{align-items:flex-start}.site-logo{flex-shrink:0;margin:0 auto;max-height:120px}.site-header-content.left-aligned .site-logo{margin-left:0;margin-right:auto;max-height:96px}.site-title{font-size:5rem;font-weight:800;margin:0;padding:0;z-index:10}.has-serif-title .site-title{font-family:var(--font-serif)}.has-cover .site-title{font-size:6rem}.site-header-content.left-aligned .site-title{font-size:4.4rem}.has-cover .site-header-content.left-aligned .site-title{font-size:4.6rem}.site-description{display:inline-block;font-size:6rem;font-weight:700;line-height:1.1;max-width:960px;z-index:10}:is(.site-logo,.site-title)+.site-description{font-size:2.4rem;font-weight:400;line-height:1.4;margin-top:16px;max-width:640px}.site-logo+.site-description{margin-top:20px}.site-title+.site-description{color:var(--color-secondary-text)}.has-cover .site-description{color:#fff;letter-spacing:-.005em}.has-cover :is(.site-logo,.site-title)+.site-description{font-size:2.4rem}.has-cover .site-header-content.left-aligned :is(.site-logo,.site-title)+.site-description{font-size:2.2rem}@media (min-width:992px){.is-head-stacked.has-cover .site-header-content{padding-top:calc(19vmin + 120px)}}@media (max-width:991px){.site-header-content{padding-top:calc(19vmin + 32px)}}@media (max-width:767px){.has-cover .site-header-content{min-height:240px}.site-header-inner{gap:16px}.site-logo{max-width:60%}.site-title{font-size:3.4rem!important}.site-description{font-size:2.2rem!important}.site-logo+.site-description,.site-title+.site-description{margin-top:12px!important}}.gh-head{background-color:#fff;font-size:1.6rem;height:88px;line-height:1.3em}.has-cover:not(.home-template) .gh-head{background-color:var(--ghost-accent-color);color:#fff}:is(.home-template,.paged:not(.tag-template):not(.author-template)).has-cover .gh-head{background-color:transparent;color:#fff;left:0;position:absolute;right:0;top:0;z-index:2000}.gh-head a{text-decoration:none}.gh-head-inner{align-items:center;-moz-column-gap:40px;column-gap:40px;display:grid;grid-auto-flow:row dense;height:100%}.gh-head-inner,.is-head-left-logo .gh-head-inner{grid-template-columns:auto 1fr auto}.is-head-left-logo.home-template .gh-head:not(.is-header-hidden) .gh-head-logo{display:none}.is-head-left-logo.home-template .gh-head:not(.is-header-hidden) .gh-head-menu{margin-left:-40px}@media (min-width:992px){.is-head-left-logo .gh-head-menu{margin-left:16px;margin-right:64px}}.is-head-middle-logo .gh-head-inner{grid-template-columns:1fr auto 1fr}.is-head-middle-logo .gh-head-brand{grid-column-start:2}@media (min-width:992px){.is-head-middle-logo .gh-head-menu{margin-right:64px}}.is-head-stacked .gh-head{height:auto}.is-head-stacked .gh-head-inner{grid-template-columns:1fr auto 1fr}.is-head-stacked .gh-head-brand{grid-column-start:2;grid-row-start:1}@media (min-width:992px){.is-head-stacked .gh-head-inner{padding:0}.is-head-stacked .gh-head-brand{align-items:center;display:flex;height:80px;position:relative}.is-head-stacked .gh-head-menu{grid-column:1/4;grid-row-start:2;height:56px;justify-content:center;margin:0 48px}.is-head-stacked .gh-head-menu:after,.is-head-stacked .gh-head-menu:before{background-color:var(--color-lightgrey);content:"";height:1px;left:0;position:absolute;top:80px;width:100%}.is-head-stacked.has-cover .gh-head-menu:after,.is-head-stacked.has-cover .gh-head-menu:before{background-color:hsla(0,0%,100%,.2)}.is-head-stacked .gh-head-menu:after{top:136px}.is-head-stacked .gh-head-actions{grid-column:1/4;grid-row-start:1;justify-content:space-between}}.gh-head-brand{align-items:center;display:flex;height:40px;word-break:break-all}.gh-head-logo{color:inherit;display:block;font-size:2.6rem;font-weight:800;letter-spacing:-.02em;white-space:nowrap}.gh-head-logo.no-image{margin-top:-5px}.has-cover .gh-head-logo{color:#fff}.gh-head-logo img{max-height:40px}.gh-head-menu{align-items:center;display:flex;font-weight:500;margin-top:1px}.gh-head-menu .nav{align-items:center;display:inline-flex;flex-wrap:wrap;gap:32px;list-style:none;margin:0;padding:0}.gh-head-menu .nav li{margin:0;padding:0}.gh-head-menu .nav a{color:inherit;display:inline-block;line-height:1.7}.gh-head-menu .nav a:hover{opacity:.9}.gh-head-menu .nav-more-toggle{background-color:transparent;font-size:inherit;height:30px;margin:0 -6px;padding:0;position:relative;text-transform:inherit;width:30px}.gh-head-menu .nav-more-toggle svg{height:24px;width:24px}@media (min-width:992px){body:not(.is-dropdown-loaded) .gh-head-menu .nav>li{opacity:0}}.gh-dropdown{background-color:#fff;border-radius:5px;box-shadow:0 0 0 1px rgba(0,0,0,.04),0 7px 20px -5px rgba(0,0,0,.15);margin-top:24px;opacity:0;padding:12px 0;position:absolute;right:-16px;text-align:left;top:100%;transform:translate3d(0,6px,0);transition:opacity .3s,transform .2s;visibility:hidden;width:200px;z-index:90}.is-head-middle-logo .gh-dropdown{left:-24px;right:auto}.is-dropdown-mega .gh-dropdown{-moz-column-gap:40px;column-gap:40px;display:grid;grid-auto-flow:column;grid-template-columns:1fr 1fr;min-width:320px;padding:20px 32px}.is-dropdown-open .gh-dropdown{opacity:1;transform:translateY(0);visibility:visible}.gh-head-menu .gh-dropdown li a{color:#15171a;display:block;padding:6px 20px}.is-dropdown-mega .gh-dropdown li a{padding:8px 0}.gh-social{align-items:center;display:flex;gap:20px}.gh-social-link{color:inherit;line-height:0}.gh-social-link:hover{opacity:.9}.gh-social-link svg{height:18px;width:18px}.gh-head-actions{align-items:center;display:flex;gap:24px;justify-content:flex-end;list-style:none;text-align:right}.gh-head-members{align-items:center;display:flex;gap:20px}.gh-head-link{color:inherit;font-weight:500}.gh-head-button{align-items:center;background:var(--ghost-accent-color);border-radius:48px;color:#fff;display:inline-flex;font-size:1.6rem;font-weight:600;height:44px;justify-content:center;letter-spacing:-.005em;padding:8px 20px}.has-cover .gh-head-button{background:#fff;color:var(--color-darkgrey)}@media (max-width:767px){.gh-head-members{flex-direction:column-reverse;gap:16px;width:100%}}.gh-search{align-items:center;background-color:transparent;border:0;cursor:pointer;display:inline-flex;height:32px;justify-content:center;outline:none;padding:0;width:32px}.gh-search:hover{opacity:.9}.gh-head-brand .gh-search{margin-right:8px}.gh-head-actions .gh-search{margin-right:-4px}@media (max-width:767px){.gh-head-actions .gh-search{display:none}}@media (min-width:768px){.gh-head-brand .gh-search{display:none}}.gh-burger{-webkit-appearance:none;-moz-appearance:none;appearance:none;background-color:transparent;border:0;cursor:pointer;display:none;height:30px;margin-right:-3px;padding:0;position:relative;width:30px}.gh-burger:after,.gh-burger:before{background-color:var(--color-darkgrey);content:"";height:1px;left:3px;position:absolute;transition:all .2s cubic-bezier(.04,.04,.12,.96) .1008s;width:24px}.has-cover .gh-burger:after,.has-cover .gh-burger:before{background-color:#fff}.gh-burger:before{top:11px}.gh-burger:after{bottom:11px}.gh-head-open .gh-burger:before{top:15px;transform:rotate(45deg)}.gh-head-open .gh-burger:after{bottom:14px;transform:rotate(-45deg)}@media (max-width:767px){#gh-head{height:64px}#gh-head .gh-head-inner{gap:48px;grid-template-columns:1fr;grid-template-rows:auto 1fr auto}#gh-head .gh-head-brand{align-items:center;display:grid;grid-column-start:1;grid-template-columns:1fr auto auto;height:64px}#gh-head .gh-head-logo{font-size:2.2rem}#gh-head .gh-head-brand .gh-search{margin-left:-6px}#gh-head .gh-burger{display:block}#gh-head .gh-head-actions,#gh-head .gh-head-menu{justify-content:center;opacity:0;position:fixed;visibility:hidden}#gh-head .gh-head-menu{margin:0;transform:translateY(0);transition:none}#gh-head .nav{align-items:center;gap:16px;line-height:1.4}#gh-head .nav a{font-size:2.6rem;font-weight:600;text-transform:none}#gh-head .nav li{opacity:0;transform:translateY(-4px)}#gh-head :is(.gh-head-button,.gh-head-link){opacity:0;transform:translateY(8px)}#gh-head .gh-head-button{font-size:1.8rem;opacity:0;text-transform:none;transform:translateY(8px);width:100%}.gh-head-open #gh-head{-webkit-overflow-scrolling:touch;height:100%;inset:0;overflow-y:scroll;position:fixed;z-index:3999999}.gh-head-open.has-cover #gh-head,.gh-head-open.has-cover #gh-head .gh-head-actions{background-color:var(--ghost-accent-color)}.gh-head-open #gh-head .gh-head-actions,.gh-head-open #gh-head .gh-head-menu{opacity:1;position:static;visibility:visible}.gh-head-open #gh-head .nav{display:flex;flex-direction:column}.gh-head-open #gh-head .nav li{opacity:1;transform:translateY(0);transition:transform .2s,opacity .2s}.gh-head-open #gh-head .gh-head-actions{align-items:center;background-color:#fff;bottom:0;display:inline-flex;flex-direction:column;gap:12px;left:0;padding:max(4vmin,20px) 0 max(4vmin,28px);position:-webkit-sticky;position:sticky;right:0}.gh-head-open #gh-head :is(.gh-head-button,.gh-head-link){opacity:1;transform:translateY(0);transition:transform .4s,opacity .4s;transition-delay:.2s}.gh-head-open #gh-head .gh-head-link{transition-delay:.4s}}.post-feed{display:grid;gap:4.8vmin 4vmin;grid-template-columns:repeat(6,1fr);padding:max(4.8vmin,36px) 0 0;position:relative}:is(.tag-template,.author-template) .post-feed{margin-top:4vmin}@media (max-width:991px){.post-feed{grid-template-columns:1fr 1fr}}@media (max-width:767px){.post-feed{grid-gap:40px;grid-template-columns:1fr}}.post-card{background-size:cover;display:flex;flex-direction:column;grid-column:span 2;position:relative;word-break:break-word}.post-card-image-link{display:block;margin-bottom:32px;overflow:hidden;position:relative}.post-card-image-link:after{content:"";display:block;padding-bottom:55%}.post-card[class*=post-access-] .post-card-image-link:after{-webkit-backdrop-filter:blur(3px);backdrop-filter:blur(3px);background-color:rgba(0,0,0,.5)}.post-card.keep-ratio[class*=post-access-] .post-card-image-link:after{inset:0;padding-bottom:0;position:absolute}.post-card.keep-ratio:not(.post-card-large):not(.post-card-full) .post-card-image-link:after{padding-bottom:0}.post-card-image{background:var(--color-lightgrey) no-repeat center center;height:100%;inset:0;-o-object-fit:cover;object-fit:cover;position:absolute;width:100%}.post-card.keep-ratio:not(.post-card-large):not(.post-card-full) .post-card-image{position:static}.post-card-access{align-items:center;color:#fff;display:flex;font-size:1.5rem;font-weight:600;gap:4px;inset:0;justify-content:center;position:absolute;z-index:10}.post-card-content-link{color:var(--color-darkgrey);display:block;position:relative}.post-card-content-link:hover{text-decoration:none}.post-feed .no-image .post-card-content-link{padding:0}.no-image .post-card-header{margin-top:0}.post-card-tags{align-items:center;color:var(--color-secondary-text);display:flex;font-size:1.4rem;font-weight:600;gap:12px;letter-spacing:-.005em;line-height:1;margin:0 0 10px}.post-card-featured{align-items:center;color:var(--ghost-accent-color);display:flex;gap:3px;padding-left:18px;position:relative}.post-card-featured svg{left:0;position:absolute}.post-card-title{font-size:2.6rem;font-weight:800;line-height:1.2;margin:0}.post-card-content-link:hover .post-card-title{opacity:.9}.no-image .post-card-title{margin-top:0}.has-serif-title .post-card-title{font-family:var(--font-serif);letter-spacing:-.005em}.post-card-title svg{margin-left:-1px;margin-top:-3px}.post-card-content{display:flex;flex-direction:column;flex-grow:1}.post-card-excerpt{-webkit-line-clamp:3;-webkit-box-orient:vertical;display:-webkit-box;font-size:1.6rem;line-height:1.5;margin-top:12px;max-width:720px;overflow-y:hidden;word-break:break-word}.has-sans-body .post-card-excerpt{font-family:var(--font-sans)}.post-card:not(.post-card-large):not(.post-card-full):not(.dynamic):not(.no-image) .post-card-excerpt{-webkit-line-clamp:2}:is(.tag-template,.author-template) .post-card-excerpt{margin-top:6px}.post-card-meta{color:var(--color-secondary-text);font-size:1.3rem;margin-top:12px;padding:0}.post-card-meta,.post-card-meta>*{align-items:center;display:flex;gap:6px}.post-card-meta>*+:not(script):before{background-color:var(--color-secondary-text);border-radius:50%;content:"";height:2px;width:2px}.post-card-meta .sep{margin:0 4px}.author-profile-image{background:#fff;border-radius:100%;display:block;height:100%;-o-object-fit:cover;object-fit:cover;width:100%}.author-list{display:flex;flex-wrap:wrap;list-style:none;margin:0 0 0 4px;padding:0}.author-list-item{flex-shrink:0;margin:0;padding:0;position:relative}@media (min-width:1001px){.post-card-large{grid-gap:4vmin;border-top:0;display:grid;grid-column:span 6;grid-template-columns:repeat(3,1fr)}.post-card-large:not(.no-image) .post-card-header{margin-top:0}.post-card-large .post-card-image-link{grid-column:span 2;margin-bottom:0;position:relative}.post-card-large .post-card-content{grid-column:span 1}.post-card-large.no-image .post-card-content{grid-column:span 2}.post-card-large .post-card-image{height:100%;position:absolute;width:100%}.post-card-large .post-card-tags{margin-bottom:12px}.post-card-large .post-card-title{font-size:4.4rem;line-height:1.05;margin-top:0}.post-card-large .post-card-excerpt{margin-top:16px}.post-card-full{grid-column:span 6}.post-card-full .post-card-image-link{margin-bottom:40px}.post-card-full .post-card-tags{margin-bottom:14px}.post-card-full .post-card-title{font-size:6.4rem;line-height:.95}.post-card-full .post-card-excerpt{font-size:1.8rem;margin-top:20px}.post-card-large+.post-card-large:nth-child(2n){margin:32px 0}.post-card-large+.post-card-large:nth-child(2n) .post-card-content{order:-1}.post-card.dynamic{grid-column:span 3}.post-card.dynamic .post-card-title{font-size:3rem}}.pagination{align-items:center;display:none;grid-template-columns:1fr auto 1fr;margin-top:8vmin}html.no-infinite-scroll .pagination{display:grid}.pagination a{font-size:1.7rem;font-weight:600}.pagination .page-number{color:var(--color-secondary-text);grid-column-start:2}.pagination .older-posts{grid-column-start:3;text-align:right}@media (max-width:767px){.pagination .page-number{display:none}}.article{padding:max(8vmin,40px) 0 max(8vmin,64px);word-break:break-word}.page-template .article{padding-top:max(12vmin,64px)}.article-header{padding:0 0 max(6.4vmin,40px)}.page-template .article-header{padding-bottom:max(3.2vmin,28px)}.article-tag{font-size:1.6rem;margin-bottom:16px}.article-tag a{color:var(--color-secondary-text)}.article-title{color:var(--color-darkgrey);font-size:clamp(3.2rem,5vw,5.2rem);font-weight:800;line-height:1.05;margin-bottom:0}.has-serif-title .article-title{font-family:var(--font-serif)}.article-excerpt{color:var(--color-darkgrey);font-size:2rem;line-height:1.45;margin-top:20px;max-width:720px}.gh-canvas .article-image{grid-column:wide-start/wide-end;margin:max(6.4vmin,40px) 0 0;width:100%}.image-full .article-image{grid-column:full-start/full-end}.image-small .article-image{grid-column:main-start/main-end}.gh-canvas .article-image img{display:block;margin-left:auto;margin-right:auto;width:100%}@media (max-width:767px){.article-excerpt{font-size:1.7rem;margin-top:14px}}.gh-canvas{display:grid;grid-template-columns:[full-start] minmax(max(4vmin,20px),auto) [wide-start] minmax(auto,240px) [main-start] min(720px,calc(100% - max(8vmin, 40px))) [main-end] minmax(auto,240px) [wide-end] minmax(max(4vmin,20px),auto) [full-end]}.gh-canvas>*{grid-column:main-start/main-end}.kg-width-wide{grid-column:wide-start/wide-end}.kg-width-full{grid-column:full-start/full-end}.kg-width-full img{width:100%}.gh-content>*+*{margin-bottom:0;margin-top:max(3.2vmin,24px)}.gh-content>[id]{color:var(--color-darkgrey);margin:0}.has-serif-title .gh-content>[id]{font-family:var(--font-serif)}.gh-content>[id]:not(:first-child){margin:2em 0 0}.gh-content>[id]+*{margin-top:1.5rem!important}.gh-content>blockquote,.gh-content>hr{margin-top:max(4.8vmin,32px);position:relative}.gh-content>blockquote+*,.gh-content>hr+*{margin-top:max(4.8vmin,32px)!important}.gh-content a{color:var(--ghost-accent-color);text-decoration:underline;word-break:break-word}.gh-content>blockquote:not([class]),.gh-content>dl,.gh-content>ol,.gh-content>p,.gh-content>ul{font-family:var(--font-serif);font-size:2rem;font-weight:400;line-height:1.6em}.gh-content .kg-callout-card .kg-callout-text,.gh-content .kg-toggle-card .kg-toggle-content>ol,.gh-content .kg-toggle-card .kg-toggle-content>p,.gh-content .kg-toggle-card .kg-toggle-content>ul{font-family:var(--font-serif);font-size:1.9rem;font-weight:400;line-height:1.6em}.gh-content .kg-product-card .kg-product-card-description>ol,.gh-content .kg-product-card .kg-product-card-description>p,.gh-content .kg-product-card .kg-product-card-description>ul{font-size:1.7rem;line-height:1.6em}.gh-content .kg-callout-card .kg-callout-emoji{font-size:2.1rem;line-height:1.4em}.gh-content .kg-toggle-card .kg-toggle-heading-text{font-size:2rem}.has-sans-body .gh-content .kg-callout-card .kg-callout-text,.has-sans-body .gh-content .kg-toggle-card .kg-toggle-content>ol,.has-sans-body .gh-content .kg-toggle-card .kg-toggle-content>p,.has-sans-body .gh-content .kg-toggle-card .kg-toggle-content>ul,.has-sans-body .gh-content>blockquote,.has-sans-body .gh-content>dl,.has-sans-body .gh-content>ol,.has-sans-body .gh-content>p,.has-sans-body .gh-content>ul{font-family:var(--font-sans)}.gh-content .kg-product-card .kg-product-card-description>ol,.gh-content .kg-product-card .kg-product-card-description>ul,.gh-content .kg-toggle-card .kg-toggle-content>ol,.gh-content .kg-toggle-card .kg-toggle-content>ul,.gh-content>dl,.gh-content>ol,.gh-content>ul{padding-left:1.9em}.gh-content>blockquote:not([class]){font-style:italic;padding:0;position:relative}.gh-content>blockquote:not([class]):before{background:var(--ghost-accent-color);bottom:0;content:"";left:-1.5em;position:absolute;top:0;width:.3rem}.gh-content :not(pre)>code{background:#f0f6f9;border:1px solid #e1eaef;border-radius:.25em;color:#15171a;font-size:.9em;font-weight:400!important;line-height:1em;padding:.15em .4em;vertical-align:middle}.gh-content pre{background:var(--color-darkgrey);border-radius:5px;box-shadow:0 2px 6px -2px rgba(0,0,0,.1),0 0 1px rgba(0,0,0,.4);color:var(--color-wash);font-size:1.4rem;line-height:1.5em;overflow:auto;padding:16px 20px}@media (max-width:650px){.gh-content .kg-callout-card .kg-callout-text,.gh-content .kg-toggle-card .kg-toggle-content>ol,.gh-content .kg-toggle-card .kg-toggle-content>p,.gh-content .kg-toggle-card .kg-toggle-content>ul,.gh-content>blockquote:not([class]),.gh-content>dl,.gh-content>ol,.gh-content>p,.gh-content>ul{font-size:1.8rem}.gh-content .kg-product-card .kg-product-card-description>ol,.gh-content .kg-product-card .kg-product-card-description>p,.gh-content .kg-product-card .kg-product-card-description>ul{font-size:1.6rem}.gh-content blockquote:not([class]):before{left:min(-4vmin,-20px)}}.gh-content .kg-card+:not(.kg-card),.gh-content :not(.kg-card):not([id])+.kg-card{margin-bottom:0;margin-top:6vmin}.kg-embed-card{align-items:center;display:flex;flex-direction:column;width:100%}.kg-image-card img{margin:auto}.has-serif-title .kg-toggle-card .kg-toggle-heading-text{font-family:var(--font-serif)}.gh-content .kg-callout-card-accent a{text-decoration:underline}.kg-blockquote-alt{color:var(--color-midgrey);font-family:var(--font-serif)}.has-sans-body .kg-blockquote-alt{font-family:var(--font-sans)}.kg-card.kg-header-card.kg-style-dark{background:var(--color-darkgrey)}.kg-header-card.kg-style-light h2.kg-header-card-header{color:#0a0b0c}.has-serif-title .kg-header-card h2.kg-header-card-header{font-family:var(--font-serif)}figcaption{color:rgba(0,0,0,.5);font-size:1.3rem;line-height:1.4em;padding:1.5rem 1.5rem 0;text-align:center}figcaption strong{color:rgba(0,0,0,.8)}figcaption a{text-decoration:underline}iframe.instagram-media{margin:6vmin auto 0!important}iframe.instagram-media+script+:not([id]){margin-top:6vmin}.kg-width-full.kg-card-hascaption{display:grid;grid-template-columns:inherit}.kg-width-wide.kg-card-hascaption img{grid-column:wide-start/wide-end}.kg-width-full.kg-card-hascaption img{grid-column:1/-1}.kg-width-full.kg-card-hascaption figcaption{grid-column:main-start/main-end}.article-comments{margin:6vmin 0 0}.footnotes-sep{margin-bottom:30px}.footnotes{font-size:1.5rem}.footnotes p{margin:0}.footnote-backref{box-shadow:none!important;font-size:1.2rem;font-weight:700;text-decoration:none!important}.gh-content table:not(.gist table){-webkit-overflow-scrolling:touch;background:radial-gradient(ellipse at left,rgba(0,0,0,.2) 0,transparent 75%) 0,radial-gradient(ellipse at right,rgba(0,0,0,.2) 0,transparent 75%) 100%;background-attachment:scroll,scroll;background-repeat:no-repeat;background-size:10px 100%,10px 100%;border-collapse:collapse;border-spacing:0;display:inline-block;font-family:var(--font-sans);font-size:1.6rem;max-width:100%;overflow-x:auto;vertical-align:top;white-space:nowrap;width:auto}.gh-content table:not(.gist table) td:first-child{background-image:linear-gradient(90deg,#fff 50%,hsla(0,0%,100%,0));background-repeat:no-repeat;background-size:20px 100%}.gh-content table:not(.gist table) td:last-child{background-image:linear-gradient(270deg,#fff 50%,hsla(0,0%,100%,0));background-position:100% 0;background-repeat:no-repeat;background-size:20px 100%}.gh-content table:not(.gist table) th{background-color:#f4f8fb;color:var(--color-darkgrey);font-size:1.2rem;font-weight:700;letter-spacing:.2px;text-align:left;text-transform:uppercase}.gh-content table:not(.gist table) td,.gh-content table:not(.gist table) th{border:1px solid #e2ecf3;padding:6px 12px}.article-byline{display:flex;justify-content:space-between;margin:min(24px,5.6vmin) 0 0}.article-byline-content{align-items:center;display:flex;flex-grow:1}.article-byline-content .author-list{justify-content:flex-start;padding:0 14px 0 0}.article-byline-meta{color:var(--color-secondary-text);font-size:1.4rem;line-height:1.2em}.article-byline-meta .author-name{font-size:1.7rem;font-weight:700;letter-spacing:0;margin:0 0 6px}.article-byline-meta .bull{display:inline-block;margin:0 2px}.author-avatar{background-color:var(--color-border);border:2px solid #fff;border-radius:50%;display:block;height:min(56px,13.6vmin);margin:0 -4px;overflow:hidden;width:min(56px,13.6vmin)}.page-template .article-title{margin-bottom:0}@media (max-width:767px){.article-byline-content .author-list{padding-right:12px}.article-byline-meta .author-name{margin-bottom:4px}}.footer-cta{position:relative;text-align:center}.footer-cta-title{font-size:clamp(2.6rem,5vw,3.8rem);font-weight:800;margin:0 0 min(24px,6.4vmin)}.has-serif-title .footer-cta-title{font-family:var(--font-serif)}.footer-cta-button{align-items:center;background:#fff;border:1px solid var(--color-border);border-radius:8px;color:var(--color-secondary-text);display:inline-flex;font-size:1.7rem;justify-content:space-between;max-width:500px;padding:5px 5px 5px 15px;position:relative;transition:border-color .2s;width:100%}.footer-cta-button:hover{border-color:#c2c2c2}.footer-cta-button span{background:var(--ghost-accent-color);border-radius:6px;color:#fff;display:inline-block;font-size:1.6rem;font-weight:600;letter-spacing:-.005em;padding:9px 15px}.read-more-wrap{margin-top:2.4vmin}.footer-cta+.read-more-wrap{margin-top:max(12vmin,72px)}.read-more{grid-gap:4vmin;display:grid;grid-template-columns:repeat(6,1fr)}.read-more .post-card-tags{display:none}@media (max-width:1000px){.read-more{grid-template-columns:repeat(4,1fr)}.read-more .post-card:nth-child(3){display:none}}@media (max-width:700px){.read-more{grid-template-columns:repeat(2,1fr)}.read-more .post-card:nth-child(2){display:none}}.comments{align-items:center;display:flex;flex-direction:column;margin:60px 0 44px}.comments-head{align-items:baseline;display:flex;justify-content:space-between;margin-bottom:32px;max-width:720px;width:100%}.comments h2{font-size:3.4rem;font-weight:800;max-width:720px;width:100%}.comments .comment-count{color:var(--color-midgrey);font-weight:600;white-space:nowrap}.comments #ghost-comments-root{max-width:720px;width:100%}.author-profile-pic{background:#fff;border-radius:50%;display:block;height:80px;margin:0 0 2rem;-o-object-fit:cover;object-fit:cover;width:80px}.author-profile-footer{margin-top:16px}.author-profile-location{font-weight:700}.author-profile-meta{display:flex;gap:10px}.author-profile-social-link{color:var(--color-secondary-text);font-size:1.3rem}.author-profile-social-link:hover{color:var(--color-darkgrey)}.author-profile-social-link svg{height:16px;width:16px}@media (min-width:1001px){.author-template .post-card-large .post-card-content:only-child{grid-column:span 2;max-width:640px}}.tag-template .post-card-large .post-card-image-link{grid-column:2/span 2;order:2}.tag-template .post-card-large .post-card-content{order:1}@media (min-width:1001px){.tag-template .post-card-large .post-card-content:only-child{grid-column:span 2;max-width:640px}}.error-content{padding:14vw 4vw 2vw}.error-message{padding-bottom:10vw;text-align:center}.error-code{font-size:12vw;letter-spacing:-5px;line-height:1em;margin:0}.error-description{color:var(--color-secondary-text);font-size:3.2rem;font-weight:400;letter-spacing:-.005em;line-height:1.3em;margin:0}.error-link{display:inline-block;margin-top:5px}@media (min-width:940px){.error-content .post-card{border-bottom:none;margin-bottom:0;padding-bottom:0}}@media (max-width:800px){.error-content{padding-top:24vw}.error-code{font-size:11.2rem}.error-message{padding-bottom:16vw}.error-description{font-size:1.8rem;margin:5px 0 0}}@media (max-width:500px){.error-content{padding-top:28vw}.error-message{padding-bottom:14vw}}.site-footer{background:#0a0b0c;color:#fff;margin:max(12vmin,64px) 0 0;padding-bottom:140px;padding-top:48px;position:relative}.site-footer .inner{grid-gap:40px;color:hsla(0,0%,100%,.7);display:grid;font-size:1.3rem;grid-template-columns:auto 1fr auto}.site-footer .copyright a{color:#fff;font-weight:500;letter-spacing:-.015em}.site-footer a{color:hsla(0,0%,100%,.7)}.site-footer a:hover{color:#fff;text-decoration:none}.site-footer-nav ul{display:flex;flex-wrap:wrap;justify-content:center;list-style:none;margin:0 0 20px;padding:0}.site-footer-nav li{align-items:center;display:inline-flex;line-height:2em;margin:0;padding:0}.site-footer-nav a{align-items:center;display:inline-flex;margin-left:10px;position:relative}.site-footer-nav li:not(:first-child) a:before{background:#fff;border-radius:100%;content:"";display:block;height:2px;margin:0 10px 0 0;width:2px}@media (max-width:767px){.site-footer .inner{grid-gap:0;grid-template-columns:1fr;max-width:500px;text-align:center}.site-footer .copyright,.site-footer .copyright a{color:#fff;font-size:1.5rem}.site-footer .copyright{margin-bottom:16px}}html.dark-mode body{background:var(--color-darkmode);color:hsla(0,0%,100%,.75)}html.dark-mode img{opacity:.9}html.dark-mode kbd{background:#212427}html.dark-mode figcaption a{color:#fff}html.dark-mode .gh-head{background:var(--color-darkmode);color:#fff}html.dark-mode .gh-burger-box,html.dark-mode .site-header-content{color:#fff}html.dark-mode .post-card-image{background:var(--color-darkmode)}html.dark-mode :is(.post-card-tags,.post-card-meta,.article-tag a,.byline-meta-content,.pagination .page-number){color:#5f5f5f}html.dark-mode .post-card-featured,html.dark-mode .post-card-title{color:#fff}html.dark-mode .post-card-excerpt{color:var(--color-secondary-text)}html.dark-mode .article-title,html.dark-mode .author-profile-location,html.dark-mode .author-profile-social-link:hover,html.dark-mode .pagination a{color:#fff}html.dark-mode .article-excerpt{color:var(--color-secondary-text)}html.dark-mode .post-full-image{background-color:#282b2f}html.dark-mode .author-avatar{background-color:#282b2f;border-color:var(--color-darkmode)}html.dark-mode .author-profile-image{opacity:1}html.dark-mode .author-profile-image path{fill:var(--color-darkmode)}html.dark-mode .article-byline-meta .author-name a{color:#fff}html.dark-mode .no-image .author-social-link a{color:hsla(0,0%,100%,.75)}html.dark-mode .gh-content>[id]{color:hsla(0,0%,100%,.9)}html.dark-mode .gh-content pre{background:#030303}html.dark-mode .gh-content :not(pre)>code{background:#23262b;border-color:#282b2f;color:var(--color-wash)}:where(html.dark-mode) .gh-content a{color:#fff}html.dark-mode .gh-content em,html.dark-mode .gh-content strong{color:#fff}html.dark-mode .gh-content code{background:#000;color:#fff}html.dark-mode hr{border-top-color:#282b2f}html.dark-mode .gh-content hr:after{background:#282b2f;box-shadow:var(--color-darkmode) 0 0 0 5px}html.dark-mode figcaption{color:hsla(0,0%,100%,.6)}html.dark-mode .gh-content table:not(.gist table) td:first-child{background-image:linear-gradient(to right,var(--color-darkmode) 50%,rgba(21,23,25,0) 100%)}html.dark-mode .gh-content table:not(.gist table) td:last-child{background-image:linear-gradient(to left,var(--color-darkmode) 50%,rgba(21,23,25,0) 100%)}html.dark-mode .gh-content table:not(.gist table) th{background-color:#282b2f;color:hsla(0,0%,100%,.85)}html.dark-mode .gh-content table:not(.gist table) td,html.dark-mode .gh-content table:not(.gist table) th{border:1px solid #282b2f}html.dark-mode .gh-content input{color:#303a3e}html.dark-mode .site-archive-header .no-image{background:var(--color-darkmode);color:hsla(0,0%,100%,.9)}html.dark-mode .kg-header-card.kg-style-dark{background:#0a0b0c}html.dark-mode .kg-header-card.kg-style-light{background:#202328}html.dark-mode .footer-cta-title,html.dark-mode .kg-header-card h2.kg-header-card-header,html.dark-mode .kg-header-card h3.kg-header-card-subheader{color:#fff}@media (prefers-color-scheme:dark){html.auto-color body{background:var(--color-darkmode);color:hsla(0,0%,100%,.75)}html.auto-color img{opacity:.9}html.auto-color kbd{background:#212427}html.auto-color figcaption a{color:#fff}html.auto-color .gh-head{background:var(--color-darkmode);color:#fff}html.auto-color .gh-burger-box,html.auto-color .site-header-content{color:#fff}html.auto-color .post-card-image{background:var(--color-darkmode)}html.auto-color :is(.post-card-tags,.post-card-meta,.article-tag a,.byline-meta-content,.pagination .page-number){color:#5f5f5f}html.auto-color .post-card-featured,html.auto-color .post-card-title{color:#fff}html.auto-color .post-card-excerpt{color:var(--color-secondary-text)}html.auto-color .article-title,html.auto-color .author-profile-location,html.auto-color .author-profile-social-link:hover,html.auto-color .pagination a{color:#fff}html.auto-color .article-excerpt{color:var(--color-secondary-text)}html.auto-color .post-full-image{background-color:#282b2f}html.auto-color .author-avatar{background-color:#282b2f;border-color:var(--color-darkmode)}html.auto-color .author-profile-image{opacity:1}html.auto-color .author-profile-image path{fill:var(--color-darkmode)}html.auto-color .article-byline-meta .author-name a{color:#fff}html.auto-color .no-image .author-social-link a{color:hsla(0,0%,100%,.75)}html.auto-color .gh-content>[id]{color:hsla(0,0%,100%,.9)}html.auto-color .gh-content pre{background:#030303}html.auto-color .gh-content :not(pre)>code{background:#23262b;border-color:#282b2f;color:var(--color-wash)}:where(html.auto-color) .gh-content a{color:#fff}html.auto-color .gh-content em,html.auto-color .gh-content strong{color:#fff}html.auto-color .gh-content code{background:#000;color:#fff}html.auto-color hr{border-top-color:#282b2f}html.auto-color .gh-content hr:after{background:#282b2f;box-shadow:var(--color-darkmode) 0 0 0 5px}html.auto-color figcaption{color:hsla(0,0%,100%,.6)}html.auto-color .gh-content table:not(.gist table) td:first-child{background-image:linear-gradient(to right,var(--color-darkmode) 50%,rgba(21,23,25,0) 100%)}html.auto-color .gh-content table:not(.gist table) td:last-child{background-image:linear-gradient(to left,var(--color-darkmode) 50%,rgba(21,23,25,0) 100%)}html.auto-color .gh-content table:not(.gist table) th{background-color:#282b2f;color:hsla(0,0%,100%,.85)}html.auto-color .gh-content table:not(.gist table) td,html.auto-color .gh-content table:not(.gist table) th{border:1px solid #282b2f}html.auto-color .gh-content input{color:#303a3e}html.auto-color .site-archive-header .no-image{background:var(--color-darkmode);color:hsla(0,0%,100%,.9)}html.auto-color .kg-header-card.kg-style-dark{background:#0a0b0c}html.auto-color .kg-header-card.kg-style-light{background:#202328}html.auto-color .footer-cta-title,html.auto-color .kg-header-card h2.kg-header-card-header,html.auto-color .kg-header-card h3.kg-header-card-subheader{color:#fff}}`,
  },
};

export const DEFAULTS = {
  posts_per_page: 25,
  image_sizes: {
    xxs: {
      width: 30,
    },
    xs: {
      width: 100,
    },
    s: {
      width: 300,
    },
    m: {
      width: 600,
    },
    l: {
      width: 1000,
    },
    xl: {
      width: 2000,
    },
  },
  card_assets: true,
  custom: {
    navigation_layout: {
      type: "select",
      options: ["Logo on cover", "Logo in the middle", "Stacked"],
      default: "Logo on cover",
    },
    title_font: {
      type: "select",
      options: ["Modern sans-serif", "Elegant serif"],
      default: "Modern sans-serif",
    },
    body_font: {
      type: "select",
      options: ["Modern sans-serif", "Elegant serif"],
      default: "Elegant serif",
    },
    show_publication_cover: {
      type: "boolean",
      default: true,
      group: "homepage",
    },
    header_style: {
      type: "select",
      options: ["Center aligned", "Left aligned", "Hidden"],
      default: "Center aligned",
      group: "homepage",
    },
    feed_layout: {
      type: "select",
      options: ["Classic", "Grid", "List"],
      default: "Classic",
      group: "homepage",
    },
    color_scheme: {
      type: "select",
      options: ["Light", "Dark", "Auto"],
      default: "Light",
    },
    post_image_style: {
      type: "select",
      options: ["Wide", "Full", "Small", "Hidden"],
      default: "Wide",
      group: "post",
    },
    email_signup_text: {
      type: "text",
      default: "Sign up for more like this.",
      group: "post",
    },
    show_recent_posts_footer: {
      type: "boolean",
      default: true,
      group: "post",
    },
  },
};
