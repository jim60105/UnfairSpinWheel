import { ref } from 'vue';

export class SidebarService {
  public visibleSidebar = ref(false);
  public openSidebar = () => {
    this.visibleSidebar.value = true;
  };
}
