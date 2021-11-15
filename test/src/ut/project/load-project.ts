import type * as TS from 'typescript';
import { createTsProgram, createTsSolutionBuilder } from '../../ts-helpers';
import path from 'path';
import { projectsPath } from '../../config';
import { ProjectRunGroup, UnderscoreTestContext, UtProjectConfig } from '../types';
import { TestMap } from '../test-map';
import { getProjectWalker } from './project-walker';
import type { TransformerOptions } from 'tstp/src';
import { getTransformerConfig } from 'tstp/src/transform/transformer';
import { default as tstpTransform } from 'typescript-transform-paths';

/* ****************************************************************************************************************** */
// region: Helpers
/* ****************************************************************************************************************** */

/**
 * Note: Does not currently support pluginOptions from runConfig
 */
function emitWithSolutionBuilder(context: UnderscoreTestContext) {
  const {
    ts,
    projectDir,
    runConfig: { pluginOptions },
    projectConfig: { builderTransformerPredicate },
  } = context;

  const builder = createTsSolutionBuilder(ts, projectDir, (program) => {
    if (builderTransformerPredicate && !builderTransformerPredicate(program)) return {};

    const tstpTransformer = tstpTransform(program, pluginOptions, { ts });
    const utWalker = getProjectWalker(context, program);
    return {
      before: [tstpTransformer],
      after: [utWalker],
      afterDeclarations: [tstpTransformer, utWalker] as TS.TransformerFactory<TS.SourceFile | TS.Bundle>[],
    };
  });

  builder.build();
  builder.restoreTs(); // Do not remove. Needed to unpatch TS createProgram
}

function emitWithProgram(context: UnderscoreTestContext) {
  const { projectDir, ts } = context;

  const program = createTsProgram({
    tsConfigFile: path.join(projectDir, 'tsconfig.json'),
    tsInstance: ts,
    pluginOptions: context.runConfig.pluginOptions,
  });

  const t = getProjectWalker(context, program);
  const customTransformers = { after: [t], afterDeclarations: [t as TS.TransformerFactory<TS.SourceFile | TS.Bundle>] };
  program.emit(undefined, () => {}, void 0, false, customTransformers);
}

function emit(context: UnderscoreTestContext) {
  const {
    projectConfig: { programKind },
  } = context;
  return programKind === 'solutionBuilder' ? emitWithSolutionBuilder(context) : emitWithProgram(context);
}

function createContext<T extends UtProjectConfig>(
  projectDir: string,
  projectConfig: T,
  tsModule: typeof envOptions.tsModules[number],
  ts: typeof TS,
  runConfig: TestRunConfig
) {
  const context: UnderscoreTestContext = {
    ts,
    projectConfig,
    tests: <any>void 0,
    printer: ts.createPrinter(),
    projectDir,
    tsModule,
    runConfig,
    transformerConfig: getTransformerConfig(runConfig.pluginOptions),
    walkLog: {
      js: false,
      declarations: false,
    },
  };
  context.tests = new TestMap(context);

  return context;
}

// endregion

/* ****************************************************************************************************************** *
 * loadProject (Utility)
 * ****************************************************************************************************************** */

export function loadProject<T extends UtProjectConfig>(projectConfig: T) {
  const { projectName, configs, useGroups } = projectConfig;

  const projectDir = path.resolve(projectsPath, projectName);

  const allowedTs = projectConfig.allowedTs?.map((m) => m.toLowerCase()) as string[];
  const tsModules = !projectConfig.allowedTs
    ? envOptions.tsModules
    : envOptions.tsModules.filter((m) => allowedTs!.includes(m[0].toLowerCase()));
  const tsInstances = new Map<typeof tsModules[number], typeof TS>();

  let res: ProjectRunGroup[] = [];
  for (const tsModule of tsModules) {
    for (const config of [configs].flat()) {
      const runConfig = createRunConfig(tsModule, config);
      const testMap = loadTests(tsModule, runConfig);
      const runLabel = `[TS: ${tsModule[0]}` + (config ? ` - ` + getConfigLabel(config) : '') + ']';
      const run = { runLabel } as ProjectRunGroup;

      if (useGroups) {
        run.groups = [];
        for (const groupName of testMap.getGroups())
          run.groups.push({ groupLabel: `[${groupName}]`, tests: testMap.getTestsForGroup(groupName) });
      } else run.tests = testMap.getTests();

      res.push(run);
    }
  }

  return res;

  function getConfigLabel(config: Record<string, any>) {
    return Object.entries(config)
      .map(([k, v]) => `${k}: ${v?.toString()}`)
      .join(', ');
  }

  function loadTests(tsModule: typeof tsModules[number], runConfig: TestRunConfig) {
    const ctx = createContext(projectDir, projectConfig, tsModule, getTsInstance(tsModule), runConfig);

    emit(ctx);

    if (!ctx.walkLog.js) throw new Error(`Walker never executed for js files!`);
    if (!ctx.walkLog.declarations) throw new Error(`Walker never executed for declarations files!`);

    return ctx.tests.validate();
  }

  function createRunConfig(tsModule: typeof tsModules[number], config?: TransformerOptions): TestRunConfig {
    const ts = getTsInstance(tsModule);
    const [majorVer, minorVer] = ts.versionMajorMinor.split('.');
    return {
      mode: 'program',
      tsMajorVersion: +majorVer,
      tsMinorVersion: +minorVer,
      pluginOptions: {
        ...projectConfig.pluginOptions,
        ...config,
      },
    };
  }

  function getTsInstance(tsModule: typeof tsModules[number]) {
    if (!tsInstances.has(tsModule)) tsInstances.set(tsModule, require(tsModule[1]));
    return tsInstances.get(tsModule)!;
  }
}
