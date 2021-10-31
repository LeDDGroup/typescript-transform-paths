import TS, { Node, SourceFile } from "typescript";
import { tsModules } from "../config";
import { TransformerConfig, TransformerOptions } from "tstp/src";
import { TestMap } from "./test-map";


/* ****************************************************************************************************************** *
 * Types
 * ****************************************************************************************************************** */

export interface ExpectDetail {
  sourceFile: SourceFile
  compiledSourceFile: SourceFile
  testName: string
  config: ExpectConfig
  targetNode: Node
  compiledTargetNode: Node | undefined
  expectedOutput: string | undefined
  actualOutput: string | undefined
}

export interface TestDetail {
  sourceFile: SourceFile
  expects: ExpectDetail[]
  config: TestConfig
  testName: string
  label: string | ((opt: any) => string)
  enabled: boolean
}

export interface UtProjectConfig {
  projectName: string;
  programKind?: 'program' | 'solutionBuilder'
  /**
   * Restrict to specific TS version (initializes array with those specified but can be narrowed by env var)
   */
  allowedTs?: typeof tsModules[number][0][]
  pluginOptions?: TransformerOptions | ((ctx: TestRunConfig) => TransformerOptions)
  useGroups?: boolean
  configs?: TransformerOptions[]
  builderTransformerPredicate?: (program: TS.Program) => boolean
}

export interface UnderscoreTestContext {
  projectConfig: UtProjectConfig
  ts: typeof TS
  printer: TS.Printer
  tests: TestMap
  projectDir: string
  tsModule: typeof tsModules[number]
  runConfig: TestRunConfig
  transformerConfig: TransformerConfig
  walkLog: {
    declarations: boolean
    js: boolean
  }
}

export interface ProjectRunGroup {
  runLabel: string;
  tests: (readonly [ string, TestDetail])[],
  groups: { groupLabel: string, tests: (readonly [ string, TestDetail ])[] }[]
}
