module.exports = {
  name: 'viewer-pdf',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/libs/viewer-pdf',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js'
  ]
};
