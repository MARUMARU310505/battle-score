!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{};e.SENTRY_RELEASE={id:"dce79c2b46fb8658052efd0b0dac2c852fc4de15"};var n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="bbc4f22e-517e-4e5b-a0c9-dc8018620673",e._sentryDebugIdIdentifier="sentry-dbid-bbc4f22e-517e-4e5b-a0c9-dc8018620673");}catch(e){}}();import { A as AstroError, bi as InvalidComponentArgs } from './params-and-props_DaruqQBn.mjs';

function validateArgs(args) {
  if (args.length !== 3) return false;
  if (!args[0] || typeof args[0] !== "object") return false;
  return true;
}
function baseCreateComponent(cb, moduleId, propagation) {
  const name = moduleId?.split("/").pop()?.replace(".astro", "") ?? "";
  const fn = (...args) => {
    if (!validateArgs(args)) {
      throw new AstroError({
        ...InvalidComponentArgs,
        message: InvalidComponentArgs.message(name)
      });
    }
    return cb(...args);
  };
  Object.defineProperty(fn, "name", { value: name, writable: false });
  fn.isAstroComponentFactory = true;
  fn.moduleId = moduleId;
  fn.propagation = propagation;
  return fn;
}
function createComponentWithOptions(opts) {
  const cb = baseCreateComponent(opts.factory, opts.moduleId, opts.propagation);
  return cb;
}
function createComponent(arg1, moduleId, propagation) {
  if (typeof arg1 === "function") {
    return baseCreateComponent(arg1, moduleId, propagation);
  } else {
    return createComponentWithOptions(arg1);
  }
}

export { createComponent as c };
