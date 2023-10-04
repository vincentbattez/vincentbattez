module.exports = {
  name: 'vb-icon',
  inputDir: './assets/icons', // (required)
  outputDir: './assets/fonts/vb-icon', // (required)
  fontTypes: ['ttf', 'woff', 'woff2'],
  assetTypes: ['ts', 'css', 'html'],
  formatOptions: {
    ts: {
      types: ['enum'],
      enumName: 'VbIconEnum',
    }
  },
  pathOptions: {
    ts: './types/vb-icon.ts',
  },
  // Customize generated icon IDs (unavailable with `.json` config file)
  getIconId: ({
    basename, // `string` - Example: 'foo';
    relativeDirPath, // `string` - Example: 'sub/dir/foo.svg'
    absoluteFilePath, // `string` - Example: '/var/icons/sub/dir/foo.svg'
    relativeFilePath, // `string` - Example: 'foo.svg'
    index // `number` - Example: `0`
  }) => ["vb", basename].join('_') // 'vb_heart'
};
