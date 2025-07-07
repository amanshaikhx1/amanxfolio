import { NextResponse } from "next/server"

// Fallback blog data with properly structured content
const fallbackBlogs = [
  {
    id: 1,
    title: "10 Essential UI/UX Design Principles Every Developer Should Know",
    slug: "ui-ux-design-principles",
    content: `User Interface (UI) and User Experience (UX) design are critical components of modern web development. As a developer, understanding these principles can significantly enhance the quality of your applications.

## 1. Keep It Simple

Simplicity is the ultimate sophistication. A clean, uncluttered interface helps users focus on what matters most. Remove unnecessary elements and focus on core functionality.

## 2. Consistency is Key

Maintain consistent design patterns, colors, and typography throughout your application. Users should feel familiar with your interface as they navigate.

## 3. Make It Accessible

Ensure your design works for users with disabilities by following accessibility guidelines. Use proper contrast ratios, semantic HTML, and keyboard navigation.

## 4. Provide Clear Feedback

Users should always know what's happening when they interact with your interface. Show loading states, success messages, and error notifications.

## 5. Design for Mobile First

With mobile usage continuing to grow, designing for mobile first ensures a better experience across all devices.

## 6. Use Visual Hierarchy

Guide users through your content with proper visual hierarchy. Use size, color, and spacing to indicate importance.

## 7. Minimize Cognitive Load

Don't make users think too hard. Use familiar patterns, clear labels, and logical groupings.

## 8. Test with Real Users

No amount of theory can replace actual user testing. Observe how real users interact with your design.

## 9. Embrace White Space

White space isn't wasted space. It helps create focus, improves readability, and makes interfaces feel less cluttered.

## 10. Stay Updated

Design trends and user expectations evolve. Stay current with design patterns and emerging technologies.`,
    excerpt:
      "Learn the fundamental UI/UX design principles that every developer should master to create better user experiences.",
    category: "Design",
    author: "Aman Shaikh",
    author_image: "/placeholder.svg?height=30&width=30",
    image: "/blog.webp",
    read_time: "5 min read",
    tags: ["Design", "UI/UX", "Web Development"],
    published_at: "2024-01-15T10:00:00Z",
  },
  {
    id: 2,
    title: "Introduction to Artificial Intelligence: The Future is Now",
    slug: "introduction-to-artificial-intelligence",
    content: `Artificial Intelligence (AI) is no longer a concept confined to science fiction. It's here, it's real, and it's transforming every aspect of our lives.

## What is AI?

AI refers to the simulation of human intelligence in machines that are programmed to think and learn like humans. These systems can perform tasks that typically require human intelligence.

## Types of AI

### 1. Narrow AI
Designed to perform specific tasks, like voice assistants or recommendation systems. This is the most common type of AI we interact with daily.

### 2. General AI
Hypothetical AI that could perform any intellectual task that a human can do. This doesn't exist yet but is the goal of many researchers.

### 3. Super AI
AI that surpasses human intelligence in all aspects. This is still theoretical and subject of much debate.

## Current Applications

AI is already transforming various industries:

- **Healthcare**: Diagnostic imaging, drug discovery, personalized treatment
- **Transportation**: Autonomous vehicles, traffic optimization
- **Finance**: Fraud detection, algorithmic trading, risk assessment
- **Entertainment**: Content recommendation, game AI, content creation
- **Education**: Personalized learning, automated grading

## The Future of AI

As AI continues to evolve, we can expect to see more sophisticated applications that will further integrate into our daily lives. The key is ensuring this development happens responsibly and ethically.`,
    excerpt:
      "Explore the world of Artificial Intelligence, its types, current applications, and what the future holds for this transformative technology.",
    category: "Technology",
    author: "Aman Shaikh",
    author_image: "/placeholder.svg?height=30&width=30",
    image: "/placeholder.svg?height=400&width=600&text=Artificial+Intelligence",
    read_time: "8 min read",
    tags: ["AI", "Technology", "Machine Learning"],
    published_at: "2024-01-10T14:30:00Z",
  },
  {
    id: 3,
    title: "From Junior to Senior Developer: A Roadmap for Career Growth",
    slug: "junior-to-senior-developer-roadmap",
    content: `Navigating the path from junior to senior developer requires more than just technical skills. This comprehensive roadmap outlines the key milestones, skills, and mindset shifts needed to advance your career.

## Technical Skills Development

### Master the Fundamentals
- **Data structures and algorithms**: Understanding how to efficiently store and manipulate data
- **Design patterns**: Common solutions to recurring problems in software design
- **System design principles**: How to architect scalable and maintainable systems
- **Testing methodologies**: Unit testing, integration testing, and test-driven development

### Expand Your Toolkit
- **Multiple programming languages**: Don't limit yourself to just one language
- **Different frameworks**: Understand various approaches to solving problems
- **Database design**: Both SQL and NoSQL database systems
- **DevOps practices**: CI/CD, containerization, and deployment strategies

## Soft Skills Matter

### Communication
- **Write clear documentation**: Your future self and teammates will thank you
- **Present technical concepts**: Ability to explain complex ideas to non-technical stakeholders
- **Code reviews**: Provide constructive feedback and accept criticism gracefully

### Leadership
- **Mentor junior developers**: Teaching others reinforces your own knowledge
- **Lead technical discussions**: Guide architectural decisions and technical direction
- **Project ownership**: Take responsibility for entire features or systems

## Building Your Professional Network

Networking isn't just about finding jobs—it's about learning from others, sharing knowledge, and building meaningful professional relationships.

## Continuous Learning

The tech industry evolves rapidly. Stay current by:
- Reading technical blogs and documentation
- Contributing to open source projects
- Attending conferences and meetups
- Taking online courses and certifications

## The Senior Developer Mindset

Senior developers think beyond just writing code. They consider:
- **Business impact**: How does this code solve real problems?
- **Maintainability**: Will this be easy to modify in the future?
- **Team dynamics**: How can I help my team be more effective?
- **Risk management**: What could go wrong and how do we prevent it?`,
    excerpt:
      "A comprehensive guide to advancing from junior to senior developer, covering technical skills, soft skills, and career strategies.",
    category: "Career",
    author: "Aman Shaikh",
    author_image: "/placeholder.svg?height=30&width=30",
    image: "/placeholder.svg?height=400&width=600&text=Career+Growth",
    read_time: "6 min read",
    tags: ["Career", "Development", "Skills"],
    published_at: "2024-01-05T09:15:00Z",
  },
  {
    id: 4,
    title: "Understanding React Server Components",
    slug: "react-server-components",
    content: `React Server Components represent a paradigm shift in how we build React applications. This article explores how they work, their benefits, and practical use cases.

## What are Server Components?

Server Components are a new type of React component that runs on the server instead of the client. They allow you to build components that:

- Render on the server during the request
- Have direct access to backend resources like databases
- Don't add to the client-side JavaScript bundle
- Can be seamlessly mixed with client components

## Key Benefits

### Performance Improvements
- **Reduced bundle size**: Server components don't ship JavaScript to the client
- **Faster initial page loads**: HTML is generated on the server
- **Better Core Web Vitals**: Improved LCP, FID, and CLS scores

### Developer Experience
- **Direct database access**: No need for API routes for simple data fetching
- **Simplified data fetching**: Async/await directly in components
- **Better SEO**: Content is server-rendered by default

### Security
- **Sensitive operations stay on server**: API keys and database credentials never reach the client
- **Reduced attack surface**: Less client-side code means fewer potential vulnerabilities

## When to Use Server Components

Server Components are ideal for:
- **Static content rendering**: Headers, footers, navigation
- **Data-heavy components**: Product listings, user profiles
- **SEO-critical pages**: Blog posts, marketing pages
- **Components without interactivity**: Display-only components

## When to Use Client Components

Client Components are necessary for:
- **Interactive elements**: Forms, buttons with onClick handlers
- **Browser APIs**: localStorage, geolocation, camera access
- **State management**: useState, useReducer, context
- **Real-time features**: WebSocket connections, live updates

## Implementation Example

Here's a simple example of how Server and Client Components work together:

**Server Component (runs on server):**
\`\`\`jsx
// This runs on the server
async function BlogPost({ id }) {
  const post = await fetchPostFromDatabase(id);
  
  return (
    <article>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
      <LikeButton postId={id} initialLikes={post.likes} />
    </article>
  );
}
\`\`\`

**Client Component (runs on client):**
\`\`\`jsx
'use client';

function LikeButton({ postId, initialLikes }) {
  const [likes, setLikes] = useState(initialLikes);
  
  const handleLike = () => {
    setLikes(likes + 1);
    // Send like to server
  };
  
  return (
    <button onClick={handleLike}>
      ❤️ {likes}
    </button>
  );
}
\`\`\`

## Best Practices

1. **Start with Server Components**: Use Server Components by default and only add 'use client' when needed
2. **Minimize Client Components**: Keep interactive parts small and focused
3. **Compose thoughtfully**: Server Components can render Client Components, but not vice versa
4. **Handle loading states**: Use Suspense boundaries for better user experience

## The Future of React

Server Components represent the future direction of React development, enabling better performance, developer experience, and user experience. As the ecosystem matures, we can expect to see more tools and patterns emerge around this paradigm.`,
    excerpt:
      "Learn about React Server Components, how they work, their benefits, and when to use them in your applications.",
    category: "React",
    author: "Aman Shaikh",
    author_image: "/placeholder.svg?height=30&width=30",
    image: "/placeholder.svg?height=400&width=600&text=React+Server+Components",
    read_time: "7 min read",
    tags: ["React", "JavaScript", "Frontend"],
    published_at: "2024-01-01T16:45:00Z",
  },
  {
    id: 5,
    title: "Optimizing Website Performance: A Developer's Guide",
    slug: "website-performance-optimization",
    content: `Website performance directly impacts user experience, conversion rates, and search engine rankings. This comprehensive guide covers practical techniques for creating lightning-fast web experiences.

## Why Performance Matters

The statistics are clear:
- **53% of users abandon sites** that take longer than 3 seconds to load
- **1-second delay can reduce conversions by 7%**
- **Google uses page speed as a ranking factor** for search results
- **Slow sites cost businesses millions** in lost revenue annually

## Core Web Vitals

Google's Core Web Vitals are essential metrics for measuring user experience:

### Largest Contentful Paint (LCP)
- **Target**: Under 2.5 seconds
- **What it measures**: Time to render the largest content element
- **How to improve**: Optimize images, improve server response times, eliminate render-blocking resources

### First Input Delay (FID)
- **Target**: Under 100 milliseconds
- **What it measures**: Time from first user interaction to browser response
- **How to improve**: Reduce JavaScript execution time, use web workers, optimize third-party scripts

### Cumulative Layout Shift (CLS)
- **Target**: Under 0.1
- **What it measures**: Visual stability of the page
- **How to improve**: Reserve space for dynamic content, use proper image dimensions, avoid inserting content above existing content

## Image Optimization

Images often account for the majority of a page's weight:

### Modern Formats
- **WebP**: 25-35% smaller than JPEG with similar quality
- **AVIF**: Even better compression than WebP
- **Use picture element** for format fallbacks

### Responsive Images
- **srcset attribute**: Serve different sizes for different screen densities
- **sizes attribute**: Tell the browser which image size to use
- **Lazy loading**: Load images only when they're about to enter the viewport

### Implementation Example
\`\`\`html
<picture>
  <source srcset="image.avif" type="image/avif">
  <source srcset="image.webp" type="image/webp">
  <img src="image.jpg" alt="Description" loading="lazy">
</picture>
\`\`\`

## JavaScript Optimization

### Code Splitting
Break your JavaScript into smaller chunks:
- **Route-based splitting**: Load code for each page separately
- **Component-based splitting**: Load components only when needed
- **Dynamic imports**: Load modules on demand

### Tree Shaking
Remove unused code from your bundles:
- Use ES6 modules for better tree shaking
- Configure your bundler properly
- Avoid importing entire libraries when you only need specific functions

### Bundle Analysis
Regularly analyze your bundles:
- Use webpack-bundle-analyzer or similar tools
- Identify large dependencies
- Look for duplicate code across chunks

## CSS Optimization

### Critical CSS
- **Inline critical CSS**: Include above-the-fold styles in the HTML
- **Defer non-critical CSS**: Load remaining styles asynchronously
- **Remove unused CSS**: Use tools like PurgeCSS to eliminate dead code

### CSS Loading Strategy
\`\`\`html
<!-- Critical CSS inlined -->
<style>
  /* Critical styles here */
</style>

<!-- Non-critical CSS loaded asynchronously -->
<link rel="preload" href="styles.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
\`\`\`

## Server-Side Optimization

### Caching Strategies
- **Browser caching**: Set appropriate cache headers
- **CDN caching**: Use a Content Delivery Network
- **Server-side caching**: Cache database queries and API responses

### Compression
- **Gzip/Brotli**: Compress text-based resources
- **Image compression**: Optimize images without losing quality
- **Minification**: Remove unnecessary characters from code

### HTTP/2 and HTTP/3
- **Multiplexing**: Send multiple requests simultaneously
- **Server Push**: Send resources before they're requested
- **Header compression**: Reduce overhead of HTTP headers

## Monitoring and Measurement

### Performance Monitoring Tools
- **Google PageSpeed Insights**: Analyze performance and get recommendations
- **WebPageTest**: Detailed performance analysis
- **Lighthouse**: Comprehensive auditing tool
- **Real User Monitoring (RUM)**: Track actual user experiences

### Key Metrics to Track
- **Time to First Byte (TTFB)**: Server response time
- **First Contentful Paint (FCP)**: When first content appears
- **Speed Index**: How quickly content is visually populated
- **Total Blocking Time (TBT)**: Time when main thread is blocked

## Advanced Techniques

### Service Workers
- **Caching strategies**: Cache resources for offline access
- **Background sync**: Sync data when connection is restored
- **Push notifications**: Engage users even when site isn't open

### Preloading and Prefetching
- **Preload**: Load critical resources early
- **Prefetch**: Load resources for future navigation
- **DNS prefetch**: Resolve domain names early

### Resource Hints
\`\`\`html
<!-- Preload critical resources -->
<link rel="preload" href="font.woff2" as="font" type="font/woff2" crossorigin>

<!-- Prefetch resources for next page -->
<link rel="prefetch" href="next-page.html">

<!-- DNS prefetch for external domains -->
<link rel="dns-prefetch" href="//external-api.com">
\`\`\`

## Performance Budget

Set and maintain performance budgets:
- **Size budgets**: Maximum file sizes for different resource types
- **Timing budgets**: Maximum load times for key metrics
- **Quantity budgets**: Maximum number of requests
- **Automated enforcement**: Fail builds that exceed budgets

## Testing and Optimization Workflow

1. **Establish baseline**: Measure current performance
2. **Set goals**: Define target metrics
3. **Implement optimizations**: Apply techniques systematically
4. **Measure impact**: Verify improvements
5. **Monitor continuously**: Track performance over time
6. **Iterate**: Continuously improve based on data

## Common Performance Pitfalls

### Third-Party Scripts
- **Analytics**: Can significantly impact performance
- **Social media widgets**: Often poorly optimized
- **Advertising**: Can add substantial overhead
- **Solution**: Load third-party scripts asynchronously and monitor their impact

### Over-Optimization
- **Premature optimization**: Focus on biggest impact first
- **Micro-optimizations**: Don't sacrifice maintainability for minimal gains
- **User experience**: Performance is means to better UX, not an end in itself

## Conclusion

Website performance optimization is an ongoing process that requires attention to multiple aspects of web development. By focusing on Core Web Vitals, optimizing images and code, implementing proper caching strategies, and continuously monitoring performance, you can create fast, engaging web experiences that delight users and drive business results.

Remember: **Performance is a feature**, not an afterthought. Build it into your development process from the beginning, and your users will thank you for it.`,
    excerpt:
      "Learn practical techniques for optimizing website performance, improving Core Web Vitals, and creating lightning-fast web experiences.",
    category: "Performance",
    author: "Aman Shaikh",
    author_image: "/placeholder.svg?height=30&width=30",
    image: "/placeholder.svg?height=400&width=600&text=Website+Performance",
    read_time: "9 min read",
    tags: ["Performance", "Web Development", "Optimization"],
    published_at: "2023-12-28T11:20:00Z",
  },
  {
    id: 6,
    title: "Building Accessible Web Applications",
    slug: "building-accessible-web-applications",
    content: `Web accessibility ensures that websites and applications are usable by everyone, including people with disabilities. This comprehensive guide covers the principles, techniques, and tools needed to create inclusive web experiences.

## Why Accessibility Matters

### The Numbers
- **Over 1 billion people worldwide** have some form of disability
- **15% of the global population** experiences some form of disability
- **$13 trillion in annual disposable income** from people with disabilities globally
- **Legal requirements** in many countries mandate accessible websites

### Beyond Compliance
Accessibility benefits everyone:
- **Better SEO**: Semantic HTML improves search engine understanding
- **Improved usability**: Clear navigation and content structure help all users
- **Broader audience**: Reach users with temporary or situational disabilities
- **Better code quality**: Accessible code is often cleaner and more maintainable

## The Four Principles of Accessibility (POUR)

### 1. Perceivable
Information must be presentable in ways users can perceive:

**Text Alternatives**
- Provide alt text for images
- Use captions for videos
- Offer transcripts for audio content

**Color and Contrast**
- Ensure sufficient color contrast (4.5:1 for normal text, 3:1 for large text)
- Don't rely solely on color to convey information
- Test with color blindness simulators

**Adaptable Content**
- Use semantic HTML elements
- Ensure content works with different presentations
- Support zoom up to 200% without horizontal scrolling

### 2. Operable
Interface components must be operable:

**Keyboard Accessibility**
- All functionality available via keyboard
- Visible focus indicators
- Logical tab order
- No keyboard traps

**Timing**
- Provide users enough time to read content
- Allow users to extend time limits
- Pause, stop, or hide moving content

**Seizures and Physical Reactions**
- Avoid content that flashes more than 3 times per second
- Provide warnings for potentially triggering content

### 3. Understandable
Information and UI operation must be understandable:

**Readable Text**
- Use clear, simple language
- Define unusual words and abbreviations
- Organize content logically

**Predictable Functionality**
- Consistent navigation and layout
- Predictable component behavior
- Clear error messages and instructions

**Input Assistance**
- Label form controls clearly
- Provide error identification and suggestions
- Offer help text when needed

### 4. Robust
Content must be robust enough for various assistive technologies:

**Compatible Code**
- Use valid, semantic HTML
- Ensure compatibility with screen readers
- Test with multiple assistive technologies

## Semantic HTML: The Foundation

### Proper Heading Structure
\`\`\`html
<h1>Main Page Title</h1>
  <h2>Section Title</h2>
    <h3>Subsection Title</h3>
    <h3>Another Subsection</h3>
  <h2>Another Section</h2>
\`\`\`

### Landmark Elements
\`\`\`html
<header>
  <nav aria-label="Main navigation">
    <!-- Navigation content -->
  </nav>
</header>

<main>
  <article>
    <h1>Article Title</h1>
    <!-- Article content -->
  </article>
  
  <aside>
    <!-- Sidebar content -->
  </aside>
</main>

<footer>
  <!-- Footer content -->
</footer>
\`\`\`

### Form Accessibility
\`\`\`html
<form>
  <fieldset>
    <legend>Personal Information</legend>
    
    <label for="name">Full Name (required)</label>
    <input type="text" id="name" name="name" required aria-describedby="name-help">
    <div id="name-help">Enter your first and last name</div>
    
    <label for="email">Email Address</label>
    <input type="email" id="email" name="email" aria-describedby="email-error">
    <div id="email-error" role="alert" aria-live="polite"></div>
  </fieldset>
</form>
\`\`\`

## ARIA (Accessible Rich Internet Applications)

### ARIA Roles
Define what an element is or does:
\`\`\`html
<div role="button" tabindex="0">Custom Button</div>
<div role="alert">Error message</div>
<nav role="navigation" aria-label="Breadcrumb">
\`\`\`

### ARIA Properties
Describe element properties:
\`\`\`html
<input type="password" aria-required="true" aria-describedby="pwd-help">
<button aria-pressed="false">Toggle Button</button>
<div aria-hidden="true">Decorative content</div>
\`\`\`

### ARIA States
Describe current conditions:
\`\`\`html
<button aria-expanded="false" aria-controls="menu">Menu</button>
<input aria-invalid="true" aria-describedby="error-msg">
<div aria-live="polite" aria-atomic="true">Status updates</div>
\`\`\`

## Common Accessibility Patterns

### Skip Links
\`\`\`html
<a href="#main-content" class="skip-link">Skip to main content</a>
<!-- Other navigation -->
<main id="main-content">
  <!-- Main content -->
</main>
\`\`\`

### Focus Management
\`\`\`javascript
// When opening a modal
function openModal() {
  const modal = document.getElementById('modal');
  const firstFocusable = modal.querySelector('button, input, select, textarea, [tabindex]:not([tabindex="-1"])');
  
  modal.style.display = 'block';
  firstFocusable.focus();
  
  // Trap focus within modal
  modal.addEventListener('keydown', trapFocus);
}

function trapFocus(e) {
  if (e.key === 'Tab') {
    const focusableElements = modal.querySelectorAll('button, input, select, textarea, [tabindex]:not([tabindex="-1"])');
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    if (e.shiftKey && document.activeElement === firstElement) {
      e.preventDefault();
      lastElement.focus();
    } else if (!e.shiftKey && document.activeElement === lastElement) {
      e.preventDefault();
      firstElement.focus();
    }
  }
}
\`\`\`

### Live Regions
\`\`\`html
<!-- For status messages -->
<div aria-live="polite" aria-atomic="true" class="sr-only" id="status"></div>

<!-- For urgent alerts -->
<div aria-live="assertive" aria-atomic="true" class="sr-only" id="alerts"></div>
\`\`\`

\`\`\`javascript
// Announce status updates
function announceStatus(message) {
  const statusElement = document.getElementById('status');
  statusElement.textContent = message;
}
\`\`\`

## Testing for Accessibility

### Automated Testing Tools
- **axe-core**: Comprehensive accessibility testing library
- **Lighthouse**: Built-in accessibility audit
- **WAVE**: Web accessibility evaluation tool
- **Pa11y**: Command-line accessibility testing

### Manual Testing
- **Keyboard navigation**: Tab through entire interface
- **Screen reader testing**: Use NVDA, JAWS, or VoiceOver
- **Color contrast**: Use tools like Colour Contrast Analyser
- **Zoom testing**: Test at 200% zoom level

### Testing Checklist
- [ ] All images have appropriate alt text
- [ ] Headings are properly structured (h1-h6)
- [ ] All form controls have labels
- [ ] Color contrast meets WCAG standards
- [ ] All functionality works with keyboard only
- [ ] Focus indicators are visible
- [ ] Error messages are clear and helpful
- [ ] Content is readable at 200% zoom

## Accessibility in Modern Frameworks

### React Accessibility
\`\`\`jsx
// Use semantic HTML
function Navigation() {
  return (
    <nav aria-label="Main navigation">
      <ul>
        {menuItems.map(item => (
          <li key={item.id}>
            <Link to={item.path} aria-current={isActive ? 'page' : undefined}>
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

// Manage focus
function Modal({ isOpen, onClose, children }) {
  const modalRef = useRef();
  
  useEffect(() => {
    if (isOpen) {
      const firstFocusable = modalRef.current.querySelector('[tabindex], button, input, select, textarea');
      firstFocusable?.focus();
    }
  }, [isOpen]);
  
  return isOpen ? (
    <div role="dialog" aria-modal="true" ref={modalRef}>
      <button onClick={onClose} aria-label="Close modal">×</button>
      {children}
    </div>
  ) : null;
}
\`\`\`

### Vue.js Accessibility
\`\`\`vue
<template>
  <form @submit.prevent="handleSubmit">
    <fieldset>
      <legend>Contact Information</legend>
      
      <label :for="nameId">Name (required)</label>
      <input 
        :id="nameId"
        v-model="name"
        type="text"
        required
        :aria-invalid="nameError ? 'true' : 'false'"
        :aria-describedby="nameError ? nameErrorId : null"
      >
      <div v-if="nameError" :id="nameErrorId" role="alert">
        {{ nameError }}
      </div>
    </fieldset>
  </form>
</template>

<script>
export default {
  data() {
    return {
      name: '',
      nameError: '',
      nameId: 'name-' + Math.random().toString(36).substr(2, 9),
      nameErrorId: 'name-error-' + Math.random().toString(36).substr(2, 9)
    };
  }
};
</script>
\`\`\`

## Common Accessibility Mistakes

### Images Without Alt Text
\`\`\`html
<!-- Wrong -->
<img src="chart.png">

<!-- Right -->
<img src="chart.png" alt="Sales increased 25% from Q1 to Q2">

<!-- Decorative images -->
<img src="decoration.png" alt="" role="presentation">
\`\`\`

### Poor Color Contrast
\`\`\`css
/* Wrong - insufficient contrast */
.text {
  color: #999;
  background: #fff;
}

/* Right - sufficient contrast */
.text {
  color: #666;
  background: #fff;
}
\`\`\`

### Missing Form Labels
\`\`\`html
<!-- Wrong -->
<input type="text" placeholder="Enter your name">

<!-- Right -->
<label for="name">Name</label>
<input type="text" id="name" placeholder="Enter your name">
\`\`\`

## Building an Accessibility Culture

### Team Education
- Regular accessibility training
- Include accessibility in code reviews
- Share accessibility resources and articles
- Celebrate accessibility improvements

### Process Integration
- Include accessibility in design mockups
- Add accessibility criteria to definition of done
- Conduct regular accessibility audits
- Test with real users who have disabilities

### Tools and Resources
- **Screen readers**: NVDA (free), JAWS, VoiceOver
- **Browser extensions**: axe DevTools, WAVE
- **Design tools**: Stark for Figma/Sketch
- **Guidelines**: WCAG 2.1 AA standards

## Conclusion

Building accessible web applications is not just about compliance—it's about creating inclusive experiences that work for everyone. By following semantic HTML practices, implementing proper ARIA attributes, conducting regular testing, and fostering an accessibility-first culture, we can build a more inclusive web.

Remember: **Accessibility is not a feature to be added later—it should be considered from the very beginning of the design and development process.** When we build for accessibility, we build better products for everyone.`,
    excerpt:
      "Learn how to build accessible web applications that work for everyone, covering WCAG guidelines, ARIA, testing strategies, and implementation techniques.",
    category: "Accessibility",
    author: "Aman Shaikh",
    author_image: "/placeholder.svg?height=30&width=30",
    image: "/placeholder.svg?height=400&width=600&text=Web+Accessibility",
    read_time: "12 min read",
    tags: ["Accessibility", "Web Development", "Inclusive Design"],
    published_at: "2023-12-25T13:10:00Z",
  },
]

export async function GET() {
  try {
    // Always return the fallback data for now to ensure it works
    const transformedBlogs = fallbackBlogs.map((blog) => ({
      id: blog.id.toString(),
      title: blog.title,
      slug: blog.slug,
      content: blog.content,
      excerpt: blog.excerpt,
      category: blog.category,
      author: blog.author,
      authorImage: blog.author_image,
      image: blog.image,
      readTime: blog.read_time,
      tags: blog.tags || [],
      date: {
        day: new Date(blog.published_at).getDate().toString().padStart(2, "0"),
        month: new Date(blog.published_at).toLocaleDateString("en-US", { month: "short" }),
        year: new Date(blog.published_at).getFullYear().toString(),
      },
      publishedAt: blog.published_at,
    }))

    const response = {
      blogs: transformedBlogs,
      pagination: {
        page: 1,
        limit: 10,
        total: transformedBlogs.length,
        totalPages: Math.ceil(transformedBlogs.length / 10),
      },
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("Error in blogs API:", error)

    // Return a minimal response even if there's an error
    return NextResponse.json({
      blogs: [],
      pagination: {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
      },
    })
  }
}
