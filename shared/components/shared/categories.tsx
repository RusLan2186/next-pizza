"use client";

import { cn } from "@/shared/lib/utils";
import { useCategoryStore } from "@/shared/store/category";
import { Category } from "@prisma/client";
import React from "react";

interface Props {
  className?: string;
  categories?: Category[];
}

/*************  ✨ Windsurf Command 🌟  *************/

export const Categories: React.FC<Props> = ({ categories, className }) => {
  const categoryAcriveId = useCategoryStore((state) => state.activeId);
  const setActiveCategoryId = useCategoryStore((state) => state.setActiveId);

  const categoryRefs = React.useRef<Record<number, HTMLButtonElement | null>>(
    {},
  );

  React.useEffect(() => {
    if (!categoryAcriveId) {
      return;
    }

    const activeElement = categoryRefs.current[categoryAcriveId];
    if (!activeElement) {
      return;
    }

    activeElement.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }, [categoryAcriveId]);

  const getStickyOffset = React.useCallback(() => {
    const topBar = document.querySelector<HTMLElement>("[data-top-bar]");
    const topBarHeight = topBar?.offsetHeight ?? 0;

    return topBarHeight + 16;
  }, []);

  const scrollToCategory = React.useCallback(
    (categoryId: number) => {
      const section = document.querySelector<HTMLElement>(
        `[data-category-id=\"${categoryId}\"]`,
      );

      if (!section) {
        return;
      }

      const top =
        window.scrollY +
        section.getBoundingClientRect().top -
        getStickyOffset();

      window.scrollTo({ top, behavior: "smooth" });
    },
    [getStickyOffset],
  );

  React.useEffect(() => {
    if (!categories?.length) {
      return;
    }

    const currentIdExists = categories.some(
      (cat) => cat.id === categoryAcriveId,
    );
    if (!currentIdExists) {
      setActiveCategoryId(categories[0].id);
    }
  }, [categories, categoryAcriveId, setActiveCategoryId]);

  React.useEffect(() => {
    if (!categories?.length) {
      return;
    }

    const getSections = () =>
      categories
        .map((cat) =>
          document.querySelector<HTMLElement>(
            `[data-category-id=\"${cat.id}\"]`,
          ),
        )
        .filter(Boolean) as HTMLElement[];

    let rafId = 0;

    const updateActiveCategory = () => {
      const sections = getSections();
      if (!sections.length) {
        return;
      }

      const offsetTop = getStickyOffset();
      const viewportTop = window.scrollY + offsetTop;
      const nearBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 4;

      if (nearBottom) {
        const lastId = Number(sections[sections.length - 1].dataset.categoryId);
        if (Number.isFinite(lastId)) {
          setActiveCategoryId(lastId);
        }
        return;
      }

      let nextActiveId = Number(sections[0].dataset.categoryId);

      for (const section of sections) {
        const id = Number(section.dataset.categoryId);
        if (!Number.isFinite(id)) {
          continue;
        }

        const sectionTop =
          window.scrollY + section.getBoundingClientRect().top - offsetTop;

        if (viewportTop >= sectionTop) {
          nextActiveId = id;
        } else {
          break;
        }
      }

      setActiveCategoryId(nextActiveId);
    };

    const onScrollOrResize = () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
      }

      rafId = requestAnimationFrame(updateActiveCategory);
    };

    updateActiveCategory();

    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize);

    return () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
      }

      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
    };
  }, [categories, getStickyOffset, setActiveCategoryId]);

  return (
    <div
      className={cn(
        "categories-scroll flex gap-2 bg-gray-50 px-1 pt-1 pb-2 rounded-2xl overflow-x-auto",
        className,
      )}
    >
      {categories?.map((cat) => (
        <button
          ref={(el) => {
            categoryRefs.current[cat.id] = el;
          }}
          onClick={() => {
            setActiveCategoryId(cat.id);
            scrollToCategory(cat.id);
          }}
          type="button"
          className={cn(
            "flex items-center font-bold h-11 rounded-2xl px-3 whitespace-nowrap",
            cat.id === categoryAcriveId &&
              "bg-white shadow-md shadow-grey-200 text-primary",
          )}
          key={cat.id}
        >
          {cat.categoryName}
        </button>
      ))}
    </div>
  );
};
