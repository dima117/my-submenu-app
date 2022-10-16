import { ReactNode } from "react";

export interface TmpMenuItemBase {
    text: ReactNode;
    hint?: ReactNode;
}

export interface TmpMenuItemMenu extends TmpMenuItemBase {
    type: 'menu';
    items: TmpMenuAnyItem[];
    key: string;
}

export interface TmpMenuItemSection extends TmpMenuItemBase {
    type: 'section';
    items: TmpMenuSingleItem[];
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

export type TmpMenuSingleItem = TmpMenuItemOption | TmpMenuItemLink | TmpMenuItemMenu;
export type TmpMenuAnyItem = TmpMenuSingleItem | TmpMenuItemSection;

export const getItemKey = (item: TmpMenuAnyItem): string => {
    switch (item.type) {
        case 'link':
        case 'menu':
        case 'section':
            return item.key;
        case 'option':
            return item.value;
    }
}
