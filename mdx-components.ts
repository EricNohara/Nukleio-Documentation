import { useMDXComponents as getThemeComponents } from "nextra-theme-docs";
import { createElement } from "react";

import { titleFont } from "./app/localFonts";

const themeComponents = getThemeComponents();

function withClassName(Component, className) {
  return function MDXComponent({ className: existingClassName, ...props }) {
    return createElement(Component, {
      ...props,
      className: [className, existingClassName].filter(Boolean).join(" "),
    });
  };
}

export function useMDXComponents(components = {}) {
  return {
    ...themeComponents,
    h1: withClassName(themeComponents.h1, titleFont.className),
    ...components,
  };
}
