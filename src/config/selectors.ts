import { Platform } from '@graasp/ui';

export const MAIN_MENU_ID = 'mainMenu';
export const TREE_VIEW_ID = 'treeView';
export const SHARED_ITEMS_ID = 'sharedItems';
export const MY_ITEMS_ID = 'myItems';
export const buildFileId = (id: string): string => `file-${id}`;
export const buildDocumentId = (id: string): string => `document-${id}`;
export const buildAppId = (id: string): string => `app-${id}`;
export const FOLDER_NAME_TITLE_CLASS = `folderNameTitle`;

export const ITEM_CHATBOX_ID = 'chatbox';
export const ITEM_CHATBOX_BUTTON_ID = 'itemChatboxButton';

export const ITEM_PINNED_ID = 'itemPinned';
export const ITEM_PINNED_BUTTON_ID = 'itemPinnedButton';

export const BUILDER_EDIT_BUTTON_ID = 'builderEditButton';

export const PANEL_CLOSE_BUTTON_SELECTOR = '[data-testid="ChevronRightIcon"]';

export const buildFolderButtonId = (id: string): string => `folderButton-${id}`;
export const buildTreeItemClass = (id: string): string => `buildTreeItem-${id}`;
export const buildTreeShortcutItemClass = (id: string): string =>
  `buildTreeShortcutItem-${id}`;

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
export const buildMemberAvatarClass = (id?: string): string =>
  `memberAvatar-${id}`;

export const APP_NAVIGATION_PLATFORM_SWITCH_ID = 'appNavigationPlatformSwitch';
export const APP_NAVIGATION_PLATFORM_SWITCH_BUTTON_IDS = {
  [Platform.Builder]: 'appNavigationPlatformSwitchButtonBuilder',
  [Platform.Player]: 'appNavigationPlatformSwitchButtonPlayer',
  [Platform.Library]: 'appNavigationPlatformSwitchButtonLibrary',
  [Platform.Analytics]: 'appNavigationPlatformSwitchButtonAnalytics',
};
