!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{};e.SENTRY_RELEASE={id:"25f39b046960f343648b5091ab94457f0b17ccff"};var n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="08d02549-e577-4ef8-b6a1-b4e4e99929aa",e._sentryDebugIdIdentifier="sentry-dbid-08d02549-e577-4ef8-b6a1-b4e4e99929aa");}catch(e){}}();import { af as sequence } from './chunks/params-and-props_Ug7RKuBl.mjs';
import { onRequest as onRequest$1 } from '@sentry/astro/middleware';

const onRequest = sequence(
	onRequest$1,
	
	
);

export { onRequest };
