import { Fragment, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

import { Alert, Box, Container, Skeleton, Typography } from '@mui/material';

import { Api } from '@graasp/query-client';
import { Context, DEFAULT_LANG, ItemType, PermissionLevel } from '@graasp/sdk';
import {
  EtherpadItemTypeRecord,
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

import PinnedFolderItem from './PinnedFolderItem';

const {
  useEtherpad,
  useItem,
  useChildren,
  useFileContentUrl,
  useItemTags,
  useChildrenPaginated,
} = hooks;

type Props = {
  id?: string;
  isChildren?: boolean;
  showPinnedOnly?: boolean;
  isShortcut?: boolean;
  isShortcutPinned?: boolean;
};

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
    data: file,
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
      fileUrl={file?.url}
      maxHeight={SCREEN_MAX_HEIGHT}
      showCollapse={item.settings?.isCollapsible}
      pdfViewerLink={PDF_VIEWER_LINK}
    />
  );

  return fileItem;
};

const Item = ({
  id = '',
  isChildren = false,
  showPinnedOnly = false,
  isShortcut = false,
  isShortcutPinned = false,
}: Props): JSX.Element | null => {
  const { ref, inView } = useInView();
  const { t: translatePlayer } = usePlayerTranslation();
  const { t: translateMessage } = useMessagesTranslation();
  const { data: item, isLoading, isError } = useItem(id);
  const { data: itemTags, isLoading: isTagsLoading } = useItemTags(id);
  const {
    data: member,
    isLoading: isLoadingMember,
    isError: isErrorMember,
    isSuccess: isSuccessMember,
  } = useCurrentMemberContext();
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

  if (
    isLoading ||
    isTagsLoading ||
    isChildrenLoading ||
    isChildrenPaginatedLoading ||
    isLoadingMember
  ) {
    return (
      <ItemSkeleton
        itemType={item?.type ?? ItemType.FOLDER}
        isChildren={isChildren}
        screenMaxHeight={SCREEN_MAX_HEIGHT}
      />
    );
  }

  const isItemHidden = isHidden(itemTags);

  if (isItemHidden && isChildren) {
    return null;
  }

  if (isItemHidden) {
    return (
      <Alert severity="error">
        {translatePlayer('You cannot access this item')}
      </Alert>
    );
  }

  if (
    isError ||
    !item ||
    isChildrenError ||
    isChildrenPaginatedError ||
    isErrorMember
  ) {
    return (
      <Alert severity="error">
        {translateMessage(FAILURE_MESSAGES.UNEXPECTED_ERROR)}
      </Alert>
    );
  }

  const showCollapse = item.settings?.isCollapsible;

  switch (item.type) {
    case ItemType.FOLDER: {
      if (isChildren) {
        const folderButton = (
          <PinnedFolderItem id={buildFolderButtonId(id)} item={item} />
        );

        // display children shortcut pinned folders
        if (isShortcut && isShortcutPinned) {
          return folderButton;
        }

        // do not display shortcut folders if they are not pinned
        if (isShortcut && !isShortcutPinned) {
          return null;
        }

        // do not display children folders if they are not pinned
        if (!item.settings?.isPinned) {
          return null;
        }

        // only display children folders if they are pinned
        if (item.settings?.isPinned) {
          return folderButton;
        }
      }

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
                      <Item isChildren id={thisItem.id} />
                    </Box>
                  ))}
                </Fragment>
              ))}
              {showLoadMoreButton}
            </>
          )}

          {showPinnedOnly &&
            children
              ?.filter(
                (i) => showPinnedOnly === (i.settings?.isPinned || false),
              )
              ?.map((thisItem) => (
                <Container key={thisItem.id}>
                  <Item isChildren id={thisItem.id} />
                </Container>
              ))}
        </>
      );
    }
    case ItemType.LINK: {
      const linkItem = (
        <LinkItem
          item={item}
          height={SCREEN_MAX_HEIGHT}
          memberId={member?.id}
          isResizable
          showButton={item.settings?.showLinkButton}
          showIframe={item.settings?.showLinkIframe}
          showCollapse={showCollapse}
        />
      );

      return linkItem;
    }
    case ItemType.LOCAL_FILE:
    case ItemType.S3_FILE: {
      return <FileContent item={item} />;
    }
    case ItemType.DOCUMENT: {
      const documentItem = (
        <DocumentItem
          id={buildDocumentId(id)}
          item={item}
          showCollapse={showCollapse}
        />
      );

      return documentItem;
    }
    case ItemType.APP: {
      if (isLoadingMember) {
        return (
          <Skeleton
            variant="rectangular"
            width="100%"
            height={SCREEN_MAX_HEIGHT}
          />
        );
      }
      if (isSuccessMember)
        return (
          <AppItem
            frameId={buildAppId(id)}
            item={item}
            memberId={member.id}
            requestApiAccessToken={(payload) =>
              Api.requestApiAccessToken(payload, { API_HOST })
            }
            height={SCREEN_MAX_HEIGHT}
            isResizable={
              item.settings?.isResizable || DEFAULT_RESIZABLE_SETTING
            }
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
            showCollapse={showCollapse}
          />
        );
      return (
        <Alert severity="error">
          {translateMessage(FAILURE_MESSAGES.UNEXPECTED_ERROR)}
        </Alert>
      );
    }

    case ItemType.H5P: {
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
          itemId={id}
          itemName={item.name}
          contentId={contentId}
          integrationUrl={H5P_INTEGRATION_URL}
          showCollapse={showCollapse}
        />
      );
    }

    case ItemType.ETHERPAD: {
      return <EtherpadContent item={item} />;
    }

    case ItemType.SHORTCUT: {
      if (item.extra?.shortcut?.target) {
        return (
          <Item
            isChildren
            isShortcut
            id={item.extra?.shortcut?.target}
            isShortcutPinned={item.settings?.isPinned}
          />
        );
      }
      return (
        <Alert severity="error">
          {translateMessage(FAILURE_MESSAGES.UNEXPECTED_ERROR)}
        </Alert>
      );
    }

    default:
      console.error(`The type ${item?.type} is not defined`);
      return null;
  }
};

export default Item;
