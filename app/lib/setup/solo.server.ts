export const THEME = {
  name: "solo",
  templates: {
    author: `{{!< default}}

    <main class="gh-main gh-outer">
        {{#author}}
            <section class="gh-article gh-inner">
                <header class="gh-article-header">
                    {{#if profile_image}}
                        <img class="gh-author-image" src="{{img_url profile_image size="s"}}" alt="{{name}}">
                    {{/if}}
                    <h1 class="gh-article-title">{{name}}</h1>
                    {{#if bio}}
                        <p class="gh-article-excerpt">{{bio}}</p>
                    {{/if}}
                </header>
                <footer class="gh-author-meta">
                    {{#if location}}
                        <div class="gh-author-location">{{location}}</div>
                    {{/if}}
                    <div class="gh-author-social">
                        {{#if website}}
                            <a class="gh-author-social-link" href="{{website}}" target="_blank" rel="noopener">{{website}}</a>
                        {{/if}}
                        {{#if twitter}}
                            <a class="gh-author-social-link" href="{{twitter_url}}" target="_blank" rel="noopener">{{> "icons/twitter"}}</a>
                        {{/if}}
                        {{#if facebook}}
                            <a class="gh-author-social-link" href="{{facebook_url}}" target="_blank" rel="noopener">{{> "icons/facebook"}}</a>
                        {{/if}}
                    </div>
                </footer>
            </section>
        {{/author}}
        <div class="gh-feed{{#match @custom.header_section_layout "!=" "Large background"}} gh-inner{{/match}}">
            {{#foreach posts}}
                {{> "loop"}}
            {{/foreach}}
        </div>
    </main>`,
    default: `<!DOCTYPE html>
    <html lang="{{@site.locale}}">
    
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>{{meta_title}}</title>
        <link rel="stylesheet" href="{{asset "built/screen.css"}}">
    
        {{#is "home"}}
            {{#if @site.cover_image}}
                <link rel="preload" as="image" href="{{@site.cover_image}}">
            {{/if}}
        {{/is}}
    
        <style>
            :root {
                --background-color: {{@custom.background_color}}
            }
        </style>
    
        <script>
            /* The script for calculating the color contrast was taken from
            https://gomakethings.com/dynamically-changing-the-text-color-based-on-background-color-contrast-with-vanilla-js/ */
            var accentColor = getComputedStyle(document.documentElement).getPropertyValue('--background-color');
            accentColor = accentColor.trim().slice(1);
            var r = parseInt(accentColor.substr(0, 2), 16);
            var g = parseInt(accentColor.substr(2, 2), 16);
            var b = parseInt(accentColor.substr(4, 2), 16);
            var yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
            var textColor = (yiq >= 128) ? 'dark' : 'light';
    
            document.documentElement.className = "has-" + textColor + "-text";
        </script>
    
        {{ghost_head}}
    </head>
    
    <body class="{{body_class}}{{{block "body_class"}}} is-head-{{#match @custom.navigation_layout "Logo on the left"}}left-logo{{else match @custom.navigation_layout "Logo in the middle"}}middle-logo{{else}}stacked{{/match}}{{#match @custom.typography "Elegant serif"}} has-serif-font{{/match}}{{#match @custom.typography "Consistent mono"}} has-mono-font{{/match}}{{#match @custom.post_feed_layout "Classic"}} has-classic-feed{{/match}}{{#match @custom.post_feed_layout "Typographic"}} has-typographic-feed{{/match}}{{#match @custom.post_feed_layout "Parallax"}} has-parallax-feed{{/match}}">
    <div class="gh-site">
    
        <header id="gh-head" class="gh-head gh-outer">
            <div class="gh-head-inner gh-inner">
                <div class="gh-head-brand">
                    <div class="gh-head-brand-wrapper">
                        <a class="gh-head-logo" href="{{@site.url}}">
                            {{#if @site.logo}}
                                <img src="{{@site.logo}}" alt="{{@site.title}}">
                            {{else}}
                                {{@site.title}}
                            {{/if}}
                        </a>
                    </div>
                    <button class="gh-search gh-icon-btn" aria-label="Search this site" data-ghost-search>{{> "icons/search"}}</button>
                    <button class="gh-burger"></button>
                </div>
    
                <nav class="gh-head-menu">
                    {{navigation}}
                    {{#unless @site.members_enabled}}
                        {{#match @custom.navigation_layout "Stacked"}}
                            <button class="gh-search gh-icon-btn" aria-label="Search this site" data-ghost-search>{{> "icons/search"}}</button>
                        {{/match}}
                    {{/unless}}
                </nav>
    
                <div class="gh-head-actions">
                    {{#unless @site.members_enabled}}
                        {{^match @custom.navigation_layout "Stacked"}}
                            <button class="gh-search gh-icon-btn" aria-label="Search this site" data-ghost-search>{{> "icons/search"}}</button>
                        {{/match}}
                    {{else}}
                        <button class="gh-search gh-icon-btn" aria-label="Search this site" data-ghost-search>{{> "icons/search"}}</button>
                        <div class="gh-head-members">
                            {{#unless @member}}
                                {{#unless @site.members_invite_only}}
                                    <a class="gh-head-link" href="#/portal/signin" data-portal="signin">Sign in</a>
                                    <a class="gh-head-btn gh-btn gh-primary-btn" href="#/portal/signup" data-portal="signup">Subscribe</a>
                                {{else}}
                                    <a class="gh-head-btn gh-btn gh-primary-btn" href="#/portal/signin" data-portal="signin">Sign in</a>
                                {{/unless}}
                            {{else}}
                                <a class="gh-head-btn gh-btn gh-primary-btn" href="#/portal/account" data-portal="account">Account</a>
                            {{/unless}}
                        </div>
                    {{/unless}}
                </div>
            </div>
        </header>
    
        {{{body}}}
    
        <footer class="gh-foot gh-outer">
            <div class="gh-foot-inner gh-inner">
                <nav class="gh-foot-menu">
                    {{navigation type="secondary"}}
                </nav>
    
                <div class="gh-copyright">
                    {{#unless @custom.footer_text}}
                        {{@site.title}} © {{date format="YYYY"}}. Powered by <a href="https://ghost.org/" target="_blank" rel="noopener">Ghost</a>
                    {{else}}
                        {{@custom.footer_text}}
                    {{/unless}}
                </div>
            </div>
        </footer>
    
    </div>
    
    {{#is "post, page"}}
        {{> "pswp"}}
    {{/is}}
    
    <script src="{{asset "built/main.min.js"}}"></script>
    
    {{ghost_foot}}
    
    </body>
    
    </html>
    `,
    index: `{{!< default}}

    <section class="gh-about gh-outer{{#match @custom.header_section_layout "!=" "Typographic profile"}}{{#unless @site.cover_image}} no-image{{/unless}}{{else}}{{#unless @site.icon}} no-image{{/unless}}{{/match}}">
        <div class="gh-about-inner gh-inner">
            {{#match @custom.header_section_layout "!=" "Typographic profile"}}
                {{#if @site.cover_image}}
                    <img class="gh-about-image" src="{{@site.cover_image}}" alt="{{@site.title}}">
                {{/if}}
            {{else}}
                {{#if @site.icon}}
                    <img class="gh-about-image" src="{{@site.icon}}" alt="{{@site.title}}">
                {{/if}}
            {{/match}}
            <script>
                (function () {
                    if (!document.body.classList.contains('has-background-about')) return;
    
                    const about = document.querySelector('.gh-about');
                    if (!about) return;
    
                    const image = about.querySelector('.gh-about-image');
    
                    about.style.setProperty('--about-height', image.clientWidth * image.naturalHeight / image.naturalWidth + 'px');
                    about.classList.add('initialized');
                })();
            </script>
            <div class="gh-about-content">
                <div class="gh-about-content-inner">
                    {{#if @custom.primary_header}}
                        <h1 class="gh-about-primary">{{{@custom.primary_header}}}</h1>
                    {{/if}}
                    {{#if @custom.secondary_header}}
                        <p class="gh-about-secondary">{{{@custom.secondary_header}}}</p>
                    {{/if}}
                    {{#if @site.members_enabled}}
                        {{#unless @member}}
                            <div class="gh-subscribe-input" data-portal>
                                jamie@example.com
                                <span class="gh-btn gh-primary-btn">Subscribe</span>
                            </div>
                        {{/unless}}
                    {{/if}}
                </div>
            </div>
        </div>
    </section>
    
    <main class="gh-main gh-outer">
        <div class="gh-feed gh-inner">
            {{#foreach posts}}
                {{> "loop"}}
            {{/foreach}}
        </div>
    </main>
    
    {{#contentFor "body_class"}}{{#match @custom.header_section_layout "Side by side"}} has-side-about{{/match}}{{#match @custom.header_section_layout "Large background"}}{{#if @site.cover_image}} is-head-transparent has-background-about{{else}} has-side-about{{/if}}{{/match}}{{#match @custom.header_section_layout "Typographic profile"}}{{#if @site.icon}} has-typographic-about{{else}} has-side-about{{/if}}{{/match}}{{/contentFor}}
    `,
    page: `{{!< default}}

    {{#post}}
    
    <main class="gh-main gh-outer">
        <div class="gh-inner">
            <article class="gh-article {{post_class}}">
                <header class="gh-article-header gh-canvas">
                    <h1 class="gh-article-title">{{title}}</h1>
                    {{#if custom_excerpt}}
                        <p class="gh-article-excerpt">{{custom_excerpt}}</p>
                    {{/if}}
                    {{> "feature-image"}}
                </header>
    
                <section class="gh-content gh-canvas">
                    {{content}}
                </section>
            </article>
        </div>
    </main>
    
    {{/post}}`,
    post: `{{!< default}}

    <main class="gh-main gh-outer">
        <div class="gh-inner">
            {{#post}}
                <article class="gh-article {{post_class}}">
                    {{#if feature_image}}
                        <header class="gh-article-header gh-canvas">
                            <h1 class="gh-article-title">{{title}}</h1>
                            {{#if custom_excerpt}}
                                <p class="gh-article-excerpt">{{custom_excerpt}}</p>
                            {{/if}}
                            {{> "feature-image"}}
                        </header>
                    {{/if}}
    
                    <section class="gh-content gh-canvas">
                        {{content}}
                        {{#unless feature_image}}
                            <header class="gh-article-header">
                                <h1 class="gh-article-title">{{title}}</h1>
                                {{#if custom_excerpt}}
                                    <p class="gh-article-excerpt">{{custom_excerpt}}</p>
                                {{/if}}
                            </header>
                        {{/unless}}
                        <aside class="gh-article-meta">
                            <div class="gh-article-meta-inner">
                                {{#primary_author}}
                                    {{#if profile_image}}
                                        <figure class="gh-author-image">
                                            <img src="{{profile_image}}" alt="{{name}}">
                                        </figure>
                                    {{/if}}
                                    <div class="gh-article-meta-wrapper">
                                    <h4 class="gh-author-name">
                                        <a href="{{url}}">{{name}}</a>
                                    </h4>
                                {{/primary_author}}
                                <time class="gh-article-date" datetime="{{date format="YYYY-MM-DD"}}">{{date}}</time></div>
                                {{#if primary_tag}}
                                    <a class="gh-article-tag" href="{{primary_tag.url}}" style="--tag-color: {{primary_tag.accent_color}}">{{primary_tag.name}}</a>
                                {{/if}}
                            </div>
                        </aside>
                    </section>
    
                    {{#if comments}}
                        <div class="gh-comments gh-canvas">
                            <h2 class="gh-comments-title">{{comment_count empty="" single="comment" plural="comments"}}</h2>
                            {{comments title="" count=false}}
                        </div>
                    {{/if}}
    
                    <footer class="gh-article-footer gh-canvas">
                        <nav class="gh-navigation">
                            <div class="gh-navigation-previous">
                                {{#prev_post}}
                                    <a class="gh-navigation-link" href="{{url}}">← Previous</a>
                                {{/prev_post}}
                            </div>
    
                            <div class="gh-navigation-middle"></div>
    
                            <div class="gh-navigation-next">
                                {{#next_post}}
                                    <a class="gh-navigation-link" href="{{url}}">Next →</a>
                                {{/next_post}}
                            </div>
                        </nav>
                    </footer>
                </article>
            {{/post}}
        </div>
    </main>`,
    tag: `{{!< default}}

    <main class="gh-main gh-outer">
        {{#tag}}
            <section class="gh-article gh-inner">
                <header class="gh-article-header">
                    <h1 class="gh-article-title">{{name}}</h1>
                    {{#if description}}
                        <p class="gh-article-excerpt">{{description}}</p>
                    {{/if}}
                    {{> "feature-image"}}
                </header>
            </section>
        {{/tag}}
        <div class="gh-feed{{#match @custom.header_section_layout "!=" "Large background"}} gh-inner{{/match}}">
            {{#foreach posts}}
                {{> "loop"}}
            {{/foreach}}
        </div>
    </main>`,
  },
  partials: {
    "content-cta": `{{{html}}}

    <section class="gh-cta">
        {{#has visibility="paid"}}
            <h4 class="gh-cta-title">This post is for paying subscribers only</h4>
        {{/has}}
        {{#has visibility="members"}}
            <h4 class="gh-cta-title">This post is for subscribers only</h4>
        {{/has}}
        {{#has visibility="filter"}}
            <h4 class="gh-cta-title">This post is for subscribers on the {{tiers}} only</h4>
        {{/has}}
    
        <div class="gh-cta-actions">
            {{#if @member}}
                <button class="gh-btn gh-primary-btn" href="#/portal/account/plans" data-portal="account/plans">Upgrade now</button>
            {{else}}
                <button class="gh-btn gh-primary-btn" href="#/portal/signup" data-portal="signup">Subscribe now</button>
                <span class="gh-cta-link" href="#/portal/signin" data-portal="signin">Already have an account? Sign in.</span>
            {{/if}}
        </div>
    </section>`,
    "feature-image": `{{#if feature_image}}
    <figure class="gh-article-image{{#if feature_image_caption}} has-caption{{/if}}">
        <img
            srcset="{{img_url feature_image size="s"}} 300w,
                    {{img_url feature_image size="m"}} 720w,
                    {{img_url feature_image size="l"}} 960w,
                    {{img_url feature_image size="xl"}} 1200w,
                    {{img_url feature_image size="xxl"}} 2000w,
                    {{img_url feature_image}}"
            sizes="(max-width: 1200px) 100vw, 1200px"
            src="{{img_url feature_image size="xl"}}"
            alt="{{title}}"
        >
        {{#if feature_image_caption}}
            <figcaption>{{feature_image_caption}}</figcaption>
        {{/if}}
    </figure>
{{/if}}`,
    loop: `<article class="gh-card {{post_class}}"{{#if primary_tag.accent_color}} style="--tag-color: {{primary_tag.accent_color}};"{{/if}}>
    <a class="gh-card-link" href="{{url}}">

        {{#match @custom.post_feed_layout "!=" "Typographic"}}
            <figure class="gh-card-image">
                {{#if feature_image}}
                    <img
                        {{#match @custom.post_feed_layout "Parallax"}}class="jarallax-img"{{/match}}
                        srcset="{{img_url feature_image size="s"}} 300w,
                                {{img_url feature_image size="m"}} 720w,
                                {{img_url feature_image size="l"}} 960w,
                                {{img_url feature_image size="xl"}} 1200w,
                                {{img_url feature_image size="xxl"}} 2000w"
                        sizes="(max-width: 1200px) 100vw, 1200px"
                        src="{{img_url feature_image size="m"}}"
                        alt="{{#if feature_image_alt}}{{feature_image_alt}}{{else}}{{title}}{{/if}}"
                    >
                {{/if}}
            </figure>
        {{/match}}

        <div class="gh-card-wrapper">
            <h2 class="gh-card-title">{{title}}</h2>
            {{#match @custom.post_feed_layout "Typographic"}}
                {{#if custom_excerpt}}
                    <p class="gh-card-excerpt">{{excerpt}}</p>
                {{/if}}
            {{/match}}
            <footer class="gh-card-meta">
                <time class="gh-card-date" datetime="{{date format="YYYY-MM-DD"}}">{{date}}</time>
                {{#if reading_time}}
                    <span class="gh-card-length">{{reading_time}}</span>
                {{/if}}
                {{#unless access}}
                {{^has visibility="public"}}
                    <span class="gh-card-access">
                        {{> "icons/lock"}}
                        {{#has visibility="members"}}
                            Members
                        {{else}}
                            Paid
                        {{/has}}
                    </span>
                {{/has}}
                {{/unless}}
                {{#if @site.comments_enabled}}
                    {{comment_count class="gh-card-comments"}}
                {{/if}}
            </footer>
        </div>

    </a>
</article>`,
    pswp: `<div class="pswp" tabindex="-1" role="dialog" aria-hidden="true">
    <div class="pswp__bg"></div>

    <div class="pswp__scroll-wrap">
        <div class="pswp__container">
            <div class="pswp__item"></div>
            <div class="pswp__item"></div>
            <div class="pswp__item"></div>
        </div>

        <div class="pswp__ui pswp__ui--hidden">
            <div class="pswp__top-bar">
                <div class="pswp__counter"></div>

                <button class="pswp__button pswp__button--close" title="Close (Esc)"></button>
                <button class="pswp__button pswp__button--share" title="Share"></button>
                <button class="pswp__button pswp__button--fs" title="Toggle fullscreen"></button>
                <button class="pswp__button pswp__button--zoom" title="Zoom in/out"></button>

                <div class="pswp__preloader">
                    <div class="pswp__preloader__icn">
                        <div class="pswp__preloader__cut">
                            <div class="pswp__preloader__donut"></div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="pswp__share-modal pswp__share-modal--hidden pswp__single-tap">
                <div class="pswp__share-tooltip"></div>
            </div>

            <button class="pswp__button pswp__button--arrow--left" title="Previous (arrow left)"></button>
            <button class="pswp__button pswp__button--arrow--right" title="Next (arrow right)"></button>

            <div class="pswp__caption">
                <div class="pswp__caption__center"></div>
            </div>
        </div>
    </div>
</div>`,
    "icons/facebook": `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16 8.04865C16 3.63065 12.418 0.048645 8 0.048645C3.582 0.048645 0 3.63065 0 8.04865C0 12.042 2.92533 15.3513 6.75 15.9513V10.3613H4.71867V8.04798H6.75V6.28665C6.75 4.28198 7.94467 3.17398 9.772 3.17398C10.6467 3.17398 11.5627 3.33065 11.5627 3.33065V5.29931H10.5533C9.55933 5.29931 9.24933 5.91598 9.24933 6.54865V8.04865H11.468L11.1133 10.362H9.24933V15.952C13.0747 15.3513 16 12.0413 16 8.04865Z" fill="currentColor"/>
    </svg>`,
    "icons/lock": `<svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fill-rule="evenodd" clip-rule="evenodd" d="M4.65654 2.15649C5.01286 1.80017 5.49613 1.59999 6.00004 1.59999C6.50395 1.59999 6.98723 1.80017 7.34355 2.15649C7.69986 2.51281 7.90004 2.99608 7.90004 3.49999V4.89999H4.10004V3.49999C4.10004 2.99608 4.30022 2.51281 4.65654 2.15649ZM2.90004 4.89999V3.49999C2.90004 2.67782 3.22665 1.88933 3.80801 1.30796C4.38937 0.7266 5.17787 0.399994 6.00004 0.399994C6.82221 0.399994 7.61071 0.7266 8.19207 1.30796C8.77344 1.88933 9.10004 2.67782 9.10004 3.49999V4.89999H9.4999C10.3836 4.89999 11.0999 5.61634 11.0999 6.49999V9.99999C11.0999 10.8836 10.3836 11.6 9.4999 11.6H2.4999C1.61625 11.6 0.899902 10.8836 0.899902 9.99999V6.49999C0.899902 5.61634 1.61625 4.89999 2.4999 4.89999H2.90004ZM2.90004 6.09999H2.4999C2.27899 6.09999 2.0999 6.27908 2.0999 6.49999V9.99999C2.0999 10.2209 2.27899 10.4 2.4999 10.4H9.4999C9.72082 10.4 9.8999 10.2209 9.8999 9.99999V6.49999C9.8999 6.27908 9.72082 6.09999 9.4999 6.09999H9.10004H7.90004H4.10004H2.90004Z" fill="currentColor" />
</svg>`,
    "icons/search": `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.5 17.5L12.5 12.5L17.5 17.5ZM14.1667 8.33333C14.1667 9.09938 14.0158 9.85792 13.7226 10.5657C13.4295 11.2734 12.9998 11.9164 12.4581 12.4581C11.9164 12.9998 11.2734 13.4295 10.5657 13.7226C9.85792 14.0158 9.09938 14.1667 8.33333 14.1667C7.56729 14.1667 6.80875 14.0158 6.10101 13.7226C5.39328 13.4295 4.75022 12.9998 4.20854 12.4581C3.66687 11.9164 3.23719 11.2734 2.94404 10.5657C2.65088 9.85792 2.5 9.09938 2.5 8.33333C2.5 6.78624 3.11458 5.30251 4.20854 4.20854C5.30251 3.11458 6.78624 2.5 8.33333 2.5C9.88043 2.5 11.3642 3.11458 12.4581 4.20854C13.5521 5.30251 14.1667 6.78624 14.1667 8.33333Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`,
    "icons/twitter": `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M15.9687 3.04665C15.3697 3.31039 14.7351 3.48448 14.0853 3.56332C14.7694 3.15215 15.2816 2.50735 15.5273 1.74799C14.8933 2.11799 14.1907 2.38732 13.4427 2.53732C12.9492 2.00961 12.2952 1.6596 11.5824 1.54165C10.8696 1.42371 10.1378 1.54442 9.50062 1.88505C8.86345 2.22567 8.35657 2.76715 8.0587 3.4254C7.76083 4.08365 7.68864 4.82183 7.85333 5.52532C5.12667 5.39665 2.71133 4.08665 1.09333 2.10799C0.799196 2.60786 0.645776 3.178 0.649333 3.75799C0.649333 4.89799 1.22933 5.89999 2.108 6.48865C1.58724 6.47208 1.07798 6.33128 0.622667 6.07799V6.11799C0.622371 6.87558 0.884179 7.60995 1.36367 8.19649C1.84316 8.78304 2.51081 9.18564 3.25333 9.33599C2.7722 9.46491 2.26828 9.48427 1.77867 9.39265C1.98941 10.0447 2.39844 10.6146 2.94868 11.023C3.49891 11.4314 4.1629 11.6578 4.848 11.6707C3.68769 12.5813 2.25498 13.0755 0.78 13.074C0.52 13.074 0.260667 13.0587 0 13.0293C1.50381 13.9922 3.25234 14.5033 5.038 14.502C11.0733 14.502 14.37 9.50465 14.37 5.17865C14.37 5.03865 14.37 4.89865 14.36 4.75865C15.004 4.29523 15.5595 3.71987 16 3.05999L15.9687 3.04665Z" fill="currentColor"/>
    </svg>`,
  },
  assets: {
    "built/main.min.js": require("./solo-main.min.js.txt"),
    "built/screen.css": require("./solo-screen.css.txt"),
  },
};

export const DEFAULTS = {
  posts_per_page: 6,
  image_sizes: {
    xs: {
      width: 150,
    },
    s: {
      width: 300,
    },
    m: {
      width: 720,
    },
    l: {
      width: 960,
    },
    xl: {
      width: 1200,
    },
    xxl: {
      width: 2000,
    },
  },
  card_assets: true,
  custom: {
    background_color: {
      type: "color",
      default: "#ffffff",
    },
    navigation_layout: {
      type: "select",
      options: ["Logo on the left", "Logo in the middle", "Stacked"],
      default: "Logo on the left",
    },
    typography: {
      type: "select",
      options: ["Modern sans-serif", "Elegant serif", "Consistent mono"],
      default: "Modern sans-serif",
    },
    footer_text: {
      type: "text",
    },
    header_section_layout: {
      type: "select",
      options: ["Side by side", "Large background", "Typographic profile"],
      default: "Large background",
      group: "homepage",
    },
    primary_header: {
      type: "text",
      default: "Welcome to my site",
      group: "homepage",
    },
    secondary_header: {
      type: "text",
      default:
        "Subscribe below to receive my latest posts directly in your inbox",
      group: "homepage",
    },
    post_feed_layout: {
      type: "select",
      options: ["Classic", "Typographic", "Parallax"],
      default: "Classic",
      group: "homepage",
    },
  },
};
