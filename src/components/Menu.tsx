import { useListState, ListProps } from "react-stately";

import { useListBox } from "react-aria";
import { FC, useCallback, useMemo, useRef } from "react";
import { TmpMenuAnyItem, getItemKey } from "../interfaces";
import { MenuAnyItem, XxxEvent } from "./MenuItem";
import { MenuContext, MenuContextValue } from "./MenuContext";

export interface MenuProps extends ListProps<TmpMenuAnyItem> {
  onSelect?: (e: XxxEvent) => void;
  onCancel?: (e: XxxEvent) => void;
}

export const Menu: FC<MenuProps> = (props) => {
  const { onSelect, onCancel, ...listProps } = props;

  let state = useListState(listProps);

  let ref = useRef<HTMLDivElement>(null);
  let { listBoxProps } = useListBox(listProps, state, ref);

  const context = useMemo(
    (): MenuContextValue => ({
      e: new EventTarget(),
    }),
    []
  );

  const handleSelect = useCallback(
    (e: XxxEvent) => {
      onSelect?.(e);
      context.e.dispatchEvent(new Event('select'));
    },
    [onSelect, context]
  );

  const items = Array.from(state.collection).map((node) => (
    <MenuAnyItem
      key={getItemKey(node.value)}
      node={node}
      state={state}
      onSelect={handleSelect}
      onCancel={onCancel}
    />
  ));

  return (
    <MenuContext.Provider value={context}>
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
    </MenuContext.Provider>
  );
};
