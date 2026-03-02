import React from "react";
import styles from "./base.module.scss";
import { TypeMediaInputValue } from "../EditorComponent";

export let iconLibraries: Record<string, React.ComponentType<any>>[] = [];

export function registerIconLibrary(lib: Record<string, React.ComponentType<any>>) {
  iconLibraries.push(lib);
}

export type TypeContentView = "monochrome" | "colorful";
export type TypeContentAlignment = "left" | "center";
export type TypeSubtitle = "line" | "badge" | "none";
export type TypeButton =
  | "Primary"
  | "Secondary"
  | "Tertiary"
  | "Link"
  | "White"
  | "Black"
  | "Bare";

export namespace Base {
  const rootStyles =
    typeof window !== "undefined"
      ? getComputedStyle(document.documentElement)
      : { getPropertyValue: () => "" };

  function getStyleValue(cssVariable: string) {
    return rootStyles.getPropertyValue(cssVariable).trim();
  }

  function setStyleValue(property: string, value: string) {
    const rootStyle = document.documentElement.style;
    return rootStyle.setProperty(property, value);
  }

  export function getSectionSubTitleType() {
    return getStyleValue("--composer-subtitle-type");
  }

  export function setSectionSubTitleType(type: TypeSubtitle) {
    setStyleValue("--composer-subtitle-type", type);
  }

  export function getContentAlignment() {
    return getStyleValue("--composer-content-alignment");
  }

  export function setAlignment(alignment: TypeContentAlignment) {
    setStyleValue("--composer-content-alignment", alignment);
  }

  export function getViewType() {
    return getStyleValue("--composer-view-type");
  }

  export function setViewType(viewType: TypeContentView) {
    setStyleValue("--composer-view-type", viewType);
  }

  export function setFontSize(size: string) {
    setStyleValue("--composer-font-size-md", `${size}px`);
  }

  export function getContentWidth() {
    return getStyleValue("--composer-content-width");
  }

  export function setContentWidth(width: string | number) {
    const widthValue = `${width}px`;
    setStyleValue("--composer-content-width", widthValue);
  }

  export function H1({ className, children, ...props }: any) {
    return (
      <h1 className={`${styles.h1} ${className || ""}`} {...props}>
        {children}
      </h1>
    );
  }

  export function H2({ className, children, ...props }: any) {
    return (
      <h2 className={`${styles.h2} ${className || ""}`} {...props}>
        {children}
      </h2>
    );
  }

  export function H3({ className, children, ...props }: any) {
    return (
      <h3 className={`${styles.h3} ${className || ""}`} {...props}>
        {children}
      </h3>
    );
  }

  export function H4({ className, children, ...props }: any) {
    return (
      <h4 className={`${styles.h4} ${className || ""}`} {...props}>
        {children}
      </h4>
    );
  }

  export function H5({ className, children, ...props }: any) {
    return (
      <h5 className={`${styles.h5} ${className || ""}`} {...props}>
        {children}
      </h5>
    );
  }

  export function H6({ className, children, ...props }: any) {
    return (
      <h6 className={`${styles.h6} ${className || ""}`} {...props}>
        {children}
      </h6>
    );
  }

  export function P({ className, children, ...props }: any) {
    return (
      <p className={`${styles.p} ${className || ""}`} {...props}>
        {children}
      </p>
    );
  }

  export function Container({
    className,
    children,
    isFull,
    isModal,
    ...props
  }: any) {
    const alignment = getContentAlignment();
    const viewType = getViewType();
    return (
      <div
        className={`${styles.container} ${styles[alignment] || ""} ${
          styles[viewType] || ""
        } ${className || ""} ${isModal ? styles.modalContainer : ""} ${
          isFull ? styles.full : ""
        }`}
        {...props}
      >
        {children}
      </div>
    );
  }

  export function MaxContent({ className, children, ...props }: any) {
    return (
      <div className={`${styles.maxContent} ${className || ""}`} {...props}>
        {children}
      </div>
    );
  }

  export function VerticalContent({ className, children, ...props }: any) {
    return (
      <div className={`${styles.verticalContent} ${className || ""}`} {...props}>
        {children}
      </div>
    );
  }

  export function ListGrid({
    className,
    gridCount,
    children,
    ...props
  }: {
    gridCount: { pc?: number; tablet?: number; phone?: number };
    [key: string]: any;
  }) {
    return (
      <div
        className={`${styles.listGrid} ${className || ""}`}
        style={
          {
            "--composer-grid-count": gridCount["pc"] || 3,
            "--composer-grid-count-tablet": gridCount["tablet"] || 2,
            "--composer-grid-count-phone": gridCount["phone"] || 1,
          } as React.CSSProperties
        }
        {...props}
      >
        {children}
      </div>
    );
  }

  export function ContainerGrid({ className, children, ...props }: any) {
    return (
      <div className={`${styles.containerGrid} ${className || ""}`} {...props}>
        {children}
      </div>
    );
  }

  export function GridCell({ className, children, ...props }: any) {
    return (
      <div className={`${styles.gridCell} ${className || ""}`} {...props}>
        {children}
      </div>
    );
  }

  export function SectionTitle({ className, ...props }: any) {
    return (
      <H1 className={`${styles.sectionTitle || ""} ${className || ""}`} {...props} />
    );
  }

  export function SectionSubTitle({ className, ...props }: any) {
    const type = getSectionSubTitleType();
    return (
      <H3
        className={`${styles.sectionSubTitle || ""} ${className || ""} ${styles[type] || ""}`}
        {...props}
      />
    );
  }

  export function SectionDescription({ className, ...props }: any) {
    return (
      <P className={`${styles.sectionDescription || ""} ${className || ""}`} {...props} />
    );
  }

  export function Button({
    className,
    buttonType,
    ...props
  }: {
    buttonType?: TypeButton;
    [key: string]: any;
  }) {
    return (
      <button
        className={`${styles.baseButton} ${
          styles[(buttonType || "Primary").toLocaleLowerCase()] || ""
        } ${className || ""}`}
        {...props}
      />
    );
  }

  export function Row({ className, ...props }: any) {
    return <div className={`${styles.row} ${className || ""}`} {...props} />;
  }

  export function Card({
    className,
    children,
    ...props
  }: React.HTMLAttributes<HTMLDivElement>) {
    return (
      <div className={`${styles.baseCard} ${className || ""}`} {...props}>
        {children}
      </div>
    );
  }

  export interface IconProps {
    name: string;
    propsIcon?: Record<string, any>;
  }

  export function Icon({ name, propsIcon }: IconProps): React.JSX.Element {
    if (!name) return <></>;

    let ElementIcon: any = null;

    for (const iconLibrary of iconLibraries) {
      if (ElementIcon) break;
      for (const [iconName, Icon] of Object.entries(iconLibrary)) {
        if (iconName === name) {
          ElementIcon = Icon;
          break;
        }
      }
    }

    if (!ElementIcon) {
      return <></>;
    }

    return <ElementIcon {...propsIcon} />;
  }

  export function Media({
    value,
    className,
    ...props
  }: {
    value?: TypeMediaInputValue;
    className?: string;
  }) {
    if (!value) return null;

    switch (value.type) {
      case "icon":
        return (
          <span className={className} {...props}>
            <Base.Icon name={value.name} />
          </span>
        );
      case "image":
        return <img className={className} src={value.url} alt="" {...props} />;
      case "video":
        return (
          <video
            className={className}
            src={value.url}
            autoPlay={!!value.settings?.autoplay}
            controls={value.settings?.controls !== false}
            loop={!!value.settings?.loop}
            muted={!!value.settings?.muted}
            {...props}
          />
        );
      case "lottie":
        return React.createElement("lottie-player", {
          className,
          src: value.url,
          background: "transparent",
          speed: "1",
          loop: !!value.settings?.loop,
          autoplay: !!value.settings?.autoplay,
          style: { width: "100%", height: "100%" },
          ...props,
        });
      default:
        return null;
    }
  }

  export namespace Navigator {
    export function Container({
      className,
      children,
      position,
      ...props
    }: {
      className?: string;
      children?: React.ReactNode;
      position?: string;
      [key: string]: any;
    }) {
      const positionClass = position
        ?.split(" ")
        .map((item: string) => item.toLowerCase())
        .join("");

      return (
        <div
          className={`${styles.navbarContainer} ${className || ""} ${
            styles[positionClass || ""] || ""
          }`}
          {...props}
        >
          <div
            className={`${styles.navbarPosition} ${styles.position || ""} ${
              props.positionContainer || ""
            }`}
          >
            {children}
          </div>
        </div>
      );
    }

    export function getWrapperContainer() {
      if (typeof window === "undefined") return;
      const playground = document.getElementById("playground") as HTMLElement;
      const isPlayground = !!playground;
      return {
        wrapper: isPlayground ? playground : window,
        scrollY: isPlayground ? playground.scrollTop : window.scrollY,
        style: isPlayground
          ? playground.style
          : document.documentElement.style,
        innerWidth: isPlayground
          ? playground.clientWidth
          : window.innerWidth,
      };
    }

    export function changeScrollBehaviour(behaviour: "hidden" | "auto") {
      const wrapperContainer = getWrapperContainer();
      if (!wrapperContainer) return;
      wrapperContainer.style.overflowY = behaviour;
    }
  }
}
