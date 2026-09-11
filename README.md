# davidalvarezp.com

> davidalvarezp's website — built with Hugo and showcasing technical content around SysAdmin web development, DevOps, cybersecurity, and other interests.

## About

This repository contains the full source code of my personal site: davidalvarezp.com

The site is generated using the static site generator Hugo. It serves as my professional / technical blog and portfolio.

## Built With

- Hugo — static site generator
- HTML, SCSS & JavaScript — front-end layout and styling
- Custom theme and assets under themes/ and resources/

## Repository Structure

- /archetypes        # Hugo archetypes (post, page templates, etc.)  
- /content           # All site content (under CC BY-NC 4.0)
- /resources/_gen    # Generated CSS / assets  
- /static/images     # Static images used in site  
- /themes/dap-theme  # Custom Hugo theme  (Based on LoveIT)
- hugo.toml          # Hugo configuration  
- .gitignore         # Ignored files/folders  

(And other standard Hugo config files.)

## Why / What for

- To share technical articles about web development, DevOps, system administration, cybersecurity, and related topics.
- To use as a personal portfolio site.
- To experiment with static-site generation, custom theming, and front-end workflow.

## Getting Started (Local Development)

If you want to run the website locally:

- Clone the repo
  
```
git clone https://github.com/davidalvarezp/davidalvarezp.com.git  
cd davidalvarezp.com  
```

- Install Hugo (if you don’t have it already). See Hugo docs for installation.
- Run the development server
  
```
hugo server  
```

Open your browser at http://localhost:1313/ to preview the site.

## Deployment

The site is configured to be published using Hugo’s static output.
You can build the static files with:

```
hugo  
```

Then deploy the public/ folder to the hosting of your choice (e.g. GitHub Pages, a VPS, CDN, etc.).

## Contributing / Updates

This is mainly a personal site — but feel free to fork or suggest improvements (theme tweaks, bug fixes, content enhancements).

If you do propose changes:

- Submit a GitHub Pull Request
- Ensure consistent styling and valid markup
- Rebuild and test the site locally before submitting

## References & Credits

- Built with Hugo — the site generator powering this repo
- Custom theme under theme/dap-theme/ based on [LoveIT](https://github.com/dillonzq/LoveIt)
- All website content is under [CC BY-NC 4.0](https://creativecommons.org/licenses/by-nc/4.0/)
