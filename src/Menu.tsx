import { Node } from "@react-types/shared";
import {
  useListState,
  ListProps,
  ListState,
  Item,
  Section,
  useMenuTriggerState,
} from "react-stately";
import {
  useListBox,
  useOption,
  useFocusRing,
  usePress,
  mergeProps,
  useMenuTrigger,
  useListBoxSection,
  useSeparator,
} from "react-aria";
import { FC, ReactNode, useRef } from "react";
import {
  TmpMenuAnyItem,
  TmpMenuItemOption,
  TmpMenuItemLink,
  TmpMenuItemMenu,
  getItemKey,
  TmpMenuItemSection,
} from "./interfaces";
import { MenuPopup } from "./components/MenuPopup";
import { MenuItemContent } from "./components/MenuItemContent";

import { cn } from "@bem-react/classname";

const cls = cn("MenuItem");

const getCls = (focus: boolean, selected: boolean) => cls({ focus, selected });

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

const onPress = (...args: unknown[]) => {
  console.log(args);
};

export const MenuMenu: FC<{
  item: TmpMenuItemMenu;
  state: ListState<TmpMenuAnyItem>;
  children: ReactNode;
}> = ({ item, children, state }) => {
  let ref = useRef(null);

  let triggerState = useMenuTriggerState({});

  const { menuTriggerProps, menuProps } = useMenuTrigger({}, triggerState, ref);
  const { onPress, onPressStart, ...restTriggerProps } = menuTriggerProps;


  let { optionProps, isSelected, isDisabled } = useOption(
    { key: item.key },
    state,
    ref
  );
  const { pressProps } = usePress({ isDisabled, ref, onPress, onPressStart }); // FIXME

  let { isFocusVisible, focusProps } = useFocusRing();

  const mergedProps = mergeProps(restTriggerProps, optionProps, focusProps, pressProps);

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
    elementType: "li",
  });

  const isFirst = item.key !== state.collection.getFirstKey();
  const separator = isFirst ? null : (
    <div {...separatorProps} style={{ borderTop: "1px solid gray" }}></div>
  );

  const title = children ? <div {...headingProps}>{children}</div> : null;

  const items = Array.from(childNodes).map((node, index) => {
    node.value = item.items[index]; // FIXME

    return (
      <MenuAnyItem key={getItemKey(node.value)} node={node} state={state} />
    );
  });

  return (
    <>
      {separator}
      <div {...itemProps}>{title}</div>
      <div {...groupProps}>{items}</div>
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

export const Menu: FC<ListProps<TmpMenuAnyItem>> = (props) => {
  let state = useListState(props);

  let ref = useRef<HTMLDivElement>(null);
  let { listBoxProps } = useListBox(props, state, ref);

  const items = Array.from(state.collection).map((node) => (
    <MenuAnyItem key={getItemKey(node.value)} node={node} state={state} />
  ));

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
