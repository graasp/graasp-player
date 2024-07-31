import { Platform } from '@graasp/ui';

export const MAIN_MENU_ID = 'mainMenu';
export const TREE_VIEW_ID = 'treeView';
export const TREE_FALLBACK_RELOAD_BUTTON_ID = 'treeViewReloadButton';
export const SHOW_MORE_ITEMS_ID = 'showMoreItems';
export const HOME_NAVIGATION_STACK_ID = 'homeNavigation';
export const MY_ITEMS_ID = 'myItems';
export const buildFileId = (id: string): string => `file-${id}`;
export const buildDocumentId = (id: string): string => `document-${id}`;
export const buildAppId = (id: string): string => `app-${id}`;
export const buildLinkItemId = (id: string): string => `link-${id}`;
export const FOLDER_NAME_TITLE_CLASS = `folderNameTitle`;

export const ITEM_LOGIN_USERNAME_INPUT_ID = 'itemLoginInput';
export const ITEM_LOGIN_SIGN_IN_BUTTON_ID = 'itemLoginSignInButton';
export const ITEM_LOGIN_PASSWORD_INPUT_ID = 'itemLoginPasswordInput';

export const ITEM_FULLSCREEN_BUTTON_ID = 'itemFullscreenButton';

export const ITEM_CHATBOX_ID = 'chatbox';
export const ITEM_CHATBOX_BUTTON_ID = 'itemChatboxButton';

export const ITEM_PINNED_ID = 'itemPinned';
export const ITEM_PINNED_BUTTON_ID = 'itemPinnedButton';

export const HIDDEN_WRAPPER_ID_CY = 'hiddenWrapper';
export const buildHiddenWrapperId = (id: string, isHidden: boolean): string =>
  `${HIDDEN_WRAPPER_ID_CY}-${id}-${isHidden ? 'grayed' : 'visible'}`;

export const COLLAPSIBLE_WRAPPER_ID = 'collapsibleWrapper';
export const buildCollapsibleId = (id: string): string =>
  `${COLLAPSIBLE_WRAPPER_ID}-${id}`;

export const BUILDER_EDIT_BUTTON_ID = 'builderEditButton';

export const CHATBOX_DRAWER_ID = 'chatboxDrawer';
export const PANEL_CLOSE_BUTTON_SELECTOR = `#${CHATBOX_DRAWER_ID} [data-testid="ChevronRightIcon"]`;

export const buildFolderButtonId = (id: string): string => `folderButton-${id}`;
export const buildTreeItemClass = (id: string): string => `buildTreeItem-${id}`;
export const buildTreeShortcutItemClass = (id: string): string =>
  `buildTreeShortcutItem-${id}`;

export const buildDataCyWrapper = (dataCy: string): string =>
  `[data-cy="${dataCy}"]`;

export const HEADER_MEMBER_MENU_BUTTON_ID = 'headerMemberMenuButton';
export const HEADER_MEMBER_MENU_SEE_PROFILE_BUTTON_ID =
  'headerMemberMenuSeeProfileButton';
export const HEADER_MEMBER_MENU_SIGN_IN_BUTTON_ID =
  'headerMemberMenuSignInButton';

export const HEADER_MEMBER_MENU_SIGN_OUT_BUTTON_ID =
  'headerMemberMenuSignOutButton';
export const buildMemberMenuItemId = (id: string): string =>
  `memberMenuItem-${id}`;
export const OWN_ITEMS_GRID_ID = 'ownItemsGrid';
export const buildMemberAvatarId = (id?: string): string =>
  `memberAvatar-${id}`;

export const HOME_PAGE_PAGINATION_ID = 'homePagePagination';
export const buildHomePaginationId = (page: number | null): string =>
  `homePagination-${page}`;

export const USER_SWITCH_SIGN_IN_BUTTON_ID = 'userSwitchSignInButton';

export const APP_NAVIGATION_PLATFORM_SWITCH_ID = 'appNavigationPlatformSwitch';
export const APP_NAVIGATION_PLATFORM_SWITCH_BUTTON_IDS = {
  [Platform.Builder]: 'appNavigationPlatformSwitchButtonBuilder',
  [Platform.Player]: 'appNavigationPlatformSwitchButtonPlayer',
  [Platform.Library]: 'appNavigationPlatformSwitchButtonLibrary',
  [Platform.Analytics]: 'appNavigationPlatformSwitchButtonAnalytics',
};

export const NAVIGATION_ISLAND_CY = 'navigationIsland';

export const TREE_NODE_GROUP_CLASS = 'tree-node-group';
export const BACK_TO_SHORTCUT_ID = 'backToButtonShortcut';
export const ITEM_MAP_BUTTON_ID = 'itemMapButton';
