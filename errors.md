[plugin:vite:import-analysis] Failed to resolve import "../lib/supabaseClient" from "src/contexts/AuthContext.tsx". Does the file exist?

C:/Users/gbami/OneDrive/Desktop/LYRA/LYRA/src/contexts/AuthContext.tsx:3:25

11 |  var _s = $RefreshSig$(), _s1 = $RefreshSig$();
12 |  import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
13 |  import { supabase } from '../lib/supabaseClient';
   |                            ^
14 |  import { useNavigate, useLocation } from 'react-router-dom';
15 |  import { useToast } from '../hooks/use-toast';

    at TransformPluginContext._formatError (file:///C:/Users/gbami/OneDrive/Desktop/LYRA/LYRA/node_modules/vite/dist/node/chunks/dep-BWSbWtLw.js:49255:41)
    at TransformPluginContext.error (file:///C:/Users/gbami/OneDrive/Desktop/LYRA/LYRA/node_modules/vite/dist/node/chunks/dep-BWSbWtLw.js:49250:16)
    at normalizeUrl (file:///C:/Users/gbami/OneDrive/Desktop/LYRA/LYRA/node_modules/vite/dist/node/chunks/dep-BWSbWtLw.js:64041:23)
    at async file:///C:/Users/gbami/OneDrive/Desktop/LYRA/LYRA/node_modules/vite/dist/node/chunks/dep-BWSbWtLw.js:64173:39
    at async Promise.all (index 3)
    at async TransformPluginContext.transform (file:///C:/Users/gbami/OneDrive/Desktop/LYRA/LYRA/node_modules/vite/dist/node/chunks/dep-BWSbWtLw.js:64100:7)
    at async PluginContainer.transform (file:///C:/Users/gbami/OneDrive/Desktop/LYRA/LYRA/node_modules/vite/dist/node/chunks/dep-BWSbWtLw.js:49096:18)
    at async loadAndTransform (file:///C:/Users/gbami/OneDrive/Desktop/LYRA/LYRA/node_modules/vite/dist/node/chunks/dep-BWSbWtLw.js:51929:27)
    at async viteTransformMiddleware (file:///C:/Users/gbami/OneDrive/Desktop/LYRA/LYRA/node_modules/vite/dist/node/chunks/dep-BWSbWtLw.js:61881:24

Click outside, press Esc key, or fix the code to dismiss.
You can also disable this overlay by setting server.hmr.overlay to false in vite.config.ts.