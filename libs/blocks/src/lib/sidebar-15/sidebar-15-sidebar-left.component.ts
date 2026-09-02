import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardSidebarImports } from '@zard/components/sidebar/sidebar.imports';

import { Sidebar15NavFavoritesComponent, type Sidebar15Favorite } from './sidebar-15-nav-favorites.component';
import { Sidebar15NavMainComponent, type Sidebar15NavItem } from './sidebar-15-nav-main.component';
import { Sidebar15NavSecondaryComponent, type Sidebar15SecondaryItem } from './sidebar-15-nav-secondary.component';
import { Sidebar15NavWorkspacesComponent, type Sidebar15Workspace } from './sidebar-15-nav-workspaces.component';
import { Sidebar15TeamSwitcherComponent, type Sidebar15Team } from './sidebar-15-team-switcher.component';

@Component({
  selector: 'lib-sidebar-15-sidebar-left',
  standalone: true,
  imports: [
    ...ZardSidebarImports,
    Sidebar15TeamSwitcherComponent,
    Sidebar15NavMainComponent,
    Sidebar15NavFavoritesComponent,
    Sidebar15NavWorkspacesComponent,
    Sidebar15NavSecondaryComponent,
  ],
  templateUrl: './sidebar-15-sidebar-left.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
})
export class Sidebar15SidebarLeftComponent {
  // This is sample data.
  protected readonly teams: readonly Sidebar15Team[] = [
    { name: 'Acme Inc', logo: 'lucideCommand', plan: 'Enterprise' },
    { name: 'Acme Corp.', logo: 'lucideAudioWaveform', plan: 'Startup' },
    { name: 'Evil Corp.', logo: 'lucideCommand', plan: 'Free' },
  ];

  protected readonly navMain: readonly Sidebar15NavItem[] = [
    { title: 'Search', url: '#', icon: 'lucideSearch' },
    { title: 'Ask AI', url: '#', icon: 'lucideSparkles' },
    { title: 'Home', url: '#', icon: 'lucideHouse', isActive: true },
    { title: 'Inbox', url: '#', icon: 'lucideInbox', badge: '10' },
  ];

  protected readonly navSecondary: readonly Sidebar15SecondaryItem[] = [
    { title: 'Calendar', url: '#', icon: 'lucideCalendar' },
    { title: 'Settings', url: '#', icon: 'lucideSettings2' },
    { title: 'Templates', url: '#', icon: 'lucideBlocks' },
    { title: 'Trash', url: '#', icon: 'lucideTrash2' },
    { title: 'Help', url: '#', icon: 'lucideMessageCircleQuestion' },
  ];

  protected readonly favorites: readonly Sidebar15Favorite[] = [
    { name: 'Project Management & Task Tracking', url: '#', emoji: '📊' },
    { name: 'Family Recipe Collection & Meal Planning', url: '#', emoji: '🍳' },
    { name: 'Fitness Tracker & Workout Routines', url: '#', emoji: '💪' },
    { name: 'Book Notes & Reading List', url: '#', emoji: '📚' },
    { name: 'Sustainable Gardening Tips & Plant Care', url: '#', emoji: '🌱' },
    { name: 'Language Learning Progress & Resources', url: '#', emoji: '🗣️' },
    { name: 'Home Renovation Ideas & Budget Tracker', url: '#', emoji: '🏠' },
    { name: 'Personal Finance & Investment Portfolio', url: '#', emoji: '💰' },
    { name: 'Movie & TV Show Watchlist with Reviews', url: '#', emoji: '🎬' },
    { name: 'Daily Habit Tracker & Goal Setting', url: '#', emoji: '✅' },
  ];

  protected readonly workspaces: readonly Sidebar15Workspace[] = [
    {
      name: 'Personal Life Management',
      emoji: '🏠',
      pages: [
        { name: 'Daily Journal & Reflection', emoji: '📔' },
        { name: 'Health & Wellness Tracker', emoji: '🍏' },
        { name: 'Personal Growth & Learning Goals', emoji: '🌟' },
      ],
    },
    {
      name: 'Professional Development',
      emoji: '💼',
      pages: [
        { name: 'Career Objectives & Milestones', emoji: '🎯' },
        { name: 'Skill Acquisition & Training Log', emoji: '🧠' },
        { name: 'Networking Contacts & Events', emoji: '🤝' },
      ],
    },
    {
      name: 'Creative Projects',
      emoji: '🎨',
      pages: [
        { name: 'Writing Ideas & Story Outlines', emoji: '✍️' },
        { name: 'Art & Design Portfolio', emoji: '🖼️' },
        { name: 'Music Composition & Practice Log', emoji: '🎵' },
      ],
    },
    {
      name: 'Travel & Adventure',
      emoji: '🌎',
      pages: [
        { name: 'Trip Planning & Itineraries', emoji: '🗺️' },
        { name: 'Travel Bucket List & Inspiration', emoji: '🌎' },
        { name: 'Travel Journal & Photo Gallery', emoji: '📸' },
      ],
    },
  ];
}
