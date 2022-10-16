// import { PressEvent } from "@react-types/shared";
import { useListState, ListProps, ListState, Item, useMenuTriggerState } from "react-stately";
import {
  useListBox,
  useOption,
  useFocusRing,
  usePress,
  mergeProps,
  useMenuTrigger,
} from "react-aria";
import { FC, ReactNode, useRef } from "react";
import {
  TmpMenuItem,
  TmpMenuItemOption,
  TmpMenuItemLink,
  TmpMenuItemMenu,
  getItemKey,
} from "./interfaces";

export const MenuOption: FC<{
  item: TmpMenuItemOption;
  state: ListState<TmpMenuItem>;
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
      style={{
        background: isSelected
          ? "blueviolet"
          : isFocusVisible
          ? "#99f"
          : "transparent",
        color: isDisabled ? "#aaa" : isSelected ? "white" : undefined,
        padding: "2px 5px",
        outline: "none",
      }}
    >
      {children}
    </div>
  );
};

const onPress = (...args: unknown[]) => {
  console.log(args);
};

export function MenuItemRenderer(item: TmpMenuItem) {
  return <Item key={getItemKey(item)}>{item.text}</Item>;
}

export const MenuMenu: FC<{
  item: TmpMenuItemMenu;
  state: ListState<TmpMenuItem>;
  children: ReactNode;
}> = ({ item, children, state }) => {
  let ref = useRef(null);

  let triggerState = useMenuTriggerState({});

  let { menuTriggerProps, menuProps } = useMenuTrigger({}, triggerState, ref);

  let { optionProps, isSelected, isDisabled } = useOption(
    { key: item.key },
    state,
    ref
  );

  const { pressProps } = usePress({ isDisabled, ref, onPress });

  // Determine whether we should show a keyboard
  // focus ring for accessibility
  let { isFocusVisible, focusProps } = useFocusRing();

  const menu = !triggerState.isOpen ? null : (
    <Menu {...menuProps} items={item.items}>{MenuItemRenderer}</Menu>
  );

  return (
    <>
      <div
        {...mergeProps(menuTriggerProps, optionProps, focusProps, pressProps)}
        ref={ref}
        style={{
          background: isSelected
            ? "blueviolet"
            : isFocusVisible
            ? "#99f"
            : "transparent",
          color: isDisabled ? "#aaa" : isSelected ? "white" : undefined,
          padding: "2px 5px",
          outline: "none",
        }}
      >
        {children}
      </div>
      {menu}
    </>
  );
};

export const MenuLink: FC<{
  item: TmpMenuItemLink;
  state: ListState<TmpMenuItem>;
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
      style={{
        display: "block",
        background: isSelected
          ? "blueviolet"
          : isFocusVisible
          ? "#99f"
          : "transparent",
        color: isDisabled ? "#aaa" : isSelected ? "white" : undefined,
        padding: "2px 5px",
        outline: "none",
      }}
    >
      {children}
    </a>
  );
};

export const Menu: FC<ListProps<TmpMenuItem>> = (props) => {
  let state = useListState(props);

  let ref = useRef<HTMLDivElement>(null);
  let { listBoxProps } = useListBox(props, state, ref);

  const items = Array.from(state.collection).map((node) => {
    const data = node.value;

    if (data) {
      switch (data.type) {
        case "option":
          return (
            <MenuOption key={data.value} item={data} state={state}>
              {node.rendered}
            </MenuOption>
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

    const { key, rendered } = node;
    const stub: TmpMenuItemOption = {
      text: rendered,
      value: String(key),
      type: "option",
    };

    return (
      <MenuOption key={node.key} item={stub} state={state}>
        {node.rendered}
      </MenuOption>
    );
  });

  return (
    <div
      {...listBoxProps}
      ref={ref}
      style={{
        padding: 0,
        margin: "5px 0",
        border: "1px solid gray",
        maxWidth: 250,
        maxHeight: 300,
        overflow: "auto",
      }}
    >
      {items}
    </div>
  );
};
