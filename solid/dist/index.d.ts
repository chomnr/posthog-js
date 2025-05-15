import { JSX } from 'solid-js';
import { PostHog } from 'posthog-js';

type PostHogContextType = {
    client: PostHog | null;
    setClient: (client: PostHog) => void;
    isInitialized: boolean;
};
declare function createPostHogContext(): {
    readonly client: PostHog | null;
    setClient: (newClient: PostHog) => void;
    readonly isInitialized: boolean;
};
declare function usePostHog(): PostHogContextType;
interface PostHogProviderProps {
    children: JSX.Element;
    token?: string;
    apiHost?: string;
    debug?: boolean;
}
declare function PostHogProvider(props: PostHogProviderProps): JSX.Element;
declare function PostHogPageViewTracker(): null;

export { PostHogPageViewTracker, PostHogProvider, createPostHogContext, usePostHog };
