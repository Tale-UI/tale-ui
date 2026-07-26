export type ComponentPerformanceSample = {
  duration: number;
  postconditionDigest: string;
};

export type ComponentPerformanceFixture = {
  id: string;
  description: string;
  path: string;
  setup: string;
  operationCount: number;
  sourceDigest: string;
  vectorDigest: string;
  markupDigest: string;
  expectedPostconditionDigest: string;
  runSample: () => ComponentPerformanceSample | Promise<ComponentPerformanceSample>;
  teardown?: () => void | Promise<void>;
};
