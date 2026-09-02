import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArchiveX, lucideCommand, lucideFile, lucideInbox, lucideSend, lucideTrash2 } from '@ng-icons/lucide';

import { ZardFieldImports } from '@zard/components/field/field.imports';
import { ZardInputComponent } from '@zard/components/input/input.component';
import { ZardSidebarImports } from '@zard/components/sidebar/sidebar.imports';
import { ZardSidebarService } from '@zard/components/sidebar/sidebar.service';
import { ZardSwitchComponent } from '@zard/components/switch/switch.component';

import { Sidebar09NavUserComponent, type Sidebar09User } from './sidebar-09-nav-user.component';

interface NavItem {
  readonly title: string;
  readonly url: string;
  readonly icon: string;
}

interface Mail {
  readonly name: string;
  readonly email: string;
  readonly subject: string;
  readonly date: string;
  readonly teaser: string;
}

@Component({
  selector: 'lib-sidebar-09-app-sidebar',
  standalone: true,
  imports: [
    ...ZardSidebarImports,
    ...ZardFieldImports,
    ZardInputComponent,
    ZardSwitchComponent,
    Sidebar09NavUserComponent,
    NgIcon,
  ],
  viewProviders: [provideIcons({ lucideArchiveX, lucideCommand, lucideFile, lucideInbox, lucideSend, lucideTrash2 })],
  templateUrl: './sidebar-09-app-sidebar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
})
export class Sidebar09AppSidebarComponent {
  private readonly sidebar = inject(ZardSidebarService);

  // This is sample data.
  protected readonly user: Sidebar09User = {
    name: 'zard ui',
    email: 'm@example.com',
    avatar: 'https://github.com/zard-ui.png',
  };

  protected readonly navMain: readonly NavItem[] = [
    { title: 'Inbox', url: '#', icon: 'lucideInbox' },
    { title: 'Drafts', url: '#', icon: 'lucideFile' },
    { title: 'Sent', url: '#', icon: 'lucideSend' },
    { title: 'Junk', url: '#', icon: 'lucideArchiveX' },
    { title: 'Trash', url: '#', icon: 'lucideTrash2' },
  ];

  protected readonly activeItem = signal<NavItem>(this.navMain[0]);

  /** Picking a mailbox also opens the outer sidebar, as it does in shadcn. */
  protected selectItem(item: NavItem): void {
    this.activeItem.set(item);
    this.sidebar.setOpen(true);
  }

  private readonly allMails: readonly Mail[] = [
    {
      name: 'William Smith',
      email: 'williamsmith@example.com',
      subject: 'Meeting Tomorrow',
      date: '09:34 AM',
      teaser:
        'Hi team, just a reminder about our meeting tomorrow at 10 AM. Please come prepared with your project updates.',
    },
    {
      name: 'Alice Smith',
      email: 'alicesmith@example.com',
      subject: 'Re: Project Update',
      date: 'Yesterday',
      teaser: 'Thanks for the update. The progress looks great so far. Let us discuss the next steps.',
    },
    {
      name: 'Bob Johnson',
      email: 'bobjohnson@example.com',
      subject: 'Weekend Plans',
      date: '2 days ago',
      teaser: 'Hey everyone! I am thinking of organising a team outing this weekend. Would you be interested?',
    },
    {
      name: 'Emily Davis',
      email: 'emilydavis@example.com',
      subject: 'Re: Question about Budget',
      date: '2 days ago',
      teaser: 'I have reviewed the budget numbers you sent over. Can we set up a quick call to discuss?',
    },
    {
      name: 'Michael Wilson',
      email: 'michaelwilson@example.com',
      subject: 'Important Announcement',
      date: '1 week ago',
      teaser: 'Please join us for an all-hands meeting this Friday to discuss some exciting news.',
    },
    {
      name: 'Sarah Brown',
      email: 'sarahbrown@example.com',
      subject: 'Re: Feedback on Proposal',
      date: '1 week ago',
      teaser: 'Thanks for sending the proposal. I have a few thoughts on the timeline we should align on.',
    },
    {
      name: 'David Lee',
      email: 'davidlee@example.com',
      subject: 'New Project Idea',
      date: '1 week ago',
      teaser: 'I had an idea for a new project that could help us streamline our workflow.',
    },
  ];

  /**
   * shadcn reshuffles and re-slices this list with `Math.random()` on every click. That would drift
   * between the server and the client, so the list rotates deterministically instead.
   */
  protected readonly mails = computed(() => {
    const offset = this.navMain.indexOf(this.activeItem());

    return [...this.allMails.slice(offset), ...this.allMails.slice(0, offset)].slice(0, 5 + offset);
  });
}
