module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  reporters: [
    "default",
    [
      "jest-junit",
      {
        outputDirectory: "coverage",
        outputName: "junit-reported-tests.xml",
        ancestorSeparator: " › "
      }
    ]
  ],
  coverageReporters: ["json", "html", "cobertura"]
};
