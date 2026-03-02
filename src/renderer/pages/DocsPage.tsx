import { useNavigate } from 'react-router-dom'
import DashboardTemplate from '../templates/dashboard-template/DashboardTemplate'
import AppHeader, { AppLogo } from '../organisms/app-header/AppHeader'
import Button from '../atoms/button/Button'
import Icon from '../atoms/icon/Icon'
import styles from './DocsPage.module.scss'

function Code({ children }: { children: string }) {
  return <code className={styles.inlineCode}>{children}</code>
}

function CodeBlock({ label, children }: { label?: string; children: string }) {
  return (
    <div className={styles.codeBlock}>
      {label && <span className={styles.codeLabel}>{label}</span>}
      <div className={styles.codeContent}>
        <pre>{children}</pre>
      </div>
    </div>
  )
}

function Callout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.callout}>
      <Icon name="book" size={18} className={styles.calloutIcon} />
      <div className={styles.calloutText}>{children}</div>
    </div>
  )
}

export default function DocsPage() {
  const navigate = useNavigate()

  const header = (
    <AppHeader
      left={
        <>
          <AppLogo />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/projects')}
            icon={<Icon name="chevron-left" size={16} />}
          >
            Projects
          </Button>
          <h1 className={styles.pageTitle}>Documentation</h1>
        </>
      }
    />
  )

  return (
    <DashboardTemplate header={header}>
      <div className={styles.content}>
        <div className={styles.hero}>
          <h1 className={styles.heroTitle}>Creating Custom Components</h1>
          <p className={styles.heroDesc}>
            Learn how to build your own components for Blinkpage using
            Component Studio. This guide covers the component structure, property
            system, theming, and everything you need to get started.
          </p>
        </div>

        {/* Quick Start */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Quick Start</h2>
          <p className={styles.paragraph}>
            Follow these steps to create your first component and preview it in
            Component Studio.
          </p>

          <ol className={styles.stepList}>
            <li className={styles.step}>
              <div className={styles.stepContent}>
                <strong>Set up your project folder</strong>
                <p>
                  Create a new folder for your components. Install the composer
                  tools package which provides the base classes and utilities.
                </p>
              </div>
            </li>
            <li className={styles.step}>
              <div className={styles.stepContent}>
                <strong>Create a component file</strong>
                <p>
                  Create a <Code>.tsx</Code> or <Code>.jsx</Code> file that
                  imports from <Code>@blinkpage/composer-tools</Code> and extends
                  one of the available base classes.
                </p>
              </div>
            </li>
            <li className={styles.step}>
              <div className={styles.stepContent}>
                <strong>Define your properties</strong>
                <p>
                  Use <Code>this.addProp()</Code> in the constructor to declare
                  editable properties that users can configure in the Blinkpage
                  editor.
                </p>
              </div>
            </li>
            <li className={styles.step}>
              <div className={styles.stepContent}>
                <strong>Implement the render method</strong>
                <p>
                  Write your JSX in the <Code>render()</Code> method using
                  Base layout components and your own styles.
                </p>
              </div>
            </li>
            <li className={styles.step}>
              <div className={styles.stepContent}>
                <strong>Link your folder in Component Studio</strong>
                <p>
                  Open a project, click "Link Folder", and select your component
                  directory. Component Studio will auto-detect your components
                  and provide live preview with hot reload.
                </p>
              </div>
            </li>
          </ol>
        </section>

        {/* File Structure */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>File Structure</h2>
          <p className={styles.paragraph}>
            Each component lives in its own folder with a component file and an
            optional SCSS module for styles.
          </p>

          <div className={styles.fileTree}>{
`my-components/
├── package.json
├── hero/
│   ├── hero.tsx
│   └── hero.module.scss
├── about/
│   ├── about.tsx
│   └── about.module.scss
└── footer/
    ├── footer.tsx
    └── footer.module.scss`
          }</div>

          <Callout>
            Component Studio scans for <Code>.tsx</Code> and <Code>.jsx</Code>{' '}
            files that import from <Code>@blinkpage/composer-tools</Code> and
            extend a recognized base class. Files in{' '}
            <Code>node_modules</Code>, <Code>.git</Code>, <Code>dist</Code>,
            and other build directories are automatically skipped.
          </Callout>
        </section>

        {/* Component Anatomy */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Component Anatomy</h2>
          <p className={styles.paragraph}>
            Components are class-based React components that extend a base class
            from the composer tools library. Here is a minimal example:
          </p>

          <CodeBlock label="my-hero/my-hero.tsx">{
`import { BaseHeroSection } from "@blinkpage/composer-tools";
import styles from "./my-hero.module.scss";

class MyHero extends BaseHeroSection {
  constructor(props?: any) {
    super(props, styles);

    this.addProp({
      type: "string",
      key: "title",
      displayer: "Title",
      value: "Welcome to My Site",
    });

    this.addProp({
      type: "string",
      key: "description",
      displayer: "Description",
      value: "A beautiful hero section built with Component Studio.",
    });

    this.addProp({
      type: "media",
      key: "backgroundImage",
      displayer: "Background Image",
      additionalParams: { availableTypes: ["image"] },
      value: {
        type: "image",
        url: "https://example.com/hero.jpg",
      },
    });
  }

  static getName(): string {
    return "My Hero";
  }

  render() {
    const title = this.getPropValue("title");
    const description = this.getPropValue("description");

    return (
      <div className={this.decorateCSS("container")}>
        <h1 className={this.decorateCSS("title")}>{title}</h1>
        <p className={this.decorateCSS("description")}>{description}</p>
      </div>
    );
  }
}

export default MyHero;`
          }</CodeBlock>

          <h3 className={styles.subsectionTitle}>Key Concepts</h3>
          <ul className={styles.list}>
            <li>
              <strong>Base class:</strong> Your component must extend one of the
              available base classes (see table below). Pass the SCSS module
              as the second argument to <Code>super()</Code>.
            </li>
            <li>
              <strong>Constructor:</strong> Define all editable properties using{' '}
              <Code>this.addProp()</Code>. Each property has a type, key,
              display label, and default value.
            </li>
            <li>
              <strong>getName():</strong> A static method that returns the
              human-readable name shown in the editor.
            </li>
            <li>
              <strong>render():</strong> Returns JSX. Use{' '}
              <Code>this.getPropValue("key")</Code> to read property values
              and <Code>this.decorateCSS("className")</Code> to apply scoped
              styles.
            </li>
            <li>
              <strong>Default export:</strong> The component class must be the
              default export of the file.
            </li>
          </ul>
        </section>

        {/* Base Classes */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Available Base Classes</h2>
          <p className={styles.paragraph}>
            Choose the base class that best matches your component's purpose.
            This helps the editor categorize and organize components correctly.
          </p>

          <table className={styles.table}>
            <thead>
              <tr>
                <th>Base Class</th>
                <th>Use Case</th>
              </tr>
            </thead>
            <tbody>
              <tr><td><Code>Component</Code></td><td>Generic component (any purpose)</td></tr>
              <tr><td><Code>BaseHeroSection</Code></td><td>Hero / banner sections</td></tr>
              <tr><td><Code>BaseAbout</Code></td><td>About sections</td></tr>
              <tr><td><Code>BaseNavigator</Code></td><td>Navigation bars and menus</td></tr>
              <tr><td><Code>BaseList</Code></td><td>List and grid layouts</td></tr>
              <tr><td><Code>BaseIntroSection</Code></td><td>Introduction / feature sections</td></tr>
              <tr><td><Code>BasePricingTable</Code></td><td>Pricing tables</td></tr>
              <tr><td><Code>BaseFooter</Code></td><td>Footer sections</td></tr>
              <tr><td><Code>BaseBlog</Code></td><td>Blog post layouts</td></tr>
              <tr><td><Code>Testimonials</Code></td><td>Testimonial and review sections</td></tr>
              <tr><td><Code>Team</Code></td><td>Team member showcases</td></tr>
              <tr><td><Code>LogoClouds</Code></td><td>Logo and brand grids</td></tr>
              <tr><td><Code>Location</Code></td><td>Contact and location sections</td></tr>
            </tbody>
          </table>
        </section>

        {/* Property System */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Property System</h2>
          <p className={styles.paragraph}>
            Properties make your component configurable in the Blinkpage editor.
            Users can edit text, swap images, toggle features, and more — all
            without touching code.
          </p>

          <h3 className={styles.subsectionTitle}>Property Types</h3>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Type</th>
                <th>Description</th>
                <th>Example Value</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><Code>string</Code></td>
                <td>Text content (supports rich text)</td>
                <td><Code>"Hello World"</Code></td>
              </tr>
              <tr>
                <td><Code>number</Code></td>
                <td>Numeric value</td>
                <td><Code>42</Code></td>
              </tr>
              <tr>
                <td><Code>boolean</Code></td>
                <td>Toggle switch</td>
                <td><Code>true</Code></td>
              </tr>
              <tr>
                <td><Code>media</Code></td>
                <td>Image, video, icon, or Lottie animation</td>
                <td><Code>{`{ type: "image", url: "..." }`}</Code></td>
              </tr>
              <tr>
                <td><Code>page</Code></td>
                <td>Navigation link to another page</td>
                <td><Code>""</Code></td>
              </tr>
              <tr>
                <td><Code>array</Code></td>
                <td>Repeatable list of objects</td>
                <td><Code>[...]</Code></td>
              </tr>
              <tr>
                <td><Code>object</Code></td>
                <td>Group of nested properties</td>
                <td><Code>[...props]</Code></td>
              </tr>
              <tr>
                <td><Code>multiSelect</Code></td>
                <td>Multiple choice selection</td>
                <td><Code>["option1"]</Code></td>
              </tr>
            </tbody>
          </table>

          <h3 className={styles.subsectionTitle}>Adding a String Property</h3>
          <CodeBlock>{
`this.addProp({
  type: "string",
  key: "title",
  displayer: "Title",
  value: "Default Title Text",
});`
          }</CodeBlock>

          <h3 className={styles.subsectionTitle}>Adding a Media Property</h3>
          <CodeBlock>{
`this.addProp({
  type: "media",
  key: "image",
  displayer: "Background Image",
  additionalParams: {
    availableTypes: ["image", "video"],
  },
  value: {
    type: "image",
    url: "https://example.com/image.jpg",
  },
});`
          }</CodeBlock>

          <h3 className={styles.subsectionTitle}>Adding an Array Property</h3>
          <p className={styles.paragraph}>
            Arrays let users add, remove, and reorder items. Each item is an
            object containing its own set of properties.
          </p>
          <CodeBlock>{
`this.addProp({
  type: "array",
  key: "features",
  displayer: "Features",
  value: [
    {
      type: "object",
      key: "feature",
      displayer: "Feature",
      value: [
        {
          type: "string",
          key: "title",
          displayer: "Title",
          value: "Fast Performance",
        },
        {
          type: "string",
          key: "description",
          displayer: "Description",
          value: "Lightning fast load times.",
        },
      ],
    },
  ],
});`
          }</CodeBlock>

          <h3 className={styles.subsectionTitle}>Reading Properties in Render</h3>
          <CodeBlock>{
`render() {
  // Simple values
  const title = this.getPropValue("title");
  const showOverlay = this.getPropValue("overlay");

  // Cast array items to a typed array
  const features = this.castToObject<Feature[]>("features");

  // Check if a string prop has content
  const hasTitle = this.castToString(title);

  return (
    <div className={this.decorateCSS("container")}>
      {hasTitle && <h1>{title}</h1>}
      {features.map((f) => (
        <div key={f.title}>
          <h3>{f.title}</h3>
          <p>{f.description}</p>
        </div>
      ))}
    </div>
  );
}`
          }</CodeBlock>
        </section>

        {/* Styling */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Styling</h2>
          <p className={styles.paragraph}>
            Components use SCSS Modules for scoped styling. Use{' '}
            <Code>this.decorateCSS("className")</Code> instead of directly
            referencing the module — this ensures proper scoping and theme
            integration.
          </p>

          <CodeBlock label="my-hero.module.scss">{
`.container {
  padding: 80px 24px;
  text-align: center;
  background-color: var(--theme-background);
}

.title {
  font-size: 48px;
  font-weight: 700;
  color: var(--theme-font-color-primary);
  font-family: var(--theme-font-family);
  margin-bottom: 16px;
}

.description {
  font-size: 18px;
  color: var(--theme-font-color-secondary);
  max-width: 600px;
  margin: 0 auto;
}`
          }</CodeBlock>

          <h3 className={styles.subsectionTitle}>Theme CSS Variables</h3>
          <p className={styles.paragraph}>
            Use these CSS custom properties so your component automatically
            adapts to the user's theme configuration:
          </p>

          <table className={styles.table}>
            <thead>
              <tr>
                <th>Variable</th>
                <th>Purpose</th>
              </tr>
            </thead>
            <tbody>
              <tr><td><Code>--theme-background</Code></td><td>Page background color</td></tr>
              <tr><td><Code>--theme-primary</Code></td><td>Primary accent color</td></tr>
              <tr><td><Code>--theme-secondary</Code></td><td>Secondary accent color</td></tr>
              <tr><td><Code>--theme-tertiary</Code></td><td>Tertiary accent color</td></tr>
              <tr><td><Code>--theme-font-color-primary</Code></td><td>Primary text color</td></tr>
              <tr><td><Code>--theme-font-color-secondary</Code></td><td>Secondary text color</td></tr>
              <tr><td><Code>--theme-font-family</Code></td><td>Font family</td></tr>
              <tr><td><Code>--theme-border-radius</Code></td><td>Border radius</td></tr>
              <tr><td><Code>--theme-content-width</Code></td><td>Max content width</td></tr>
              <tr><td><Code>--theme-box-shadow</Code></td><td>Standard box shadow</td></tr>
            </tbody>
          </table>
        </section>

        {/* Base Layout Components */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Base Layout Components</h2>
          <p className={styles.paragraph}>
            The composer tools provide a set of <Code>Base</Code> layout
            components that handle responsive behavior and consistent spacing.
            Import them from the base module and use them in your render method.
          </p>

          <table className={styles.table}>
            <thead>
              <tr>
                <th>Component</th>
                <th>Purpose</th>
              </tr>
            </thead>
            <tbody>
              <tr><td><Code>Base.Container</Code></td><td>Full-width wrapper with theme background</td></tr>
              <tr><td><Code>Base.MaxContent</Code></td><td>Constrains content to max theme width</td></tr>
              <tr><td><Code>Base.ContainerGrid</Code></td><td>CSS Grid container</td></tr>
              <tr><td><Code>Base.GridCell</Code></td><td>Grid cell</td></tr>
              <tr><td><Code>Base.VerticalContent</Code></td><td>Flex column layout</td></tr>
              <tr><td><Code>Base.SectionTitle</Code></td><td>Styled section heading</td></tr>
              <tr><td><Code>Base.SectionSubTitle</Code></td><td>Styled section subheading</td></tr>
              <tr><td><Code>Base.H2</Code></td><td>Styled h2 element</td></tr>
              <tr><td><Code>Base.P</Code></td><td>Styled paragraph element</td></tr>
              <tr><td><Code>Base.Media</Code></td><td>Renders image, video, icon, or Lottie</td></tr>
            </tbody>
          </table>

          <CodeBlock label="Using Base components">{
`import { Base } from "@blinkpage/composer-tools";

render() {
  return (
    <Base.Container className={this.decorateCSS("container")}>
      <Base.MaxContent className={this.decorateCSS("max-content")}>
        <Base.SectionTitle className={this.decorateCSS("title")}>
          {this.getPropValue("title")}
        </Base.SectionTitle>
        <Base.Media
          value={this.getPropValue("image")}
          className={this.decorateCSS("image")}
        />
      </Base.MaxContent>
    </Base.Container>
  );
}`
          }</CodeBlock>
        </section>

        {/* Detection Requirements */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Detection Requirements</h2>
          <p className={styles.paragraph}>
            For Component Studio to automatically detect your component, your
            file must meet all of these criteria:
          </p>

          <ul className={styles.list}>
            <li>
              File extension must be <Code>.tsx</Code> or <Code>.jsx</Code>
            </li>
            <li>
              Must contain an import from <Code>@blinkpage/composer-tools</Code>{' '}
              or a path containing <Code>EditorComponent</Code>
            </li>
            <li>
              Must extend one of the recognized base classes (e.g.{' '}
              <Code>extends BaseHeroSection</Code>)
            </li>
            <li>
              The component class must be the <strong>default export</strong>
            </li>
          </ul>

          <Callout>
            If your component doesn't appear in the component list, double-check
            the import path and the extends clause. The detector looks for
            specific patterns in your source code.
          </Callout>
        </section>

        {/* Full Example */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Full Example</h2>
          <p className={styles.paragraph}>
            Here is a complete example of an About section component with an
            image, text content, and a list of items.
          </p>

          <CodeBlock label="about-section/about-section.tsx">{
`import { BaseAbout } from "@blinkpage/composer-tools";
import { Base } from "@blinkpage/composer-tools";
import styles from "./about-section.module.scss";

interface ListItem {
  title: React.JSX.Element;
  description: React.JSX.Element;
}

class AboutSection extends BaseAbout {
  constructor(props?: any) {
    super(props, styles);

    this.addProp({
      type: "string",
      key: "heading",
      displayer: "Heading",
      value: "About Us",
    });

    this.addProp({
      type: "media",
      key: "photo",
      displayer: "Photo",
      additionalParams: { availableTypes: ["image"] },
      value: {
        type: "image",
        url: "https://example.com/team.jpg",
      },
    });

    this.addProp({
      type: "array",
      key: "paragraphs",
      displayer: "Paragraphs",
      value: [
        {
          type: "object",
          key: "paragraph",
          displayer: "Paragraph",
          value: [
            {
              type: "string",
              key: "title",
              displayer: "Title",
              value: "Our Mission",
            },
            {
              type: "string",
              key: "description",
              displayer: "Description",
              value: "We build tools that empower creators.",
            },
          ],
        },
      ],
    });

    this.addProp({
      type: "boolean",
      key: "showPhoto",
      displayer: "Show Photo",
      value: true,
    });
  }

  static getName(): string {
    return "About Section";
  }

  render() {
    const heading = this.getPropValue("heading");
    const showPhoto = this.getPropValue("showPhoto");
    const paragraphs = this.castToObject<ListItem[]>("paragraphs");

    return (
      <Base.Container className={this.decorateCSS("container")}>
        <Base.MaxContent className={this.decorateCSS("max-content")}>
          {this.castToString(heading) && (
            <Base.SectionTitle className={this.decorateCSS("heading")}>
              {heading}
            </Base.SectionTitle>
          )}
          <Base.ContainerGrid className={this.decorateCSS("grid")}>
            {showPhoto && (
              <Base.GridCell className={this.decorateCSS("photo-cell")}>
                <Base.Media
                  value={this.getPropValue("photo")}
                  className={this.decorateCSS("photo")}
                />
              </Base.GridCell>
            )}
            <Base.GridCell className={this.decorateCSS("text-cell")}>
              {paragraphs.map((item) => (
                <Base.VerticalContent
                  className={this.decorateCSS("paragraph")}
                >
                  {this.castToString(item.title) && (
                    <Base.H2 className={this.decorateCSS("item-title")}>
                      {item.title}
                    </Base.H2>
                  )}
                  {this.castToString(item.description) && (
                    <Base.P className={this.decorateCSS("item-desc")}>
                      {item.description}
                    </Base.P>
                  )}
                </Base.VerticalContent>
              ))}
            </Base.GridCell>
          </Base.ContainerGrid>
        </Base.MaxContent>
      </Base.Container>
    );
  }
}

export default AboutSection;`
          }</CodeBlock>

          <CodeBlock label="about-section/about-section.module.scss">{
`.container {
  padding: 80px 24px;
  background: var(--theme-background);
}

.max-content {
  max-width: var(--theme-content-width);
  margin: 0 auto;
}

.heading {
  text-align: center;
  margin-bottom: 48px;
  color: var(--theme-font-color-primary);
  font-family: var(--theme-font-family);
}

.grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  align-items: start;
}

.photo {
  width: 100%;
  border-radius: var(--theme-border-radius);
  object-fit: cover;
}

.paragraph {
  margin-bottom: 24px;
}

.item-title {
  font-size: 20px;
  font-weight: 600;
  color: var(--theme-font-color-primary);
  margin-bottom: 8px;
}

.item-desc {
  font-size: 16px;
  line-height: 1.6;
  color: var(--theme-font-color-secondary);
}`
          }</CodeBlock>
        </section>
      </div>
    </DashboardTemplate>
  )
}
