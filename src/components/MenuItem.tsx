import { Node, PressEvent } from "@react-types/shared";
import {
  ListState,
  Item,
  Section,
  useMenuTriggerState,
  MenuTriggerState,
} from "react-stately";

import { useId } from "@react-aria/utils";
import {
  useOption,
  useFocusRing,
  usePress,
  mergeProps,
  useListBoxSection,
  useSeparator,
  useOverlayTrigger,
  AriaMenuTriggerProps,
  MenuTriggerAria,
} from "react-aria";
import { FC, ReactNode, useRef, RefObject, KeyboardEvent } from "react";
import {
  TmpMenuAnyItem,
  TmpMenuItemOption,
  TmpMenuItemLink,
  TmpMenuItemMenu,
  getItemKey,
  TmpMenuItemSection,
} from "../interfaces";
import { MenuPopup } from "./MenuPopup";
import { MenuItemContent } from "./MenuItemContent";

import { cn } from "@bem-react/classname";
import { Menu } from "./Menu";

const cls = cn("MenuItem");

const getCls = (focus: boolean, selected: boolean) => cls({ focus, selected });

const onPress = (...args: unknown[]) => {
  // заглушка для обработки выбора пунктов меню
  console.log(args);
};

export function MenuItemRenderer(item: TmpMenuAnyItem) {
  if (item.type === "section") {
    const items = item.items.map(MenuItemRenderer);

    return <Section title={item.text}>{items}</Section>;
  }

  return (
    <Item key={getItemKey(item)}>
      <MenuItemContent item={item} />
    </Item>
  );
}

export function useMenuTrigger2<T>(
  props: Omit<AriaMenuTriggerProps, "trigger">,
  state: MenuTriggerState,
  ref: RefObject<Element>
): MenuTriggerAria<T> {
  let { type = "menu", isDisabled } = props;

  const menuTriggerId = useId();

  const { triggerProps, overlayProps } = useOverlayTrigger(
    { type },
    state,
    ref
  );

  delete triggerProps.onPress;

  const onKeyDown = (e: KeyboardEvent) => {
    if (isDisabled) {
      return;
    }

    if (ref && ref.current) {
      switch (e.key) {
        case "Enter":
        case " ":
        // fallthrough
        case "ArrowRight":
          e.stopPropagation();
          e.preventDefault();
          state.toggle("first");
          break;
        case "ArrowLeft":
          e.stopPropagation();
          e.preventDefault();
          state.close();
          break;
      }
    }
  };

  let pressProps = {
    onPressStart(e: PressEvent) {
      // For consistency with native, open the menu on mouse/key down, but touch up.
      if (
        e.pointerType !== "touch" &&
        e.pointerType !== "keyboard" &&
        !isDisabled
      ) {
        // If opened with a screen reader, auto focus the first item.
        // Otherwise, the menu itself will be focused.
        state.toggle(e.pointerType === "virtual" ? "first" : null);
      }
    },
    onPress(e: PressEvent) {
      if (e.pointerType === "touch" && !isDisabled) {
        state.toggle();
      }
    },
  };

  return {
    menuTriggerProps: {
      ...triggerProps,
      ...pressProps,
      id: menuTriggerId,
      onKeyDown,
    },
    menuProps: {
      ...overlayProps,
      "aria-labelledby": menuTriggerId,
      autoFocus: state.focusStrategy,
      onClose: state.close,
    },
  };
}

export const MenuOption: FC<{
  item: TmpMenuItemOption;
  state: ListState<TmpMenuAnyItem>;
  children: ReactNode;
}> = ({ item, children, state }) => {
  // Get props for the option element
  let ref = useRef(null);
  let { optionProps, isSelected, isDisabled } = useOption(
    { key: item.value },
    state,
    ref
  );

  const { pressProps } = usePress({ isDisabled, ref, onPress });

  // Determine whether we should show a keyboard
  // focus ring for accessibility
  let { isFocusVisible, focusProps } = useFocusRing();

  return (
    <div
      {...mergeProps(optionProps, focusProps, pressProps)}
      ref={ref}
      className={getCls(isFocusVisible, isSelected)}
    >
      {children}
    </div>
  );
};

export const MenuMenu: FC<{
  item: TmpMenuItemMenu;
  state: ListState<TmpMenuAnyItem>;
  children: ReactNode;
}> = ({ item, children, state }) => {
  let ref = useRef(null);

  let { optionProps, isSelected, isDisabled } = useOption(
    { key: item.key },
    state,
    ref
  );

  let triggerState = useMenuTriggerState({});

  const { menuTriggerProps, menuProps } = useMenuTrigger2(
    { isDisabled },
    triggerState,
    ref
  );

  const { onPress, onPressStart, ...restTriggerProps } = menuTriggerProps;

  const { pressProps } = usePress({ isDisabled, ref, onPress, onPressStart }); // FIXME

  let { isFocusVisible, focusProps } = useFocusRing();

  const mergedProps = mergeProps(
    restTriggerProps,
    optionProps,
    focusProps,
    pressProps
  );

  return (
    <>
      <div
        {...mergedProps}
        ref={ref}
        className={getCls(isFocusVisible, isSelected)}
      >
        {children}
      </div>
      <MenuPopup anchorRef={ref} visible={triggerState.isOpen}>
        <Menu {...menuProps} items={item.items}>
          {MenuItemRenderer}
        </Menu>
      </MenuPopup>
    </>
  );
};

export const MenuLink: FC<{
  item: TmpMenuItemLink;
  state: ListState<TmpMenuAnyItem>;
  children: ReactNode;
}> = ({ item, state, children }) => {
  // Get props for the option element
  let ref = useRef(null);
  let { optionProps, isSelected, isDisabled } = useOption(
    { key: item.key },
    state,
    ref
  );

  const { pressProps } = usePress({ isDisabled, ref, onPress });

  // Determine whether we should show a keyboard
  // focus ring for accessibility
  let { isFocusVisible, focusProps } = useFocusRing();

  return (
    <a
      {...mergeProps(optionProps, focusProps, pressProps)}
      ref={ref}
      href={item.url}
      target={item.target}
      className={getCls(isFocusVisible, isSelected)}
    >
      {children}
    </a>
  );
};

export const MenuSection: FC<{
  item: TmpMenuItemSection;
  state: ListState<TmpMenuAnyItem>;
  children: ReactNode;
  childNodes: Iterable<Node<TmpMenuAnyItem>>;
}> = ({ item, state, children, childNodes }) => {
  let { itemProps, headingProps, groupProps } = useListBoxSection({
    heading: children,
  });

  let { separatorProps } = useSeparator({
    elementType: "div",
  });

  const isFirst = item.key !== state.collection.getFirstKey();
  const separator = isFirst ? null : (
    <div {...separatorProps} style={{ borderTop: "1px solid gray" }}></div>
  );

  const title = children ? <div {...headingProps}>{children}</div> : null;

  const items = Array.from(childNodes).map((node, index) => {
    node.value = item.items[index]; // FIXME у дочерних node не заполняется value

    return (
      <MenuAnyItem key={getItemKey(node.value)} node={node} state={state} />
    );
  });

  return (
    <>
      {separator}
      <div {...itemProps} className={cls('SectionTitle')}>{title}</div>
      <div {...groupProps} className={cls('SectionItems')}>{items}</div>
    </>
  );
};

export const MenuAnyItem: FC<{
  node: Node<TmpMenuAnyItem>;
  state: ListState<TmpMenuAnyItem>;
}> = ({ node, state }) => {
  const data = node.value;

  if (data) {
    switch (data.type) {
      case "option":
        return (
          <MenuOption key={data.value} item={data} state={state}>
            {node.rendered}
          </MenuOption>
        );

      case "section":
        return (
          <MenuSection
            key={data.key}
            item={data}
            state={state}
            childNodes={node.childNodes}
          >
            {node.rendered}
          </MenuSection>
        );
      case "menu":
        return (
          <MenuMenu key={data.key} item={data} state={state}>
            {node.rendered}
          </MenuMenu>
        );
      case "link":
        return (
          <MenuLink key={data.key} item={data} state={state}>
            {node.rendered}
          </MenuLink>
        );
    }
  }

  return null;
};
