import { DomElementInfo, InteractionDetails } from '../store/slices/consoleSlice';

export function generateElementSelector(element: Element, concise: boolean = false): string {
  const parts: string[] = [];
  let current = element;

  while (current && current.nodeType === Node.ELEMENT_NODE) {
    let selector = current.nodeName.toLowerCase();
    
    if (current.id) {
      selector += `#${current.id}`;
      parts.unshift(selector);
      break; // ID is unique, no need to go further up
    } else if (current.className) {
      const classes = current.className.toString().trim();
      if (classes && concise) {
        // For concise mode, only show meaningful classes
        const meaningfulClasses = classes.split(/\s+/).filter(cls => 
          cls.includes('project') || 
          cls.includes('button') || 
          cls.includes('panel') ||
          cls.includes('container') ||
          cls.includes('main') ||
          cls.includes('header') ||
          cls.includes('footer')
        );
        if (meaningfulClasses.length > 0) {
          selector += `.${meaningfulClasses.join('.')}`;
        }
      } else if (classes && !concise) {
        selector += `.${classes.replace(/\s+/g, '.')}`;
      }
    }

    // Add nth-child if there are siblings with same tag
    const parent = current.parentElement;
    if (parent) {
      const siblings = Array.from(parent.children).filter(
        child => child.nodeName === current.nodeName
      );
      if (siblings.length > 1) {
        const index = siblings.indexOf(current) + 1;
        selector += `:nth-child(${index})`;
      }
    }

    parts.unshift(selector);
    current = current.parentElement!;
    
    // Limit depth - shorter for concise mode
    if (parts.length >= (concise ? 3 : 5)) break;
  }

  return parts.join(' > ');
}

export function extractDomElementInfo(element: Element, concise: boolean = false): DomElementInfo {
  const rect = element.getBoundingClientRect();
  const attributes: Record<string, string> = {};
  
  // Extract relevant attributes
  for (let i = 0; i < element.attributes.length; i++) {
    const attr = element.attributes[i];
    if (attr.name !== 'style' && attr.name !== 'class') {
      attributes[attr.name] = attr.value;
    }
  }

  return {
    tagName: element.tagName.toLowerCase(),
    id: element.id || undefined,
    className: element.className || undefined,
    selector: generateElementSelector(element, concise),
    position: {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    },
    attributes: Object.keys(attributes).length > 0 ? attributes : undefined,
  };
}

export function createInteractionDetails(
  event: Event,
  eventType: string,
  concise: boolean = true
): InteractionDetails {
  const target = event.target as Element;
  const currentTarget = event.currentTarget;
  const details: InteractionDetails = {
    eventType,
    domElement: target && typeof target.getBoundingClientRect === 'function' 
      ? extractDomElementInfo(target, concise) 
      : undefined,
    currentTarget: (currentTarget && typeof (currentTarget as Element).getBoundingClientRect === 'function')
      ? extractDomElementInfo(currentTarget as Element, concise) 
      : undefined,
    userAgent: navigator.userAgent,
    viewport: {
      width: window.innerWidth,
      height: window.innerHeight,
    },
  };

  // Add mouse/touch coordinates for relevant events
  if (event instanceof MouseEvent) {
    details.coordinates = {
      clientX: event.clientX,
      clientY: event.clientY,
    };
  }

  // Add key information for keyboard events
  if (event instanceof KeyboardEvent) {
    details.key = event.key;
    details.code = event.code;
  }

  return details;
}