import { ref } from 'vue';

export const VisibleSidebar = ref(false);

export class SidebarService {
  public openSidebar = () => {
    VisibleSidebar.value = true;
  };
}
