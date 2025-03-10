declare module "bun" {
  interface Env {
    API_ROOT_URL: string;
    API_KEY: string;
    API_KEY_HEADER_NAME: string;
    BEARER_TOKEN: string;
    SESSION_ID: string;

    BUN_CONFIG_NO_CLEAR_TERMINAL_ON_RELOAD: boolean;
    BUN_CONFIG_NO_CLEAR_TERMINAL_ON_EXIT: boolean;
    BUN_CONFIG_NO_CLEAR_TERMINAL_ON_ERROR: boolean;
    BUN_CONFIG_VERBOSE_FETCH: boolean;
}
