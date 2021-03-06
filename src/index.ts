export const eventsToLookFor: (keyof HTMLElementEventMap)[] = 
    ['click', 'dblclick', 'change', 'input',
    'blur', 'focus',
    'dragstart', 'dragend',
    'keydown', 'keypress', 'keyup'];

export const elementsAlreadyNotified = new WeakMap<HTMLElement,true>();

export type elemCheckFn = (elem:HTMLElement) => boolean;

export function startDetectingProblems(root: HTMLElement, altCheck?:elemCheckFn) {
    runCheckAndReportProblems(root, altCheck);

    // for now - just recheck on any changes; If the concept prooves beneficial - we will optimize
    const mutationObserver = new MutationObserver(() => runCheckAndReportProblems(root, altCheck));
    mutationObserver.observe(root, {
        attributes: true,
        subtree: true
    });

    return mutationObserver;
}

export function detectElementsWithProblems(root: HTMLElement, altCheck?: elemCheckFn): HTMLElement[] {
    const descendantsOfRoot = Array.from(root.querySelectorAll('*')) as HTMLElement[];

    const elemIsOkCheck = altCheck || isElementTargetableByAutoTests;

    const problematicElements = descendantsOfRoot
                                        .filter(isElementRelevantToUserInteraction)
                                        .filter(x => elemIsOkCheck(x) === false);

    return problematicElements;
}

export function runCheckAndReportProblems(root:  HTMLElement, altCheck?:elemCheckFn) {
    const elementsWithProblens = detectElementsWithProblems(root, altCheck);

    const elemtWithProblemsWithoutPriorNotification 
                                    = elementsWithProblens.filter(x => elementsAlreadyNotified.has(x) === false);

    if(elemtWithProblemsWithoutPriorNotification.length === 0){
        return;
    }

    console.warn('Following elements appear to be reachable by user-interaction, but don\'t have an attributes for auto-test targeting (id).');
    elemtWithProblemsWithoutPriorNotification.forEach(elem => {       
        console.warn(elem);
        elementsAlreadyNotified.set(elem, true);
    });
}

function isElementRelevantToUserInteraction(elem: HTMLElement) {

    let e = elem as any;
    // apparently, there still no standartised way to get a list of element events...
    // webkit seems to expose them via ('on' + eventName);
    const hasRelativeEvent = eventsToLookFor
                                .some(eventName => !!e['on' + eventName]);

    return hasRelativeEvent;
}

function isElementTargetableByAutoTests(elem: HTMLElement) {
    return !!elem.id;
}