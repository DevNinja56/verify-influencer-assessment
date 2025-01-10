import { Link, useLocation } from "react-router-dom";

interface propTypes {
  path?: string;
  title: string;
  Icon?: React.ReactElement;
}

const HeaderButton = ({ path, title, Icon }: propTypes) => {
  const { pathname } = useLocation();

  return (
    <Link
      to={path ?? "/"}
      className={`text-sm  font-medium ${
        path === pathname ? "text-white" : "text-grayColor"
      } hover:text-white transition-all duration-300 flex items-center gap-1.5`}
    >
      {Icon && Icon}
      {title}
    </Link>
  );
};

export default HeaderButton;
