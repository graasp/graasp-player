import PropTypes from 'prop-types';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';

import { Container, Typography, makeStyles } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';

import { Api } from '@graasp/query-client';
import {
  AppItem,
  DocumentItem,
  FileItem,
  H5PItem,
  LinkItem,
  Loader,
  TextEditor,
  withCollapse,
} from '@graasp/ui';

import {
  API_HOST,
  H5P_INTEGRATION_URL,
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
import { isHidden } from '../../utils/item';
import { CurrentMemberContext } from '../context/CurrentMemberContext';
import FolderButton from './FolderButton';

const { useItem, useChildren, useFileContent, useItemTags } = hooks;

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
}));

const Item = ({ id, isChildren, showPinnedOnly }) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const { data: item, isLoading, isError } = useItem(id);
  const { data: itemTags, isLoading: isTagsLoading } = useItemTags(id);
  const { data: member, isLoading: isMemberLoading } =
    useContext(CurrentMemberContext);
  // fetch children if item is folder
  const isFolder = Boolean(item?.type === ITEM_TYPES.FOLDER);
  const { data: children, isLoading: isChildrenLoading } = useChildren(id, {
    enabled: isFolder,
    getUpdates: isFolder,
  });

  // fetch file content if type is file
  const { data: content, isError: isFileError } = useFileContent(id, {
    enabled: Boolean(
      item && [ITEM_TYPES.FILE, ITEM_TYPES.S3_FILE].includes(item.type),
    ),
  });

  if (isLoading || isTagsLoading || isChildrenLoading) {
    return <Loader />;
  }

  const isItemHidden = isHidden(itemTags?.toJS());

  if (isItemHidden && isChildren) {
    return null;
  }

  if (isItemHidden) {
    return <Alert severity="error">{t('You cannnot access this item')}</Alert>;
  }

  if (isError || !item || isFileError) {
    return <Alert severity="error">{t('An unexpected error occured.')}</Alert>;
  }

  const showCollapse = item.settings?.isCollapsible;

  switch (item.type) {
    case ITEM_TYPES.FOLDER: {
      // do not display children folders if they are not pinned
      if (!item.settings?.isPinned && isChildren) {
        return null;
      }

      // only display children folders if they are pinned
      if (item.settings?.isPinned && isChildren) {
        return <FolderButton id={buildFolderButtonId(id)} item={item} />;
      }

      // render each children recursively
      return (
        <Container>
          {!showPinnedOnly && (
            <>
              <Typography className={FOLDER_NAME_TITLE_CLASS} variant="h5">
                {item.name}
              </Typography>
              <TextEditor value={item.description} />
            </>
          )}

          {children
            .filter((i) => showPinnedOnly === (i.settings?.isPinned || false))
            .map((thisItem) => (
              <Container key={thisItem.id} className={classes.container}>
                <Item isChildren id={thisItem.id} />
              </Container>
            ))}
        </Container>
      );
    }
    case ITEM_TYPES.LINK: {
      const linkItem = (
        <LinkItem item={item} height={SCREEN_MAX_HEIGHT} isResizable />
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
          content={content}
          maxHeight={SCREEN_MAX_HEIGHT}
          showCollapse={showCollapse}
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
        return <Loader />;
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
          isResizable
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
          <Alert severity="error">{t('An unexpected error occured.')}</Alert>
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

    default:
      console.error(`The type ${item?.type} is not defined`);
      return null;
  }
};

Item.propTypes = {
  id: PropTypes.string.isRequired,
  isChildren: PropTypes.bool,
  showPinnedOnly: PropTypes.bool,
};

Item.defaultProps = {
  isChildren: false,
  showPinnedOnly: false,
};

export default Item;
