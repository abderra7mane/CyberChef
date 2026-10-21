/**
 * Vercel Web Analytics tests.
 *
 * @license Apache-2.0
 */

import TestRegister from "../../lib/TestRegister.mjs";
import { sanitiseAnalyticsEvent } from "../../../src/web/utils/analytics.mjs";
import it from "../assertionHandler.mjs";
import assert from "assert";

TestRegister.addApiTests([
    it("Analytics: should strip the recipe and input from the URL hash", () => {
        const event = sanitiseAnalyticsEvent({
            type: "pageview",
            url: "https://example.com/#recipe=To_Base64('A-Za-z0-9%2B/%3D')&input=c2VjcmV0"
        });
        assert.deepStrictEqual(event, {
            type: "pageview",
            url: "https://example.com/"
        });
    }),

    it("Analytics: should strip the query string from the URL", () => {
        const event = sanitiseAnalyticsEvent({
            type: "pageview",
            url: "https://example.com/?recipe=To_Hex('Space')&input=c2VjcmV0#input=c2VjcmV0"
        });
        assert.strictEqual(event.url, "https://example.com/");
    }),

    it("Analytics: should keep the path", () => {
        const event = sanitiseAnalyticsEvent({
            type: "event",
            url: "https://example.com/CyberChef/index.html?a=1"
        });
        assert.deepStrictEqual(event, {
            type: "event",
            url: "https://example.com/CyberChef/index.html"
        });
    }),

    it("Analytics: should not modify the original event", () => {
        const original = { type: "pageview", url: "https://example.com/#input=c2VjcmV0" };
        sanitiseAnalyticsEvent(original);
        assert.strictEqual(original.url, "https://example.com/#input=c2VjcmV0");
    }),

    it("Analytics: should drop events with an unparseable URL", () => {
        assert.strictEqual(sanitiseAnalyticsEvent({ type: "pageview", url: "not a url #input=c2VjcmV0" }), null);
    }),

    it("Analytics: should drop malformed events", () => {
        assert.strictEqual(sanitiseAnalyticsEvent(null), null);
        assert.strictEqual(sanitiseAnalyticsEvent({ type: "pageview" }), null);
        assert.strictEqual(sanitiseAnalyticsEvent({ type: "pageview", url: 42 }), null);
    }),
]);
