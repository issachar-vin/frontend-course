import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Note: intentionally not wrapped in <StrictMode>. Sandpack's bundler runs in an
// iframe that StrictMode's dev-mode double-mount tears down mid-load, aborting
// the bundler connection so the live preview and tests never run.
createRoot(document.getElementById('root')!).render(<App />)
