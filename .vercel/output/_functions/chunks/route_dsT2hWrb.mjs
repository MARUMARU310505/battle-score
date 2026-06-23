!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{};e.SENTRY_RELEASE={id:"0f5592c27bdbf924f4cd59af20d6d6f67364ea24"};var n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="7b4cf74b-0560-4d64-ba2a-9d787e33e276",e._sentryDebugIdIdentifier="sentry-dbid-7b4cf74b-0560-4d64-ba2a-9d787e33e276");}catch(e){}}();import { g as getActionContext } from './entrypoint_a031BDoZ.mjs';

const POST = async (context) => {
  const { action, serializeActionResult } = getActionContext(context);
  if (action?.calledFrom !== "rpc") {
    return new Response("Not found", { status: 404 });
  }
  const result = await action.handler();
  const serialized = serializeActionResult(result);
  if (serialized.type === "empty") {
    return new Response(null, {
      status: serialized.status
    });
  }
  return new Response(serialized.body, {
    status: serialized.status,
    headers: {
      "Content-Type": serialized.contentType
    }
  });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
