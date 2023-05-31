import { Fragment, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

import { Alert, Box, Container, Skeleton, Typography } from '@mui/material';

import { Api } from '@graasp/query-client';
import { Context, DEFAULT_LANG, ItemType, PermissionLevel } from '@graasp/sdk';
import {
  AppItemTypeRecord,
  DocumentItemTypeRecord,
  EmbeddedLinkItemTypeRecord,
  EtherpadItemTypeRecord,
  H5PItemTypeRecord,
  ItemRecord,
  LocalFileItemTypeRecord,
  S3FileItemTypeRecord,
} from '@graasp/sdk/frontend';
import { FAILURE_MESSAGES, PLAYER } from '@graasp/translations';
import {
  AppItem,
  Button,
  DocumentItem,
  EtherpadItem,
  FileItem,
  H5PItem,
  ItemSkeleton,
  LinkItem,
  TextEditor,
} from '@graasp/ui';

import { List } from 'immutable';

import {
  DEFAULT_RESIZABLE_SETTING,
  PDF_VIEWER_LINK,
  SCREEN_MAX_HEIGHT,
} from '@/config/constants';
import { API_HOST, H5P_INTEGRATION_URL } from '@/config/env';
import { useMessagesTranslation, usePlayerTranslation } from '@/config/i18n';
import { hooks } from '@/config/queryClient';
import {
  FOLDER_NAME_TITLE_CLASS,
  buildAppId,
  buildDocumentId,
  buildFileId,
  buildFolderButtonId,
} from '@/config/selectors';
import { useCurrentMemberContext } from '@/contexts/CurrentMemberContext';
import { isHidden, paginationContentFilter } from '@/utils/item';

import HiddenWrapper from '../common/HiddenWrapper';
import PinnedFolderItem from './PinnedFolderItem';

const {
  useEtherpad,
  useItem,
  useChildren,
  useFileContentUrl,
  useItemTags,
  useChildrenPaginated,
} = hooks;

type EtherpadContentProps = {
  item: EtherpadItemTypeRecord;
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
  item: S3FileItemTypeRecord | LocalFileItemTypeRecord;
};
const FileContent = ({ item }: FileContentProps) => {
  const { t: translateMessage } = useMessagesTranslation();
  // fetch file content if type is file
  const {
    data: fileUrl,
    isLoading: isFileContentLoading,
    isError: isFileError,
  } = useFileContentUrl(item.id);

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
    />
  );

  return fileItem;
};

const LinkContent = ({
  item,
}: {
  item: EmbeddedLinkItemTypeRecord;
}): JSX.Element => {
  const { data: member } = useCurrentMemberContext();
  const linkItem = (
    <LinkItem
      item={item}
      height={SCREEN_MAX_HEIGHT}
      memberId={member?.id}
      isResizable
      showButton={item.settings?.showLinkButton}
      showIframe={item.settings?.showLinkIframe}
      showCollapse={item.settings?.isCollapsible}
    />
  );

  return linkItem;
};

const DocumentContent = ({
  item,
}: {
  item: DocumentItemTypeRecord;
}): JSX.Element => {
  const documentItem = (
    <DocumentItem
      id={buildDocumentId(item.id)}
      item={item}
      showCollapse={item.settings?.isCollapsible}
    />
  );

  return documentItem;
};

const AppContent = ({ item }: { item: AppItemTypeRecord }): JSX.Element => {
  const {
    data: member,
    isLoading: isLoadingMember,
    isSuccess: isSuccessMember,
  } = useCurrentMemberContext();
  const { t: translateMessage } = useMessagesTranslation();

  if (isLoadingMember) {
    return (
      <Skeleton variant="rectangular" width="100%" height={SCREEN_MAX_HEIGHT} />
    );
  }
  if (isSuccessMember)
    return (
      <AppItem
        frameId={buildAppId(item.id)}
        item={item}
        memberId={member.id}
        requestApiAccessToken={(payload) =>
          Api.requestApiAccessToken(payload, { API_HOST })
        }
        height={SCREEN_MAX_HEIGHT}
        isResizable={item.settings?.isResizable || DEFAULT_RESIZABLE_SETTING}
        contextPayload={{
          apiHost: API_HOST,
          settings: item.settings,
          lang:
            // todo: remove once it is added in ItemSettings type in sdk
            (item.settings?.lang as string | undefined) ||
            member?.extra?.lang ||
            DEFAULT_LANG,
          permission: PermissionLevel.Read,
          context: Context.Player,
          memberId: member?.id,
          itemId: item.id,
        }}
        showCollapse={item.settings?.isCollapsible}
      />
    );
  return (
    <Alert severity="error">
      {translateMessage(FAILURE_MESSAGES.UNEXPECTED_ERROR)}
    </Alert>
  );
};

const H5PContent = ({ item }: { item: H5PItemTypeRecord }): JSX.Element => {
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
      itemName={item.name}
      contentId={contentId}
      integrationUrl={H5P_INTEGRATION_URL}
      showCollapse={item.settings?.isCollapsible}
    />
  );
};

type ItemContentProps = {
  item: ItemRecord;
};

const ItemContent = ({ item }: ItemContentProps) => {
  switch (item.type) {
    case ItemType.FOLDER: {
      const folderButton = (
        <PinnedFolderItem id={buildFolderButtonId(item.id)} item={item} />
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
      return (
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        <Item isChildren id={item.extra?.shortcut?.target} />
      );
    }

    default:
      console.error(`The type ${item?.type} is not defined`);
      return null;
  }
};

const ItemContentWrapper = ({ item }: { item: ItemRecord }) => {
  const { data: itemTags } = useItemTags(item.id);
  const isItemHidden = isHidden(item, itemTags);

  return (
    <HiddenWrapper itemId={item.id} hidden={isItemHidden}>
      <ItemContent item={item} />
    </HiddenWrapper>
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

/**
 *
 * @returns
 */
const Item = ({
  id,
  isChildren = false,
  showPinnedOnly = false,
}: Props): JSX.Element | null => {
  const { ref, inView } = useInView();
  const { t: translatePlayer } = usePlayerTranslation();
  const { t: translateMessage } = useMessagesTranslation();
  const { data: item, isLoading, isError } = useItem(id);

  // fetch children if item is folder
  const isFolder = Boolean(item?.type === ItemType.FOLDER);
  const {
    data: children = List(),
    isLoading: isChildrenLoading,
    isError: isChildrenError,
  } = useChildren(id, {
    enabled: isFolder,
    getUpdates: isFolder,
  });

  const {
    data: childrenPaginated,
    isLoading: isChildrenPaginatedLoading,
    isError: isChildrenPaginatedError,
    refetch: refetchChildrenPaginated,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useChildrenPaginated(id, children, {
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

  if (isLoading || isChildrenLoading || isChildrenPaginatedLoading) {
    return (
      <ItemSkeleton
        itemType={item?.type ?? ItemType.FOLDER}
        isChildren={isChildren}
        screenMaxHeight={SCREEN_MAX_HEIGHT}
      />
    );
  }

  if (isError || !item || isChildrenError || isChildrenPaginatedError) {
    return (
      <Alert severity="error">
        {translateMessage(FAILURE_MESSAGES.UNEXPECTED_ERROR)}
      </Alert>
    );
  }

  if (item.type === ItemType.FOLDER) {
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

    // render each children recursively
    return (
      <>
        {!showPinnedOnly && (
          <>
            <Typography className={FOLDER_NAME_TITLE_CLASS} variant="h5">
              {item.name}
            </Typography>
            <TextEditor value={item.description} />

            {childrenPaginated?.pages.map((page) => (
              <Fragment key={page.pageNumber}>
                {page.data.map((thisItem) => (
                  <Box
                    key={thisItem.id}
                    textAlign="center"
                    marginTop={(theme) => theme.spacing(1)}
                    marginBottom={(theme) => theme.spacing(1)}
                  >
                    <ItemContentWrapper item={thisItem} />
                  </Box>
                ))}
              </Fragment>
            ))}
            {showLoadMoreButton}
          </>
        )}

        {showPinnedOnly &&
          children
            ?.filter((i) => showPinnedOnly === (i.settings?.isPinned || false))
            ?.map((thisItem) => (
              <Container key={thisItem.id}>
                <ItemContentWrapper item={thisItem} />
              </Container>
            ))}
      </>
    );
  }

  // executed when item is a single child that is not a folder
  return <ItemContentWrapper item={item} />;
};

export default Item;
