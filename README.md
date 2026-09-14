# dap.gal // davidalvarezp.com

> Personal website and technical blog of David Álvarez, built with [Hugo](<https://gohugo.io/>) and published in English at **[davidalvarezp.com](<https://davidalvarezp.com>)** and in Spanish at **[dap.gal](<https://dap.gal>)**.

 [](<https://gohugo.io/>)\
 [](<https://creativecommons.org/licenses/by-nc/4.0/>)

## Overview

This repository contains the complete source code and content for my personal website, technical blog, and portfolio.

The project is built with **Hugo**, a fast static site generator, and uses a custom theme and frontend assets to provide a lightweight and maintainable publishing platform.

The same codebase serves two language-specific public websites:

| Language | Website |
| --- | --- |
| 🇬🇧 English | **[davidalvarezp.com](<https://davidalvarezp.com>)** |
| 🇪🇸 Spanish | **[dap.gal](<https://dap.gal>)** |

The English and Spanish versions are maintained from this repository and are published to their respective domains.

 ## Content

The site focuses primarily on technical and professional topics, including:

- System administration and Linux
- Development
- DevOps and infrastructure
- Cybersecurity
- Software and tooling
- Self-hosting and automation
- Networking
- Personal projects and technical experiments
- Other topics related to technology and my professional interests

Content is authored and maintained as part of this repository.

## Tech Stack

The website is intentionally built around a small and maintainable stack:

- **[Hugo](<https://gohugo.io/>)** — static site generator
- **HTML** — semantic page structure
- **SCSS** — stylesheets and theme customization
- **JavaScript** — client-side functionality
- **Custom Hugo theme** — `themes/dap-theme/`
- **LoveIt** — the original theme foundation

Hugo generates static output, making the resulting websites suitable for deployment through static hosting, CDNs, or other web infrastructure.

## Repository Structure

```
.
├── archetypes/          # Hugo content templates and archetypes
├── content/             # Website content
├── resources/
│   └── _gen/            # Hugo-generated resources
├── static/
│   └── images/          # Static images and media
├── themes/
│   └── dap-theme/       # Custom Hugo theme
├── hugo.toml            # Hugo configuration
├── .gitignore           # Git ignore rules
└── README.md            # Project documentation
```

Additional Hugo configuration and project files may be present as the project evolves.

## Local Development

### Prerequisites

You need **Hugo** installed locally.

Check your installation with:

```
hugo version
```

Refer to the official Hugo documentation for installation instructions:

https://gohugo.io/installation/

### Clone the repository

```
git clone https://github.com/davidalvarezp/web.git
cd web
```

### Start the development server

```
hugo server
```

By default, Hugo will make the development site available at:

```
http://localhost:1313/
```

Hugo watches the project files and automatically rebuilds the site as changes are made.

### Build the site

To generate the production-ready static output:

```
hugo
```

The generated website is written to:

```
public/
```

The contents of `public/` can then be served by any compatible static web server, CDN, or hosting platform.

## Production Build

For a production build, Hugo can be run without the development server:

```
hugo
```

The resulting `public/` directory contains the static assets that should be deployed.

Before publishing changes, it is recommended to verify the generated site locally and check:

- Internal links
- Images and other static assets
- HTML rendering
- CSS and JavaScript
- Language-specific content
- Metadata and canonical URLs
- Responsive layouts
- Hugo build warnings or errors

A clean production build should complete successfully before deployment.

## Internationalization

This repository contains content for two language-specific versions of the website.

### English

English content is published at:

**[https://davidalvarezp.com](<https://davidalvarezp.com>)**

### Spanish

 Spanish content is published at:

**[https://dap.gal](<https://dap.gal>)**

The two domains represent different language versions of the same personal website and are maintained from this single source repository.

## Deployment

The project is designed to produce static files through Hugo.

The general deployment flow is:

```
Source
  │
  ├── Content
  ├── Theme
  ├── Assets
  └── Hugo configuration
          │
          ▼
        Hugo
          │
          ▼
        public/
          │
          ├── English → davidalvarezp.com
          │
          └── Spanish → dap.gal
```

The exact deployment infrastructure is intentionally kept separate from the Hugo source code. This repository is responsible for generating the website; the resulting static output can be deployed to the infrastructure serving each domain.

## Development Workflow

A typical workflow is:

```
# Get the latest source
git pull

# Start local development
hugo server

# Make and review changes

# Generate the production build
hugo

# Review the generated output
# Then commit and push the changes
git add .
git commit -m "Update website"
git push
```

Generated files and local development artifacts should remain excluded according to `.gitignore`.

## Contributing

This is a personal website and is not intended to be a general-purpose open-source project.

That said, suggestions, corrections, bug reports, and improvements are welcome.

If you want to contribute:

1. Fork the repository.
2. Create a dedicated branch for your changes.
3. Make the required changes.
4. Run the Hugo build locally.
5. Verify the generated site.
6. Open a Pull Request describing the change.

For content corrections, please provide enough context to verify the proposed change.

## Credits

This website is powered by **[Hugo](<https://gohugo.io/>)**.

The custom theme located at `themes/dap-theme/` is based on **[LoveIt](<https://github.com/dillonzq/LoveIt>)**.

## License

### Website content

Unless otherwise stated, the original content published on this website is licensed under the:

**[Creative Commons Attribution-NonCommercial 4.0 International License (CC BY-NC 4.0)](<https://creativecommons.org/licenses/by-nc/4.0/>)**

You may share and adapt the content under the terms of that license, provided that you comply with its attribution and non-commercial requirements.

### Source code and theme

The licensing of source code, theme components, and third-party dependencies may differ from the content license above.

Third-party components remain subject to their respective licenses.

## Author

**David Álvarez**

- English website: **[davidalvarezp.com](<https://davidalvarezp.com>)**
- Spanish website: **[dap.gal](<https://dap.gal>)**
- GitHub: **[github.com/davidalvarezp](<https://github.com/davidalvarezp>)**

---

Built with Hugo, maintained from a single repository, and published in two languages.