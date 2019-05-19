export declare const eventsToLookFor: (keyof HTMLElementEventMap)[];
export declare const elementsAlreadyNotified: WeakMap<HTMLElement, true>;
export declare type elemCheckFn = (elem: HTMLElement) => boolean;
export declare function startDetectingProblems(root: HTMLElement, altCheck?: elemCheckFn): MutationObserver;
export declare function detectElementsWithProblems(root: HTMLElement, altCheck?: elemCheckFn): HTMLElement[];
export declare function runCheckAndReportProblems(root: HTMLElement, altCheck?: elemCheckFn): void;
