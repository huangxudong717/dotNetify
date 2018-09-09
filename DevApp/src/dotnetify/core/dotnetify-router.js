/* 
Copyright 2017-2018 Dicky Suryadi

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
 */
import Path from '../libs/path';

export default class dotnetifyRouter {
  version = '2.0.0';

  // URL path that will be parsed when performing routing.
  urlPath = document.location.pathname;

  // Initialize routing using PathJS.
  init() {
    if (typeof Path !== 'undefined') {
      Path.history.listen(true);
      Path.routes.rescue = function() {
        //window.location.replace(document.location.pathname);
      };
    }
    else throw new Error('Pathjs library is required for routing.');
  }

  // Map a route to an action.
  mapTo(iPath, iFn) {
    if (typeof Path !== 'undefined')
      Path.map(iPath).to(function() {
        iFn(this.params);
      });
  }

  // Match a URL path to a route and run the action.
  match(iUrlPath) {
    if (typeof Path !== 'undefined') {
      var matched = Path.match(iUrlPath, true);
      if (matched != null) {
        matched.run();
        return true;
      }
    }
    return false;
  }

  // Optional callback to override a URL before performing routing.
  overrideUrl(iUrl, iTargetSelector) {
    return iUrl;
  }

  // Push state to HTML history.
  pushState(iState, iTitle, iPath) {
    dotnetify.react.router.urlPath = '';
    if (typeof Path !== 'undefined') Path.history.pushState(iState, iTitle, iPath);
  }

  // Redirect to the a URL.
  redirect(iUrl, viewModels) {
    // Check first whether existing views can handle routing this URL.
    // Otherwise, do a hard browser redirect.
    dotnetify.react.router.urlPath = iUrl;
    for (let i = 0; i < viewModels.length; i++) {
      const vm = viewModels[i];
      if (vm.$router.routeUrl()) {
        if (dotnetify.debug) console.log('router> redirected');
        return;
      }
    }
    window.location.replace(iUrl);
  }

  // Called by dotNetify when a view model is ready.
  $ready() {
    this.$router.initRouting();
  }
}
