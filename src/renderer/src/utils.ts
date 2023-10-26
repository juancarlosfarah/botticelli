export const openSidebar = (): void => {
  if (typeof document !== 'undefined') {
    document.body.style.overflow = 'hidden';
    document.documentElement.style.setProperty('--SideNavigation-slideIn', '1');
  }
};

export const closeSidebar = (): void => {
  if (typeof document !== 'undefined') {
    document.documentElement.style.removeProperty('--SideNavigation-slideIn');
    document.body.style.removeProperty('overflow');
  }
};

export const toggleSidebar = (): void => {
  if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    const slideIn = window
      .getComputedStyle(document.documentElement)
      .getPropertyValue('--SideNavigation-slideIn');
    if (slideIn) {
      closeSidebar();
    } else {
      openSidebar();
    }
  }
};

export const openMessagesPane = (): void => {
  if (typeof document !== 'undefined') {
    document.body.style.overflow = 'hidden';
    document.documentElement.style.setProperty('--MessagesPane-slideIn', '1');
  }
};

export const closeMessagesPane = (): void => {
  if (typeof document !== 'undefined') {
    document.documentElement.style.removeProperty('--MessagesPane-slideIn');
    document.body.style.removeProperty('overflow');
  }
};

export const toggleMessagesPane = (): void => {
  if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    const slideIn = window
      .getComputedStyle(document.documentElement)
      .getPropertyValue('--MessagesPane-slideIn');
    if (slideIn) {
      closeMessagesPane();
    } else {
      openMessagesPane();
    }
  }
};
