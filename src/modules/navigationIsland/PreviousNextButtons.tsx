import { useNavigate, useParams } from 'react-router-dom';

import { ActionTriggers, DiscriminatedItem, ItemType } from '@graasp/sdk';

import isArray from 'lodash.isarray';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { buildContentPagePath } from '@/config/paths';
import { hooks, mutations } from '@/config/queryClient';

import { NavigationButton } from './CustomButtons';

const usePreviousNextButtons = (): {
  previousButton: JSX.Element | false;
  nextButton: JSX.Element | false;
} => {
  const { rootId, itemId } = useParams();
  const navigate = useNavigate();
  const { mutate: triggerAction } = mutations.usePostItemAction();
  const { data: rootItem } = hooks.useItem(rootId);

  const { data: descendants, isLoading } = hooks.useDescendants({
    // not correct but enabled
    id: rootId ?? '',
    enabled: Boolean(rootId),
  });

  const prevRoot: DiscriminatedItem | null = rootItem || null;
  let prev: DiscriminatedItem | null = null;
  let next: DiscriminatedItem | null = null;

  // if there are no descendants then there is no need to navigate
  if (!isArray(descendants)) {
    return { previousButton: false, nextButton: false };
  }

  if (isLoading) {
    return { previousButton: false, nextButton: false };
  }

  // we only navigate through folders
  const folderHierarchy: DiscriminatedItem[] = descendants.filter(
    ({ type }) => type === ItemType.FOLDER,
  );

  // when focusing on the root item
  if (itemId === rootId && folderHierarchy.length) {
    // there is no previous and the nex in the first item in the hierarchy
    [next] = folderHierarchy;
    // when focusing on the descendants
  } else {
    const idx = folderHierarchy.findIndex(({ id }) => id === itemId);

    // if index is not found, then do not show navigation
    if (idx < 0) {
      return { previousButton: false, nextButton: false };
    }

    // if index is 0, previous is root
    prev = idx === 0 ? prevRoot : folderHierarchy[idx - 1];
    // check if the next element is inside the bounds of folderHierarchy, of not, next will simply stay null
    if (idx + 1 < folderHierarchy.length) {
      next = folderHierarchy[idx + 1];
    }
  }

  const handleClickNavigationButton = (newItemId: string) => {
    triggerAction({
      itemId: newItemId,
      payload: { type: ActionTriggers.ItemView },
    });
    navigate(buildContentPagePath({ rootId, itemId: newItemId }));
  };

  // should we display both buttons if they are disabled ?
  if (!prev && !next) {
    return { previousButton: false, nextButton: false };
  }

  return {
    previousButton: (
      <NavigationButton
        disabled={!prev}
        key="previousButton"
        // variant="outlined"
        onClick={() => {
          if (prev?.id) {
            handleClickNavigationButton(prev.id);
          }
        }}
      >
        <ChevronLeft />
      </NavigationButton>
    ),

    nextButton: (
      <NavigationButton
        disabled={!next}
        key="nextButton"
        // variant="contained"
        // endIcon={<ArrowForwardIcon />}
        // sx={{ textTransform: 'unset' }}
        onClick={() => {
          if (next?.id) {
            handleClickNavigationButton(next.id);
          }
        }}
      >
        <ChevronRight />
      </NavigationButton>
    ),
  };
};
export default usePreviousNextButtons;
