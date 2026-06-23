!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{};e.SENTRY_RELEASE={id:"d9eddfe5ff0a9193a99cfff4c059b06ab7d53ab4"};var n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="c5b921aa-347e-4f54-95a1-d306ccbe0f50",e._sentryDebugIdIdentifier="sentry-dbid-c5b921aa-347e-4f54-95a1-d306ccbe0f50");}catch(e){}}();import { p as pipelineSymbol, A as AstroError, a as ActionCalledFromServerError } from './params-and-props_C_SQUMVQ.mjs';
import { c as createActionsProxy } from './entrypoint_B2Vs5dyY.mjs';

const actions = createActionsProxy({
  handleAction: async (param, path, context) => {
    const pipeline = context ? Reflect.get(context, pipelineSymbol) : void 0;
    if (!pipeline) {
      throw new AstroError(ActionCalledFromServerError);
    }
    const action = await pipeline.getAction(path);
    if (!action) throw new Error(`Action not found: ${path}`);
    return action.bind(context)(param);
  }
});

export { actions as a };
