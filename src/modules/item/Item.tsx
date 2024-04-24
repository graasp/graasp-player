import { Fragment, useCallback, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

import {
  Alert,
  Box,
  Container,
  Divider,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';

import { Api } from '@graasp/query-client';
import {
  ActionTriggers,
  AppItemType,
  Context,
  DiscriminatedItem,
  DocumentItemType,
  EtherpadItemType,
  FolderItemType,
  H5PItemType,
  ItemType,
  LinkItemType,
  LocalFileItemType,
  PermissionLevel,
  S3FileItemType,
  ShortcutItemType,
  ThumbnailSize,
  formatDate,
} from '@graasp/sdk';
import { DEFAULT_LANG, FAILURE_MESSAGES } from '@graasp/translations';
import {
  AppItem,
  Button,
  EtherpadItem,
  FileItem,
  H5PItem,
  ItemSkeleton,
  LinkItem,
  TextDisplay,
  Thumbnail,
  withCollapse,
} from '@graasp/ui';
import { DocumentItem } from '@graasp/ui/text-editor';

import {
  DEFAULT_RESIZABLE_SETTING,
  PDF_VIEWER_LINK,
  SCREEN_MAX_HEIGHT,
} from '@/config/constants';
import { API_HOST, H5P_INTEGRATION_URL } from '@/config/env';
import { useMessagesTranslation, usePlayerTranslation } from '@/config/i18n';
import { axios, hooks, mutations } from '@/config/queryClient';
import {
  FOLDER_NAME_TITLE_CLASS,
  buildAppId,
  buildCollapsibleId,
  buildDocumentId,
  buildFileId,
  buildFolderButtonId,
} from '@/config/selectors';
import { useCurrentMemberContext } from '@/contexts/CurrentMemberContext';
import { PLAYER } from '@/langs/constants';
import { isHidden, paginationContentFilter } from '@/utils/item';

import NavigationIsland from '../navigationIsland/NavigationIsland';
import FolderCard from './FolderCard';

const {
  useEtherpad,
  useItem,
  useChildren,
  useFileContentUrl,
  useItemTags,
  useChildrenPaginated,
  useItemThumbnailUrl,
} = hooks;

type EtherpadContentProps = {
  item: EtherpadItemType;
};
const EtherpadContent = ({ item }: EtherpadContentProps) => {
  const { t: translateMessage } = useMessagesTranslation();
  // get etherpad url if type is etherpad
  const etherpadQuery = useEtherpad(item, 'read');

  if (etherpadQuery?.isLoading) {
    return (
      <ItemSkeleton
        itemType={item.type}
        isChildren={false}
        screenMaxHeight={SCREEN_MAX_HEIGHT}
      />
    );
  }

  if (etherpadQuery?.isError) {
    return (
      <Alert severity="error">
        {translateMessage(FAILURE_MESSAGES.UNEXPECTED_ERROR)}
      </Alert>
    );
  }
  if (!etherpadQuery?.data?.padUrl) {
    return (
      <Alert severity="error">
        {translateMessage(FAILURE_MESSAGES.UNEXPECTED_ERROR)}
      </Alert>
    );
  }
  return (
    <EtherpadItem
      itemId={item.id}
      padUrl={etherpadQuery.data.padUrl}
      options={{
        showLineNumbers: false,
        showControls: false,
        showChat: false,
        noColors: true,
      }}
    />
  );
};

type FileContentProps = {
  item: S3FileItemType | LocalFileItemType;
};
const FileContent = ({ item }: FileContentProps) => {
  const { t: translateMessage } = useMessagesTranslation();
  // fetch file content if type is file
  const {
    data: fileUrl,
    isLoading: isFileContentLoading,
    isError: isFileError,
  } = useFileContentUrl(item.id);
  const { mutate: triggerAction } = mutations.usePostItemAction();

  const onDownloadClick = useCallback(() => {
    triggerAction({
      itemId: item.id,
      payload: { type: ActionTriggers.ItemDownload },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item.id]);

  if (isFileContentLoading) {
    return (
      <ItemSkeleton
        itemType={item.type}
        isChildren={false}
        screenMaxHeight={SCREEN_MAX_HEIGHT}
      />
    );
  }
  if (isFileError) {
    return (
      <Alert severity="error">
        {translateMessage(FAILURE_MESSAGES.UNEXPECTED_ERROR)}
      </Alert>
    );
  }
  const fileItem = (
    <FileItem
      id={buildFileId(item.id)}
      item={item}
      fileUrl={fileUrl}
      maxHeight={SCREEN_MAX_HEIGHT}
      showCollapse={item.settings?.isCollapsible}
      pdfViewerLink={PDF_VIEWER_LINK}
      onClick={onDownloadClick}
    />
  );

  return fileItem;
};

const LinkContent = ({ item }: { item: LinkItemType }): JSX.Element => {
  const { data: member } = useCurrentMemberContext();

  const { mutate: triggerAction } = mutations.usePostItemAction();
  const handleLinkClick = () => {
    // trigger player Action for link click
    triggerAction({
      itemId: item.id,
      payload: { type: ActionTriggers.LinkOpen },
    });
  };
  const linkItem = (
    <LinkItem
      item={item}
      height={SCREEN_MAX_HEIGHT}
      memberId={member?.id}
      isResizable
      showButton={item.settings?.showLinkButton}
      showIframe={item.settings?.showLinkIframe}
      showCollapse={item.settings?.isCollapsible}
      onClick={handleLinkClick}
    />
  );

  return linkItem;
};

const DocumentContent = ({ item }: { item: DocumentItemType }): JSX.Element => {
  const documentItem = (
    <DocumentItem
      id={buildDocumentId(item.id)}
      item={item}
      showCollapse={item.settings?.isCollapsible}
    />
  );

  return documentItem;
};

const AppContent = ({ item }: { item: AppItemType }): JSX.Element => {
  const {
    data: member,
    isLoading: isLoadingMember,
    isSuccess: isSuccessMember,
  } = useCurrentMemberContext();
  const { t: translateMessage } = useMessagesTranslation();

  if (member || isSuccessMember)
    return (
      <AppItem
        frameId={buildAppId(item.id)}
        item={item}
        memberId={member?.id}
        requestApiAccessToken={(payload) =>
          Api.requestApiAccessToken(payload, { API_HOST, axios })
        }
        height={SCREEN_MAX_HEIGHT}
        isResizable={item.settings?.isResizable || DEFAULT_RESIZABLE_SETTING}
        contextPayload={{
          apiHost: API_HOST,
          settings: item.settings,
          lang: item.lang || member?.extra?.lang || DEFAULT_LANG,
          permission: PermissionLevel.Read,
          context: Context.Player,
          memberId: member?.id,
          itemId: item.id,
        }}
        showCollapse={item.settings?.isCollapsible}
      />
    );

  if (isLoadingMember) {
    return (
      <Skeleton variant="rectangular" width="100%" height={SCREEN_MAX_HEIGHT} />
    );
  }

  return (
    <Alert severity="error">
      {translateMessage(FAILURE_MESSAGES.UNEXPECTED_ERROR)}
    </Alert>
  );
};

const H5PContent = ({ item }: { item: H5PItemType }): JSX.Element => {
  const { t: translateMessage } = useMessagesTranslation();
  const contentId = item?.extra?.h5p?.contentId;
  if (!contentId) {
    return (
      <Alert severity="error">
        {translateMessage(FAILURE_MESSAGES.UNEXPECTED_ERROR)}
      </Alert>
    );
  }

  return (
    <H5PItem
      itemId={item.id}
      itemName={item.displayName}
      contentId={contentId}
      integrationUrl={H5P_INTEGRATION_URL}
      showCollapse={item.settings?.isCollapsible}
    />
  );
};

const ShortcutContent = ({ item }: { item: ShortcutItemType }): JSX.Element => {
  if (item.settings.isCollapsible) {
    return (
      <span id={buildCollapsibleId(item.id)}>
        {withCollapse({ item })(
          // eslint-disable-next-line @typescript-eslint/no-use-before-define
          <Item isChildren id={item.extra?.shortcut?.target} />,
        )}
      </span>
    );
  }
  return (
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    <Item isChildren id={item.extra?.shortcut?.target} />
  );
};

type ItemContentProps = {
  item: DiscriminatedItem;
};

const ItemContent = ({ item }: ItemContentProps) => {
  switch (item.type) {
    case ItemType.FOLDER: {
      const folderButton = (
        <FolderCard id={buildFolderButtonId(item.id)} item={item} replaceRoot />
      );
      return folderButton;

      // todo: check that the folders are displayed as expected.
      // in case everything is okay, remove the following

      // // display children shortcut pinned folders
      // if (isShortcut && isShortcutPinned) {
      //   return folderButton;
      // }

      // // do not display shortcut folders if they are not pinned
      // if (isShortcut && !isShortcutPinned) {
      //   return null;
      // }

      // // // do not display children folders if they are not pinned
      // // if (!item.settings?.isPinned) {
      // //   return null;
      // // }

      // // only display children folders if they are pinned
      // if (item.settings?.isPinned) {
      //   return folderButton;
      // }
      // break;
    }
    case ItemType.LINK: {
      return <LinkContent item={item} />;
    }
    case ItemType.LOCAL_FILE:
    case ItemType.S3_FILE: {
      return <FileContent item={item} />;
    }
    case ItemType.DOCUMENT: {
      return <DocumentContent item={item} />;
    }
    case ItemType.APP: {
      return <AppContent item={item} />;
    }

    case ItemType.H5P: {
      return <H5PContent item={item} />;
    }

    case ItemType.ETHERPAD: {
      return <EtherpadContent item={item} />;
    }

    case ItemType.SHORTCUT: {
      return <ShortcutContent item={item} />;
    }

    default:
      console.error(`The type of item is not defined`, item);
      return null;
  }
};

const ItemContentWrapper = ({ item }: { item: DiscriminatedItem }) => {
  const { data: itemTags } = useItemTags(item.id);
  const isItemHidden = isHidden(item, itemTags);

  // An item the user has access to can be hidden (write, admin) so we hide it in player
  if (isItemHidden) {
    return null;
  }
  return <ItemContent item={item} />;
};

type FolderContentProps = {
  item: FolderItemType;
  showPinnedOnly?: boolean;
};
const FolderContent = ({
  item,
  showPinnedOnly = false,
}: FolderContentProps) => {
  const { ref, inView } = useInView();
  const { t: translatePlayer, i18n } = usePlayerTranslation();

  // this should be fetched only when the item is a folder
  const { data: children = [], isInitialLoading: isChildrenLoading } =
    useChildren(item.id, undefined, {
      getUpdates: true,
    });
  const { data: thumbnailSrc } = useItemThumbnailUrl({
    id: item.id,
    size: ThumbnailSize.Medium,
  });

  const {
    data: childrenPaginated,
    refetch: refetchChildrenPaginated,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useChildrenPaginated(item.id, children, {
    enabled: Boolean(!showPinnedOnly && children && !isChildrenLoading),
    filterFunction: paginationContentFilter,
  });

  useEffect(() => {
    if (children) {
      refetchChildrenPaginated();
    }

    if (inView) {
      fetchNextPage();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, children]);

  const showLoadMoreButton =
    !hasNextPage || isFetchingNextPage ? null : (
      <Container ref={ref}>
        <Button
          disabled={!hasNextPage || isFetchingNextPage}
          onClick={() => fetchNextPage()}
          fullWidth
        >
          {translatePlayer(PLAYER.LOAD_MORE)}
        </Button>
      </Container>
    );

  if (showPinnedOnly) {
    return children
      ?.filter((i) => showPinnedOnly === (i.settings?.isPinned || false))
      ?.map((thisItem) => (
        <ItemContentWrapper key={thisItem.id} item={thisItem} />
      ));
  }
  // render each children recursively
  return (
    <>
      <Stack
        direction="column"
        pb={7}
        spacing={2}
        maxWidth="1000px"
        margin="auto"
      >
        <Stack direction="column" spacing={2}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Thumbnail
              maxWidth="96px"
              maxHeight="96px"
              url={thumbnailSrc}
              alt={item.displayName}
              sx={{ borderRadius: 5 }}
            />
            <Stack>
              <Typography className={FOLDER_NAME_TITLE_CLASS} variant="h2">
                {item.displayName}
              </Typography>
              <Typography variant="caption">
                {translatePlayer(PLAYER.ITEM_TITLE_CREATED_AT, {
                  date: formatDate(item.createdAt, {
                    locale: i18n.language,
                  }),
                })}
              </Typography>
              <Typography variant="caption">
                {translatePlayer(PLAYER.ITEM_TITLE_UPDATED_AT, {
                  date: formatDate(item.updatedAt, {
                    locale: i18n.language,
                  }),
                })}
              </Typography>
            </Stack>
          </Stack>
          <TextDisplay content={item.description ?? ''} />
        </Stack>
        <Divider flexItem />

        <Stack direction="column" spacing={2}>
          {childrenPaginated?.pages?.map((page) => (
            <Fragment key={page.pageNumber}>
              {page.data.map((thisItem) => (
                <Box key={thisItem.id} textAlign="center" mt={1} mb={1}>
                  <ItemContentWrapper item={thisItem} />
                </Box>
              ))}
            </Fragment>
          ))}
        </Stack>
        {showLoadMoreButton}
      </Stack>
      <NavigationIsland />
    </>
  );
};

type Props = {
  /**
   * Id of the parent item for which the page is displayed
   */
  id?: string;

  isChildren?: boolean;
  showPinnedOnly?: boolean;
};

const Item = ({
  id,
  isChildren = false,
  showPinnedOnly = false,
}: Props): JSX.Element | false => {
  const { t: translateMessage } = useMessagesTranslation();
  const { data: item, isInitialLoading: isLoadingItem, isError } = useItem(id);

  if (item && item.type === ItemType.FOLDER) {
    if (isChildren) {
      return <ItemContentWrapper item={item} />;
    }
    return <FolderContent item={item} showPinnedOnly={showPinnedOnly} />;
  }

  if (isLoadingItem) {
    return (
      <ItemSkeleton
        itemType={item?.type ?? ItemType.FOLDER}
        isChildren={isChildren}
        screenMaxHeight={SCREEN_MAX_HEIGHT}
      />
    );
  }

  if (item) {
    // executed when item is a single child that is not a folder
    return (
      <>
        <ItemContentWrapper item={item} />
        <NavigationIsland />
      </>
    );
  }

  if (isError || !item) {
    return (
      <Alert severity="error">
        {translateMessage(FAILURE_MESSAGES.UNEXPECTED_ERROR)}
      </Alert>
    );
  }
  return false;
};

export default Item;
