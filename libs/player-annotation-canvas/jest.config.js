module.exports = {
  name: 'player-annotation-canvas',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/libs/player-annotation-canvas',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js'
  ]
};
