// src/index.tsx
import { createSignal, createEffect, onMount, createContext, useContext } from "solid-js";
import { useLocation, useSearchParams } from "@solidjs/router";
import posthog from "posthog-js";
var PostHogContext = createContext({
  client: null,
  setClient: () => {
  },
  isInitialized: false
});
function createPostHogContext() {
  const [client, setClient] = createSignal(null);
  const [isInitialized, setIsInitialized] = createSignal(false);
  return {
    get client() {
      return client();
    },
    setClient: (newClient) => {
      setClient(newClient);
      setIsInitialized(true);
    },
    get isInitialized() {
      return isInitialized();
    }
  };
}
function usePostHog() {
  return useContext(PostHogContext);
}
function PostHogProvider(props) {
  const posthogContext = createPostHogContext();
  onMount(() => {
    const token = props.token;
    const apiHost = props.apiHost || "https://us.i.posthog.com";
    if (token) {
      try {
        posthog.init(token, {
          api_host: apiHost,
          person_profiles: "identified_only",
          capture_pageview: false,
          debug: props.debug || false
        });
        posthogContext.setClient(posthog);
        if (props.debug) {
        }
      } catch (error) {
      }
    } else {
    }
  });
  return <PostHogContext.Provider value={posthogContext}>{props.children}</PostHogContext.Provider>;
}
function PostHogPageViewTracker() {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const posthogContext = usePostHog();
  createEffect(() => {
    const pathname = location.pathname;
    const client = posthogContext.client;
    const isInitialized = posthogContext.isInitialized;
    if (pathname && client && isInitialized) {
      let url = window.origin + pathname;
      const paramsEntries = Object.entries(searchParams);
      const urlSearchParams = new URLSearchParams();
      paramsEntries.forEach(([key, value]) => {
        if (value !== void 0) {
          urlSearchParams.append(key, value.toString());
        }
      });
      const searchParamsString = urlSearchParams.toString();
      if (searchParamsString) {
        url = url + "?" + searchParamsString;
      }
      client.capture("$pageview", { $current_url: url });
    }
  });
  return null;
}
export {
  PostHogPageViewTracker,
  PostHogProvider,
  createPostHogContext,
  usePostHog
};
