export {};

import(/* webpackChunkName: "AppLoader" */ "./AppLoader").then((module) => {
  module.default();
});
