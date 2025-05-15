# PostHog.js Solid Components
```tsx
import { PostHogProvider, PostHogPageViewTracker } from 'posthog-js/solid'
```

```tsx
const App: Component = () => {
  return (
    <PostHogProvider token="your-posthog-token" apiHost="your-posthog-region" debug={true}>
      <div class={styles.App}>
        <header class={styles.header}>
          <img src={logo} class={styles.logo} alt="logo" />
          <h1></h1>
          <p>
            Edit <code>src/App.tsx</code> and save to reload.
          </p>
          <a
            class={styles.link}
            href="https://github.com/solidjs/solid"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn Solid
          </a>
        </header>
      </div>
    </PostHogProvider>
  )
}
```

If you would like to enable pageviews and such just simply add the following
component in any one of your routes.

```tsx
<PostHogPageViewTracker />
```
