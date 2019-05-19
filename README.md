# html-id-enforcer-for-autotesting

Enforce elements relevant to user-interaction to have ids.

Experimental.

Looks for elements that have events relevant to user-interaction, like 'onclick', 
and checks that they have 'id' attribute. Alternatively, you can provide you own check.

Tracks DOM changes and retriggers check. 

Typical use.
```typescript
// you get back the obsever, so you can .disconnect() once no longer needed
let observer = startDetectingProblems(document.body);
```

React case, checks element itself to have an id or one of the ancestors within the same Component to have an id 
(Obviously, custom check would have to be very specific to your practices).
Hint, the check can be anything, not just 'id' presence.
```typescript

let observer = startDetectingProblems(document.body, elementOrComponentHasId); 


function getReactComponentInternalInstance(dom: any) {
  const key = Object.keys(dom).find(key => key.startsWith('__reactInternalInstance$'));
  const internalInstance = dom[key];
  if (internalInstance == null) {
    return null;
  }
 
  if (internalInstance.return) { // react 16+
    return internalInstance._debugOwner
      ? internalInstance._debugOwner.stateNode
      : internalInstance.return.stateNode;
  } else { // react <16
    return internalInstance._currentElement._owner._instance;
  }
}
 
function elementOrComponentHasId(elem: HTMLElement) {
  if (!!elem.id) {
    return true;
  }
 
  let ancestorWithIdLookup = elem;
  while (ancestorWithIdLookup
    && ancestorWithIdLookup !== document.body) {
 
    if (!!ancestorWithIdLookup.id) {
      break;
    }
 
    ancestorWithIdLookup = ancestorWithIdLookup.parentElement;
  }
 
  if (!ancestorWithIdLookup
    || ancestorWithIdLookup === document.body) {
    return false;
  }
 
  const initialReactComp = getReactComponentInternalInstance(elem);
  const reactCompOfElementWithId = getReactComponentInternalInstance(ancestorWithIdLookup);
 
  return initialReactComp === reactCompOfElementWithId;
}
```