/**
 * Vercel Web Analytics integration.
 *
 * CyberChef stores the recipe and input in the URL query string and hash, so
 * these are stripped from every event before it is sent to ensure user data
 * never leaves the browser.
 *
 * @license Apache-2.0
 */

import { inject } from "@vercel/analytics";

/**
 * Removes the query string and fragment from an analytics event URL.
 *
 * @param {Object} event - The event passed to the Vercel `beforeSend` hook
 * @returns {Object|null} A copy of the event with a sanitised URL, or null to
 *     drop the event if its URL cannot be parsed
 */
export function sanitiseAnalyticsEvent(event) {
    if (!event || typeof event.url !== "string") return null;

    let url;
    try {
        url = new URL(event.url);
    } catch (err) {
        return null;
    }

    url.search = "";
    url.hash = "";
    return { ...event, url: url.toString() };
}

/**
 * Starts Vercel Web Analytics. Does nothing when CyberChef is opened from the
 * local filesystem (e.g. the standalone download).
 */
export function initAnalytics() {
    if (window.location.protocol === "file:") return;

    inject({
        mode: "production",
        beforeSend: sanitiseAnalyticsEvent
    });
}
