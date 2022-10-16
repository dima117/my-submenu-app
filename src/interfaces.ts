import { ReactNode } from "react";

export interface TmpMenuItemBase {
    text: ReactNode;
}

export interface TmpMenuItemMenu extends TmpMenuItemBase {
    type: 'menu';
    items: TmpMenuItem[];
    key: string;
}

export interface TmpMenuItemOption extends TmpMenuItemBase {
    type: 'option';
    value: string;
}

export interface TmpMenuItemLink extends TmpMenuItemBase {
    type: 'link';
    key: string;
    url: string;
    target?: string;
}

export type TmpMenuItem = TmpMenuItemOption | TmpMenuItemLink | TmpMenuItemMenu;

export const getItemKey = (item: TmpMenuItem): string => {
    switch (item.type) {
        case 'link':
        case 'menu':
            return item.key;
        case 'option':
            return item.value;
    }
}
