import { Link } from "@/i18n/navigation";

interface BreadcrumbProps {
  pageTitle: string;
}

const PageBreadcrumb: React.FC<BreadcrumbProps> = ({ pageTitle }) => {
  return (
    <div className="mb-6 flex flex-col gap-2">
      <nav>
        <ol className="flex items-center gap-1.5 text-theme-xs text-gray-400">
          <li>
            <Link className="transition-colors hover:text-ink dark:hover:text-white" href="/">
              Home
            </Link>
          </li>
          <li aria-hidden className="text-gray-300 dark:text-gray-600">/</li>
          <li className="text-gray-600 dark:text-gray-300">{pageTitle}</li>
        </ol>
      </nav>
      <h2 className="text-title-sm font-medium tracking-tight text-ink dark:text-white">
        {pageTitle}
      </h2>
    </div>
  );
};

export default PageBreadcrumb;
