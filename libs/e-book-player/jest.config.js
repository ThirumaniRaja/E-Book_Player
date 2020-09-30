module.exports = {
  name: 'e-book-player',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/libs/e-book-player',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js'
  ]
};
