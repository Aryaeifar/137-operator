
export declare type FlashMessageStrategy = 'multiple' | 'single';
export declare type FlashMessageContainerPosition = 'right bottom' | 'right top' | 'left bottom' | 'left top';

export interface FlashMessageOptions {
    rtl: boolean;
    time: number;
    strategy: FlashMessageStrategy;
    position: FlashMessageContainerPosition;
}

export type FlashMessageParams = {
    type?: 'error' | 'warning' | 'info' | 'success',
    rtl?: boolean,
    title?: string;
    text?: string;
    time?: number,
    icon?: string,
    clickable?: boolean,
    blockClass?: string,
    wrapperClass?: string,
    iconClass?: string,
    contentClass?: string,
    position?: 'right bottom' | 'right top' | 'left bottom' | 'left top',
    x?: string,
    y?: string,
    html?: string,
}
