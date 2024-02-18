module.exports = {
  plugins: [
    require('@pandacss/dev/postcss')({
      configPath: '../styled-system/panda.config.ts',
    }),
  ],
};
