import { Fragment, useCallback, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useInView } from 'react-intersection-observer';
import { useParams, useSearchParams } from 'react-router-dom';

import { Alert, Box, Container, Divider, Skeleton, Stack } from '@mui/material';

import { Api } from '@graasp/query-client';
import {
  AccountType,
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
  PackedItem,
  PermissionLevel,
  S3FileItemType,
  ShortcutItemType,
  ThumbnailSize,
} from '@graasp/sdk';
import { DEFAULT_LANG, FAILURE_MESSAGES } from '@graasp/translations';
import {
  AppItem,
  Button,
  EtherpadItem,
  FileItem,
  FolderCard,
  H5PItem,
  ItemSkeleton,
  LinkItem,
  TextDisplay,
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
import { buildContentPagePath } from '@/config/paths';
import { axios, hooks, mutations } from '@/config/queryClient';
import {
  buildAppId,
  buildCollapsibleId,
  buildDocumentId,
  buildFileId,
  buildFolderButtonId,
  buildLinkItemId,
} from '@/config/selectors';
import { useCurrentMemberContext } from '@/contexts/CurrentMemberContext';
import { PLAYER } from '@/langs/constants';
import { paginationContentFilter } from '@/utils/item';

import NavigationIsland from '../navigationIsland/NavigationIsland';
import FromShortcutButton from './FromShortcutButton';
import SectionHeader from './SectionHeader';
import usePageTitle from './usePageTitle';

const {
  useEtherpad,
  useItem,
  useChildren,
  useFileContentUrl,
  useChildrenPaginated,
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
      style={{ height: '80vh' }}
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

  const onCollapse = (c: boolean) => {
    triggerAction({
      itemId: item.id,
      payload: {
        type: c ? ActionTriggers.CollapseItem : ActionTriggers.UnCollapseItem,
      },
    });
  };

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

  return (
    <FileItem
      id={buildFileId(item.id)}
      item={item}
      fileUrl={fileUrl}
      maxHeight={SCREEN_MAX_HEIGHT}
      showCollapse={item.settings?.isCollapsible}
      pdfViewerLink={PDF_VIEWER_LINK}
      onClick={onDownloadClick}
      onCollapse={onCollapse}
    />
  );
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

  const onCollapse = (c: boolean) => {
    triggerAction({
      itemId: item.id,
      payload: {
        type: c ? ActionTriggers.CollapseItem : ActionTriggers.UnCollapseItem,
      },
    });
  };

  return (
    <Box id={buildLinkItemId(item.id)}>
      <LinkItem
        id={item.id}
        item={item}
        height={SCREEN_MAX_HEIGHT}
        memberId={member?.id}
        isResizable
        showButton={item.settings?.showLinkButton}
        showIframe={item.settings?.showLinkIframe}
        showCollapse={item.settings?.isCollapsible}
        onClick={handleLinkClick}
        onCollapse={onCollapse}
      />
    </Box>
  );
};

const DocumentContent = ({ item }: { item: DocumentItemType }): JSX.Element => {
  const { mutate: triggerAction } = mutations.usePostItemAction();

  const onCollapse = (c: boolean) => {
    triggerAction({
      itemId: item.id,
      payload: {
        type: c ? ActionTriggers.CollapseItem : ActionTriggers.UnCollapseItem,
      },
    });
  };
  return (
    <DocumentItem
      id={buildDocumentId(item.id)}
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      showTitle={item.settings?.showTitle}
      item={{ ...item, name: item.displayName }}
      showCollapse={item.settings?.isCollapsible}
      onCollapse={onCollapse}
    />
  );
};

const AppContent = ({ item }: { item: AppItemType }): JSX.Element => {
  const {
    data: member,
    isLoading: isLoadingMember,
    isSuccess: isSuccessMember,
  } = useCurrentMemberContext();
  const { t: translateMessage } = useMessagesTranslation();
  const { mutate: triggerAction } = mutations.usePostItemAction();

  const onCollapse = (c: boolean) => {
    triggerAction({
      itemId: item.id,
      payload: {
        type: c ? ActionTriggers.CollapseItem : ActionTriggers.UnCollapseItem,
      },
    });
  };
  if (member || isSuccessMember) {
    const memberLang =
      member && member?.type === AccountType.Individual
        ? member.extra?.lang
        : DEFAULT_LANG;

    return (
      <AppItem
        frameId={buildAppId(item.id)}
        item={item}
        memberId={member?.id}
        requestApiAccessToken={(payload) =>
          Api.requestApiAccessToken(payload, { API_HOST, axios })
        }
        isResizable={item.settings?.isResizable || DEFAULT_RESIZABLE_SETTING}
        contextPayload={{
          apiHost: API_HOST,
          settings: item.settings,
          lang: item.lang ?? memberLang,
          permission: PermissionLevel.Read,
          context: Context.Player,
          accountId: member?.id,
          itemId: item.id,
        }}
        showCollapse={item.settings?.isCollapsible}
        onCollapse={onCollapse}
      />
    );
  }

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
  const { mutate: triggerAction } = mutations.usePostItemAction();

  const contentId = item?.extra?.h5p?.contentId;
  if (!contentId) {
    return (
      <Alert severity="error">
        {translateMessage(FAILURE_MESSAGES.UNEXPECTED_ERROR)}
      </Alert>
    );
  }
  const onCollapse = (c: boolean) => {
    triggerAction({
      itemId: item.id,
      payload: {
        type: c ? ActionTriggers.CollapseItem : ActionTriggers.UnCollapseItem,
      },
    });
  };

  return (
    <H5PItem
      itemId={item.id}
      itemName={item.displayName}
      contentId={contentId}
      integrationUrl={H5P_INTEGRATION_URL}
      showCollapse={item.settings?.isCollapsible}
      onCollapse={onCollapse}
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

const FolderButtonContent = ({ item }: { item: FolderItemType }) => {
  const [searchParams] = useSearchParams();
  const { itemId } = useParams();
  const { data: currentDisplayedItem } = useItem(itemId);
  const { data: thumbnail } = hooks.useItemThumbnailUrl({
    id: item.id,
    size: ThumbnailSize.Medium,
  });

  const newSearchParams = new URLSearchParams(searchParams.toString());
  newSearchParams.set('from', window.location.pathname);
  if (currentDisplayedItem) {
    newSearchParams.set('fromName', currentDisplayedItem.name);
  }
  return (
    <FolderCard
      id={buildFolderButtonId(item.id)}
      name={item.name}
      thumbnail={thumbnail}
      description={
        // to not display the default empty description we check it here
        item.description && item.description !== '<p><br></p>' ? (
          <TextDisplay content={item.description ?? ''} />
        ) : undefined
      }
      to={{
        pathname: buildContentPagePath({ rootId: item.id, itemId: item.id }),
        search: newSearchParams.toString(),
      }}
    />
  );
};

type ItemContentProps = {
  item: DiscriminatedItem;
};

const ItemContent = ({ item }: ItemContentProps) => {
  switch (item.type) {
    case ItemType.FOLDER: {
      return <FolderButtonContent item={item} />;
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

export const ItemContentWrapper = ({
  item,
}: {
  item: PackedItem;
}): JSX.Element | null => {
  // An item the user has access to can be hidden (write, admin) so we hide it in player
  if (item.hidden) {
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
  const { t: translatePlayer } = usePlayerTranslation();

  // this should be fetched only when the item is a folder
  const { data: children = [], isInitialLoading: isChildrenLoading } =
    useChildren(item.id, undefined, {
      getUpdates: true,
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
      <Container maxWidth="lg">
        <Stack direction="column" pb={7} spacing={2} margin="auto">
          <SectionHeader item={item} />
          <Divider flexItem />

          <Stack direction="column" gap={4}>
            {childrenPaginated?.pages?.map((page) => (
              <Fragment key={page.pageNumber}>
                {page.data.map((thisItem) => (
                  <ItemContentWrapper key={thisItem.id} item={thisItem} />
                ))}
              </Fragment>
            ))}
          </Stack>
          {showLoadMoreButton}
        </Stack>
      </Container>
      <FromShortcutButton />
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
  const title = usePageTitle();
  if (item && item.type === ItemType.FOLDER) {
    if (isChildren) {
      return <ItemContentWrapper item={item} />;
    }

    return (
      <>
        <Helmet>
          <title>{title}</title>
        </Helmet>
        <FolderContent item={item} showPinnedOnly={showPinnedOnly} />
      </>
    );
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
        {
          // only render the island when the item is not a children
          isChildren ? false : <NavigationIsland />
        }
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
