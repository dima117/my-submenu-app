import { useListState, ListProps } from "react-stately";

import { useListBox } from "react-aria";
import { FC, useRef } from "react";
import { TmpMenuAnyItem, getItemKey } from "../interfaces";
import { MenuAnyItem } from "./MenuItem";

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
