!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{};e.SENTRY_RELEASE={id:"bfcd9436403f315a94acf36ebfa581e3e93a06fc"};var n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="c0b385df-ae44-4e23-a30a-7562c7f3b42a",e._sentryDebugIdIdentifier="sentry-dbid-c0b385df-ae44-4e23-a30a-7562c7f3b42a");}catch(e){}}();import './page-ssr_e8NL110z.mjs';
import { c as createComponent } from './astro-component_BDF6RDGh.mjs';
import 'piccolore';
import { Q as renderTemplate, T as maybeRenderHead, a4 as addAttribute } from './params-and-props_BwyISsjz.mjs';
import { r as renderComponent } from './entrypoint_B-q5n6qa.mjs';
import { $ as $$BaseLayout } from './base-layout_DIw7OLsH.mjs';

const $$404 = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, {}, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<main class="h-screen flex flex-col justify-center items-center gap-6"> <img class="max-w-[350px]" src="/images/404.svg" alt="404"${addAttribute(350, "width")}> <div class="flex flex-col gap-1 text-center"> <h1 class="text-4xl font-bold text-gray-700">
Oops!, Página no encontrada
</h1> <p class="text-2xl text-gray-400">El enlace puede estar dañado</p> <small class="text-sm text-gray-600">o la página pudo haber sido removida</small> </div> <a href="/" class="bg-black py-3 px-4 rounded-sm text-white text-sm font-bold hover:bg-slate-900">Regresar al inicio</a> </main> ` })}`;
}, "/Users/mpacheco/Documents/projects/PROJECT-battle-score/battle-score/src/pages/404.astro", void 0);

const $$file = "/Users/mpacheco/Documents/projects/PROJECT-battle-score/battle-score/src/pages/404.astro";
const $$url = "/404";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$404,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
