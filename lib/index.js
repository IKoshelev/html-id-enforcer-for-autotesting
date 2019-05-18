"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.eventsToLookFor = ['click', 'dblclick', 'change', 'input',
    'blur', 'focus',
    'dragstart', 'dragend',
    'keydown', 'keypress', 'keyup'];
exports.elementsAlreadyNotified = new WeakMap();
function startDetectingProblems(root) {
    runCheckAndReportProblems(root);
    // for now - just recheck on any changes; If the concept prooves beneficial - we will optimize
    var mutationObserver = new MutationObserver(function () { return runCheckAndReportProblems(root); });
    mutationObserver.observe(root, {
        attributes: true,
        subtree: true
    });
    return mutationObserver;
}
exports.startDetectingProblems = startDetectingProblems;
function detectElementsWithProblems(root) {
    var descendantsOfRoot = Array.from(root.querySelectorAll('*'));
    var problematicElements = descendantsOfRoot
        .filter(isElementRelevantToUserInteraction)
        .filter(function (x) { return isElementTargetableByAutoTests(x) === false; });
    return problematicElements;
}
exports.detectElementsWithProblems = detectElementsWithProblems;
function runCheckAndReportProblems(root) {
    var elementsWithProblens = detectElementsWithProblems(root);
    var elemtWithProblemsWithoutPriorNotification = elementsWithProblens.filter(function (x) { return exports.elementsAlreadyNotified.has(x) === false; });
    if (elemtWithProblemsWithoutPriorNotification.length === 0) {
        return;
    }
    console.warn('Following elements appear to be reachable by user-interaction, but don\'t have an attributes for auto-test targeting (id).');
    elemtWithProblemsWithoutPriorNotification.forEach(function (elem) {
        console.warn(elem);
        exports.elementsAlreadyNotified.set(elem, true);
    });
}
exports.runCheckAndReportProblems = runCheckAndReportProblems;
function isElementRelevantToUserInteraction(elem) {
    var e = elem;
    // apparently, there still no standartised way to get a list of element events...
    // webkit seems to expose them via ('on' + eventName);
    var hasRelativeEvent = exports.eventsToLookFor
        .some(function (eventName) { return !!e['on' + eventName]; });
    return hasRelativeEvent;
}
function isElementTargetableByAutoTests(elem) {
    return !!elem.id;
}
//# sourceMappingURL=index.js.map