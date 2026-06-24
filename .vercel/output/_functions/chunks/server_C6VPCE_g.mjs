!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{};e.SENTRY_RELEASE={id:"9c940a4166a61bf356fe8b380c1a18ceb395b620"};var n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="0d31f028-88bd-43b8-8460-7be616d881ef",e._sentryDebugIdIdentifier="sentry-dbid-0d31f028-88bd-43b8-8460-7be616d881ef");}catch(e){}}();import { p as pipelineSymbol, A as AstroError, a as ActionCalledFromServerError } from './params-and-props_XDDp7hio.mjs';
import { c as createActionsProxy } from './entrypoint_B5U5RYEC.mjs';

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
