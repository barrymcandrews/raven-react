/// <reference types="react-scripts" />
declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production' | 'test'
    PUBLIC_URL: string
    REACT_APP_USER_POOL_ID: string
    REACT_APP_USER_POOL_CLIENT_ID: string
    REACT_APP_REST_ENDPOINT: string
    REACT_APP_WEBSOCKET_ENDPOINT: string
  }
}
