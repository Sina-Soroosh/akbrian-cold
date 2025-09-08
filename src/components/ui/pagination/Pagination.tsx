import { ArrowLeft2, ArrowRight2 } from "iconsax-react";

interface Props {
  activePage: number;
  numberOfPages: number;
  onChangePage?: (page: number) => void;
}

const activeShowArray = (activePage: number, numberOfPages: number) => {
  // The number of screen display before and after the active page
  let afterActive = 2;
  let beforeActive = 2;
  const pages: number[] = [];

  // The number of blank page before the active page
  const spaceForShowTwoNumberBefore = activePage - 1 - beforeActive;

  // If the space was less than the amount of designation, we will add a little afterwards
  if (spaceForShowTwoNumberBefore < 0) {
    beforeActive += spaceForShowTwoNumberBefore;
    afterActive -= spaceForShowTwoNumberBefore;
  }

  // The number of blank page after the active page
  const spaceForShowTwoNumberAfter = numberOfPages - (afterActive + activePage);

  // If there is not enough page after the active page, we will subtract from it
  if (spaceForShowTwoNumberAfter < 0) {
    afterActive += spaceForShowTwoNumberAfter;
  }

  for (let index = 0; index < beforeActive; index++) {
    pages.push(activePage - (index + 1));
  }

  pages.reverse();

  pages.push(activePage);

  for (let index = 0; index < afterActive; index++) {
    pages.push(activePage + (index + 1));
  }

  return pages;
};

function Pagination({ numberOfPages, activePage, onChangePage }: Props) {
  const pagesNearActivePages = activeShowArray(activePage, numberOfPages);

  const changePage = (page: number) => {
    if (onChangePage) onChangePage(page);
  };

  return (
    <>
      <div className="flex gap-[30px] justify-center max-w-screen overflow-auto">
        {activePage !== numberOfPages ? (
          <button onClick={() => changePage(activePage + 1)}>
            <ArrowRight2
              className="w-8 h-8 stroke-blue01 hover:stroke-primary transition-colors"
              variant="Broken"
            />
          </button>
        ) : null}

        <div className="flex gap-2 flex-row-reverse">
          {pagesNearActivePages[0] !== 1 ? (
            <>
              <button
                className={`w-[26px] h-[26px] flex justify-center items-center rounded-sm text-gray10 body1 cursor-pointer bg-blue02`}
                onClick={() => changePage(1)}
              >
                1
              </button>
              <span className="body2 text-gray10">...</span>
            </>
          ) : null}

          {pagesNearActivePages.map((pageNumber) => (
            <button
              key={pageNumber}
              className={`w-[26px] h-[26px] flex justify-center items-center rounded cursor-pointer ${
                activePage === pageNumber
                  ? "bg-dark-primary01 text-blue02 bg-blue01"
                  : "text-gray10 bg-blue02"
              } body1 `}
              onClick={() => changePage(pageNumber)}
            >
              {pageNumber}
            </button>
          ))}

          {pagesNearActivePages[pagesNearActivePages.length - 1] !==
          numberOfPages ? (
            <>
              <span className="body2 text-gray10">...</span>
              <button
                className={`w-[26px] h-[26px] flex justify-center items-center rounded-sm text-gray10 body1 cursor-pointer bg-blue02`}
                onClick={() => changePage(numberOfPages)}
              >
                {numberOfPages}
              </button>
            </>
          ) : null}
        </div>

        {activePage !== 1 ? (
          <button onClick={() => changePage(activePage - 1)}>
            <ArrowLeft2
              className="w-8 h-8 stroke-blue01 hover:stroke-primary transition-colors"
              variant="Broken"
            />
          </button>
        ) : null}
      </div>
    </>
  );
}

export default Pagination;
