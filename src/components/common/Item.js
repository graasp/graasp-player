import PropTypes from 'prop-types';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useInView } from 'react-intersection-observer';

import { Alert, Container, Skeleton, Typography } from '@mui/material';

import { Api } from '@graasp/query-client';
import {
  AppItem,
  Button,
  DocumentItem,
  FileItem,
  H5PItem,
  ItemSkeleton,
  LinkItem,
  TextEditor,
  withCollapse,
} from '@graasp/ui';

import {
  API_HOST,
  DEFAULT_RESIZABLE_SETTING,
  H5P_INTEGRATION_URL,
  PDF_VIEWER_LINK,
  SCREEN_MAX_HEIGHT,
} from '../../config/constants';
import { hooks } from '../../config/queryClient';
import {
  FOLDER_NAME_TITLE_CLASS,
  buildAppId,
  buildDocumentId,
  buildFileId,
  buildFolderButtonId,
} from '../../config/selectors';
import { ITEM_TYPES } from '../../enums';
import { isHidden, paginationContentFilter } from '../../utils/item';
import { CurrentMemberContext } from '../context/CurrentMemberContext';
import FolderButton from './FolderButton';

const {
  useItem,
  useChildren,
  useFileContent,
  useItemTags,
  useChildrenPaginated,
} = hooks;

const Item = ({
  id,
  isChildren,
  showPinnedOnly,
  itemType,
  isCollapsible,
  isShortcut,
  isShortcutPinned,
}) => {
  const { ref, inView } = useInView();
  const { t } = useTranslation();
  const { data: item, isLoading, isError } = useItem(id);
  const { data: itemTags, isLoading: isTagsLoading } = useItemTags(id);
  const { data: member, isLoading: isMemberLoading } =
    useContext(CurrentMemberContext);
  // fetch children if item is folder
  const isFolder = Boolean(item?.type === ITEM_TYPES.FOLDER);
  const {
    data: children,
    isLoading: isChildrenLoading,
    isError: isChildrenError,
  } = useChildren(id, {
    enabled: isFolder,
    getUpdates: isFolder,
  });

  // fetch file content if type is file
  const {
    data: file,
    isLoading: isFileContentLoading,
    isError: isFileError,
  } = useFileContent(id, {
    enabled: Boolean(
      item && [ITEM_TYPES.FILE, ITEM_TYPES.S3_FILE].includes(item.type),
    ),
    replyUrl: true,
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

  React.useEffect(() => {
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
    isFileContentLoading
  ) {
    return (
      <ItemSkeleton
        itemType={itemType}
        isChildren={isChildren}
        isCollapsible={isCollapsible}
        screenMaxHeight={SCREEN_MAX_HEIGHT}
      />
    );
  }

  const isItemHidden = isHidden(itemTags?.toJS());

  if (isItemHidden && isChildren) {
    return null;
  }

  if (isItemHidden) {
    return <Alert severity="error">{t('You cannot access this item')}</Alert>;
  }

  if (
    isError ||
    !item ||
    isFileError ||
    isChildrenError ||
    isChildrenPaginatedError
  ) {
    return <Alert severity="error">{t('An unexpected error occured.')}</Alert>;
  }

  const showCollapse = item.settings?.isCollapsible;

  switch (item.type) {
    case ITEM_TYPES.FOLDER: {
      if (isChildren) {
        const folderButton = (
          <FolderButton id={buildFolderButtonId(id)} item={item} />
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
              {t('Load more')}
            </Button>
          </Container>
        );

      // render each children recursively
      return (
        <Container disableGutters>
          {!showPinnedOnly && (
            <>
              <Typography className={FOLDER_NAME_TITLE_CLASS} variant="h5">
                {item.name}
              </Typography>
              <TextEditor value={item.description} />

              {childrenPaginated.pages.map((page) => (
                <>
                  {page.data.map((thisItem) => (
                    <Container key={thisItem.id} mt={1} mb={1}>
                      <Item
                        isChildren
                        id={thisItem.id}
                        itemType={thisItem.type}
                        isCollapsible={thisItem.settings?.isCollapsible}
                      />
                    </Container>
                  ))}
                </>
              ))}
              {showLoadMoreButton}
            </>
          )}

          {showPinnedOnly && (
            // eslint-disable-next-line react/jsx-no-useless-fragment
            <>
              {children
                ?.filter(
                  (i) => showPinnedOnly === (i.settings?.isPinned || false),
                )
                ?.map((thisItem) => (
                  <Container key={thisItem.id}>
                    <Item
                      isChildren
                      id={thisItem.id}
                      itemType={thisItem.type}
                      isCollapsible={thisItem.settings?.isCollapsible}
                    />
                  </Container>
                ))}
            </>
          )}
        </Container>
      );
    }
    case ITEM_TYPES.LINK: {
      const linkItem = (
        <LinkItem
          item={item}
          height={SCREEN_MAX_HEIGHT}
          member={member}
          isResizable
          // todo: remove default values once player follows ui
          showButton={item.settings?.showLinkButton ?? true}
          showIframe={item.settings?.showLinkIframe ?? false}
        />
      );

      if (showCollapse) {
        return withCollapse({
          item,
        })(linkItem);
      }
      return linkItem;
    }
    case ITEM_TYPES.FILE:
    case ITEM_TYPES.S3_FILE: {
      const fileItem = (
        <FileItem
          id={buildFileId(id)}
          item={item}
          fileUrl={file?.url}
          maxHeight={SCREEN_MAX_HEIGHT}
          showCollapse={showCollapse}
          pdfViewerLink={PDF_VIEWER_LINK}
        />
      );

      if (showCollapse) {
        return withCollapse({
          item,
        })(fileItem);
      }
      return fileItem;
    }
    case ITEM_TYPES.DOCUMENT: {
      const documentItem = (
        <DocumentItem id={buildDocumentId(id)} item={item} readOnly />
      );

      if (showCollapse) {
        return withCollapse({
          item,
        })(documentItem);
      }
      return documentItem;
    }
    case ITEM_TYPES.APP: {
      if (isMemberLoading) {
        return (
          <Skeleton variant="rect" width="100%" height={SCREEN_MAX_HEIGHT} />
        );
      }

      const appItem = (
        <AppItem
          id={buildAppId(id)}
          item={item}
          apiHost={API_HOST} // todo: to change
          member={member}
          permission="read" // todo: use graasp-constants
          requestApiAccessToken={Api.requestApiAccessToken}
          height={SCREEN_MAX_HEIGHT}
          isResizable={item.settings?.isResizable || DEFAULT_RESIZABLE_SETTING}
        />
      );

      if (showCollapse) {
        return withCollapse({
          item,
        })(appItem);
      }
      return appItem;
    }

    case ITEM_TYPES.H5P: {
      const contentId = item.get('extra')?.h5p?.contentId;
      if (!contentId) {
        return (
          <Alert severity="error">{t('An unexpected error occurred.')}</Alert>
        );
      }

      return (
        <H5PItem
          itemId={id}
          contentId={contentId}
          integrationUrl={H5P_INTEGRATION_URL}
        />
      );
    }

    case ITEM_TYPES.SHORTCUT: {
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
        <Alert severity="error">{t('An unexpected error occurred.')}</Alert>
      );
    }

    default:
      console.error(`The type ${item?.type} is not defined`);
      return null;
  }
};

Item.propTypes = {
  id: PropTypes.string.isRequired,
  isChildren: PropTypes.bool,
  showPinnedOnly: PropTypes.bool,
  isShortcut: PropTypes.bool,
  isShortcutPinned: PropTypes.bool,
  itemType: PropTypes.string.isRequired,
  isCollapsible: PropTypes.bool,
};

Item.defaultProps = {
  isChildren: false,
  showPinnedOnly: false,
  isShortcut: false,
  isShortcutPinned: false,
  isCollapsible: false,
};

export default Item;
