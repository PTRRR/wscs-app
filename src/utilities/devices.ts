/**
 * Detects if the current device is a mobile device using multiple detection methods:
 * 1. User agent string checking
 * 2. Screen dimension checking
 * 3. Touch points checking
 *
 * @returns {boolean} True if the device is likely a mobile device, false otherwise
 */
const isMobile = (): boolean => {
	// Check if we're in a browser environment
	if (typeof window === 'undefined') {
		return false;
	}

	// User agent check
	const userAgent = window.navigator.userAgent.toLowerCase();
	const mobileKeywords = [
		'android',
		'webos',
		'iphone',
		'ipad',
		'ipod',
		'blackberry',
		'iemobile',
		'opera mini',
		'mobile',
		'tablet'
	];

	const isUserAgentMobile = mobileKeywords.some((keyword) => userAgent.includes(keyword));

	// Screen dimension check
	// Most mobile devices have a width less than 768px
	const isScreenSizeMobile = window.innerWidth <= 768;

	// Touch points check
	// Most mobile devices have more than 0 touch points
	const isTouchDevice = window.navigator.maxTouchPoints > 0;

	// Vendor-specific mobile checks
	const hasVendorMobile = Boolean(
		'ontouchstart' in window || (window.navigator as any).msMaxTouchPoints
	);

	// CSS media query check for mobile devices
	const mediaQuery = window.matchMedia('(hover: none) and (pointer: coarse)');
	const isMediaQueryMobile = mediaQuery.matches;

	// Combined check - device is considered mobile if it meets multiple criteria
	return (
		isUserAgentMobile ||
		(isScreenSizeMobile && (isTouchDevice || hasVendorMobile || isMediaQueryMobile))
	);
};

export default isMobile;
