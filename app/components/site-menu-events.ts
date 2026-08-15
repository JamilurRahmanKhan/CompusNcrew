/**
 * Lets a page's own trigger (e.g. a hero hamburger button) open the shared
 * SiteNav overlay without prop-drilling or duplicating its nav items. The
 * overlay content itself always lives in SiteNav, so any future change
 * there is picked up automatically by every trigger that dispatches this.
 */
export const SITE_MENU_OPEN_REQUEST_EVENT = "compassncrew:site-menu-open-request";

export function requestSiteMenuOpen() {
  window.dispatchEvent(new Event(SITE_MENU_OPEN_REQUEST_EVENT));
}
