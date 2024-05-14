import { useParams } from 'react-router';

import { hooks } from '@/config/queryClient';

const { useItem } = hooks;
const usePageTitle = (): string | undefined => {
  const { rootId, itemId } = useParams();
  const { data: root } = useItem(rootId);
  const { data: item } = useItem(itemId);
  if (root && item) {
    if (rootId !== itemId) {
      return `${item.name} | ${root.name}`;
    }
    return item.name;
  }
  return undefined;
};

export default usePageTitle;
