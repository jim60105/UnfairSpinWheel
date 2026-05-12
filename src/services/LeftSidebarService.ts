import { ref } from 'vue';

export const VisibleLeftSidebar = ref(false);

export class LeftSidebarService {
  public openSidebar = () => {
    VisibleLeftSidebar.value = true;
  };
}
