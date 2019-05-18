export declare const eventsToLookFor: (keyof HTMLElementEventMap)[];
export declare const elementsAlreadyNotified: WeakMap<HTMLElement, true>;
export declare function startDetectingProblems(root: HTMLElement): MutationObserver;
export declare function detectElementsWithProblems(root: HTMLElement): HTMLElement[];
export declare function runCheckAndReportProblems(root: HTMLElement): void;
