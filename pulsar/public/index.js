import { defaultConfig, versionInfo } from "./scramjet/scramjet.mjs";
import {
	Controller,
	ManagedPlugin,
} from "./controller/controller-external.mjs";
import LibcurlTransport from "./libcurl/index.mjs";
import EpoxyTransport from "./epoxy/index.mjs";
import createTorRoutingTransport from "./tor-adapter.mjs";

("use strict");

const form = document.getElementById("sj-form");
const address = document.getElementById("sj-address");
const homeAddress = document.getElementById("sj-home-address");
const searchEngine = document.getElementById("sj-engine-select");
const searchEngineSettings = document.getElementById(
	"sj-engine-select-settings"
);
const wispSelectTop = document.getElementById("sj-wisp-select-top");
const torSelect = document.getElementById("sj-tor-select");
const transportSelect = document.getElementById("sj-transport-select");
const adblockToggle = document.getElementById("sj-adblock-toggle");
const popupBlockerToggle = document.getElementById("sj-popup-blocker-toggle");
const autoClickerToggle = document.getElementById("sj-autoclicker-toggle");
const autoClickerDelay = document.getElementById("sj-autoclicker-delay");
const error = document.getElementById("sj-error");
const errorCode = document.getElementById("sj-error-code");
const viewport = document.getElementById("sj-viewport");
const errorPanel = document.getElementById("sj-error-panel");
const loadingBar = document.getElementById("sj-loading-bar");
const pageLoader = document.getElementById("sj-page-loader");
const pageLoaderText = document.getElementById("sj-page-loader-text");
const settingsPanel = document.getElementById("sj-settings-panel");
const settingsButton = document.getElementById("sj-settings-button");
const settingsClose = document.getElementById("sj-settings-close");
const newTabButton = document.getElementById("sj-new-tab");
const backButton = document.getElementById("sj-back");
const forwardButton = document.getElementById("sj-forward");
const reloadButton = document.getElementById("sj-reload");
const tabsContainer = document.getElementById("sj-tabs");
const tabsStrip = tabsContainer?.closest(".tabs") || null;
const fullscreenButton = document.getElementById("sj-fullscreen-button");
const particlesCanvas = document.getElementById("particles");
const shieldButton = document.getElementById("sj-shield-button");
const shieldPopup = document.getElementById("sj-shield-popup");
const shieldSite = document.getElementById("sj-shield-site");
const shieldStatus = document.getElementById("sj-shield-status");
const shieldCountMini = document.getElementById("sj-shield-count-mini");
const shieldBlockedCount = document.getElementById("sj-shield-blocked-count");
const shieldMainToggle = document.getElementById("sj-shield-main-toggle");
const shieldTrackerMode = document.getElementById("sj-shield-tracker-mode");
const shieldHttpsToggle = document.getElementById("sj-shield-https-toggle");
const shieldScriptsToggle = document.getElementById("sj-shield-scripts-toggle");
const shieldFingerprintingToggle = document.getElementById(
	"sj-shield-fingerprinting-toggle"
);
const shieldCookiesToggle = document.getElementById("sj-shield-cookies-toggle");
const shieldForgetToggle = document.getElementById("sj-shield-forget-toggle");
const shieldClearSite = document.getElementById("sj-shield-clear-site");
const shieldOpenSettings = document.getElementById("sj-shield-open-settings");
const shieldsToggleSettings = document.getElementById(
	"sj-shields-toggle-settings"
);
const trackerModeSettings = document.getElementById("sj-tracker-mode-settings");
const httpsUpgradeToggle = document.getElementById("sj-https-upgrade-toggle");
const stripTrackingToggle = document.getElementById("sj-strip-tracking-toggle");
const blockScriptsToggle = document.getElementById("sj-block-scripts-toggle");
const gpcToggle = document.getElementById("sj-gpc-toggle");
const fingerprintingToggle = document.getElementById(
	"sj-fingerprinting-toggle"
);
const webrtcToggle = document.getElementById("sj-webrtc-toggle");
const thirdPartyCookiesToggle = document.getElementById(
	"sj-third-party-cookies-toggle"
);
const forgetSiteToggleSettings = document.getElementById(
	"sj-forget-site-toggle-settings"
);
const clearDataButton = document.getElementById("sj-clear-data-button");
const bookmarksButton = document.getElementById("sj-bookmarks-button");
const bookmarksDrawer = document.getElementById("sj-bookmarks-drawer");
const bookmarksList = document.getElementById("sj-bookmarks-list");
const bookmarksAddBtn = document.getElementById("sj-bookmarks-add");
const bookmarksCloseBtn = document.getElementById("sj-bookmarks-close");
const scriptsToggle = document.getElementById("sj-scripts-toggle");
const scriptsList = document.getElementById("sj-scripts-list");
const scriptsAddBtn = document.getElementById("sj-scripts-add");

const NEW_TAB_URL = "pulsar://new-tab";
// Base64 rather than percent-encoded: renderTabs runs favicons through
// encodeURI, which would escape the `%` of a percent-encoded data URI.
const INTERNAL_PAGE_FAVICON =
	"data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI2M3N2RmZiI+PHBhdGggZD0iTTIwIDEyYTIuNSAyLjUgMCAwIDAtMi41LTIuNUgxN1Y3YTIgMiAwIDAgMC0yLTJoLTIuNVY0LjVhMi41IDIuNSAwIDAgMC01IDBWNUg1YTIgMiAwIDAgMC0yIDJ2My4yaC41YTIuNCAyLjQgMCAwIDEgMCA0LjhIM1YxOWEyIDIgMCAwIDAgMiAyaDMuMnYtLjVhMi40IDIuNCAwIDAgMSA0LjggMHYuNUgxNWEyIDIgMCAwIDAgMi0ydi0yLjVoLjVBMi41IDIuNSAwIDAgMCAyMCAxNHoiLz48L3N2Zz4=";

// Pages Pulsar serves itself instead of routing through the proxy.
const INTERNAL_PAGES = {};

const INTERNAL_PAGE_ALIASES = {
	"new-tab": NEW_TAB_URL,
	newtab: NEW_TAB_URL,
};
const FAVICON_FALLBACK = "./favi.png";
const TRANSPORT_STORAGE_KEY = "pulsar-transport";
const TRANSPORT_PROFILE_STORAGE_KEY = "pulsar-transport-profile";
const STREAMING_TRANSPORT_PROFILE = "scramjet-v2-epoxy-default-v1";
const SEARCH_ENGINE_STORAGE_KEY = "pulsar-search-engine";
const SESSION_STORAGE_KEY = "pulsar-session";
const HISTORY_STORAGE_KEY = "pulsar-history";
const POPUP_BLOCKER_STORAGE_KEY = "pulsar-popup-blocker";
const AUTOCLICKER_ENABLED_STORAGE_KEY = "pulsar-autoclicker-enabled";
const AUTOCLICKER_DELAY_STORAGE_KEY = "pulsar-autoclicker-delay";
const PRIVACY_STORAGE_KEY = "pulsar-privacy-settings-v1";
const BOOKMARKS_STORAGE_KEY = "pulsar-bookmarks-v1";
const SCRIPTS_STORAGE_KEY = "pulsar-scripts-v1";
const SCRIPTS_ENABLED_KEY = "pulsar-scripts-enabled";
const TOR_STORAGE_KEY = "pulsar-tor-server";
const TOR_CAPABILITY_TIMEOUT_MS = 3500;
const TOR_SCAN_CONCURRENCY = 12;
const WISP_PING_TIMEOUT_MS = 2200;
const WISP_PING_CONCURRENCY = 6;
const WISP_PING_ATTEMPTS = 1;
const WISP_HEALTH_CHECK_DELAY_MS = 4000;
const WISP_LAUNCH_HEALTH_BUDGET_MS = 1100;
const WISP_INSTANT_PING_TIMEOUT_MS = 1100;
const WISP_INSTANT_PING_CONCURRENCY = 12;
const WISP_INSTANT_LAUNCH_HEALTH_BUDGET_MS = 1200;
const SHIELD_POPUP_CLOSE_MS = 220;
const TRANSPORT_RESUME_DELAY_MS = 250;
const DEFAULT_AUTOCLICKER_DELAY_MS = 250;
const NAVIGATION_WATCHDOG_MS = 24000;
const SPA_LOADING_WATCHDOG_MS = 9000;
const MAX_NAVIGATION_RETRIES = 1;
const SILENT_TRANSPORT_ERROR_WINDOW_MS = 5000;
const SILENT_TRANSPORT_ERROR_THRESHOLD = 3;
const MEDIA_TRANSPORT_ERROR_WINDOW_MS = 8000;
const MEDIA_TRANSPORT_ERROR_THRESHOLD = 4;
const TRANSIENT_DROP_WINDOW_MS = 60000;
const TRANSIENT_DROP_ESCALATION = 2;
const TRANSPORT_FALLBACK_STREAK = 3;
const AUTO_RELOAD_COOLDOWN_MS = 30000;
const FRAME_URL_POLL_MS = 1000;
const MEDIA_DESTINATIONS = new Set(["audio", "track", "video"]);
const DOCUMENT_DESTINATIONS = new Set([
	"document",
	"embed",
	"frame",
	"iframe",
	"object",
]);
const TRACKING_PARAM_PATTERNS = [
	/^utm_/i,
	/^fbclid$/i,
	/^gclid$/i,
	/^dclid$/i,
	/^msclkid$/i,
	/^mc_(cid|eid)$/i,
	/^igshid$/i,
	/^ref_(src|url)$/i,
	/^vero_(conv|id)$/i,
	/^wickedid$/i,
];
const DEFAULT_PRIVACY_SETTINGS = Object.freeze({
	shieldsEnabled: true,
	trackerMode: "standard",
	upgradeHttps: true,
	stripTrackingParams: true,
	blockScripts: false,
	sendGpc: true,
	fingerprintingProtection: true,
	blockWebRtc: true,
	blockThirdPartyCookies: true,
	forgetClosedSites: false,
	siteSettings: {},
});
const RELOAD_ON_CHANGE_PRIVACY_KEYS = new Set([
	"shieldsEnabled",
	"blockScripts",
]);
const SAFE_POPUP_HOSTS = [
	"youtube.com",
	"youtu.be",
	"youtube-nocookie.com",
	"tiktok.com",
	"brave.com",
	"search.brave.com",
	"duckduckgo.com",
	"google.com",
	"googleusercontent.com",
	"gstatic.com",
	"now.gg",
	"nowgg.fun",
	"nvidia.com",
	"geforcenow.com",
];
const SHIELDS_OFF_HOSTS = [
	"now.gg",
	"nowgg.fun",
	"nowgg.com",
	"nvidia.com",
	"geforcenow.com",
	"nvidiagrid.net",
	"nvidia-services.net",
];

const config = window.__PULSAR_CONFIG__ || {};
const INSTANT_LAUNCH_TARGET = getFullscreenQueryTarget();
let instantLaunchBoost = Boolean(INSTANT_LAUNCH_TARGET);
const IS_FULLSCREEN_QUERY_MODE = Boolean(INSTANT_LAUNCH_TARGET);
let instantLaunchPromise = null;
const appBasePath = new URL("./", document.baseURI || window.location.href).pathname;
const scramjetPrefix = `${appBasePath}service/scramjet/`;
const scramjetControllerConfig = {
	prefix: scramjetPrefix,
	scramjetPath: `${appBasePath}scramjet/scramjet.js`,
	injectPath: `${appBasePath}controller/controller.inject.js`,
	wasmPath: `${appBasePath}scramjet/scramjet.wasm`,
	virtualWasmPath: "scramjet.wasm.js",
};
const scramjetRuntimeConfig = {
	flags: {
		...defaultConfig.flags,
		allowFailedIntercepts: true,
		captureErrors: false,
	},
};

let selectedWispUrl = "";
let activeWispUrl = "";
let selectedTransportId = "";
let activeTransportId = "";
let swRegistrationPromise = null;
let scramjetController = null;
let controllerReadyPromise = null;
let transportWarmupPromise = null;
let transportRecoveryPromise = null;
let lastTransportRecoveryAt = 0;
let reloadAfterTransportRecovery = false;
let resumeRefreshTimer = null;
let activeTabId = null;
let nextTabId = 1;
let isRestoringSession = false;
let sessionSaveTimer = null;
const tabs = [];
const recentlyClosedTabs = [];

const transports = getConfiguredTransports();
const suggestionsBox = document.getElementById("sj-suggestions");
let highlightedIndex = -1;
let currentSuggestions = [];
let debounceTimer = null;
let wispServers = [];
let wispPicker = null;
const customSelectPickers = new WeakMap();
let wispUserSelected = false;
let wispHealthCheckScheduled = false;
let wispHealthCheckCompleted = false;
let wispHealthResults = [];
let wispHealthCheckPromise = null;
let wispFailoverIndex = 0;
let wispHealthTimer = null;
let popupBlockerEnabled = true;
let autoClickerEnabled = false;
let autoClickerDelayMs = DEFAULT_AUTOCLICKER_DELAY_MS;
let privacySettings = {
	...DEFAULT_PRIVACY_SETTINGS,
	siteSettings: {},
};
let showRecoveryOverlay = false;
let shieldPopupCloseTimer = null;
let settingsReloadTimer = null;
let settingsReloadSequence = 0;
let shieldUiUpdateQueued = false;
let transportWarmupForced = false;
let renderedTabsSignature = "";
let particlesController = null;

const TAB_DRAG_THRESHOLD_PX = 4;
const TAB_DRAG_HYSTERESIS_PX = 2;
let tabDragState = null;
let tabDragJustEnded = false;
let silentTransportErrors = [];
let mediaTransportErrors = [];

let transportFailureStreak = 0;
let firstReachableWispPromise = null;
let firstReachableWispResolve = null;
let firstReachableWispUrl = "";
const wispFunctionalFailures = new Map();
const wispTransientDrops = new Map();
let torServers = [];
let torScanPromise = null;
let torScanCompleted = false;
let selectedTorUrl = "";
let torUserSelected = false;
let torPicker = null;
let activeTransportClient = null;
const torFunctionalFailures = new Map();

const torCapability = new Map();

function normalizeWispUrl(candidate) {
	if (typeof candidate !== "string" || candidate.trim() === "") return "";
	try {
		const url = new URL(candidate);
		if (url.protocol !== "ws:" && url.protocol !== "wss:") return "";
		if (!url.pathname.endsWith("/")) url.pathname += "/";
		return url.toString();
	} catch (_) {
		return "";
	}
}

function readJsonStorage(key, fallback) {
	try {
		const stored = JSON.parse(localStorage.getItem(key) || "null");
		return stored && typeof stored === "object" ? stored : fallback;
	} catch (_) {
		return fallback;
	}
}

function writeJsonStorage(key, value) {
	try {
		localStorage.setItem(key, JSON.stringify(value));
	} catch (_) {}
}

function getInternalPage(value) {
	return INTERNAL_PAGES[value] || null;
}

function isInternalPageUrl(value) {
	return Boolean(getInternalPage(value));
}

/** Resolves any `pulsar://...` spelling to a canonical internal page URL. */
function resolveInternalUrl(value) {
	const raw = String(value || "").trim();
	if (!/^pulsar:\/\//i.test(raw)) return "";

	const key = raw
		.replace(/^pulsar:\/\//i, "")
		.replace(/[/?#].*$/, "")
		.toLowerCase();
	if (!key) return NEW_TAB_URL;

	const alias = INTERNAL_PAGE_ALIASES[key];
	if (alias) return alias;
	return isInternalPageUrl(`pulsar://${key}`) ? `pulsar://${key}` : "";
}

/** True for tab URLs that never reach the proxy (new tab and internal pages). */
function isShellUrl(value) {
	return !value || value === NEW_TAB_URL || isInternalPageUrl(value);
}

function getUrlHostname(value) {
	try {
		if (isShellUrl(value)) return "";
		return new URL(value).hostname.toLowerCase().replace(/\.$/, "");
	} catch (_) {
		return "";
	}
}

function getActiveSiteHost() {
	return getUrlHostname(getActiveTab()?.url);
}

function extractRemoteUrl(value) {
	let decoded = String(value || "");
	for (let pass = 0; pass < 3; pass++) {
		try {
			const next = decodeURIComponent(decoded);
			if (next === decoded) break;
			decoded = next;
		} catch (_) {
			break;
		}
	}

	const marker = "/service/scramjet/";
	const markerIndex = decoded.indexOf(marker);
	if (markerIndex === -1) return decoded;
	const routed = decoded.slice(markerIndex + marker.length);
	const remoteIndex = routed.search(/https?:\/\//i);
	if (remoteIndex === -1) return decoded;
	return routed
		.slice(remoteIndex)
		.replace(/[?&]\$(?:mode|cred|io|rfp|dest|type|module)=[^#]*/i, "");
}

function isSelfOriginUrl(value) {
	try {
		return new URL(value, window.location.href).origin === window.location.origin;
	} catch (_) {
		return false;
	}
}

function isOnionHostname(hostname) {
	const host = String(hostname || "")
		.toLowerCase()
		.replace(/\.$/, "");
	return host === "onion" ? false : host.endsWith(".onion");
}

function isOnionUrl(value) {
	return isOnionHostname(getUrlHostname(value));
}

function getSitePrivacySettings(host, create = false) {
	if (!host) return {};
	const existing = privacySettings.siteSettings?.[host];
	if (existing && typeof existing === "object") return existing;
	if (!create) return {};
	if (!privacySettings.siteSettings) privacySettings.siteSettings = {};
	privacySettings.siteSettings[host] = {};
	return privacySettings.siteSettings[host];
}

function hasShieldsOffHost(hostname) {
	const host = String(hostname || "")
		.toLowerCase()
		.replace(/^www\./, "");
	if (!host) return false;
	return SHIELDS_OFF_HOSTS.some(
		(entry) => host === entry || host.endsWith(`.${entry}`)
	);
}

function getEffectivePrivacySettings(host = getActiveSiteHost()) {
	const site = getSitePrivacySettings(host);
	const shieldsEnabled = hasShieldsOffHost(host)
		? false
		: typeof site.shieldsEnabled === "boolean"
			? site.shieldsEnabled
			: privacySettings.shieldsEnabled;
	const getBoolean = (key) =>
		typeof site[key] === "boolean" ? site[key] : privacySettings[key];
	const trackerMode = ["aggressive", "standard", "off"].includes(
		site.trackerMode
	)
		? site.trackerMode
		: privacySettings.trackerMode;
	return {
		shieldsEnabled,
		trackerMode: shieldsEnabled ? trackerMode : "off",
		upgradeHttps: shieldsEnabled && getBoolean("upgradeHttps"),
		stripTrackingParams: shieldsEnabled && getBoolean("stripTrackingParams"),
		blockScripts: shieldsEnabled && getBoolean("blockScripts"),
		sendGpc: shieldsEnabled && getBoolean("sendGpc"),
		fingerprintingProtection:
			shieldsEnabled && getBoolean("fingerprintingProtection"),
		blockWebRtc: shieldsEnabled && getBoolean("blockWebRtc"),
		blockThirdPartyCookies:
			shieldsEnabled && getBoolean("blockThirdPartyCookies"),
		forgetSiteData:
			privacySettings.forgetClosedSites || site.forgetSiteData === true,
		siteHost: host,
	};
}

function loadPrivacySettings() {
	const stored = readJsonStorage(PRIVACY_STORAGE_KEY, {});
	const siteSettings =
		stored.siteSettings && typeof stored.siteSettings === "object"
			? stored.siteSettings
			: {};
	privacySettings = {
		...DEFAULT_PRIVACY_SETTINGS,
		...stored,
		siteSettings,
	};
	if (
		!["aggressive", "standard", "off"].includes(privacySettings.trackerMode)
	) {
		privacySettings.trackerMode = DEFAULT_PRIVACY_SETTINGS.trackerMode;
	}
	if (INSTANT_LAUNCH_TARGET) applyInstantLaunchPrivacy();
}

function applyInstantLaunchPrivacy() {
	privacySettings = {
		...privacySettings,
		shieldsEnabled: true,
		upgradeHttps: false,
		stripTrackingParams: false,
		blockScripts: false,
		sendGpc: false,
		fingerprintingProtection: false,
		blockWebRtc: false,
		blockThirdPartyCookies: false,
		forgetClosedSites: false,
		siteSettings: {},
	};
}

function getPrivacyServiceWorkerPayload() {
	const disabledHosts = [];
	const enabledHosts = [];
	for (const [host, settings] of Object.entries(
		privacySettings.siteSettings || {}
	)) {
		if (settings?.shieldsEnabled === false) disabledHosts.push(host);
		if (settings?.shieldsEnabled === true) enabledHosts.push(host);
	}
	return {
		...privacySettings,
		disabledHosts,
		enabledHosts,
	};
}

function postPrivacyConfigToServiceWorker() {
	if (!("serviceWorker" in navigator)) return;
	const message = {
		type: "pulsar-privacy-config",
		config: getPrivacyServiceWorkerPayload(),
	};
	const send = (worker) => worker?.postMessage(message);
	send(navigator.serviceWorker.controller);
	navigator.serviceWorker.ready
		.then((registration) => send(registration.active))
		.catch(() => {});
}

function syncGlobalPrivacyControls() {
	if (shieldsToggleSettings) {
		shieldsToggleSettings.checked = privacySettings.shieldsEnabled;
	}
	if (adblockToggle) {
		adblockToggle.checked = privacySettings.trackerMode !== "off";
	}
	if (trackerModeSettings) {
		trackerModeSettings.value = privacySettings.trackerMode;
		refreshCustomSelectPicker(trackerModeSettings);
	}
	if (httpsUpgradeToggle) {
		httpsUpgradeToggle.checked = privacySettings.upgradeHttps;
	}
	if (stripTrackingToggle) {
		stripTrackingToggle.checked = privacySettings.stripTrackingParams;
	}
	if (blockScriptsToggle) {
		blockScriptsToggle.checked = privacySettings.blockScripts;
	}
	if (gpcToggle) gpcToggle.checked = privacySettings.sendGpc;
	if (fingerprintingToggle) {
		fingerprintingToggle.checked = privacySettings.fingerprintingProtection;
	}
	if (webrtcToggle) webrtcToggle.checked = privacySettings.blockWebRtc;
	if (thirdPartyCookiesToggle) {
		thirdPartyCookiesToggle.checked = privacySettings.blockThirdPartyCookies;
	}
	if (forgetSiteToggleSettings) {
		forgetSiteToggleSettings.checked = privacySettings.forgetClosedSites;
	}
	if (window.ScramjetAdblock?.setMode) {
		window.ScramjetAdblock.setMode(privacySettings.trackerMode);
	} else if (window.ScramjetAdblock) {
		window.ScramjetAdblock.setEnabled(privacySettings.trackerMode !== "off");
	}
}

function scheduleActiveTabReload(options = {}) {
	const { after = null, delay = 260 } = options;
	const sequence = ++settingsReloadSequence;
	window.clearTimeout(settingsReloadTimer);
	settingsReloadTimer = window.setTimeout(async () => {
		settingsReloadTimer = null;
		if (after) {
			try {
				await after;
			} catch (_) {}
		}
		if (sequence !== settingsReloadSequence) return;
		reloadActiveTab();
	}, delay);
}

function savePrivacySettings(options = {}) {
	writeJsonStorage(PRIVACY_STORAGE_KEY, privacySettings);
	syncGlobalPrivacyControls();
	postPrivacyConfigToServiceWorker();
	syncProxyToolSettingsToFrames();
	updateShieldUi();
	if (options.reload !== false) scheduleActiveTabReload();
}

function setTrackerMode(mode) {
	if (!["aggressive", "standard", "off"].includes(mode)) return;
	if (privacySettings.trackerMode === mode) return;
	privacySettings.trackerMode = mode;
	savePrivacySettings();
}

function setPrivacySetting(key, value) {
	const next = Boolean(value);
	if (privacySettings[key] === next) return;
	privacySettings[key] = next;
	savePrivacySettings({ reload: RELOAD_ON_CHANGE_PRIVACY_KEYS.has(key) });
}

function setActiveSitePrivacySetting(key, value) {
	const host = getActiveSiteHost();
	if (!host) return;
	const site = getSitePrivacySettings(host, true);
	if (site[key] === value) return;
	site[key] = value;
	savePrivacySettings({
		reload: key === "trackerMode" || RELOAD_ON_CHANGE_PRIVACY_KEYS.has(key),
	});
}

function shouldSkipHttpsUpgrade(hostname) {
	const host = String(hostname || "").toLowerCase();
	if (!host) return true;
	if (host === "localhost" || host.endsWith(".localhost")) return true;
	if (isOnionHostname(host) || host.endsWith(".i2p") || host.endsWith(".local"))
		return true;
	if (host.startsWith("[")) return true;
	if (/^\d{1,3}(\.\d{1,3}){3}$/.test(host)) return true;
	if (!host.includes(".")) return true;
	return false;
}

function prepareNavigationUrl(value) {
	try {
		const url = new URL(value);
		const effective = getEffectivePrivacySettings(url.hostname.toLowerCase());
		if (
			effective.upgradeHttps &&
			url.protocol === "http:" &&
			!shouldSkipHttpsUpgrade(url.hostname)
		) {
			url.protocol = "https:";
		}
		if (effective.stripTrackingParams) {
			for (const key of [...url.searchParams.keys()]) {
				if (TRACKING_PARAM_PATTERNS.some((pattern) => pattern.test(key))) {
					url.searchParams.delete(key);
				}
			}
		}
		return url.toString();
	} catch (_) {
		return value;
	}
}

function updateShieldUi() {
	if (!shieldButton) return;
	const tab = getActiveTab();
	const host = getActiveSiteHost();
	const effective = getEffectivePrivacySettings(host);
	const count = tab?.blockedCount || 0;
	const hasSite = Boolean(host);
	if (shieldSite) shieldSite.textContent = host || "New tab";
	if (shieldStatus) {
		shieldStatus.textContent = hasSite
			? effective.shieldsEnabled
				? "Shields up for this site"
				: "Shields down for this site"
			: "Shields ready";
	}
	if (shieldCountMini) {
		shieldCountMini.textContent = count > 99 ? "99+" : String(count);
	}
	if (shieldBlockedCount) shieldBlockedCount.textContent = String(count);
	if (shieldMainToggle) {
		shieldMainToggle.checked = effective.shieldsEnabled;
		shieldMainToggle.disabled = !hasSite;
	}
	if (shieldForgetToggle) {
		shieldForgetToggle.checked =
			getSitePrivacySettings(host).forgetSiteData === true;
		shieldForgetToggle.disabled = !hasSite;
	}
	if (shieldTrackerMode) {
		shieldTrackerMode.value = effective.trackerMode;
		shieldTrackerMode.disabled = !hasSite || !effective.shieldsEnabled;
		refreshCustomSelectPicker(shieldTrackerMode);
	}
	if (shieldHttpsToggle) {
		shieldHttpsToggle.checked = effective.upgradeHttps;
		shieldHttpsToggle.disabled = !hasSite || !effective.shieldsEnabled;
	}
	if (shieldScriptsToggle) {
		shieldScriptsToggle.checked = effective.blockScripts;
		shieldScriptsToggle.disabled = !hasSite || !effective.shieldsEnabled;
	}
	if (shieldFingerprintingToggle) {
		shieldFingerprintingToggle.checked = effective.fingerprintingProtection;
		shieldFingerprintingToggle.disabled = !hasSite || !effective.shieldsEnabled;
	}
	if (shieldCookiesToggle) {
		shieldCookiesToggle.checked = effective.blockThirdPartyCookies;
		shieldCookiesToggle.disabled = !hasSite || !effective.shieldsEnabled;
	}
	shieldButton.disabled = !hasSite;
	shieldButton.classList.toggle("active", hasSite && effective.shieldsEnabled);
	shieldButton.classList.toggle(
		"shields-down",
		hasSite && !effective.shieldsEnabled
	);
	shieldButton.title = hasSite
		? `Pulsar Shields: ${effective.shieldsEnabled ? "up" : "down"}`
		: "Pulsar Shields";
}

function scheduleShieldUiUpdate() {
	if (shieldUiUpdateQueued) return;
	shieldUiUpdateQueued = true;
	window.requestAnimationFrame(() => {
		shieldUiUpdateQueued = false;
		updateShieldUi();
	});
}

function recordPrivacyBlock(data) {
	const requestHost = getUrlHostname(data?.requestUrl || data?.url || "");
	const siteHost = String(data?.siteHost || "").toLowerCase();
	const count = Number.isFinite(data?.count) ? Math.max(1, data.count) : 1;
	let matchedTab =
		tabs.find((tab) => getUrlHostname(tab.url) === siteHost) ||
		tabs.find((tab) => getUrlHostname(tab.url) === requestHost) ||
		getActiveTab();
	if (!matchedTab) return;
	matchedTab.blockedCount = (matchedTab.blockedCount || 0) + count;
	if (matchedTab.id === activeTabId) scheduleShieldUiUpdate();
}

function setShieldPopupOpen(open) {
	if (!shieldPopup || !shieldButton) return;
	const shouldOpen = Boolean(open && getActiveSiteHost());
	window.clearTimeout(shieldPopupCloseTimer);
	shieldPopupCloseTimer = null;
	shieldButton.setAttribute("aria-expanded", shouldOpen ? "true" : "false");
	if (shouldOpen) {
		shieldPopup.classList.remove("hidden", "closing");
		updateShieldUi();
		return;
	}
	if (shieldPopup.classList.contains("hidden")) return;
	shieldPopup.classList.add("closing");
	shieldPopupCloseTimer = window.setTimeout(() => {
		shieldPopup.classList.add("hidden");
		shieldPopup.classList.remove("closing");
		shieldPopupCloseTimer = null;
	}, SHIELD_POPUP_CLOSE_MS);
}

function syncFramePrivacySettings(tab) {
	try {
		const win = getFrameElement(tab?.frame)?.contentWindow;
		if (!win) return;
		const effective = getEffectivePrivacySettings(getUrlHostname(tab.url));
		win.__pulsarApplyPrivacyConfig?.(effective);
		win.ScramjetAdblock?.setMode?.(effective.trackerMode);
		win.ScramjetAdblock?.setEnabled?.(
			effective.shieldsEnabled && effective.trackerMode !== "off"
		);
	} catch (_) {}
}

async function clearTabSiteData(tab = getActiveTab()) {
	if (!tab || tab.url === NEW_TAB_URL) return false;
	try {
		const win = getFrameElement(tab.frame)?.contentWindow;
		if (!win) return false;
		win.localStorage?.clear();
		win.sessionStorage?.clear();
		const cookieNames = String(win.document?.cookie || "")
			.split(";")
			.map((cookie) => cookie.split("=")[0].trim())
			.filter(Boolean);
		for (const name of cookieNames) {
			win.document.cookie = `${name}=; Max-Age=0; path=/; SameSite=Lax`;
		}
		if (win.caches) {
			const keys = await win.caches.keys();
			await Promise.all(keys.map((key) => win.caches.delete(key)));
		}
		return true;
	} catch (_) {
		return false;
	}
}

function getFrameElement(proxyFrame) {
	return proxyFrame?.frame || proxyFrame?.element || null;
}

function withTimeout(promise, timeoutMs, message) {
	let timer = null;
	const timeout = new Promise((_, reject) => {
		timer = setTimeout(() => reject(new Error(message)), timeoutMs);
	});
	return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
}

async function waitForServiceWorkerController(registration, timeoutMs = 10000) {
	if (navigator.serviceWorker.controller) {
		return navigator.serviceWorker.controller;
	}

	await Promise.race([
		new Promise((resolve) => {
			navigator.serviceWorker.addEventListener("controllerchange", resolve, {
				once: true,
			});
		}),
		navigator.serviceWorker.ready,
		new Promise((resolve) => setTimeout(resolve, timeoutMs)),
	]);

	const serviceWorker =
		navigator.serviceWorker.controller ||
		registration.active ||
		registration.waiting ||
		registration.installing;
	if (!serviceWorker) {
		throw new Error("No active service worker is available for Scramjet v2.");
	}
	return serviceWorker;
}

function getTransportKind(transport, id = selectedTransportId) {
	return transport?.type || transport?.kind || id;
}

function createTransportClient(transport, wispUrl) {
	const options = getTransportOptions(transport, wispUrl);
	let client;
	switch (getTransportKind(transport, selectedTransportId)) {
		case "epoxy":
			client = new EpoxyTransport(options);
			break;
		case "libcurl":
		default:
			client = new LibcurlTransport(options);
			break;
	}

	const routed = createTorRoutingTransport(client, {
		getEndpoint: () => getTorFetchEndpoint(getEffectiveTorUrl()),
		onRouted: (endpoint) => clearTorFunctionalFailure(endpoint),
		onFailure: (endpoint) => recordTorFunctionalFailure(endpoint),
	});

	activeTransportClient = routed;
	return routed;
}

async function ensureProxyController(wispUrl) {
	if (scramjetController) return scramjetController;
	if (controllerReadyPromise) return controllerReadyPromise;

	controllerReadyPromise = (async () => {
		const registration = await ensureServiceWorkerReady();
		const serviceworker = await waitForServiceWorkerController(registration);
		const transport = getSelectedTransport();
		if (!transport) throw new Error("No proxy transports are configured.");

		let transportClient;
		try {
			transportClient = createTransportClient(transport, wispUrl);
			if (typeof transportClient.init === "function") {
				await withTimeout(
					transportClient.init(),
					15000,
					"Proxy transport initialization timed out"
				);
			}
			if (!transportClient.ready) {
				throw new Error("Proxy transport did not become ready");
			}
		} catch (err) {
			throw new Error(`Failed to create transport client: ${err.message}`);
		}

		const controller = new Controller({
			serviceworker,
			transport: transportClient,
			config: scramjetControllerConfig,
			scramjetConfig: scramjetRuntimeConfig,
		});

		await withTimeout(
			controller.wait(),
			12000,
			"Scramjet v2 controller did not become ready in time."
		);
		scramjetController = controller;
		activeWispUrl = wispUrl;
		activeTransportId = selectedTransportId;
		return controller;
	})().catch((error) => {
		controllerReadyPromise = null;
		scramjetController = null;
		throw error;
	});

	return controllerReadyPromise;
}

function updateProxiedTabUrl(tab, nextUrl, loading = true) {
	if (!tab || !nextUrl) return;

	if (tab.url === nextUrl && !loading && !tab.loading) return;
	try {
		const parsed = new URL(nextUrl);
		if (!parsed.protocol.startsWith("http")) return;
	} catch (_) {
		return;
	}

	if (isSelfOriginUrl(nextUrl)) return;
	const previousHost = getUrlHostname(tab.url);
	tab.url = nextUrl;
	if (previousHost !== getUrlHostname(nextUrl)) tab.blockedCount = 0;
	tab.favicon = getFaviconForUrl(nextUrl);
	try {
		tab.title = new URL(nextUrl).hostname;
	} catch (_) {
		tab.title = "Browsing";
	}
	tab.loading = loading;
	if (loading) armSpaLoadingWatchdog(tab);
	else clearTabWatchdog(tab);
	if (tab.id === activeTabId) {
		updateAddressBar();
		setLoading(loading, loading ? 58 : 0, "Following page navigation...");
	}
	renderTabs();
	queueSessionSave();
}

class PulsarUrlWatcherPlugin extends ManagedPlugin {
	constructor(tab) {
		super(`pulsar-url-watcher-${tab.id}`, []);
		this.tab = tab;
	}

	install(frame) {
		super.install(frame);
		this.tap(frame.hooks.init.post, (context) => {
			if (!context.isTopLevel) return;

			const notifyCurrent = (loading = false) => {
				const href = context.client?.url?.href;
				if (href) updateProxiedTabUrl(this.tab, href, loading);
			};

			notifyCurrent(false);
			this.tap(context.client.hooks.lifecycle.navigate, (_context, props) => {
				if (props?.url) updateProxiedTabUrl(this.tab, props.url, true);
			});
			context.window.addEventListener(
				"hashchange",
				() => notifyCurrent(false),
				{ capture: true }
			);

			window.clearInterval(this.tab.urlPollTimer);
			this.tab.urlPollTimer = window.setInterval(() => {
				if (!getFrameElement(this.tab.frame)?.isConnected) {
					window.clearInterval(this.tab.urlPollTimer);
					this.tab.urlPollTimer = null;
					return;
				}
				if (document.hidden || this.tab.loading) return;
				notifyCurrent(false);
			}, FRAME_URL_POLL_MS);
		});
	}
}

function getActiveTab() {
	return tabs.find((tab) => tab.id === activeTabId) || null;
}

function getFullscreenQueryTarget() {
	const search = window.location.search || "";
	return search.startsWith("?=") ? search.slice(2) : "";
}

function getUrlQueryTarget() {
	const params = new URLSearchParams(window.location.search || "");
	return params.get("url") || "";
}

function decodeQueryPart(value) {
	try {
		return decodeURIComponent(String(value).replaceAll("+", "%20"));
	} catch (_) {
		return value;
	}
}

function parseProxyLaunchInput(rawInput, options = {}) {
	const raw = typeof rawInput === "string" ? rawInput.trim() : "";
	const decoded = (options.decode ? decodeQueryPart(raw) : raw).trim();
	const separatorIndex = decoded.indexOf("|");
	if (separatorIndex === -1) {
		return {
			url: decoded,
			injectScriptUrl: "",
		};
	}

	return {
		url: decoded.slice(0, separatorIndex).trim(),
		injectScriptUrl: decoded.slice(separatorIndex + 1).trim(),
	};
}

function resolveAddressInput(value, engine = getDefaultSearchEngine()) {
	const input = typeof value === "string" ? value.trim() : "";
	if (!input) return "";

	if (/^pulsar:\/\//i.test(input)) {
		const internalUrl = resolveInternalUrl(input);
		if (internalUrl && internalUrl !== NEW_TAB_URL) return internalUrl;

		const remainder = input.replace(/^pulsar:\/\/(new-tab)?/i, "").trim();
		if (!remainder) return "";
		return resolveAddressInput(remainder, engine);
	}
	if (/^[a-z][a-z0-9+.-]*:\/\//i.test(input)) return input;

	if (/^[a-z2-7]{16,56}\.onion(\/|$|\?|#)/i.test(input)) {
		return `http://${input}`;
	}
	return search(input, engine);
}

function getInjectionScriptUrl(value) {
	const raw = typeof value === "string" ? value.trim() : "";
	if (!raw) return "";
	try {
		const url = new URL(raw, window.location.href);
		if (url.protocol !== "http:" && url.protocol !== "https:") return "";
		return url.toString();
	} catch (_) {
		return "";
	}
}

function appendParentRealmScript(frameElement, src, code = null) {
	const win = frameElement?.contentWindow;
	const doc = win?.document;
	if (!win || !doc) return false;

	const script = document.createElement("script");
	script.async = false;
	script.dataset.pulsarInjected = "true";

	if (typeof code === "string") {
		script.textContent = `${code}
//# sourceURL=${src}`;
	} else {
		script.src = src;
	}

	(doc.head || doc.documentElement || doc.body)?.appendChild(script);
	return true;
}

async function injectScriptIntoFrameElement(frameElement, scriptUrl) {
	const src = getInjectionScriptUrl(scriptUrl);
	if (!frameElement || !src) return;
	let injectedScripts = null;
	try {
		const win = frameElement.contentWindow;
		const doc = win?.document;
		if (!win || !doc) return;

		if (!win.__pulsarInjectedScripts) win.__pulsarInjectedScripts = new Set();
		injectedScripts = win.__pulsarInjectedScripts;
		if (injectedScripts.has(src)) return;
		injectedScripts.add(src);

		try {
			const response = await fetch(src, {
				cache: "no-store",
				credentials: "same-origin",
			});
			if (!response.ok) throw new Error(`HTTP ${response.status}`);
			const code = await response.text();
			appendParentRealmScript(frameElement, src, code);
			console.info(`Pulsar injected inline script: ${src}`);
			return;
		} catch (fetchErr) {

			console.warn(`Pulsar inline injection failed, trying script src: ${src}`, fetchErr);
		}

		appendParentRealmScript(frameElement, src);
		console.info(`Pulsar injected external script: ${src}`);
	} catch (err) {
		if (injectedScripts) injectedScripts.delete(src);
		console.warn("Pulsar script injection failed", err);
	}
}

function injectScriptIntoTab(tab) {
	if (!tab?.injectScriptUrl) return;
	injectScriptIntoFrameElement(getFrameElement(tab.frame), tab.injectScriptUrl);
}

function getDisplayUrl(tab = getActiveTab()) {
	return tab && tab.url !== NEW_TAB_URL ? tab.url : "";
}

function getFaviconForUrl(url) {
	try {
		if (isInternalPageUrl(url)) return INTERNAL_PAGE_FAVICON;
		if (!url || url === NEW_TAB_URL) return FAVICON_FALLBACK;
		const { hostname } = new URL(url);

		if (isOnionHostname(hostname) || !hostname.includes("."))
			return FAVICON_FALLBACK;
		return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(
			hostname
		)}&sz=32`;
	} catch (_) {
		return FAVICON_FALLBACK;
	}
}

function setLoading(
	active,
	progress = active ? 38 : 100,
	status = "Loading..."
) {
	pageLoader?.classList.toggle("active", active && progress <= 55);
	if (active && pageLoaderText) pageLoaderText.textContent = status;
	if (!loadingBar) return;
	loadingBar.classList.toggle("active", active);
	loadingBar.style.width = `${progress}%`;
	if (!active) {
		setTimeout(() => {
			loadingBar.style.width = "0%";
		}, 220);
	}
}

function showError(message, code = "") {
	if (error) error.textContent = message;
	if (errorCode) errorCode.textContent = code;
	errorPanel?.classList.toggle("active", Boolean(message || code));
}

function clearError() {
	showError("", "");
}

function closeSuggestions() {
	suggestionsBox.classList.remove("active");
	suggestionsBox.innerHTML = "";
	currentSuggestions = [];
	highlightedIndex = -1;
}

function updateAddressBar() {

	if (document.activeElement !== address) address.value = getDisplayUrl();
	document.body.classList.toggle("tor-route", isOnionUrl(getActiveTab()?.url));
	updateFullscreenButton();
	updateShieldUi();
}

function queueSessionSave() {
	clearTimeout(sessionSaveTimer);
	sessionSaveTimer = setTimeout(saveSession, 120);
}

function saveSession() {
	if (isRestoringSession) return;
	const payload = {
		activeUrl: getActiveTab()?.url || NEW_TAB_URL,
		tabs: tabs.map((tab) => ({
			title: tab.title,
			url: tab.url,
			favicon: tab.favicon,
		})),
	};
	try {
		localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(payload));
	} catch (_) {}
}

function getHistory() {
	try {
		const stored = JSON.parse(
			localStorage.getItem(HISTORY_STORAGE_KEY) || "[]"
		);
		return Array.isArray(stored) ? stored : [];
	} catch (_) {
		return [];
	}
}

function addHistoryEntry(tab) {
	if (!tab || isShellUrl(tab.url)) return;
	const nextEntry = {
		title: tab.title || tab.url,
		url: tab.url,
		favicon: tab.favicon || getFaviconForUrl(tab.url),
		visitedAt: Date.now(),
	};
	const history = getHistory().filter((entry) => entry.url !== tab.url);
	history.unshift(nextEntry);
	try {
		localStorage.setItem(
			HISTORY_STORAGE_KEY,
			JSON.stringify(history.slice(0, 100))
		);
	} catch (_) {}
}

function getTabsSignature() {
	return tabs
		.map((tab) =>
			[tab.id, tab.id === activeTabId ? 1 : 0, tab.title, tab.favicon].join("\u001f")
		)
		.join("\u001e");
}

function renderTabs(force = false) {
	if (!tabsContainer) return;

	if (tabDragState?.moved) return;
	const signature = getTabsSignature();

	if (!force && signature === renderedTabsSignature) return;
	renderedTabsSignature = signature;
	tabsContainer.innerHTML = "";

	for (const tab of tabs) {
		const tabEl = document.createElement("div");
		tabEl.className = `tab ${tab.id === activeTabId ? "active" : ""}`;
		tabEl.dataset.tabId = String(tab.id);
		tabEl.innerHTML = `
			<div class="tab-background"></div>
			<div class="tab-content">
				<div class="tab-favicon"></div>
				<div class="tab-title">${escapeHtml(tab.title)}</div>
				<div class="tab-drag-handle"></div>
				<button class="tab-close" type="button" tabindex="-1" aria-label="Close tab"><span class="material-symbols-outlined">close</span></button>
			</div>
			<div class="tab-bottom-border"></div>
		`;
		tabEl.querySelector(".tab-favicon").style.backgroundImage =
			`url("${encodeURI(tab.favicon)}")`;
		tabEl.addEventListener("click", () => {
			if (tabDragJustEnded) {
				tabDragJustEnded = false;
				return;
			}
			switchTab(tab.id);
		});
		tabEl.querySelector(".tab-close").addEventListener("click", (event) => {
			event.stopPropagation();
			closeTab(tab.id);
		});
		tabEl.addEventListener("pointerdown", (event) => {
			if (event.button !== 0) return;
			if (event.target.closest(".tab-close")) return;
			tabDragJustEnded = false;
			beginTabDrag(event, tab.id, tabEl);
		});
		tabsContainer.appendChild(tabEl);
	}

	layoutTabs();
}

function getTabLayoutData() {
	const numberOfTabs = tabs.length;
	if (!numberOfTabs) return { widths: [], positions: [] };

	const tabsContentWidth = tabsContainer.clientWidth;
	const tabsCumulativeOverlappedWidth = (numberOfTabs - 1) * 1;
	const targetWidth =
		(tabsContentWidth - 2 * 9 + tabsCumulativeOverlappedWidth) / numberOfTabs;
	const clampedTargetWidth = Math.max(24, Math.min(240, targetWidth));
	const flooredClampedTargetWidth = Math.floor(clampedTargetWidth);
	const totalTabsWidthUsingTarget =
		flooredClampedTargetWidth * numberOfTabs +
		2 * 9 -
		tabsCumulativeOverlappedWidth;
	let extraWidthRemaining = tabsContentWidth - totalTabsWidthUsingTarget;

	const widths = [];
	for (let i = 0; i < numberOfTabs; i += 1) {
		const extraWidth =
			flooredClampedTargetWidth < 240 && extraWidthRemaining > 0 ? 1 : 0;
		extraWidthRemaining -= extraWidth;
		widths.push(flooredClampedTargetWidth + extraWidth);
	}

	const positions = [];
	let position = 9;
	widths.forEach((width, i) => {
		positions.push(position + 4 - i * 1);
		position += width;
	});

	return { widths, positions };
}

function layoutTabs(draggedId = null) {
	if (!tabsContainer) return;
	const numberOfTabs = tabs.length;
	if (!numberOfTabs) {
		if (newTabButton) newTabButton.style.transform = "";
		return;
	}

	const tabEls = new Map();
	for (const el of tabsContainer.querySelectorAll(".tab")) {
		tabEls.set(Number(el.dataset.tabId), el);
	}

	const { widths, positions } = getTabLayoutData();

	tabs.forEach((tab, i) => {
		const tabEl = tabEls.get(tab.id);
		if (!tabEl) return;
		const contentWidth = widths[i];
		tabEl.classList.remove("tab-small", "tab-smaller", "tab-mini");
		tabEl.style.width = `${Math.min(contentWidth + 2 * 9, 240)}px`;
		if (contentWidth < 84) tabEl.classList.add("tab-small");
		if (contentWidth < 60) tabEl.classList.add("tab-smaller");
		if (contentWidth < 48) tabEl.classList.add("tab-mini");
		if (tab.id !== draggedId) {
			tabEl.style.transform = `translate3d(${positions[i]}px, 0, 0)`;
		}
	});

	if (newTabButton) {
		const lastPos = positions[positions.length - 1];
		newTabButton.style.transform =
			`translate(${lastPos + widths[widths.length - 1] + 20}px)`;
	}
}

function beginTabDrag(event, tabId, tabEl) {
	if (tabDragState) return;
	const startIndex = tabs.findIndex((tab) => tab.id === tabId);
	if (startIndex === -1) return;

	const { widths, positions } = getTabLayoutData();
	const containerLeft = tabsContainer.getBoundingClientRect().left;
	tabDragState = {
		tabId,
		tabEl,
		containerLeft,
		grabOffset: event.clientX - containerLeft - positions[startIndex],
		dragBoxWidth: tabEl.getBoundingClientRect().width,
		slotCenters: positions.map((position, i) =>
			position + Math.min(widths[i] + 2 * 9, 240) / 2
		),
		startPageX: event.clientX,
		pointerId: event.pointerId,
		moved: false,
		tabX: positions[startIndex],
	};

	window.addEventListener("pointermove", onTabDragMove);
	window.addEventListener("pointerup", endTabDrag);
	window.addEventListener("pointercancel", endTabDrag);
}

function onTabDragMove(event) {
	const state = tabDragState;
	if (!state) return;
	if (!state.moved) {
		if (Math.abs(event.clientX - state.startPageX) < TAB_DRAG_THRESHOLD_PX)
			return;
		state.moved = true;
		state.tabEl.classList.add("tab-is-dragging");
		tabsStrip?.classList.add("tabs-is-sorting");
		document.body.classList.add("tab-dragging");
		try {
			state.tabEl.setPointerCapture(state.pointerId);
		} catch (_) {}
		if (event.cancelable) event.preventDefault();
	}
	state.tabX = event.clientX - state.containerLeft - state.grabOffset;
	state.tabEl.style.transform = `translate3d(${state.tabX}px, 0, 0)`;
	reorderTabsForDrag(state);
}

function reorderTabsForDrag(state) {
	const currentIndex = tabs.findIndex((tab) => tab.id === state.tabId);
	if (currentIndex === -1) return;
	const center = state.tabX + state.dragBoxWidth / 2;

	if (
		currentIndex < tabs.length - 1 &&
		center > state.slotCenters[currentIndex + 1] + TAB_DRAG_HYSTERESIS_PX
	) {
		const [movedTab] = tabs.splice(currentIndex, 1);
		tabs.splice(currentIndex + 1, 0, movedTab);
		layoutTabs(state.tabId);
		return;
	}
	if (
		currentIndex > 0 &&
		center < state.slotCenters[currentIndex] - TAB_DRAG_HYSTERESIS_PX
	) {
		const [movedTab] = tabs.splice(currentIndex, 1);
		tabs.splice(currentIndex - 1, 0, movedTab);
		layoutTabs(state.tabId);
	}
}

function endTabDrag(event) {
	const state = tabDragState;
	if (!state) return;
	tabDragState = null;
	window.removeEventListener("pointermove", onTabDragMove);
	window.removeEventListener("pointerup", endTabDrag);
	window.removeEventListener("pointercancel", endTabDrag);

	if (!state.moved) return;

	try {
		state.tabEl.releasePointerCapture(state.pointerId);
	} catch (_) {}

	for (const tab of tabs) {
		const el = tabsContainer.querySelector(`[data-tab-id="${tab.id}"]`);
		if (el) tabsContainer.appendChild(el);
	}

	tabDragJustEnded = true;
	state.tabEl.classList.add("tab-was-just-dragged");
	state.tabEl.classList.remove("tab-is-dragging");
	tabsStrip?.classList.remove("tabs-is-sorting");
	document.body.classList.remove("tab-dragging");
	state.tabEl.style.transform = "";
	layoutTabs();

	window.setTimeout(() => {
		tabDragJustEnded = false;
	}, 0);

	window.setTimeout(() => {
		state.tabEl.classList.remove("tab-was-just-dragged");
		renderTabs();
	}, 180);
	queueSessionSave();
}

window.addEventListener("resize", () => layoutTabs());

function syncInternalPages() {
	const activeUrl = getActiveTab()?.url || "";
	let showingInternal = false;

	for (const [url, page] of Object.entries(INTERNAL_PAGES)) {
		const element = page.element();
		if (!element) continue;
		const isActive = url === activeUrl;
		element.hidden = !isActive;
		element.classList.toggle("active", isActive);
		if (isActive) showingInternal = true;
	}

	viewport.classList.toggle("has-internal", showingInternal);
}

/**
 * Points a tab at one of Pulsar's own pages. Returns false for anything that
 * still needs the proxy.
 */
function openInternalPage(url, tab = getActiveTab()) {
	const page = getInternalPage(url);
	if (!page) return false;

	const target = tab || createTab(true);
	clearTabWatchdog(target);
	closeSuggestions();
	target.needsLoad = false;
	target.loading = false;
	target.url = url;
	target.title = page.title;
	target.favicon = getFaviconForUrl(url);
	target.blockedCount = 0;
	target.injectScriptUrl = "";
	discardTabFrame(target);
	page.mount();

	if (target.id === activeTabId) {
		setLoading(false);
		clearError();
		if (homeAddress) homeAddress.value = "";
		syncActiveSurface();
		page.show?.();
	} else {
		renderTabs();
		queueSessionSave();
	}
	return true;
}

function syncActiveSurface() {
	const activeTab = getActiveTab();
	const hasFrame = Boolean(getFrameElement(activeTab?.frame)?.isConnected);
	viewport.classList.toggle("has-frame", hasFrame);
	syncInternalPages();

	for (const tab of tabs) {
		const frameElement = getFrameElement(tab.frame);
		if (frameElement) {
			frameElement.classList.toggle("hidden", tab.id !== activeTabId);
		}
	}

	setLoading(Boolean(activeTab?.loading), activeTab?.loading ? 62 : 0);
	updateAddressBar();
	renderTabs();
	updateParticlesActivity();
	queueSessionSave();
}

function createTab(makeActive = true) {
	const tab = {
		id: nextTabId++,
		title: "New Tab",
		url: NEW_TAB_URL,
		favicon: FAVICON_FALLBACK,
		frame: null,
		injectScriptUrl: "",
		loading: false,
		blockedCount: 0,
		needsLoad: false,
		navAttempts: 0,
		watchdogTimer: null,
		frameControllerId: "",
		controllerResets: 0,
		autoReloadAt: 0,
		urlPollTimer: null,
	};
	tabs.push(tab);
	if (makeActive) switchTab(tab.id);
	else renderTabs();
	queueSessionSave();
	return tab;
}

function switchTab(tabId) {
	activeTabId = tabId;
	closeSuggestions();
	setShieldPopupOpen(false);
	clearError();
	if (homeAddress) homeAddress.value = "";
	syncActiveSurface();
	hydrateTab(getActiveTab());
}

function hydrateTab(tab) {
	if (!tab?.needsLoad || tab.url === NEW_TAB_URL) return;
	tab.needsLoad = false;
	launchInProxy(tab.url, tab);
}

function closeTab(tabId) {
	const index = tabs.findIndex((tab) => tab.id === tabId);
	if (index === -1) return;

	const [tab] = tabs.splice(index, 1);
	clearTabWatchdog(tab);
	if (tab.urlPollTimer) {
		window.clearInterval(tab.urlPollTimer);
		tab.urlPollTimer = null;
	}
	const effectivePrivacy = getEffectivePrivacySettings(getUrlHostname(tab.url));
	if (effectivePrivacy.forgetSiteData) clearTabSiteData(tab);
	recentlyClosedTabs.unshift({
		title: tab.title,
		url: tab.url,
		favicon: tab.favicon,
	});
	recentlyClosedTabs.splice(10);
	const frameElement = getFrameElement(tab.frame);
	if (frameElement) {
		frameElement.src = "about:blank";
		frameElement.remove();
	}

	if (!tabs.length) {
		createTab(true);
		return;
	}

	if (activeTabId === tabId) {
		const nextTab = tabs[Math.max(0, index - 1)];
		switchTab(nextTab.id);
	} else {
		renderTabs();
		queueSessionSave();
	}
}

function resetActiveTabToNewTab(tab = getActiveTab()) {
	if (!tab) return;
	closeSuggestions();
	clearError();
	setLoading(false);
	clearTabWatchdog(tab);
	tab.title = "New Tab";
	tab.url = NEW_TAB_URL;
	tab.favicon = FAVICON_FALLBACK;
	tab.loading = false;
	tab.blockedCount = 0;
	tab.needsLoad = false;
	tab.navAttempts = 0;
	tab.controllerResets = 0;
	if (homeAddress) homeAddress.value = "";
	discardTabFrame(tab);
	if (tab.id === activeTabId) syncActiveSurface();
	else renderTabs();
	queueSessionSave();
}

function clearTabWatchdog(tab) {
	if (!tab?.watchdogTimer) return;
	window.clearTimeout(tab.watchdogTimer);
	tab.watchdogTimer = null;
}

function finishTabLoading(tab) {
	clearTabWatchdog(tab);
	tab.loading = false;
	if (tab.id === activeTabId) setLoading(false);
}

function armNavigationWatchdog(tab) {
	clearTabWatchdog(tab);
	tab.watchdogTimer = window.setTimeout(() => {
		tab.watchdogTimer = null;
		if (!tab.loading) return;
		tab.loading = false;
		if (tab.id === activeTabId) setLoading(false);
		renderTabs();
		if (tab.navAttempts < MAX_NAVIGATION_RETRIES) {
			tab.navAttempts += 1;
			recoverTransport("navigation watchdog timeout", {
				reloadActive: tab.id === activeTabId,
				silent: tab.id !== activeTabId,
			});
			return;
		}
		if (tab.id === activeTabId) {
			showError(
				"This page took too long to respond. Try a different Wisp server from Settings > Network, or reload.",
				"navigation timed out"
			);
		}
	}, NAVIGATION_WATCHDOG_MS);
}

function armSpaLoadingWatchdog(tab) {
	clearTabWatchdog(tab);
	tab.watchdogTimer = window.setTimeout(() => {
		tab.watchdogTimer = null;
		if (!tab.loading) return;
		tab.loading = false;
		if (tab.id === activeTabId) setLoading(false);
		renderTabs();
	}, SPA_LOADING_WATCHDOG_MS);
}

function wireFrameEvents(tab) {
	const frame = tab.frame;
	const frameElement = getFrameElement(frame);
	frameElement.addEventListener("load", () => {
		if (isFrameUnrouted(frameElement)) {
			finishTabLoading(tab);
			handleUnroutedFrame(tab);
			return;
		}
		tab.navAttempts = 0;
		tab.controllerResets = 0;

		transportFailureStreak = 0;
		clearWispFunctionalFailure(activeWispUrl);
		finishTabLoading(tab);
		installFrameShortcutBridge(tab);
		installProxiedPageTools(tab);
		injectScriptIntoTab(tab);
		injectCustomScripts(tab);
		try {
			const title = frameElement.contentWindow.document.title;
			if (title) tab.title = title;
		} catch (_) {}
		renderTabs();
		addHistoryEntry(tab);
		queueSessionSave();
	});

	if (typeof frame.addEventListener === "function") {
		frame.addEventListener("urlchange", (event) => {
			const nextUrl = event.url || "";
			if (nextUrl) {
				try {
					const parsed = new URL(nextUrl);
					if (!parsed.protocol.startsWith("http")) return;
				} catch (_) {
					return;
				}
				if (isSelfOriginUrl(nextUrl)) return;
				const previousHost = getUrlHostname(tab.url);
				tab.url = nextUrl;
				if (previousHost !== getUrlHostname(nextUrl)) tab.blockedCount = 0;
				tab.favicon = getFaviconForUrl(nextUrl);
				try {
					tab.title = new URL(nextUrl).hostname;
				} catch (_) {
					tab.title = "Browsing";
				}
			}
			tab.loading = true;
			armSpaLoadingWatchdog(tab);
			if (tab.id === activeTabId) {
				updateAddressBar();
				setLoading(true, 58, "Following page navigation...");
			}
			renderTabs();
			queueSessionSave();
		});
	}
}

function installFrameShortcutBridge(tab) {
	try {
		const frameElement = getFrameElement(tab.frame);
		const win = frameElement.contentWindow;
		if (!win.__pulsarShortcutBridge) {
			win.__pulsarShortcutBridge = true;
			win.addEventListener("keydown", handleKeyboardShortcuts, {
				capture: true,
			});
		}
		if (win.__pulsarShieldOutsideClickBridge) return;
		win.__pulsarShieldOutsideClickBridge = true;
		const closeShieldPopup = () => setShieldPopupOpen(false);
		win.addEventListener(
			"pointerdown",
			closeShieldPopup,
			{ capture: true }
		);
		win.document?.addEventListener("pointerdown", closeShieldPopup, {
			capture: true,
		});
	} catch (_) {}
}

function readStoredBoolean(key, fallback) {
	try {
		const stored = localStorage.getItem(key);
		if (stored === null) return fallback;
		return stored !== "false";
	} catch (_) {
		return fallback;
	}
}

function writeStoredBoolean(key, value) {
	try {
		localStorage.setItem(key, value ? "true" : "false");
	} catch (_) {}
}

function readStoredDelay() {
	try {
		const stored = Number(localStorage.getItem(AUTOCLICKER_DELAY_STORAGE_KEY));
		if (Number.isFinite(stored)) return clampAutoClickerDelay(stored);
	} catch (_) {}
	return DEFAULT_AUTOCLICKER_DELAY_MS;
}

function clampAutoClickerDelay(value) {
	const numeric = Number(value);
	if (!Number.isFinite(numeric)) return DEFAULT_AUTOCLICKER_DELAY_MS;
	return Math.min(10000, Math.max(25, Math.round(numeric)));
}

function loadProxyToolSettings() {
	popupBlockerEnabled = readStoredBoolean(POPUP_BLOCKER_STORAGE_KEY, true);
	autoClickerEnabled = readStoredBoolean(
		AUTOCLICKER_ENABLED_STORAGE_KEY,
		false
	);
	autoClickerDelayMs = readStoredDelay();
	if (popupBlockerToggle) popupBlockerToggle.checked = popupBlockerEnabled;
	if (autoClickerToggle) autoClickerToggle.checked = autoClickerEnabled;
	if (autoClickerDelay) autoClickerDelay.value = String(autoClickerDelayMs);
}

function syncProxyToolSettingsToFrames() {
	for (const tab of tabs) installProxiedPageTools(tab);
}

function installProxiedPageTools(tab) {
	if (!getFrameElement(tab?.frame)?.isConnected) return;
	installFramePopupBlocker(tab);
	installFrameAutoClicker(tab);
	syncFramePrivacySettings(tab);
}

function openUrlInNewTab(url) {
	const remote = extractRemoteUrl(url);
	if (!remote) return;
	try {
		const parsed = new URL(remote);
		if (!parsed.protocol.startsWith("http")) return;
	} catch (_) {
		return;
	}
	const tab = createTab(true);
	launchInProxy(remote, tab);
}

const SAME_FRAME_TARGETS = new Set(["_self", "_top", "_parent"]);
const NEW_TAB_TARGETS = new Set(["_blank", "_new"]);

function installFramePopupBlocker(tab) {
	try {
		const win = getFrameElement(tab.frame).contentWindow;
		const doc = win.document;
		if (!win || !doc) return;

		const safeHosts = [...SAFE_POPUP_HOSTS];
		const resolveCandidate = (candidate) => {
			try {
				return new win.URL(candidate, win.location.href).toString();
			} catch (_) {
				return "";
			}
		};
		const isAllowed = (candidate) => {
			if (!candidate) return false;
			try {
				const url = new win.URL(candidate, win.location.href);
				const host = url.hostname.toLowerCase().replace(/^www\./, "");
				return safeHosts.some((safeHost) => {
					const normalized = safeHost.replace(/^www\./, "");
					return host === normalized || host.endsWith(`.${normalized}`);
				});
			} catch (_) {
				return false;
			}
		};

		if (!win.__pulsarPopupBlockerInstalled) {
			win.__pulsarPopupBlockerInstalled = true;
			const nativeOpen = win.open ? win.open.bind(win) : null;
			win.open = function pulsarOpen(...args) {
				const [url, target] = args;
				const targetName = String(target || "").toLowerCase();

				if (url === undefined || url === null || url === "") {
					return nativeOpen ? nativeOpen(...args) : null;
				}
				if (SAME_FRAME_TARGETS.has(targetName)) {
					return nativeOpen ? nativeOpen(...args) : null;
				}
				const resolved = resolveCandidate(url);
				const userInitiated = Boolean(win.navigator.userActivation?.isActive);
				if (
					win.__pulsarPopupBlockerEnabled &&
					!userInitiated &&
					!isAllowed(resolved || url)
				) {
					return null;
				}
				openUrlInNewTab(resolved || url);
				return null;
			};
		}

		if (!win.__pulsarBlankLinkBridge) {
			win.__pulsarBlankLinkBridge = true;
			doc.addEventListener(
				"click",
				(event) => {
					try {
						const anchor =
							event.target instanceof win.Element
								? event.target.closest("a[target]")
								: null;
						if (!anchor) return;
						if (!NEW_TAB_TARGETS.has(String(anchor.target || "").toLowerCase()))
							return;
						const href = anchor.href;
						if (!href || href.startsWith("javascript:")) return;
						event.preventDefault();
						event.stopPropagation();
						openUrlInNewTab(href);
					} catch (_) {}
				},
				true
			);
		}

		win.__pulsarPopupBlockerEnabled = popupBlockerEnabled;
	} catch (_) {}
}

function installFrameAutoClicker(tab) {
	try {
		const win = getFrameElement(tab.frame).contentWindow;
		const doc = win.document;
		if (!win || !doc) return;

		if (!win.__pulsarAutoClickerInstalled) {
			win.__pulsarAutoClickerInstalled = true;
			let timer = null;
			let lastTarget = null;
			const lastPoint = {
				x: Math.max(1, Math.floor(win.innerWidth / 2)),
				y: Math.max(1, Math.floor(win.innerHeight / 2)),
			};
			const rememberTarget = (event) => {
				lastTarget = event.target;
				if (Number.isFinite(event.clientX)) lastPoint.x = event.clientX;
				if (Number.isFinite(event.clientY)) lastPoint.y = event.clientY;
			};
			const clickTarget = () => {
				const target =
					lastTarget?.isConnected && lastTarget !== doc
						? lastTarget
						: doc.elementFromPoint(lastPoint.x, lastPoint.y);
				if (!target || target === doc.body || target === doc.documentElement)
					return;
				const options = {
					bubbles: true,
					cancelable: true,
					composed: true,
					clientX: lastPoint.x,
					clientY: lastPoint.y,
					view: win,
				};
				target.dispatchEvent(new win.MouseEvent("mousedown", options));
				target.dispatchEvent(new win.MouseEvent("mouseup", options));
				target.dispatchEvent(new win.MouseEvent("click", options));
			};

			doc.addEventListener("pointermove", rememberTarget, true);
			doc.addEventListener("mousemove", rememberTarget, true);
			doc.addEventListener("mousedown", rememberTarget, true);
			win.__pulsarSetAutoClicker = (enabled, delayMs) => {
				if (timer) {
					win.clearInterval(timer);
					timer = null;
				}
				if (enabled) {
					timer = win.setInterval(clickTarget, clampAutoClickerDelay(delayMs));
				}
			};
		}

		win.__pulsarSetAutoClicker(autoClickerEnabled, autoClickerDelayMs);
	} catch (_) {}
}

function isFrameFromCurrentController(tab) {
	if (!scramjetController) return false;
	return tab.frameControllerId === scramjetController.id;
}

function discardTabFrame(tab) {
	const frameElement = getFrameElement(tab?.frame);
	if (frameElement) {
		frameElement.src = "about:blank";
		frameElement.remove();
	}
	if (tab) {
		if (tab.urlPollTimer) {
			window.clearInterval(tab.urlPollTimer);
			tab.urlPollTimer = null;
		}
		tab.frame = null;
		tab.frameControllerId = "";
	}
}

function resetProxyController() {
	scramjetController = null;
	controllerReadyPromise = null;
	activeWispUrl = "";
	activeTransportId = "";
	transportWarmupPromise = null;
	transportWarmupForced = false;
	for (const tab of tabs) discardTabFrame(tab);
}

function isFrameUnrouted(frameElement) {
	try {
		const win = frameElement?.contentWindow;
		const doc = win?.document;
		if (!win || !doc || doc.location?.href === "about:blank") return false;
		if (win.$scramjet) return false;
		return Boolean(
			doc.querySelector('meta[name="pulsar-unrouted"]') ||
				doc.title === "Scramjet | Error"
		);
	} catch (_) {
		return false;
	}
}

function handleUnroutedFrame(tab) {
	if ((tab.controllerResets || 0) >= 1) {
		if (tab.id === activeTabId) {
			setLoading(false);
			showError(
				"Pulsar lost its proxy controller and could not rebuild it. Reload Pulsar to reset the connection.",
				"frame bypassed the proxy"
			);
		}
		return;
	}
	tab.controllerResets = (tab.controllerResets || 0) + 1;
	const url = tab.url;
	resetProxyController();
	if (tab.id === activeTabId) {
		setLoading(true, 30, "Rebuilding proxy controller...");
	}
	launchInProxy(url, tab);
}

function getOrCreateFrame(tab = getActiveTab()) {
	if (!tab) return null;
	if (!scramjetController) return null;
	const existingFrameElement = getFrameElement(tab.frame);
	if (existingFrameElement?.isConnected && isFrameFromCurrentController(tab)) {
		return tab.frame;
	}
	if (existingFrameElement) discardTabFrame(tab);

	tab.frame = scramjetController.createFrame(undefined, {
		plugins: [new PulsarUrlWatcherPlugin(tab)],
	});
	tab.frameControllerId = scramjetController.id;
	const frameElement = getFrameElement(tab.frame);
	frameElement.className = "sj-frame";
	frameElement.title = "Pulsar page";
	frameElement.classList.toggle("hidden", tab.id !== activeTabId);
	wireFrameEvents(tab);
	viewport.appendChild(frameElement);
	return tab.frame;
}

function createFullscreenFrame() {
	const frame = scramjetController.createFrame();
	const frameElement = getFrameElement(frame);
	frameElement.className = "fullscreen-proxy-frame";
	frameElement.title = "Pulsar fullscreen page";
	document.body.appendChild(frameElement);
	document.body.classList.add("fullscreen-proxy-mode");
	return frame;
}

function getWispUrl() {
	const fallback = getConfiguredWispUrls()[0] || "";
	const sourceUrl = selectedWispUrl || fallback;
	if (sourceUrl.trim() === "") {
		throw new Error(
			"Set window.__PULSAR_CONFIG__.wispUrl (or wispUrls) in config.js."
		);
	}

	const url = normalizeWispUrl(sourceUrl);
	if (!url) {
		throw new Error("The configured Wisp URL must start with ws:// or wss://.");
	}

	return url;
}

function getConfiguredWispUrls() {
	const urls = [];
	if (typeof config.wispUrl === "string") urls.push(config.wispUrl);
	if (Array.isArray(config.wispUrls)) urls.push(...config.wispUrls);
	const deduped = new Set();
	const valid = [];
	for (const candidate of urls) {
		const normalized = normalizeWispUrl(candidate);
		if (!normalized || deduped.has(normalized)) continue;
		deduped.add(normalized);
		valid.push(normalized);
	}
	return valid;
}

function getPrimaryWispUrl() {
	return normalizeWispUrl(config.wispUrl) || getConfiguredWispUrls()[0] || "";
}

function getWispPingTimeoutMs() {
	return instantLaunchBoost ? WISP_INSTANT_PING_TIMEOUT_MS : WISP_PING_TIMEOUT_MS;
}

function getWispPingConcurrency() {
	return instantLaunchBoost
		? WISP_INSTANT_PING_CONCURRENCY
		: WISP_PING_CONCURRENCY;
}

function pingWispAttempt(url, timeoutMs = getWispPingTimeoutMs()) {
	return new Promise((resolve) => {
		const startedAt = performance.now();
		let ws = null;
		let settled = false;
		let triedLegacy = false;
		const detach = (socket) => {
			if (!socket) return;
			socket.onopen = null;
			socket.onerror = null;
			socket.onclose = null;
			try {

				if (
					socket.readyState === WebSocket.OPEN ||
					socket.readyState === WebSocket.CONNECTING
				) {
					socket.close();
				}
			} catch (_) {}
		};
		const finish = (latency, reachable) => {
			if (settled) return;
			settled = true;
			clearTimeout(timer);
			detach(ws);
			resolve({ url, latency, reachable });
		};
		const retryOrFail = (protocol) => {
			if (protocol && !triedLegacy) {
				triedLegacy = true;
				detach(ws);
				connect("");
				return;
			}
			finish(Number.POSITIVE_INFINITY, false);
		};
		const connect = (protocol) => {
			try {
				ws = protocol ? new WebSocket(url, protocol) : new WebSocket(url);
			} catch (_) {
				retryOrFail(protocol);
				return;
			}
			ws.onopen = () => finish(Math.round(performance.now() - startedAt), true);
			ws.onerror = () => retryOrFail(protocol);

			ws.onclose = () => retryOrFail(protocol);
		};
		const timer = setTimeout(
			() => finish(Number.POSITIVE_INFINITY, false),
			timeoutMs
		);
		connect("wisp-v2");
	});
}

async function pingWisp(url) {
	const attempts = [];
	for (let attempt = 0; attempt < WISP_PING_ATTEMPTS; attempt++) {
		attempts.push(await pingWispAttempt(url));
	}
	const successful = attempts.filter((attempt) => attempt.reachable);
	const successes = successful.length;
	const latency = successes
		? Math.round(
				successful.reduce((total, attempt) => total + attempt.latency, 0) /
					successes
			)
		: Infinity;
	const bestLatency = successes
		? Math.min(...successful.map((attempt) => attempt.latency))
		: Infinity;

	return {
		url,
		latency,
		bestLatency,
		reachable: successes > 0,
		successes,
		attempts: WISP_PING_ATTEMPTS,
	};
}

function getWispFailureCount(url) {
	return wispFunctionalFailures.get(url) || 0;
}

function recordWispFunctionalFailure(url) {
	if (!url) return;
	wispFunctionalFailures.set(url, getWispFailureCount(url) + 1);

	wispServers = [...wispServers].sort(compareWispServers);
	renderWispSelectOptions();
}

function clearWispFunctionalFailure(url) {
	if (!url) return;
	wispFunctionalFailures.delete(url);
	wispTransientDrops.delete(url);
}

function recordTransientDrop(url) {
	if (!url) return Number.POSITIVE_INFINITY;
	const now = Date.now();
	const entry = wispTransientDrops.get(url);
	if (!entry || now - entry.firstAt > TRANSIENT_DROP_WINDOW_MS) {
		wispTransientDrops.set(url, { count: 1, firstAt: now });
		return 1;
	}
	entry.count += 1;
	return entry.count;
}

function compareWispServers(a, b) {
	const primary = getPrimaryWispUrl();
	if (a.reachable !== b.reachable) return a.reachable ? -1 : 1;
	// The configured primary (21baseballacademy by default) always wins among
	// servers with the same reachability, so the app keeps using it whenever it
	// is available and only falls back to another server when it is down.
	const aIsPrimary = a.url === primary;
	const bIsPrimary = b.url === primary;
	if (aIsPrimary !== bIsPrimary) return aIsPrimary ? -1 : 1;
	const failureDelta = getWispFailureCount(a.url) - getWispFailureCount(b.url);
	if (failureDelta) return failureDelta;
	const successDelta = (b.successes || 0) - (a.successes || 0);
	if (successDelta) return successDelta;
	const latencyDelta = (a.latency || Infinity) - (b.latency || Infinity);
	if (latencyDelta) return latencyDelta;
	if (a.pending !== b.pending) return a.pending ? -1 : 1;
	return (a.index || 0) - (b.index || 0);
}

function getBestReachableWispUrl() {
	const healthy = wispServers.find(
		(server) => server.reachable && !getWispFailureCount(server.url)
	);
	return (healthy || wispServers.find((server) => server.reachable))?.url || "";
}

function formatWispHealth(server) {
	if (!server) return "";
	if (server.pending) return "Checking";
	const attempts = server.attempts || WISP_PING_ATTEMPTS;
	const successes = server.successes || 0;
	if (!successes) return `0/${attempts} - No response`;
	const failures = getWispFailureCount(server.url);
	const suffix = failures ? ` - ${failures} proxy error(s)` : "";
	return `${successes}/${attempts} - ${server.latency}ms${suffix}`;
}

function getWispStatusClass(server) {
	if (!server || server.pending) return "checking";
	if (server.reachable && getWispFailureCount(server.url)) return "checking";
	return server.reachable ? "up" : "down";
}

function formatWispOptionText(server) {
	const state = server.pending
		? "Checking"
		: server.reachable
			? getWispFailureCount(server.url)
				? "Flaky"
				: "Up"
			: "Down";
	return `${state} - ${server.url} - ${formatWispHealth(server)}`;
}

function renderWispOptions(servers) {
	wispServers = [...servers].sort(compareWispServers);
	if (!wispUserSelected) {
		const nextWispUrl = getBestReachableWispUrl() || wispServers[0]?.url;
		setSelectedWispUrl(nextWispUrl || selectedWispUrl, {
			warm:
				!instantLaunchBoost &&
				Boolean(
					nextWispUrl && selectedWispUrl && nextWispUrl !== selectedWispUrl
				),
		});
	} else if (!wispServers.some((server) => server.url === selectedWispUrl)) {
		setSelectedWispUrl(wispServers[0]?.url || "", {
			manual: false,
			warm: false,
		});
		wispUserSelected = false;
	}

	if (instantLaunchBoost) return;

	renderWispSelectOptions();
}

function renderWispSelectOptions() {
	if (!wispSelectTop) return;
	wispSelectTop.innerHTML = wispServers
		.map((server) => {
			const selected = server.url === selectedWispUrl;
			return `<option value="${escapeHtml(server.url)}"${
				selected ? " selected" : ""
			}>${escapeHtml(formatWispOptionText(server))}</option>`;
		})
		.join("");
	wispSelectTop.value = selectedWispUrl;
	updateWispPicker();
}

function setSelectedWispUrl(url, options = {}) {
	const { manual = false, warm = true, force = false } = options;
	const normalized = normalizeWispUrl(url) || url || "";
	const changed = normalized !== selectedWispUrl;
	selectedWispUrl = normalized;
	wispUserSelected = manual || wispUserSelected;
	if (wispSelectTop) wispSelectTop.value = selectedWispUrl;
	updateWispPicker();
	if (warm && changed) {
		const warmup = warmTransport({ force });
		if (manual) scheduleActiveTabReload({ after: warmup, delay: 320 });
	}
}

function updateWispPicker() {
	if (!wispPicker) return;
	const selected =
		wispServers.find((server) => server.url === selectedWispUrl) ||
		wispServers[0];

	wispPicker.button.innerHTML = selected
		? `<span class="wisp-status-dot ${getWispStatusClass(
				selected
			)}"></span><span class="wisp-picker-title">${escapeHtml(
				selected.url
			)}</span><span class="wisp-picker-meta">${escapeHtml(
				formatWispHealth(selected)
			)}</span>`
		: `<span class="wisp-status-dot checking"></span><span class="wisp-picker-title">Choose Wisp server</span>`;

	wispPicker.list.innerHTML = wispServers
		.map(
			(server) => `<button
				type="button"
				class="wisp-picker-option${server.url === selectedWispUrl ? " selected" : ""}"
				role="option"
				aria-selected="${server.url === selectedWispUrl ? "true" : "false"}"
				data-url="${escapeHtml(server.url)}"
			>
				<span class="wisp-status-dot ${getWispStatusClass(server)}"></span>
				<span class="wisp-picker-title">${escapeHtml(server.url)}</span>
				<span class="wisp-picker-meta">${escapeHtml(
					formatWispHealth(server)
				)}</span>
			</button>`
		)
		.join("");
}

function setWispPickerOpen(open) {
	if (!wispPicker) return;
	if (open) closeOtherPickerMenus(wispPicker.root);
	wispPicker.root.classList.toggle("open", open);
	wispPicker.list.classList.toggle("hidden", !open);
	wispPicker.button.setAttribute("aria-expanded", open ? "true" : "false");
	if (open) scheduleWispHealthChecks();
}

function initWispPicker() {
	if (!wispSelectTop || wispPicker) return;

	const root = document.createElement("div");
	root.className = "wisp-picker";
	const button = document.createElement("button");
	button.type = "button";
	button.className = "wisp-picker-button";
	button.setAttribute("aria-haspopup", "listbox");
	button.setAttribute("aria-expanded", "false");
	const list = document.createElement("div");
	list.className = "wisp-picker-list hidden";
	list.setAttribute("role", "listbox");

	root.append(button, list);
	wispSelectTop.classList.add("native-wisp-select");
	wispSelectTop.insertAdjacentElement("afterend", root);
	wispPicker = { root, button, list };

	button.addEventListener("click", () => {
		setWispPickerOpen(!root.classList.contains("open"));
	});
	button.addEventListener("keydown", (event) => {
		if (!["Enter", " ", "ArrowDown"].includes(event.key)) return;
		event.preventDefault();
		setWispPickerOpen(true);
		list.querySelector(".wisp-picker-option")?.focus();
	});
	list.addEventListener("click", (event) => {
		const option =
			event.target instanceof Element
				? event.target.closest(".wisp-picker-option")
				: null;
		if (!option) return;
		syncWispUrl(option.dataset.url, true);
		setWispPickerOpen(false);
		button.focus();
	});
	list.addEventListener("keydown", (event) => {
		const options = [...list.querySelectorAll(".wisp-picker-option")];
		const current = options.indexOf(document.activeElement);
		if (event.key === "Escape") {
			event.preventDefault();
			setWispPickerOpen(false);
			button.focus();
		} else if (event.key === "ArrowDown") {
			event.preventDefault();
			options[Math.min(current + 1, options.length - 1)]?.focus();
		} else if (event.key === "ArrowUp") {
			event.preventDefault();
			options[Math.max(current - 1, 0)]?.focus();
		} else if (event.key === "Enter" || event.key === " ") {
			event.preventDefault();
			document.activeElement?.click();
		}
	});
	document.addEventListener("click", (event) => {
		if (!root.contains(event.target)) setWispPickerOpen(false);
	});
	updateWispPicker();
}

function closeOtherPickerMenus(activeRoot) {
	document.querySelectorAll(".wisp-picker.open").forEach((root) => {
		if (root === activeRoot) return;
		root.classList.remove("open");
		root.querySelector(".wisp-picker-list")?.classList.add("hidden");
		root
			.querySelector(".wisp-picker-button")
			?.setAttribute("aria-expanded", "false");
	});
}

function updateCustomSelectPicker(select) {
	const picker = customSelectPickers.get(select);
	if (!picker) return;
	const selected = select.selectedOptions[0] || select.options[0];
	const label = selected?.textContent?.trim() || "Choose option";
	picker.button.disabled = select.disabled;
	picker.button.innerHTML = `<span class="custom-select-icon"></span><span class="wisp-picker-title">${escapeHtml(
		label
	)}</span>`;
	picker.list.innerHTML = [...select.options]
		.map(
			(option) => `<button
				type="button"
				class="wisp-picker-option${
					option.value === select.value ? " selected" : ""
				}"
				role="option"
				aria-selected="${option.value === select.value ? "true" : "false"}"
				data-value="${escapeHtml(option.value)}"
				${option.disabled ? "disabled" : ""}
			>
				<span class="custom-select-icon"></span>
				<span class="wisp-picker-title">${escapeHtml(
					option.textContent.trim()
				)}</span>
			</button>`
		)
		.join("");
}

function refreshCustomSelectPicker(select) {
	if (select) updateCustomSelectPicker(select);
}

function setCustomSelectPickerOpen(select, open) {
	const picker = customSelectPickers.get(select);
	if (!picker) return;
	if (open) closeOtherPickerMenus(picker.root);
	picker.root.classList.toggle("open", open);
	picker.list.classList.toggle("hidden", !open);
	picker.button.setAttribute("aria-expanded", open ? "true" : "false");
}

function initCustomSelectPicker(select) {
	if (
		!select ||
		select.classList.contains("native-wisp-select") ||
		customSelectPickers.has(select)
	) {
		return;
	}
	const root = document.createElement("div");
	root.className = "wisp-picker custom-select-picker";
	const button = document.createElement("button");
	button.type = "button";
	button.className = "wisp-picker-button";
	button.setAttribute("aria-haspopup", "listbox");
	button.setAttribute("aria-expanded", "false");
	const list = document.createElement("div");
	list.className = "wisp-picker-list hidden";
	list.setAttribute("role", "listbox");

	root.append(button, list);
	select.classList.add("native-wisp-select");
	select.insertAdjacentElement("afterend", root);
	const picker = { root, button, list };
	customSelectPickers.set(select, picker);

	button.addEventListener("click", () => {
		setCustomSelectPickerOpen(select, !root.classList.contains("open"));
	});
	button.addEventListener("keydown", (event) => {
		if (!["Enter", " ", "ArrowDown"].includes(event.key)) return;
		event.preventDefault();
		setCustomSelectPickerOpen(select, true);
		list.querySelector(".wisp-picker-option:not(:disabled)")?.focus();
	});
	list.addEventListener("click", (event) => {
		const option =
			event.target instanceof Element
				? event.target.closest(".wisp-picker-option")
				: null;
		if (!option || option.disabled) return;
		select.value = option.dataset.value;
		select.dispatchEvent(new Event("change", { bubbles: true }));
		updateCustomSelectPicker(select);
		setCustomSelectPickerOpen(select, false);
		button.focus();
	});
	list.addEventListener("keydown", (event) => {
		const options = [
			...list.querySelectorAll(".wisp-picker-option:not(:disabled)"),
		];
		const current = options.indexOf(document.activeElement);
		if (event.key === "Escape") {
			event.preventDefault();
			setCustomSelectPickerOpen(select, false);
			button.focus();
		} else if (event.key === "ArrowDown") {
			event.preventDefault();
			options[Math.min(current + 1, options.length - 1)]?.focus();
		} else if (event.key === "ArrowUp") {
			event.preventDefault();
			options[Math.max(current - 1, 0)]?.focus();
		} else if (event.key === "Enter" || event.key === " ") {
			event.preventDefault();
			document.activeElement?.click();
		}
	});
	document.addEventListener("click", (event) => {
		if (!root.contains(event.target)) setCustomSelectPickerOpen(select, false);
	});
	updateCustomSelectPicker(select);
}

function initCustomSelectPickers() {
	// One select failing must not leave the rest of the page on native controls.
	document.querySelectorAll("select").forEach((select) => {
		try {
			initCustomSelectPicker(select);
		} catch (err) {
			console.warn("Pulsar could not style a select", select.id, err);
		}
	});
}

function syncWispUrl(url, manual = false, warm = true) {
	setSelectedWispUrl(url, { manual, warm });
}

function syncWispSelects(source) {
	syncWispUrl(source.value, true);
}

function getConfiguredTransports() {
	const fallbackTransports = {
		epoxy: {
			name: "Epoxy",
			type: "epoxy",
			options: "wisp",
		},
		libcurl: {
			name: "Libcurl",
			type: "libcurl",
			options: "wisp",
		},
	};

	if (!config.transports || typeof config.transports !== "object") {
		return fallbackTransports;
	}

	return {
		...fallbackTransports,
		...config.transports,
	};
}

function getTransportIds() {
	return Object.keys(transports).filter((id) => {
		const transport = transports[id];
		return (
			transport &&
			["epoxy", "libcurl"].includes(getTransportKind(transport, id))
		);
	});
}

function getDefaultTransportId() {
	const ids = getTransportIds();
	const configuredDefault = config.defaultTransport;
	if (configuredDefault && ids.includes(configuredDefault))
		return configuredDefault;
	if (ids.includes("libcurl")) return "libcurl";
	return ids[0] || "";
}

function getStoredTransportId() {
	try {
		const profile = localStorage.getItem(TRANSPORT_PROFILE_STORAGE_KEY);
		if (profile !== STREAMING_TRANSPORT_PROFILE) {
			localStorage.setItem(
				TRANSPORT_PROFILE_STORAGE_KEY,
				STREAMING_TRANSPORT_PROFILE
			);
			return "";
		}
		return localStorage.getItem(TRANSPORT_STORAGE_KEY) || "";
	} catch (_) {
		return "";
	}
}

function storeTransportId(id) {
	try {
		localStorage.setItem(TRANSPORT_STORAGE_KEY, id);
	} catch (_) {}
}

function getNextWispUrl(currentUrl) {
	const urls = getConfiguredWispUrls();
	if (!urls.length) return currentUrl;
	const currentIndex = urls.indexOf(currentUrl);
	return urls[(currentIndex + 1 + urls.length) % urls.length] || urls[0];
}

function getNextFailoverWispUrl(currentUrl) {
	const urls = getConfiguredWispUrls();
	if (urls.length <= 1) return currentUrl;

	const reachable = wispServers.filter(
		(server) => server.reachable && server.url !== currentUrl
	);
	const ranked = (
		reachable.filter((server) => !getWispFailureCount(server.url)).length
			? reachable.filter((server) => !getWispFailureCount(server.url))
			: reachable
	).map((server) => server.url);
	if (ranked.length) {
		return ranked[wispFailoverIndex++ % ranked.length];
	}

	const unknown = urls.filter((url) => {
		if (url === currentUrl) return false;
		const health = wispHealthResults.find((server) => server.url === url);
		return !health || health.pending;
	});
	if (unknown.length) {
		return unknown[wispFailoverIndex++ % unknown.length];
	}

	wispFailoverIndex += 1;
	return getNextWispUrl(currentUrl);
}

function renderTransportOptions() {
	const ids = getTransportIds();
	const defaultId = getDefaultTransportId();
	const storedId = getStoredTransportId();
	selectedTransportId = ids.includes(storedId) ? storedId : defaultId;

	transportSelect.innerHTML = ids
		.map((id) => {
			const transport = transports[id];
			const selected = id === selectedTransportId ? " selected" : "";
			const name = transport.name || id;
			return `<option value="${id}"${selected}>${name}</option>`;
		})
		.join("");
	transportSelect.value = selectedTransportId;
	storeTransportId(selectedTransportId);
	refreshCustomSelectPicker(transportSelect);
}

function getSelectedTransport() {
	return transports[selectedTransportId] || transports[getDefaultTransportId()];
}

function getTransportOptions(transport, wispUrl) {
	const options = { ...(transport.transportOptions || {}) };
	const wispOption = transport.options || "websocket";
	options[wispOption] = wispUrl;
	return options;
}

function syncTransportSelect(source) {
	selectedTransportId = source.value;
	storeTransportId(selectedTransportId);

	transportFailureStreak = 0;
	clearError();
	const warmup = warmTransport({ force: true });
	scheduleActiveTabReload({ after: warmup, delay: 320 });
}

async function recoverTransport(reason = "", options = {}) {
	if (transportRecoveryPromise) {
		if (options.reloadActive) reloadAfterTransportRecovery = true;
		return transportRecoveryPromise;
	}
	reloadAfterTransportRecovery = Boolean(options.reloadActive);
	if (!options.silent || options.reloadActive) showRecoveryOverlay = true;

	transportRecoveryPromise = (async () => {
		const now = Date.now();
		if (now - lastTransportRecoveryAt < 2500) {
			const shouldReloadActive = reloadAfterTransportRecovery;
			reloadAfterTransportRecovery = false;
			if (shouldReloadActive) window.setTimeout(() => reloadActiveTab(), 500);
			return;
		}
		lastTransportRecoveryAt = now;

		const currentWisp = selectedWispUrl || getWispUrl();
		let rotatedServer = false;
		const ids = getTransportIds();
		const fallbackTransportId = getDefaultTransportId();

		transportFailureStreak += 1;
		const transportLooksBroken =
			transportFailureStreak >= TRANSPORT_FALLBACK_STREAK &&
			selectedTransportId !== fallbackTransportId &&
			ids.includes(fallbackTransportId);

		const libcurlSslFailure =
			/ssl connect|error code 35|certificate/i.test(reason) &&
			selectedTransportId === "libcurl" &&
			ids.includes("epoxy");
		const transientTransportDrop =
			/muxtaskended|multiplexor task ended|wisp:\s*muxtaskended|tls handshake eof|unexpectedeof/i.test(
				reason
			);
		if (transportLooksBroken || libcurlSslFailure) {
			const brokenTransportId = selectedTransportId;
			selectedTransportId = libcurlSslFailure ? "epoxy" : fallbackTransportId;
			storeTransportId(selectedTransportId);
			if (transportSelect) transportSelect.value = selectedTransportId;
			refreshCustomSelectPicker(transportSelect);
			transportFailureStreak = 0;
			activeWispUrl = "";
			activeTransportId = "";
			if (transportLooksBroken) {
				showError(
					`The ${
						transports[brokenTransportId]?.name || brokenTransportId
					} transport could not connect through any server, so Pulsar switched back to ${
						transports[selectedTransportId]?.name || selectedTransportId
					}.`,
					"transport fallback"
				);
			}
		} else if (
			transientTransportDrop &&
			recordTransientDrop(currentWisp) < TRANSIENT_DROP_ESCALATION
		) {

			activeWispUrl = "";
			activeTransportId = "";
		} else {

			recordWispFunctionalFailure(currentWisp);
			const nextWisp = getNextFailoverWispUrl(currentWisp);
			rotatedServer = nextWisp !== currentWisp;
			syncWispUrl(nextWisp, false, false);
			scheduleWispHealthChecks({ immediate: true });
		}

		activeWispUrl = "";
		activeTransportId = "";
		if (showRecoveryOverlay) {
			setLoading(true, 36, "Recovering proxy connection...");
		}
		await withTimeout(
			ensureTransport(getWispUrl(), { force: true }),
			10000,
			"Recovery transport connection timed out"
		);

		const tab = getActiveTab();
		const shouldReloadActive = reloadAfterTransportRecovery;
		reloadAfterTransportRecovery = false;

		const canAutoReload =
			rotatedServer &&
			!options.noAutoReload &&
			tab &&
			Date.now() - (tab.autoReloadAt || 0) > AUTO_RELOAD_COOLDOWN_MS;
		if ((shouldReloadActive || canAutoReload) && tab?.url && tab.url !== NEW_TAB_URL) {
			if (canAutoReload) tab.autoReloadAt = Date.now();
			window.setTimeout(
				() => reloadActiveTab(),
				reason.includes("video") ? 300 : 700
			);
		}
	})()
		.catch(() => {})
		.finally(() => {
			reloadAfterTransportRecovery = false;
			showRecoveryOverlay = false;
			transportRecoveryPromise = null;
		});

	return transportRecoveryPromise;
}

function initializeWispDropdowns() {
	const configured = getConfiguredWispUrls();
	if (!configured.length) return;

	wispHealthResults = configured.map((url, index) => ({
		url,
		index,
		latency: Infinity,
		bestLatency: Infinity,
		reachable: false,
		successes: 0,
		attempts: WISP_PING_ATTEMPTS,
		pending: true,
	}));
	renderWispOptions(wispHealthResults);
}

function scheduleWispHealthChecks(options = {}) {
	const { immediate = false, stopOnFirst = false } = options;
	if (wispHealthCheckPromise) return wispHealthCheckPromise;
	if (immediate) {
		if (wispHealthTimer) {
			window.clearTimeout(wispHealthTimer);
			wispHealthTimer = null;
		}
		wispHealthCheckScheduled = true;
		return runWispHealthChecks({ stopOnFirst });
	}
	if (wispHealthCheckScheduled || wispHealthCheckCompleted || wispHealthTimer)
		return;
	wispHealthCheckScheduled = true;
	wispHealthTimer = window.setTimeout(() => {
		wispHealthTimer = null;
		runWispHealthChecks();
	}, WISP_HEALTH_CHECK_DELAY_MS);
}

async function runWispHealthChecks(options = {}) {
	if (wispHealthCheckPromise) return wispHealthCheckPromise;

	wispHealthCheckPromise = runWispHealthChecksOnce(options).finally(() => {
		wispHealthCheckPromise = null;
	});
	return wispHealthCheckPromise;
}

async function runWispHealthChecksOnce({ stopOnFirst = false } = {}) {
	const configured = getConfiguredWispUrls();
	if (!configured.length) return;

	const results = wispHealthResults.length
		? wispHealthResults
		: configured.map((url, index) => ({
				url,
				index,
				latency: Infinity,
				bestLatency: Infinity,
				reachable: false,
				successes: 0,
				attempts: WISP_PING_ATTEMPTS,
				pending: true,
			}));
	wispHealthResults = results;

	// Probe only a small launch set. The latest config contains many community
	// endpoints, and opening a WebSocket to every dead endpoint creates a wall
	// of Firefox errors before the primary server can start.
	const queue = configured.slice(0, 4);
	let nextIndex = 0;
	let stopped = false;

	const probeNext = async () => {
		if (stopped) return;
		const url = queue[nextIndex++];
		if (!url) return;
		try {
			const result = await pingWisp(url);
			const entry = results.find((item) => item.url === url);
			if (!entry) return;
			Object.assign(entry, {
				...result,
				url,
				latency: result.reachable ? result.latency : Infinity,
				bestLatency: result.reachable ? result.bestLatency : Infinity,
				pending: false,
			});
			if (result.reachable) {
				if (!firstReachableWispUrl) firstReachableWispUrl = url;
				if (stopOnFirst) stopped = true;
				resolveFirstReachableWisp();
				if (!stopOnFirst && ensureTransportClientReady()) {
					probeTorCapability(url).then(() => renderTorOptions());
				}
			}
			renderWispOptions(results);
		} finally {
			await probeNext();
		}
	};

	await Promise.all(
		Array.from(
			{ length: Math.min(getWispPingConcurrency(), queue.length) },
			probeNext
		)
	);

	if (stopped) {

		wispHealthCheckScheduled = false;
		resolveFirstReachableWisp();
		return;
	}

	await runTorScan();

	wispHealthCheckCompleted = true;
	resolveFirstReachableWisp();
	renderWispOptions(results);
}

function resolveFirstReachableWisp() {
	if (!firstReachableWispResolve) return;
	const resolve = firstReachableWispResolve;
	firstReachableWispResolve = null;
	resolve();
}

function waitForFirstReachableWisp() {
	if (!firstReachableWispPromise) {
		firstReachableWispPromise = new Promise((resolve) => {
			firstReachableWispResolve = resolve;
		});
	}
	return firstReachableWispPromise;
}

async function selectBestWispForLaunch() {
	const primary = getPrimaryWispUrl();
	if (!selectedWispUrl) {
		setSelectedWispUrl(primary, { warm: false });
	}
	if (wispUserSelected) return;
	if (getConfiguredWispUrls().length <= 1) return;

	// Start with the configured primary immediately. Health probing remains a
	// background task and the navigation retry path can switch servers if it
	// is unavailable. This removes several seconds from the normal launch path.
	if (!instantLaunchBoost && selectedWispUrl === primary && !wispHealthCheckCompleted) {
		scheduleWispHealthChecks({ immediate: true });
		return;
	}

	if (instantLaunchBoost) {
		if (!firstReachableWispUrl) {
			scheduleWispHealthChecks({ immediate: true, stopOnFirst: true });
			await Promise.race([
				waitForFirstReachableWisp(),
				new Promise((resolve) =>
					setTimeout(resolve, WISP_INSTANT_LAUNCH_HEALTH_BUDGET_MS)
				),
			]);
		}

		if (!firstReachableWispUrl) {
			await Promise.race([
				waitForFirstReachableWisp(),
				new Promise((resolve) =>
					setTimeout(resolve, WISP_LAUNCH_HEALTH_BUDGET_MS)
				),
			]);
		}
		const winner = firstReachableWispUrl || getBestReachableWispUrl();
		if (winner && winner !== selectedWispUrl) {
			setSelectedWispUrl(winner, { warm: false });
		}
		return;
	}

	if (!wispHealthCheckCompleted && !getBestReachableWispUrl()) {
		scheduleWispHealthChecks({ immediate: true });
		await Promise.race([
			waitForFirstReachableWisp(),
			new Promise((resolve) =>
				setTimeout(resolve, WISP_LAUNCH_HEALTH_BUDGET_MS)
			),
		]);
	}

	const best = getBestReachableWispUrl();
	if (best && best !== selectedWispUrl) {
		setSelectedWispUrl(best, { warm: false });
	}
}

function getExplicitTorUrls() {
	const urls = [];
	if (typeof config.torUrl === "string") urls.push(config.torUrl);
	if (Array.isArray(config.torUrls)) urls.push(...config.torUrls);
	const deduped = new Set();
	const valid = [];
	for (const candidate of urls) {
		const normalized = normalizeWispUrl(candidate);
		if (!normalized || deduped.has(normalized)) continue;
		deduped.add(normalized);
		valid.push(normalized);
	}
	return valid;
}

function getTorCandidateUrls() {
	const ordered = [];
	const seen = new Set();
	const push = (candidate) => {
		const normalized = normalizeWispUrl(candidate);
		if (!normalized || seen.has(normalized)) return;
		seen.add(normalized);
		ordered.push(normalized);
	};

	for (const url of getExplicitTorUrls()) push(url);
	for (const server of wispServers) if (server.reachable) push(server.url);
	for (const url of getConfiguredWispUrls()) {
		const known = wispServers.find((server) => server.url === url);
		if (known && !known.reachable && !known.pending) continue;
		push(url);
	}
	return ordered;
}

function getWispLatency(url) {
	const server = wispServers.find((item) => item.url === url);
	return server?.reachable ? server.latency : Infinity;
}

function getDetectedTorUrls() {
	return getTorCandidateUrls()
		.filter((url) => torCapability.get(url) === true)
		.sort((a, b) => {
			const latencyDelta = getWispLatency(a) - getWispLatency(b);
			if (latencyDelta) return latencyDelta;
			return getTorFailureCount(a) - getTorFailureCount(b);
		});
}

function getBestDetectedTorUrl() {
	return getDetectedTorUrls()[0] || "";
}

function toHttpOrigin(wispUrl) {
	const normalized = normalizeWispUrl(wispUrl);
	if (!normalized) return "";
	try {
		const url = new URL(normalized);
		url.protocol = url.protocol === "ws:" ? "http:" : "https:";
		return `${url.origin}/`;
	} catch (_) {
		return "";
	}
}

function getTorCapabilityPaths() {
	const configured =
		typeof config.torCapabilityPath === "string" && config.torCapabilityPath
			? [{ path: config.torCapabilityPath, verifyBody: false }]
			: [];
	return [
		...configured,

		{ path: "/.well-known/pulsar-tor", verifyBody: false },

		{ path: "/health", verifyBody: true },
	];
}

function ensureTransportClientReady() {
	return Boolean(activeTransportClient && activeTransportClient.ready);
}

const NO_TRANSPORT = Symbol("no-transport");

async function requestThroughTransport(url, timeoutMs) {
	if (!(await ensureTransportClientReady())) return NO_TRANSPORT;
	try {
		return await withTimeout(
			activeTransportClient.request(
				url,
				"GET",
				null,
				[["accept", "*/*"]],
				undefined
			),
			timeoutMs,
			"Tor capability probe timed out"
		);
	} catch (err) {

		console.warn("[pulsar-tor] probe failed for", url.href, err);
		return null;
	}
}

async function readTransferrableText(response, limit = 2048) {
	try {
		const text = await new Response(response.body).text();
		return text.slice(0, limit);
	} catch (_) {
		return "";
	}
}

async function probeTorCapability(wispUrl) {
	if (torCapability.has(wispUrl)) return torCapability.get(wispUrl);

	const base = toHttpOrigin(wispUrl);
	if (!base) {
		torCapability.set(wispUrl, false);
		return false;
	}

	for (const { path, verifyBody } of getTorCapabilityPaths()) {
		let target;
		try {
			target = new URL(path, base);
		} catch (_) {
			continue;
		}

		const response = await requestThroughTransport(
			target,
			TOR_CAPABILITY_TIMEOUT_MS
		);
		if (response === NO_TRANSPORT) return NO_TRANSPORT;
		if (!response || response.status < 200 || response.status >= 300) continue;

		if (
			!verifyBody ||
			/onion|\btor\b|blacklist/i.test(await readTransferrableText(response))
		) {
			torCapability.set(wispUrl, true);
			return true;
		}
	}

	torCapability.set(wispUrl, false);
	return false;
}

function runTorScan(options = {}) {
	if (torScanPromise) return torScanPromise;
	torScanPromise = runTorScanOnce(options).finally(() => {
		torScanPromise = null;
	});
	return torScanPromise;
}

async function runTorScanOnce({ stopOnFirst = false } = {}) {
	if (!getTorCandidateUrls().length) return;

	for (const url of getExplicitTorUrls()) {
		if (!torCapability.has(url)) torCapability.set(url, true);
	}

	let found = getDetectedTorUrls().length > 0;
	let probedAny = getExplicitTorUrls().length > 0;
	let cleanPass = false;

	for (;;) {
		const candidates = getTorCandidateUrls();
		if (!candidates.length) break;
		let nextIndex = 0;
		let skipped = 0;
		const worker = async () => {
			while (nextIndex < candidates.length) {
				if (stopOnFirst && found) return;
				const url = candidates[nextIndex++];
				if (torCapability.has(url)) continue;
				const result = await probeTorCapability(url);
				if (result === NO_TRANSPORT) {
					skipped += 1;
					continue;
				}
				probedAny = true;
				if (result === true) {
					found = true;
					await ensureWispLatency(url);
				}
				renderTorOptions();
			}
		};

		await Promise.all(
			Array.from(
				{ length: Math.min(TOR_SCAN_CONCURRENCY, candidates.length) },
				worker
			)
		);
		cleanPass = skipped === 0;
		if (stopOnFirst || cleanPass || !ensureTransportClientReady()) break;
	}
	if (!stopOnFirst && probedAny && cleanPass) torScanCompleted = true;
	renderTorOptions();
}

function getTorFetchEndpoint(torUrl) {
	const origin = toHttpOrigin(torUrl);
	if (!origin) return "";
	const path =
		typeof config.torFetchPath === "string" && config.torFetchPath
			? config.torFetchPath
			: "tor-fetch";
	try {
		return new URL(path, origin).toString();
	} catch (_) {
		return "";
	}
}

function findTorUrlByEndpoint(endpoint) {
	return (
		getTorCandidateUrls().find(
			(url) => getTorFetchEndpoint(url) === endpoint
		) || ""
	);
}

function getTorFailureCount(url) {
	return torFunctionalFailures.get(url) || 0;
}

function recordTorFunctionalFailure(endpoint) {
	const url = findTorUrlByEndpoint(endpoint);
	if (!url) return;
	torFunctionalFailures.set(url, getTorFailureCount(url) + 1);
	renderTorOptions();
}

function clearTorFunctionalFailure(endpoint) {
	const url = findTorUrlByEndpoint(endpoint);
	if (url && torFunctionalFailures.delete(url)) renderTorOptions();
}

function getEffectiveTorUrl() {
	if (torUserSelected && selectedTorUrl) return selectedTorUrl;
	return getBestDetectedTorUrl();
}

function formatTorOptionText(url) {
	const latency = getWispLatency(url);
	const failures = getTorFailureCount(url);
	const health = Number.isFinite(latency) ? ` - ${latency}ms` : "";
	const suffix = failures ? ` - ${failures} tor error(s)` : "";
	return `${failures ? "Flaky" : "Tor"} - ${url}${health}${suffix}`;
}

function getTorStatusClass(url) {
	if (!url) return "checking";
	if (getTorFailureCount(url)) return "checking";
	return "up";
}

function formatTorHealth(url) {
	const latency = getWispLatency(url);
	const failures = getTorFailureCount(url);
	const parts = [];
	if (Number.isFinite(latency)) parts.push(`${latency}ms`);
	if (failures) parts.push(`${failures} error${failures === 1 ? "" : "s"}`);
	return parts.join(" · ");
}

async function ensureWispLatency(url) {
	const existing = wispServers.find((server) => server.url === url);
	if (existing?.reachable) return;
	const result = await pingWisp(url);
	if (!result.reachable) return;
	if (existing) {
		Object.assign(existing, { ...result, url, pending: false });
	} else {
		wispServers.push({ ...result, url, index: wispServers.length });
	}
	renderTorOptions();
}

function renderTorOptions() {
	torServers = getDetectedTorUrls();
	if (!torSelect) return;

	const options = torServers.map(
		(url) =>
			`<option value="${escapeHtml(url)}">${escapeHtml(
				formatTorOptionText(url)
			)}</option>`
	);
	torSelect.innerHTML = options.join("");
	const pinned =
		torUserSelected && selectedTorUrl && torServers.includes(selectedTorUrl);
	if (torUserSelected && !pinned) torUserSelected = false;
	torSelect.value = pinned ? selectedTorUrl : torServers[0] || "";
	torSelect.disabled = !torServers.length;
	if (torPicker) updateTorPicker();
	else refreshCustomSelectPicker(torSelect);
}

function updateTorPicker() {
	if (!torPicker) return;
	const active = getEffectiveTorUrl();
	const pinned = Boolean(torUserSelected && selectedTorUrl);

	const headerLabel = `<span class="wisp-picker-title">${escapeHtml(
		active || "No Tor server"
	)}</span><span class="wisp-picker-meta">${
		active
			? escapeHtml(formatTorHealth(active))
			: torServers.length === 0
				? "no Tor-capable server yet"
				: "ready"
	}</span>`;

	torPicker.button.innerHTML = `<span class="wisp-status-dot tor ${
		active ? getTorStatusClass(active) : "down"
	}"></span>${headerLabel}`;

	const serverOptions = torServers
		.map((url) => {
			const selected = url === (pinned ? selectedTorUrl : active);
			return `<button type="button"
				class="wisp-picker-option${selected ? " selected" : ""}"
				role="option"
				aria-selected="${selected ? "true" : "false"}"
				data-url="${escapeHtml(url)}"
			>
				<span class="wisp-status-dot tor ${getTorStatusClass(url)}"></span>
				<span class="wisp-picker-title">${escapeHtml(url)}</span>
				<span class="wisp-picker-meta">${escapeHtml(formatTorHealth(url))}</span>
			</button>`;
		})
		.join("");

	const emptyState = torServers.length
		? ""
		: `<div class="tor-picker-empty">No Tor-capable Wisp servers detected yet.</div>`;

	torPicker.list.innerHTML = serverOptions + emptyState;
}

function setTorPickerOpen(open) {
	if (!torPicker) return;
	if (open) closeOtherPickerMenus(torPicker.root);
	torPicker.root.classList.toggle("open", open);
	torPicker.list.classList.toggle("hidden", !open);
	torPicker.button.setAttribute("aria-expanded", open ? "true" : "false");
}

function initTorPicker() {
	if (!torSelect || torPicker) return;

	const root = document.createElement("div");
	root.className = "wisp-picker tor-picker";
	const button = document.createElement("button");
	button.type = "button";
	button.className = "wisp-picker-button";
	button.setAttribute("aria-haspopup", "listbox");
	button.setAttribute("aria-expanded", "false");
	const list = document.createElement("div");
	list.className = "wisp-picker-list hidden";
	list.setAttribute("role", "listbox");

	root.append(button, list);
	torSelect.classList.add("native-wisp-select");
	torSelect.insertAdjacentElement("afterend", root);
	torPicker = { root, button, list };

	button.addEventListener("click", () => {
		setTorPickerOpen(!root.classList.contains("open"));
	});
	button.addEventListener("keydown", (event) => {
		if (!["Enter", " ", "ArrowDown"].includes(event.key)) return;
		event.preventDefault();
		setTorPickerOpen(true);
		list.querySelector(".wisp-picker-option")?.focus();
	});
	list.addEventListener("click", (event) => {
		const target = event.target instanceof Element ? event.target : null;
		if (!target) return;
		const option = target.closest(".wisp-picker-option");
		if (!option) return;
		setSelectedTorUrl(option.dataset.url);
		setTorPickerOpen(false);
		button.focus();
	});
	list.addEventListener("keydown", (event) => {
		const options = [...list.querySelectorAll(".wisp-picker-option")];
		const current = options.indexOf(document.activeElement);
		if (event.key === "Escape") {
			event.preventDefault();
			setTorPickerOpen(false);
			button.focus();
		} else if (event.key === "ArrowDown") {
			event.preventDefault();
			options[Math.min(current + 1, options.length - 1)]?.focus();
		} else if (event.key === "ArrowUp") {
			event.preventDefault();
			options[Math.max(current - 1, 0)]?.focus();
		} else if (event.key === "Enter" || event.key === " ") {
			event.preventDefault();
			document.activeElement?.click();
		}
	});
	document.addEventListener("click", (event) => {
		if (!root.contains(event.target)) setTorPickerOpen(false);
	});
	updateTorPicker();
}

function initializeTorDropdown() {
	let stored = "";
	try {
		stored = localStorage.getItem(TOR_STORAGE_KEY) || "";
	} catch (_) {}

	if (stored && normalizeWispUrl(stored)) {
		selectedTorUrl = normalizeWispUrl(stored);
		torUserSelected = true;
	}
	renderTorOptions();
}

function setSelectedTorUrl(value) {
	const isAuto = !value;
	torUserSelected = !isAuto;
	selectedTorUrl = isAuto ? "" : normalizeWispUrl(value) || value;
	try {
		localStorage.setItem(TOR_STORAGE_KEY, isAuto ? "" : selectedTorUrl);
	} catch (_) {}
	renderTorOptions();

	if (isOnionUrl(getActiveTab()?.url)) scheduleActiveTabReload({ delay: 200 });
}

async function ensureTorServerForOnion() {
	if (!getTorCandidateUrls().length) return "";
	if (torUserSelected && selectedTorUrl) return selectedTorUrl;

	if (!getBestDetectedTorUrl() && !torScanCompleted) {
		await runTorScan({ stopOnFirst: true });
	}
	return getEffectiveTorUrl();
}

async function ensureTransport(wispUrl, options = {}) {
	const transport = getSelectedTransport();
	if (!transport) throw new Error("No proxy transports are configured.");

	const controller = await ensureProxyController(wispUrl);
	if (
		options.force ||
		activeWispUrl !== wispUrl ||
		activeTransportId !== selectedTransportId
	) {
		const transportClient = createTransportClient(transport, wispUrl);
		if (typeof transportClient.init === "function") {
			await withTimeout(
				transportClient.init(),
				15000,
				"Proxy transport initialization timed out"
			);
		}
		if (!transportClient.ready) {
			throw new Error("Proxy transport did not become ready");
		}
		await withTimeout(
			Promise.resolve(controller.setTransport(transportClient)),
			8000,
			"Setting transport timed out"
		);
		activeWispUrl = wispUrl;
		activeTransportId = selectedTransportId;
	if (!torScanCompleted && !instantLaunchBoost) runTorScan();
}
}

function warmTransport(options = {}) {
	const force = Boolean(options.force);

	if (transportWarmupPromise && (!force || transportWarmupForced)) {
		return transportWarmupPromise;
	}

	const previous = transportWarmupPromise;
	transportWarmupForced = force;
	const task = (async () => {
		if (previous) await previous;
		try {
			await ensureTransport(getWispUrl(), { force });
		} catch (_) {}
	})();
	transportWarmupPromise = task;
	task.finally(() => {
		if (transportWarmupPromise !== task) return;
		transportWarmupPromise = null;
		transportWarmupForced = false;
	});
	return task;
}

function refreshTransportAfterResume() {
	clearTimeout(resumeRefreshTimer);
	resumeRefreshTimer = window.setTimeout(async () => {
		resumeRefreshTimer = null;
		try {
			await ensureServiceWorkerReady();
			await warmTransport();
		} catch (_) {}
	}, TRANSPORT_RESUME_DELAY_MS);
}

async function ensureServiceWorkerReady(options = {}) {
	if (!swRegistrationPromise) {
		const register =
			typeof registerSWFast === "function"
				? registerSWFast
				: registerSW;
		swRegistrationPromise = register()
			.then(() => navigator.serviceWorker.ready)
			.then((registration) => {
				postPrivacyConfigToServiceWorker();
				return registration;
			})
			.catch((err) => {
				swRegistrationPromise = null;
				throw err;
			});
	}
	return swRegistrationPromise;
}

function syncAdblockToggle() {
	if (!window.ScramjetAdblock) return;
	window.ScramjetAdblock.setMode?.(privacySettings.trackerMode);
	window.ScramjetAdblock.setEnabled(privacySettings.trackerMode !== "off");
	if (adblockToggle) {
		adblockToggle.checked = privacySettings.trackerMode !== "off";
	}
}

function shouldRecoverForSilentError() {
	const now = Date.now();
	silentTransportErrors = silentTransportErrors.filter(
		(at) => now - at < SILENT_TRANSPORT_ERROR_WINDOW_MS
	);
	silentTransportErrors.push(now);
	if (silentTransportErrors.length < SILENT_TRANSPORT_ERROR_THRESHOLD) {
		return false;
	}
	silentTransportErrors = [];
	return true;
}

function shouldRecoverForMediaError() {
	const now = Date.now();
	mediaTransportErrors = mediaTransportErrors.filter(
		(at) => now - at < MEDIA_TRANSPORT_ERROR_WINDOW_MS
	);
	mediaTransportErrors.push(now);
	if (mediaTransportErrors.length < MEDIA_TRANSPORT_ERROR_THRESHOLD) {
		return false;
	}
	mediaTransportErrors = [];
	return true;
}

function handleServiceWorkerMessage(event) {
	if (event.data?.type === "pulsar-privacy-blocked") {
		recordPrivacyBlock(event.data);
		return;
	}
	if (event.data?.type === "pulsar-privacy-blocked-batch") {
		for (const entry of event.data.entries || []) {
			recordPrivacyBlock(entry);
		}
		return;
	}
	if (event.data?.type !== "pulsar-transport-error") return;
	const destination = event.data.destination || "";
	const reason = `${event.data.message || ""} ${
		event.data.destination || ""
	} ${event.data.url || ""}`.toLowerCase();

	if (event.data.isMedia || MEDIA_DESTINATIONS.has(destination)) {
		if (!shouldRecoverForMediaError()) return;

		recoverTransport(reason, {
			reloadActive: false,
			silent: true,
			noAutoReload: true,
		});
		return;
	}

	const reloadActive =
		event.data.mode === "navigate" || DOCUMENT_DESTINATIONS.has(destination);
	if (!reloadActive && !shouldRecoverForSilentError()) return;
	recoverTransport(reason, { reloadActive, silent: !reloadActive });
}

async function launchInProxy(rawInput, tab = getActiveTab()) {
	closeSuggestions();
	clearError();
	if (!tab) tab = createTab(true);

	const internalUrl = resolveInternalUrl(rawInput);
	if (internalUrl && internalUrl !== NEW_TAB_URL) {
		openInternalPage(internalUrl, tab);
		return;
	}

	tab.needsLoad = false;
	clearTabWatchdog(tab);
	if (tab.id === activeTabId) setLoading(true, 18, "Preparing proxy...");
	const requestedRaw = typeof rawInput === "string" ? rawInput.trim() : "";
	const parsedLaunch = parseProxyLaunchInput(requestedRaw);
	const requestedUrl = parsedLaunch.url;
	const shouldKeepExistingInjection =
		!parsedLaunch.injectScriptUrl && tab.url === requestedUrl && tab.injectScriptUrl;
	tab.injectScriptUrl = parsedLaunch.injectScriptUrl || (shouldKeepExistingInjection ? tab.injectScriptUrl : "");
	const nextUrl = prepareNavigationUrl(requestedUrl);
	if (!nextUrl || nextUrl === NEW_TAB_URL || isSelfOriginUrl(nextUrl)) {
		tab.injectScriptUrl = "";
		if (tab.id === activeTabId) setLoading(false);
		resetActiveTabToNewTab(tab);
		return;
	}
	try {
		if (tab.id === activeTabId)
			setLoading(true, 28, "Checking service worker...");
		await ensureServiceWorkerReady();
	} catch (err) {
		tab.loading = false;
		if (tab.id === activeTabId) setLoading(false);
		showError("Failed to register service worker.", err.toString());
		return;
	}

	let wispUrl;
	try {
		if (tab.id === activeTabId)
			setLoading(true, 36, "Selecting Wisp server...");
		await selectBestWispForLaunch();
		wispUrl = getWispUrl();
	} catch (err) {
		tab.loading = false;
		if (tab.id === activeTabId) setLoading(false);
		showError("Pulsar is missing a valid Wisp server URL.", err.toString());
		return;
	}

	try {
		if (tab.id === activeTabId)
			setLoading(true, 48, "Starting proxy transport...");
		await ensureTransport(wispUrl);
	} catch (err) {

		recordWispFunctionalFailure(wispUrl);
		const fallback = getNextFailoverWispUrl(wispUrl);
		if (tab.navAttempts < MAX_NAVIGATION_RETRIES && fallback !== wispUrl) {
			tab.navAttempts += 1;
			syncWispUrl(fallback, false, false);
			activeWispUrl = "";
			activeTransportId = "";
			if (tab.id === activeTabId)
				setLoading(true, 44, "Trying another Wisp server...");
			try {
				await ensureTransport(getWispUrl());
				wispUrl = getWispUrl();
			} catch (retryErr) {
				recordWispFunctionalFailure(getWispUrl());
				tab.loading = false;
				if (tab.id === activeTabId) setLoading(false);
				showError(
					"Failed to start the selected proxy transport.",
					retryErr.toString()
				);
				return;
			}
		} else {
			tab.loading = false;
			if (tab.id === activeTabId) setLoading(false);
			showError("Failed to start the selected proxy transport.", err.toString());
			return;
		}
	}

	if (!tabs.includes(tab)) return;

	if (isOnionUrl(nextUrl)) {
		if (tab.id === activeTabId)
			setLoading(true, 54, "Finding a Tor-capable server...");
		const torUrl = await ensureTorServerForOnion();
		if (!tabs.includes(tab)) return;
		if (!torUrl) {
			tab.loading = false;
			if (tab.id === activeTabId) setLoading(false);
			showError(
				"This is an onion address, but none of your Wisp servers reported Tor support. Add a wisptor server to wispUrls in config.js.",
				"no tor-capable server"
			);
			return;
		}
	}

	const previousHost = getUrlHostname(tab.url);
	tab.url = nextUrl;
	if (previousHost !== getUrlHostname(nextUrl)) tab.blockedCount = 0;
	tab.favicon = getFaviconForUrl(nextUrl);
	tab.loading = true;
	addHistoryEntry(tab);
	if (homeAddress) homeAddress.value = "";
	try {
		tab.title = new URL(nextUrl).hostname;
	} catch (_) {
		tab.title = "Browsing";
	}

	if (tab.id === activeTabId) {
		address.value = nextUrl;
		setLoading(true, 62, "Requesting page...");
	}

	renderTabs();
	queueSessionSave();
	const frame = getOrCreateFrame(tab);
	updateFullscreenButton();
	if (tab.id === activeTabId)
		setLoading(true, 72, "Waiting for page response...");
	if (!frame) {
		tab.loading = false;
		if (tab.id === activeTabId) {
			setLoading(false);
			showError(
				"Pulsar could not create a proxy frame. Reload the page to reset the proxy controller.",
				"no frame"
			);
		}
		return;
	}
	try {
		frame.go(nextUrl);
		armNavigationWatchdog(tab);
	} catch (err) {
		tab.loading = false;
		if (tab.id === activeTabId) {
			setLoading(false);
			showError("Pulsar could not start this navigation.", err.toString());
		}
	}
}

function failInstantLaunch(message) {
	instantLaunchBoost = false;
	clearInstantLaunchOverlay();
	document.body.textContent = message;
}

function clearInstantLaunchOverlay() {
	document.documentElement.classList.remove("pulsar-instant");
}

async function launchFullscreenProxy(rawInput) {

	const parsedLaunch = parseProxyLaunchInput(rawInput, { decode: true });
	const nextUrl = prepareNavigationUrl(
		resolveAddressInput(parsedLaunch.url, getDefaultSearchEngine())
	);
	const injectScriptUrl = parsedLaunch.injectScriptUrl;
	const instant = instantLaunchBoost;

	const swReady = ensureServiceWorkerReady({ fast: instant }).then(
		() => null,
		(err) => err
	);
	const wispReady = selectBestWispForLaunch()
		.then(() => getWispUrl())
		.then(
			(url) => ({ url }),
			(error) => ({ error })
		);

	const swError = await swReady;
	if (swError) {
		failInstantLaunch(
			`Failed to register service worker.\n${swError.toString()}`
		);
		return;
	}

	if (isOnionUrl(nextUrl) && !(await ensureTorServerForOnion())) {
		failInstantLaunch(
			"This is an onion address, but no Tor server is configured. Add wisptor endpoints to torUrls in config.js."
		);
		return;
	}

	const wisp = await wispReady;
	if (wisp.error) {
		failInstantLaunch(
			`Pulsar is missing a valid Wisp server URL.\n${wisp.error.toString()}`
		);
		return;
	}

	try {
		await ensureTransport(wisp.url);
	} catch (err) {
		failInstantLaunch(
			`Failed to start the selected proxy transport.\n${err.toString()}`
		);
		return;
	}

	const frame = createFullscreenFrame();
	const frameElement = getFrameElement(frame);
	if (injectScriptUrl) {
		frameElement?.addEventListener(
			"load",
			() => injectScriptIntoFrameElement(frameElement, injectScriptUrl),
			{ capture: true }
		);
	}
	frame.go(nextUrl);
	if (instant) clearInstantLaunchOverlay();
	instantLaunchBoost = false;
}

function navigateFrame(action) {
	if (action === "reload") {
		reloadActiveTab();
		return;
	}

	const tab = getActiveTab();
	const frame = tab?.frame;
	if (!frame) return;
	try {
		if (typeof frame[action] === "function") {
			frame[action]();
			return;
		}
		const frameElement = getFrameElement(frame);
		if (action === "back") frameElement?.contentWindow?.history?.back();
		if (action === "forward") frameElement?.contentWindow?.history?.forward();
	} catch (_) {}
}

function reloadActiveTab() {
	const tab = getActiveTab();
	if (!tab || tab.url === NEW_TAB_URL) return;
	launchInProxy(tab.url, tab);
}

function reloadAllProxiedTabs() {
	const proxiedTabs = tabs.filter((tab) => tab.url && tab.url !== NEW_TAB_URL);
	if (!proxiedTabs.length) return;
	for (const tab of proxiedTabs) {
		tab.loading = true;
	}
	renderTabs();
	setLoading(Boolean(getActiveTab()?.loading), 45);
	for (const tab of proxiedTabs) {
		launchInProxy(tab.url, tab);
	}
}

function getDefaultSearchEngine() {
	return "https://search.brave.com/search?q=%s";
}

function getSearchEngineHomepage(engine) {
	try {
		return new URL(engine).origin + "/";
	} catch (_) {
		return "";
	}
}

function getFullscreenFrame() {
	const tab = getActiveTab();
	if (!tab || tab.url === NEW_TAB_URL) return null;
	const frameElement = getFrameElement(tab.frame);
	return frameElement?.isConnected ? frameElement : null;
}

function updateFullscreenButton() {
	if (!fullscreenButton) return;
	const frame = getFullscreenFrame();
	const isFullscreen = document.fullscreenElement === frame;
	fullscreenButton.disabled = !frame && !document.fullscreenElement;
	fullscreenButton.classList.toggle("active", isFullscreen);
	fullscreenButton.title = isFullscreen ? "Exit fullscreen" : "Fullscreen page";
	fullscreenButton.setAttribute(
		"aria-label",
		isFullscreen ? "Exit fullscreen" : "Fullscreen proxied page"
	);
	fullscreenButton.innerHTML = `<i class="material-symbols-outlined" aria-hidden="true">${
		isFullscreen ? "fullscreen_exit" : "fullscreen"
	}</i>`;
}

async function toggleProxyFullscreen() {
	const frame = getFullscreenFrame();
	try {
		if (document.fullscreenElement) {
			await document.exitFullscreen();
		} else if (frame?.requestFullscreen) {
			await frame.requestFullscreen();
		}
	} catch (_) {
	} finally {
		updateFullscreenButton();
	}
}

function syncSearchEngineControls(source) {
	const value = source.value;
	searchEngine.value = value;
	searchEngineSettings.value = value;
	refreshCustomSelectPicker(searchEngine);
	refreshCustomSelectPicker(searchEngineSettings);
	try {
		localStorage.setItem(SEARCH_ENGINE_STORAGE_KEY, value);
	} catch (_) {}
}

function restoreSearchEngine() {
	try {
		const stored = localStorage.getItem(SEARCH_ENGINE_STORAGE_KEY);
		const value = stored || getDefaultSearchEngine();
		searchEngine.value = value;
		searchEngineSettings.value = value;
		refreshCustomSelectPicker(searchEngine);
		refreshCustomSelectPicker(searchEngineSettings);
	} catch (_) {}
}

function activateSettingsTab(tabName) {
	const tabButtons = settingsPanel.querySelectorAll("[data-settings-tab]");
	const panes = settingsPanel.querySelectorAll("[data-settings-pane]");
	tabButtons.forEach((item) => {
		item.classList.toggle("active", item.dataset.settingsTab === tabName);
	});
	panes.forEach((pane) => {
		pane.classList.toggle("active", pane.dataset.settingsPane === tabName);
	});
}

function openSettings(tabName = "") {
	settingsPanel.classList.remove("hidden");
	if (tabName) activateSettingsTab(tabName);
	scheduleWispHealthChecks();
	if (getTorCandidateUrls().length && !torScanCompleted) runTorScan();
}

function closeSettings() {
	settingsPanel.classList.add("hidden");
}

function initializeSettingsTabs() {
	const tabButtons = settingsPanel.querySelectorAll("[data-settings-tab]");
	tabButtons.forEach((tabButton) => {
		tabButton.addEventListener("click", () => {
			activateSettingsTab(tabButton.dataset.settingsTab);
		});
	});
}

function wirePrivacyControls() {
	shieldsToggleSettings?.addEventListener("change", () => {
		setPrivacySetting("shieldsEnabled", shieldsToggleSettings.checked);
	});
	adblockToggle?.addEventListener("change", () => {
		setTrackerMode(adblockToggle.checked ? "standard" : "off");
	});
	trackerModeSettings?.addEventListener("change", () => {
		setTrackerMode(trackerModeSettings.value);
	});
	shieldTrackerMode?.addEventListener("change", () => {
		setActiveSitePrivacySetting("trackerMode", shieldTrackerMode.value);
	});
	httpsUpgradeToggle?.addEventListener("change", () => {
		setPrivacySetting("upgradeHttps", httpsUpgradeToggle.checked);
	});
	shieldHttpsToggle?.addEventListener("change", () => {
		setActiveSitePrivacySetting("upgradeHttps", shieldHttpsToggle.checked);
	});
	stripTrackingToggle?.addEventListener("change", () => {
		setPrivacySetting("stripTrackingParams", stripTrackingToggle.checked);
	});
	blockScriptsToggle?.addEventListener("change", () => {
		setPrivacySetting("blockScripts", blockScriptsToggle.checked);
	});
	shieldScriptsToggle?.addEventListener("change", () => {
		setActiveSitePrivacySetting("blockScripts", shieldScriptsToggle.checked);
	});
	gpcToggle?.addEventListener("change", () => {
		setPrivacySetting("sendGpc", gpcToggle.checked);
	});
	fingerprintingToggle?.addEventListener("change", () => {
		setPrivacySetting("fingerprintingProtection", fingerprintingToggle.checked);
	});
	shieldFingerprintingToggle?.addEventListener("change", () => {
		setActiveSitePrivacySetting(
			"fingerprintingProtection",
			shieldFingerprintingToggle.checked
		);
	});
	webrtcToggle?.addEventListener("change", () => {
		setPrivacySetting("blockWebRtc", webrtcToggle.checked);
	});
	thirdPartyCookiesToggle?.addEventListener("change", () => {
		setPrivacySetting(
			"blockThirdPartyCookies",
			thirdPartyCookiesToggle.checked
		);
	});
	shieldCookiesToggle?.addEventListener("change", () => {
		setActiveSitePrivacySetting(
			"blockThirdPartyCookies",
			shieldCookiesToggle.checked
		);
	});
	forgetSiteToggleSettings?.addEventListener("change", () => {
		setPrivacySetting("forgetClosedSites", forgetSiteToggleSettings.checked);
	});

	shieldMainToggle?.addEventListener("change", () => {
		const host = getActiveSiteHost();
		if (!host) return;
		getSitePrivacySettings(host, true).shieldsEnabled =
			shieldMainToggle.checked;
		savePrivacySettings();
	});
	shieldForgetToggle?.addEventListener("change", () => {
		const host = getActiveSiteHost();
		if (!host) return;
		getSitePrivacySettings(host, true).forgetSiteData =
			shieldForgetToggle.checked;
		savePrivacySettings();
	});
	shieldClearSite?.addEventListener("click", async () => {
		const cleared = await clearTabSiteData();
		shieldClearSite.textContent = cleared
			? "Site data cleared"
			: "Nothing to clear";
		window.setTimeout(() => {
			shieldClearSite.textContent = "Clear site data";
		}, 1400);
	});
	shieldOpenSettings?.addEventListener("click", () => {
		setShieldPopupOpen(false);
		openSettings("privacy");
	});
	shieldButton?.addEventListener("click", (event) => {
		event.stopPropagation();
		setShieldPopupOpen(
			shieldPopup?.classList.contains("hidden") ||
				shieldPopup?.classList.contains("closing")
		);
	});
	shieldPopup?.addEventListener("click", (event) => {
		event.stopPropagation();
	});
	document.addEventListener("click", () => setShieldPopupOpen(false));

	clearDataButton?.addEventListener("click", async () => {
		const confirmed = window.confirm(
			"Clear Pulsar history, saved sessions, and cached filter data?"
		);
		if (!confirmed) return;
		try {
			localStorage.removeItem(HISTORY_STORAGE_KEY);
			localStorage.removeItem(SESSION_STORAGE_KEY);
			localStorage.removeItem("qblocker-fetched-at");
			await caches.delete("adblxcklists");
		} catch (_) {}
		for (const tab of tabs) tab.blockedCount = 0;
		privacySettings.siteSettings = {};
		savePrivacySettings();
		clearDataButton.textContent = "Privacy data cleared";
		window.setTimeout(() => {
			clearDataButton.textContent =
				"Clear Pulsar history and cached privacy data";
		}, 1600);
	});

}

function getBookmarks() {
	return readJsonStorage(BOOKMARKS_STORAGE_KEY, []);
}

function saveBookmarks(bookmarks) {
	writeJsonStorage(BOOKMARKS_STORAGE_KEY, bookmarks);
}

function getScripts() {
	return readJsonStorage(SCRIPTS_STORAGE_KEY, []);
}

function saveScripts(scripts) {
	writeJsonStorage(SCRIPTS_STORAGE_KEY, scripts);
}

function isScriptsEnabled() {
	try {
		return localStorage.getItem(SCRIPTS_ENABLED_KEY) !== "false";
	} catch (_) {
		return true;
	}
}

function setScriptsEnabled(enabled) {
	try {
		localStorage.setItem(SCRIPTS_ENABLED_KEY, enabled ? "true" : "false");
	} catch (_) {}
}

function isBookmarklet(url) {
	return typeof url === "string" && url.trim().toLowerCase().startsWith("javascript:");
}

function executeBookmarklet(tab, code) {
	if (!tab || !code) return;
	const frameElement = getFrameElement(tab.frame);
	if (!frameElement) return;
	try {
		const win = frameElement.contentWindow;
		if (!win) return;
		const scriptCode = code.replace(/^javascript:\s*/i, "");
		const script = document.createElement("script");
		script.textContent = scriptCode;
		script.dataset.pulsarInjected = "true";
		(win.document.head || win.document.documentElement || win.document.body)?.appendChild(script);
	} catch (_) {}
}

function injectCustomScripts(tab) {
	if (!isScriptsEnabled()) return;
	const scripts = getScripts();
	const enabledScripts = scripts.filter((s) => s.enabled !== false);
	if (!enabledScripts.length) return;
	const frameElement = getFrameElement(tab.frame);
	if (!frameElement) return;
	try {
		const win = frameElement.contentWindow;
		if (!win) return;
		if (!win.__pulsarCustomScriptsInjected) win.__pulsarCustomScriptsInjected = new Set();
		const injected = win.__pulsarCustomScriptsInjected;
		for (const script of enabledScripts) {
			const key = script.id || script.name || script.code;
			if (injected.has(key)) continue;
			injected.add(key);
			let code = script.code;
			if (isBookmarklet(code)) code = code.replace(/^javascript:\s*/i, "");
			const el = document.createElement("script");
			el.textContent = code;
			el.dataset.pulsarInjected = "true";
			(win.document.head || win.document.documentElement || win.document.body)?.appendChild(el);
		}
	} catch (_) {}
}

function renderBookmarks() {
	if (!bookmarksList) return;
	const bookmarks = getBookmarks();
	bookmarksList.innerHTML = "";
	if (!bookmarks.length) {
		bookmarksList.innerHTML = "";
		return;
	}
	for (const bm of bookmarks) {
		const item = document.createElement("div");
		item.className = "bookmark-item";
		const isJS = isBookmarklet(bm.url);
		item.innerHTML = `
			<span class="bookmark-item-icon"><i class="material-symbols-outlined">${isJS ? "code" : "star"}</i></span>
			<div class="bookmark-item-content">
				<div class="bookmark-item-title">${escapeHtml(bm.title || "Untitled")}</div>
				<div class="bookmark-item-url">${escapeHtml(bm.url)}</div>
			</div>
			<button class="bookmark-item-delete" title="Delete bookmark" data-bm-id="${escapeHtml(String(bm.id))}"><i class="material-symbols-outlined">close</i></button>
		`;
		item.addEventListener("click", (event) => {
			if (event.target.closest(".bookmark-item-delete")) return;
			openBookmark(bm);
		});
		item.querySelector(".bookmark-item-delete")?.addEventListener("click", (event) => {
			event.stopPropagation();
			deleteBookmark(bm.id);
		});
		bookmarksList.appendChild(item);
	}
}

function openBookmark(bm) {
	setBookmarkDrawerOpen(false);
	const tab = getActiveTab();
	if (isBookmarklet(bm.url)) {
		if (tab && tab.url !== NEW_TAB_URL) {
			executeBookmarklet(tab, bm.url);
		}
		return;
	}
	launchInProxy(bm.url);
}

function addBookmark(title, url) {
	const bookmarks = getBookmarks();
	const id = Date.now() + "_" + Math.random().toString(36).slice(2, 6);
	bookmarks.unshift({ id, title: title || url, url });
	saveBookmarks(bookmarks);
	renderBookmarks();
}

function deleteBookmark(id) {
	let bookmarks = getBookmarks();
	bookmarks = bookmarks.filter((bm) => bm.id !== id);
	saveBookmarks(bookmarks);
	renderBookmarks();
}

function setBookmarkDrawerOpen(open) {
	if (!bookmarksDrawer || !bookmarksButton) return;
	bookmarksDrawer.classList.toggle("hidden", !open);
	bookmarksButton.setAttribute("aria-expanded", open ? "true" : "false");
	if (open) {
		renderBookmarks();
	} else {
		setShieldPopupOpen(false);
	}
}

function wireBookmarks() {
	bookmarksButton?.addEventListener("click", (event) => {
		event.stopPropagation();
		setShieldPopupOpen(false);
		setBookmarkDrawerOpen(bookmarksDrawer.classList.contains("hidden"));
	});
	bookmarksAddBtn?.addEventListener("click", () => {
		const tab = getActiveTab();
		if (!tab || tab.url === NEW_TAB_URL) return;
		const title = tab.title || tab.url;
		addBookmark(title, tab.url);
		renderBookmarks();
	});
	bookmarksCloseBtn?.addEventListener("click", () => setBookmarkDrawerOpen(false));
	document.addEventListener("click", (event) => {
		if (bookmarksDrawer && !bookmarksDrawer.classList.contains("hidden") && !bookmarksDrawer.contains(event.target) && event.target !== bookmarksButton) {
			setBookmarkDrawerOpen(false);
		}
	});
}

function renderScriptsList() {
	if (!scriptsList) return;
	const scripts = getScripts();
	if (scriptsToggle) scriptsToggle.checked = isScriptsEnabled();
	scriptsList.innerHTML = "";
	for (const script of scripts) {
		const editor = document.createElement("div");
		editor.className = "script-editor";
		editor.innerHTML = `
			<div class="script-editor-header">
				<input type="text" value="${escapeHtml(script.name || "")}" placeholder="Script name" data-script-field="name" data-script-id="${escapeHtml(String(script.id))}">
				<label title="Enable this script" style="display:flex;align-items:center;gap:6px;cursor:pointer;flex:0 0 auto;">
					<input type="checkbox" ${script.enabled !== false ? "checked" : ""} data-script-field="enabled" data-script-id="${escapeHtml(String(script.id))}" style="position:absolute;opacity:0;pointer-events:none;">
					<span class="toggle-visual" aria-hidden="true"></span>
				</label>
				<button class="script-delete-btn" title="Delete script" data-script-id="${escapeHtml(String(script.id))}"><i class="material-symbols-outlined">delete</i></button>
			</div>
			<textarea data-script-field="code" data-script-id="${escapeHtml(String(script.id))}" placeholder="// JavaScript or bookmarklet code">${escapeHtml(script.code || "")}</textarea>
		`;
		const nameInput = editor.querySelector("[data-script-field='name']");
		const codeTextarea = editor.querySelector("[data-script-field='code']");
		const enabledCheckbox = editor.querySelector("[data-script-field='enabled']");
		const deleteBtn = editor.querySelector(".script-delete-btn");

		const saveScriptDebounced = debounce(() => {
			const scripts = getScripts();
			const found = scripts.find((s) => s.id === script.id);
			if (found) {
				found.name = nameInput.value;
				found.code = codeTextarea.value;
				found.enabled = enabledCheckbox.checked;
				saveScripts(scripts);
			}
		}, 300);

		nameInput.addEventListener("input", saveScriptDebounced);
		codeTextarea.addEventListener("input", saveScriptDebounced);
		enabledCheckbox.addEventListener("change", saveScriptDebounced);
		deleteBtn.addEventListener("click", () => {
			let scripts = getScripts();
			scripts = scripts.filter((s) => s.id !== script.id);
			saveScripts(scripts);
			renderScriptsList();
		});
		scriptsList.appendChild(editor);
	}
}

function debounce(fn, ms) {
	let timer;
	return (...args) => {
		clearTimeout(timer);
		timer = setTimeout(() => fn(...args), ms);
	};
}

const downloadsRegistry = [];
let nextDownloadId = 1;

function safeDownloadFilename(filename) {
	const base = String(filename || "").split(/[\\/]/).pop() || "";
	return base
		.replace(/[^a-zA-Z0-9._ ()[\]-]/g, "_")
		.slice(0, 180) || "download";
}

function startBrowserDownload(options = {}) {
	const id = nextDownloadId++;
	const url = String(options.url || "");
	const entry = {
		id,
		url,
		filename: safeDownloadFilename(options.filename),
		state: "in_progress",
		bytesReceived: 0,
		totalBytes: -1,
		startTime: Date.now(),
		endTime: 0,
		error: null,
	};
	downloadsRegistry.unshift(entry);
	if (downloadsRegistry.length > 200) downloadsRegistry.length = 200;

	const anchor = document.createElement("a");
	anchor.href = url;
	anchor.download = entry.filename;
	anchor.rel = "noopener";
	anchor.style.display = "none";
	document.body.appendChild(anchor);
	anchor.click();
	setTimeout(() => anchor.remove(), 0);

	setTimeout(() => {
		entry.state = "complete";
		entry.endTime = Date.now();
	}, 3000);

	return { id, url, filename: entry.filename, state: entry.state };
}

function searchDownloadsRegistry(query = {}) {
	let results = downloadsRegistry;
	if (query.filename) {
		const needle = String(query.filename).toLowerCase();
		results = results.filter((item) => item.filename.toLowerCase().includes(needle));
	}
	if (query.state) results = results.filter((item) => item.state === query.state);
	if (Number.isFinite(query.limit) && query.limit > 0) {
		results = results.slice(0, query.limit);
	}
	return results.map(({ id, url, filename, state, bytesReceived, totalBytes, startTime, endTime, error }) => ({
		id,
		url,
		filename,
		state,
		bytesReceived,
		totalBytes,
		startTime,
		endTime,
		error,
	}));
}

function eraseDownloadsRegistry(query = {}) {
	const before = downloadsRegistry.length;
	for (let index = downloadsRegistry.length - 1; index >= 0; index--) {
		const item = downloadsRegistry[index];
		if (query.id !== undefined && item.id !== query.id) continue;
		if (query.state && item.state !== query.state) continue;
		if (query.url && item.url !== query.url) continue;
		downloadsRegistry.splice(index, 1);
	}
	return before - downloadsRegistry.length;
}

function cancelDownloadRegistry(downloadId) {
	const entry = downloadsRegistry.find((item) => item.id === downloadId);
	if (!entry || entry.state !== "in_progress") return false;
	entry.state = "interrupted";
	entry.error = "USER_CANCELED";
	entry.endTime = Date.now();
	return true;
}

function wireScripts() {
	if (scriptsToggle) {
		scriptsToggle.addEventListener("change", () => {
			setScriptsEnabled(scriptsToggle.checked);
		});
	}
	if (scriptsAddBtn) {
		scriptsAddBtn.addEventListener("click", () => {
			const scripts = getScripts();
			const id = Date.now() + "_" + Math.random().toString(36).slice(2, 6);
			scripts.push({ id, name: "New Script", code: "// your code here", enabled: true });
			saveScripts(scripts);
			renderScriptsList();
			const lastEditor = scriptsList.lastElementChild;
			if (lastEditor) lastEditor.querySelector("input")?.focus();
		});
	}
}

function getSuggestions(q, callback) {
	const localMatches = getLocalOmniboxSuggestions(q);
	fetch(
		"https://en.wikipedia.org/w/api.php?action=opensearch&search=" +
			encodeURIComponent(q) +
			"&limit=4&namespace=0&format=json&origin=*"
	)
		.then((res) => res.json())
		.then((data) => callback([...localMatches, ...(data[1] || [])].slice(0, 6)))
		.catch(() => callback(localMatches));
}

function getLocalOmniboxSuggestions(query) {
	const needle = query.toLowerCase();
	const entries = getHistory();
	const seen = new Set();
	return entries
		.filter((entry) => {
			const title = (entry.title || "").toLowerCase();
			const url = (entry.url || "").toLowerCase();
			return title.includes(needle) || url.includes(needle);
		})
		.filter((entry) => {
			if (seen.has(entry.url)) return false;
			seen.add(entry.url);
			return true;
		})
		.slice(0, 3)
		.map((entry) => entry.url);
}

function initAutocomplete() {
	function renderSuggestions(items) {
		currentSuggestions = items;
		highlightedIndex = -1;
		suggestionsBox.innerHTML = "";

		if (!items.length) {
			suggestionsBox.classList.remove("active");
			return;
		}

		items.forEach((text) => {
			const item = document.createElement("div");
			item.className = "sj-suggestion-item";
			item.setAttribute("role", "option");
			item.textContent = text;
			item.addEventListener("mousedown", (event) => {
				event.preventDefault();
				address.value = text;
				closeSuggestions();
			});
			suggestionsBox.appendChild(item);
		});

		suggestionsBox.classList.add("active");
	}

	function setHighlight(index) {
		const items = suggestionsBox.querySelectorAll(".sj-suggestion-item");
		items.forEach((item) => item.classList.remove("highlighted"));
		if (index >= 0 && index < items.length) {
			items[index].classList.add("highlighted");
			highlightedIndex = index;
		} else {
			highlightedIndex = -1;
		}
	}

	address.addEventListener("input", () => {
		clearTimeout(debounceTimer);
		const q = address.value.trim();
		if (!q || q === NEW_TAB_URL) {
			closeSuggestions();
			return;
		}
		debounceTimer = setTimeout(() => getSuggestions(q, renderSuggestions), 220);
	});

	address.addEventListener("keydown", (event) => {
		if (!suggestionsBox.classList.contains("active")) return;
		const count = currentSuggestions.length;

		if (event.key === "ArrowDown") {
			event.preventDefault();
			setHighlight((highlightedIndex + 1) % count);
		} else if (event.key === "ArrowUp") {
			event.preventDefault();
			setHighlight(highlightedIndex <= 0 ? count - 1 : highlightedIndex - 1);
		} else if (event.key === "Enter" && highlightedIndex >= 0) {
			event.preventDefault();
			address.value = currentSuggestions[highlightedIndex];
			closeSuggestions();
		} else if (event.key === "Escape") {
			closeSuggestions();
		}
	});

	address.addEventListener("blur", () => {
		setTimeout(closeSuggestions, 150);
	});
}

function handleAddressSubmit(value = address.value) {
	const input = value.trim();
	if (!input || input === NEW_TAB_URL) {
		const engineHome = getSearchEngineHomepage(
			searchEngine.value || getDefaultSearchEngine()
		);
		if (engineHome) {
			launchInProxy(engineHome);
			return;
		}
		resetActiveTabToNewTab();
		return;
	}
	const parsedLaunch = parseProxyLaunchInput(input);
	const resolvedUrl = resolveAddressInput(parsedLaunch.url, searchEngine.value);
	launchInProxy(
		parsedLaunch.injectScriptUrl
			? `${resolvedUrl}|${parsedLaunch.injectScriptUrl}`
			: resolvedUrl
	);
}

function focusOmnibox() {
	address.focus();
	address.select();
}

function wireOmniboxSelection() {
	if (!address) return;
	let selectOnRelease = false;

	address.addEventListener("mousedown", () => {
		selectOnRelease = document.activeElement !== address;
	});
	address.addEventListener("mouseup", (event) => {
		if (!selectOnRelease) return;
		selectOnRelease = false;

		if (address.selectionStart !== address.selectionEnd) return;
		event.preventDefault();
		address.select();
	});
	address.addEventListener("focus", () => {

		if (selectOnRelease || !address.value) return;
		address.select();
	});
	address.addEventListener("blur", () => {
		selectOnRelease = false;
	});
}

function createForegroundTab() {
	createTab(true);
	focusOmnibox();
}

function restoreSessionTabs() {
	let payload;
	try {
		payload = JSON.parse(localStorage.getItem(SESSION_STORAGE_KEY) || "null");
	} catch (_) {
		payload = null;
	}

	const savedTabs = (Array.isArray(payload?.tabs) ? payload.tabs : []).filter(
		(savedTab) =>
			!savedTab?.url ||
			savedTab.url === NEW_TAB_URL ||
			!isSelfOriginUrl(savedTab.url)
	);
	if (!savedTabs.length) {
		createTab(true);
		return;
	}

	isRestoringSession = true;
	for (const savedTab of savedTabs.slice(0, 12)) {
		const tab = createTab(false);
		tab.title = savedTab.title || "New Tab";
		tab.url = savedTab.url || NEW_TAB_URL;
		tab.favicon = savedTab.favicon || getFaviconForUrl(tab.url);

		tab.needsLoad = tab.url !== NEW_TAB_URL;
	}

	const activeTab =
		tabs.find((tab) => tab.url === payload.activeUrl) ||
		tabs[0] ||
		createTab(false);
	activeTabId = activeTab.id;
	isRestoringSession = false;
	syncActiveSurface();

	hydrateTab(activeTab);
}

function duplicateActiveTab() {
	const tab = getActiveTab();
	const duplicate = createTab(true);
	if (tab?.url && tab.url !== NEW_TAB_URL) {
		launchInProxy(tab.url, duplicate);
	} else {
		focusOmnibox();
	}
}

function reopenClosedTab() {
	const closed = recentlyClosedTabs.shift();
	if (!closed) return;
	const tab = createTab(true);
	tab.title = closed.title || "New Tab";
	tab.favicon = closed.favicon || getFaviconForUrl(closed.url);
	renderTabs();
	if (closed.url && closed.url !== NEW_TAB_URL) launchInProxy(closed.url, tab);
}

function cycleTab(direction) {
	if (tabs.length <= 1) return;
	const index = tabs.findIndex((tab) => tab.id === activeTabId);
	const nextIndex = (index + direction + tabs.length) % tabs.length;
	switchTab(tabs[nextIndex].id);
}

function handleKeyboardShortcuts(event) {
	const isMod = event.ctrlKey || event.metaKey;
	const key = event.key.toLowerCase();

	if (event.altKey && key === "arrowleft") {
		event.preventDefault();
		event.stopImmediatePropagation();
		navigateFrame("back");
		return;
	}

	if (event.altKey && key === "arrowright") {
		event.preventDefault();
		event.stopImmediatePropagation();
		navigateFrame("forward");
		return;
	}

	if (!isMod) return;

	if (key === "r") {
		event.preventDefault();
		event.stopImmediatePropagation();
		navigateFrame("reload");
		return;
	}

	if (key === "w") {
		event.preventDefault();
		event.stopImmediatePropagation();
		closeTab(activeTabId);
		return;
	}

	if (key === "t") {
		event.preventDefault();
		event.stopImmediatePropagation();

		if (event.shiftKey) reopenClosedTab();
		else createForegroundTab();

		return;
	}

	if (key === "l" || key === "k") {
		event.preventDefault();
		event.stopImmediatePropagation();
		focusOmnibox();
		return;
	}

	if (key === "tab") {
		event.preventDefault();
		event.stopImmediatePropagation();
		cycleTab(event.shiftKey ? -1 : 1);
		return;
	}

	if (key === "enter" && event.shiftKey) {
		event.preventDefault();
		event.stopImmediatePropagation();
		duplicateActiveTab();
		return;
	}
}

window.addEventListener("keydown", handleKeyboardShortcuts, { capture: true });
window.addEventListener("beforeunload", saveSession);
window.addEventListener("online", () => refreshTransportAfterResume());
window.addEventListener("blur", () => {
	window.setTimeout(() => {
		const activeElement = document.activeElement;
		if (
			activeElement?.classList?.contains("sj-frame") ||
			activeElement?.classList?.contains("fullscreen-proxy-frame")
		) {
			setShieldPopupOpen(false);
		}
	}, 0);
});
window.addEventListener("pageshow", (event) => {
	if (event.persisted) refreshTransportAfterResume();
});
document.addEventListener("visibilitychange", () => {
	updateParticlesActivity();

	if (!document.hidden) refreshTransportAfterResume();
});

function initParticles() {
	if (!particlesCanvas || !viewport) return;
	const ctx = particlesCanvas.getContext("2d");
	if (!ctx) return;
	const particles = [];

	let width = 0;
	let height = 0;
	let rafHandle = null;

	function resize() {
		const rect = viewport.getBoundingClientRect();
		width = rect.width;
		height = rect.height;
		particlesCanvas.width = width * window.devicePixelRatio;
		particlesCanvas.height = height * window.devicePixelRatio;
		ctx.setTransform(
			window.devicePixelRatio,
			0,
			0,
			window.devicePixelRatio,
			0,
			0
		);
	}

	class Particle {
		constructor() {
			this.reset();
		}

		reset() {
			this.x = Math.random() * width;
			this.y = Math.random() * height;
			this.size = Math.random() * 2 + 1;
			this.vx = (Math.random() - 0.5) * 0.4;
			this.vy = (Math.random() - 0.5) * 0.4;
			this.alpha = 0.1 + Math.random() * 0.2;
		}

		update() {
			this.x += this.vx;
			this.y += this.vy;
			if (this.x < 0 || this.x > width || this.y < 0 || this.y > height) {
				this.reset();
			}
		}

		draw() {
			ctx.beginPath();
			ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
			ctx.fillStyle = `rgba(255, 255, 255, ${this.alpha})`;
			ctx.fill();
		}
	}

	resize();
	for (let i = 0; i < 50; i++) particles.push(new Particle());

	function animate() {
		ctx.clearRect(0, 0, width, height);
		for (const particle of particles) {
			particle.update();
			particle.draw();
		}
		rafHandle = requestAnimationFrame(animate);
	}

	window.addEventListener("resize", resize);

	particlesController = {
		start() {
			if (rafHandle !== null) return;
			resize();
			rafHandle = requestAnimationFrame(animate);
		},
		stop() {
			if (rafHandle === null) return;
			cancelAnimationFrame(rafHandle);
			rafHandle = null;
			ctx.clearRect(0, 0, width, height);
		},
	};
	updateParticlesActivity();
}

function updateParticlesActivity() {
	if (!particlesController) return;
	const activeTab = getActiveTab();
	const hasFrame = Boolean(getFrameElement(activeTab?.frame)?.isConnected);
	const visible = !document.hidden && !hasFrame && !document.fullscreenElement;
	if (visible) particlesController.start();
	else particlesController.stop();
}

function escapeHtml(value) {
	return String(value)
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll('"', "&quot;")
		.replaceAll("'", "&#039;");
}

function startInstantLaunch() {
	if (instantLaunchPromise) return instantLaunchPromise;

	loadPrivacySettings();
	renderTransportOptions();
	initializeTorDropdown();
	syncAdblockToggle();
	loadProxyToolSettings();
	if (navigator.serviceWorker) {
		navigator.serviceWorker.addEventListener(
			"message",
			handleServiceWorkerMessage
		);
	}
	scheduleWispHealthChecks({ immediate: true, stopOnFirst: true });

	instantLaunchPromise = launchFullscreenProxy(INSTANT_LAUNCH_TARGET).catch(
		(err) => {
			failInstantLaunch(`Pulsar could not start this launch.\n${err}`);
		}
	);
	return instantLaunchPromise;
}

if (INSTANT_LAUNCH_TARGET) startInstantLaunch();

window.addEventListener("load", async () => {
	if (INSTANT_LAUNCH_TARGET) return;

	const tagline = document.getElementById("sj-tagline");
	if (tagline) tagline.textContent = `v${versionInfo.version}`;
	loadPrivacySettings();
	syncGlobalPrivacyControls();

	wispSelectTop.addEventListener("change", () =>
		syncWispSelects(wispSelectTop)
	);
	torSelect?.addEventListener("change", () =>
		setSelectedTorUrl(torSelect.value)
	);
	transportSelect.addEventListener("change", () =>
		syncTransportSelect(transportSelect)
	);
	searchEngine.addEventListener("change", () =>
		syncSearchEngineControls(searchEngine)
	);
	searchEngineSettings.addEventListener("change", () =>
		syncSearchEngineControls(searchEngineSettings)
	);
	settingsButton.addEventListener("click", () => openSettings());
	settingsClose.addEventListener("click", closeSettings);
	settingsPanel.addEventListener("click", (event) => {
		if (event.target === settingsPanel) closeSettings();
	});
	newTabButton.addEventListener("click", createForegroundTab);
	backButton.addEventListener("click", () => navigateFrame("back"));
	forwardButton.addEventListener("click", () => navigateFrame("forward"));
	reloadButton.addEventListener("click", () => navigateFrame("reload"));
	fullscreenButton.addEventListener("click", toggleProxyFullscreen);
	document.addEventListener("fullscreenchange", () => {
		updateFullscreenButton();
		updateParticlesActivity();
	});
	homeAddress.addEventListener("keydown", (event) => {
		if (event.key !== "Enter") return;
		event.preventDefault();
		handleAddressSubmit(homeAddress.value);
	});
	document.getElementById("sj-home-search")?.addEventListener("click", () => {
		handleAddressSubmit(homeAddress.value);
	});
	document.querySelectorAll("[data-url]").forEach((button) => {
		button.addEventListener("click", () => launchInProxy(button.dataset.url));
	});

	syncAdblockToggle();
	loadProxyToolSettings();

	if (popupBlockerToggle) {
		popupBlockerToggle.addEventListener("change", () => {
			popupBlockerEnabled = popupBlockerToggle.checked;
			writeStoredBoolean(POPUP_BLOCKER_STORAGE_KEY, popupBlockerEnabled);
			syncProxyToolSettingsToFrames();
		});
	}
	if (autoClickerToggle) {
		autoClickerToggle.addEventListener("change", () => {
			autoClickerEnabled = autoClickerToggle.checked;
			writeStoredBoolean(AUTOCLICKER_ENABLED_STORAGE_KEY, autoClickerEnabled);
			syncProxyToolSettingsToFrames();
		});
	}
	if (autoClickerDelay) {
		autoClickerDelay.addEventListener("change", () => {
			autoClickerDelayMs = clampAutoClickerDelay(autoClickerDelay.value);
			autoClickerDelay.value = String(autoClickerDelayMs);
			try {
				localStorage.setItem(
					AUTOCLICKER_DELAY_STORAGE_KEY,
					String(autoClickerDelayMs)
				);
			} catch (_) {}
			syncProxyToolSettingsToFrames();
		});
	}
	if (navigator.serviceWorker) {
		navigator.serviceWorker.addEventListener(
			"message",
			handleServiceWorkerMessage
		);
		navigator.serviceWorker.addEventListener("controllerchange", () => {
			postPrivacyConfigToServiceWorker();

			if (!tabs.some((tab) => getFrameElement(tab.frame))) return;
			const activeTab = getActiveTab();
			resetProxyController();
			for (const tab of tabs) {
				if (tab.url !== NEW_TAB_URL) tab.needsLoad = true;
			}
			if (activeTab) hydrateTab(activeTab);
		});
	}

	const stabilizedInit = [
		[restoreSearchEngine, "search engine restore"],
		[renderTransportOptions, "transport options"],
		[initAutocomplete, "autocomplete"],
		[initWispPicker, "the Wisp picker"],
		[initTorPicker, "the Tor picker"],
		[initCustomSelectPickers, "select pickers"],
		[wireBookmarks, "bookmark wiring"],
		[wireScripts, "script wiring"],
		[renderBookmarks, "bookmark list"],
		[renderScriptsList, "script list"],
		[initializeWispDropdowns, "wisp dropdowns"],
		[initializeTorDropdown, "tor dropdown"],
	];
	for (const [step, label] of stabilizedInit) {
		try {
			step();
		} catch (err) {
			console.warn("Pulsar could not run", label, err);
		}
	}

	scheduleWispHealthChecks({ immediate: true });

	restoreSessionTabs();
	postPrivacyConfigToServiceWorker();

	const urlTarget = getUrlQueryTarget();
	if (urlTarget) await launchInProxy(urlTarget);

	if (typeof window.requestIdleCallback === "function") {
		window.requestIdleCallback(() => initParticles(), { timeout: 800 });
	} else {
		setTimeout(() => initParticles(), 800);
	}
});

form.addEventListener("submit", (event) => {
	event.preventDefault();
	handleAddressSubmit();
});
