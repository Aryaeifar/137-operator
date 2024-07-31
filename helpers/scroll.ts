
function getOffsetOfElement(el: any) {
  let _x = 0;
  let _y = 0;
  while( el && !isNaN( el.offsetLeft ) && !isNaN( el.offsetTop ) ) {
    _x += el.offsetLeft - el.scrollLeft;
    _y += el.offsetTop - el.scrollTop;
    el = el.offsetParent;
  }
  return { top: _y, left: _x };
}

function whenReachedToElement(event: any, scrollElRef: any, elementRef: any, callable: Function, opts: Record<string, any>) {
  const e = event.target;

  opts = opts ?? {}
  const spaceSize = opts.space ?? 0;

  const offsetSc = getOffsetOfElement( scrollElRef.value.parentElement );
  const offsetEl = getOffsetOfElement( elementRef.value );
  const bottomOfElement = ((e.scrollTop + e.offsetHeight + e.offsetTop + offsetSc.top) >= (offsetEl.top + elementRef.value.clientHeight - spaceSize));
  
  if (bottomOfElement) {
    callable();
  }
}

function whenReachedToElementWindow(elementRef: any, callable: Function, opts: Record<string, any>) {
  opts = opts ?? {}
  const spaceSize = opts.space ?? 0;

  const offset = getOffsetOfElement( elementRef.value );
  const bottomOfElement = (window.innerHeight + window.scrollY) >= (offset.top + elementRef.value.clientHeight - spaceSize);

  if (bottomOfElement) {
    callable();
  }
}

// this function must be used in onMounted
export function scrollToElement(scrollElRef: any, elementRef: any, callable: Function, opts: Record<string, any>) {
  opts = opts ?? {}

  if(![window, document].includes(scrollElRef)) {
    scrollElRef.value.onscroll = (event: any) => whenReachedToElement(event, scrollElRef, elementRef, callable, opts);
  } else {
    window.onscroll = () => whenReachedToElementWindow(elementRef, callable, opts);
  }
}

function whenReachedToEndOfElement(event: any, callable: Function, opts: Record<string, any>) {
  opts = opts ?? {}

  const e = event.target;
  let spaceSize = opts.space ?? 0;
  let bottomOfElement = ((e.scrollHeight - spaceSize) <= e.scrollTop + e.clientHeight);

  if (bottomOfElement) {
    callable();
  }
}

function whenReachedToEndOfWindow(callable: Function, opts: Record<string, any>) {
  opts = opts ?? {}

  let spaceSize = opts.space ?? 0;
  let bottomOfElement = (window.innerHeight + window.pageYOffset) >= (document.body.offsetHeight - spaceSize);

  if (bottomOfElement) {
    callable();
  }
}

// this function must be used in onMounted
export function scrollToEnd(elementRef: any, callable: Function, opts: Record<string, any>) {
  opts = opts ?? {}

  if(![window, document].includes(elementRef)) {
    elementRef.value.onscroll = (event: any) => whenReachedToEndOfElement(event, callable, opts);
  } else {
    window.onscroll = () => whenReachedToEndOfWindow(callable, opts);
  }
}