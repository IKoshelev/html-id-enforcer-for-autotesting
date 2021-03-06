# html-id-enforcer-for-autotesting

Enforce elements relevant to user-interaction to have ids.

Experimental.

Looks for elements that have events relevant to user-interaction, like 'onclick', 
and checks that they have 'id' attribute. Alternatively, you can provide you own check.

Tracks DOM changes and retriggers check. 

Typical use.

```
npm install -save-dev html-id-enforcer-for-autotesting
```

Make a file with below code and add it to the entry point of the development build in webpack (i.e. use 'multi-main entry'). The idea is to only load the file during development, so that devs see the message on local env/dev env.   

```typescript
// you get back the obsever, so you can .disconnect() once no longer needed
import { startDetectingProblems } from 'html-id-enforcer-for-autotesting';
let observer = startDetectingProblems(document.body);
```

React case, checks element itself to have an id or one of the ancestors within the same Component to have an id 
(Obviously, custom check would have to be very specific to your practices).
Hint, the check can be anything, not just 'id' presence.
```typescript
import { startDetectingProblems } from 'html-id-enforcer-for-autotesting';

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
