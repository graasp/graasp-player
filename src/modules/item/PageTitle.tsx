import { Helmet } from 'react-helmet';

type TitlePageProps = {
  titlePage: {
    rootId?: string;
    root?: { name: string };
    item: { id: string; name: string };
  };
};
const PageTitle = ({ titlePage }: TitlePageProps): JSX.Element => {
  const { rootId, root, item } = titlePage;

  let title = item.name;

  if (rootId !== item.id) {
    title = `${item.name} | ${root?.name}`;
  }

  return (
    <Helmet>
      <title>{title}</title>
    </Helmet>
  );
};

export default PageTitle;
