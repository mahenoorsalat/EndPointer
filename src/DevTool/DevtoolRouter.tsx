import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import DevToolsApp from './DevtoolsApp'
import {
  HashRouter as Router,
  Route,
  Routes,
} from 'react-router-dom'
import { URLs } from './routes/urls'
import { JSFiles } from './routes/js-files'
import { Creds } from './routes/creds'
import { APIKeys } from './routes/apikeys'
import { URLSVisited } from './routes/urlsvisited';

// Create the DevTools panel
chrome.devtools.panels.create(
  "JS-Toolkit",
  "",
  "DevTool/DevTool.html",
  (panel) => {
    console.log("DevTools panel created");

    const  logCurrentUrl = () => {
    chrome.tabs.get(chrome.devtools.inspectedWindow.tabId, (tab) => {
      if (tab && tab.url) {
        console.log("Current URL:", tab.url);
      } else {
        console.error("Unable to get current tab URL");
      }
    });
  };

  // Log URL when panel is shown
  // panel.onShown.addListener(logCurrentUrl);

  // // Log URL on page updates for the inspected window
  // chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  //   if (tabId === chrome.devtools.inspectedWindow.tabId && changeInfo.status === 'complete') {
  //     logCurrentUrl();
  //   }
  // });

  });



// Render the React app
function renderApp() {
  const root = document.getElementById('root');
  if (root) {
    createRoot(root).render(
      <StrictMode>
        <Router>
          <Routes>
            <Route path="/" element={<DevToolsApp />} />
            <Route path="/urls" element={<URLs />} />
            <Route path="/js-files" element={<JSFiles />} />
            <Route path="/creds" element={<Creds />} />
            <Route path="/apikeys" element={<APIKeys />} />
            <Route path="/urlsvisited" element={<URLSVisited />} />
          </Routes>
        </Router>
      </StrictMode>
    );
  } else {
    console.log("Root element not found");
  }
}
  
// Wait for the DOM to be fully loaded before rendering
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', renderApp);
} else {
  renderApp();
}
  