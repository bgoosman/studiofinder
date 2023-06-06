let data = {};
module.exports = {
  e2e: {
    setupNodeEvents(on, config) {
      on("task", {
        setValue: ({ key, value }) => {
          data[key] = value;
          return null;
        },
        getValue: ({ key }) => {
          return data[key] || null;
        },
      });
    },
  },
  video: false,
};
