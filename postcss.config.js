module.exports = {
  plugins: [
    require('postcss-preset-env')({
      browsers: [
        'defaults',
        'not IE <= 10',
        'IE 11',
        'not Android < 4.4.4',
        'not dead'
      ],
      autoprefixer: { grid: true },
      stage: 3
    })
  ]
};
