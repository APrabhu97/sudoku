module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['.'],
          alias: {
            '@/components': './components',
            '@/hooks': './hooks',
            '@/services': './src/services',
            '@/screens': './src/screens',
            '@/store': './src/store',
            '@/types': './src/types',
            '@/styles': './src/styles',
            '@': './src',
          },
        },
      ],
    ],
  };
};
