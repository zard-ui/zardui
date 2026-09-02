import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardSidebarImports } from '@zard/components/sidebar/sidebar.imports';

import { Sidebar10NavFavoritesComponent, type Sidebar10Favorite } from './sidebar-10-nav-favorites.component';
import { Sidebar10NavMainComponent, type Sidebar10NavItem } from './sidebar-10-nav-main.component';
import { Sidebar10NavSecondaryComponent, type Sidebar10SecondaryItem } from './sidebar-10-nav-secondary.component';
import { Sidebar10NavWorkspacesComponent, type Sidebar10Workspace } from './sidebar-10-nav-workspaces.component';
import { Sidebar10TeamSwitcherComponent, type Sidebar10Team } from './sidebar-10-team-switcher.component';

@Component({
  selector: 'lib-sidebar-10-app-sidebar',
  standalone: true,
  imports: [
    ...ZardSidebarImports,
    Sidebar10TeamSwitcherComponent,
    Sidebar10NavMainComponent,
    Sidebar10NavFavoritesComponent,
    Sidebar10NavWorkspacesComponent,
    Sidebar10NavSecondaryComponent,
  ],
  templateUrl: './sidebar-10-app-sidebar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
})
export class Sidebar10AppSidebarComponent {
  // This is sample data.
  protected readonly teams: readonly Sidebar10Team[] = [
    { name: 'Acme Inc', logo: 'lucideCommand', plan: 'Enterprise' },
    { name: 'Acme Corp.', logo: 'lucideAudioWaveform', plan: 'Startup' },
    { name: 'Evil Corp.', logo: 'lucideCommand', plan: 'Free' },
  ];

  protected readonly navMain: readonly Sidebar10NavItem[] = [
    { title: 'Search', url: '#', icon: 'lucideSearch' },
    { title: 'Ask AI', url: '#', icon: 'lucideSparkles' },
    { title: 'Home', url: '#', icon: 'lucideHouse', isActive: true },
    { title: 'Inbox', url: '#', icon: 'lucideInbox', badge: '10' },
  ];

  protected readonly navSecondary: readonly Sidebar10SecondaryItem[] = [
    { title: 'Calendar', url: '#', icon: 'lucideCalendar' },
    { title: 'Settings', url: '#', icon: 'lucideSettings2' },
    { title: 'Templates', url: '#', icon: 'lucideBlocks' },
    { title: 'Trash', url: '#', icon: 'lucideTrash2' },
    { title: 'Help', url: '#', icon: 'lucideMessageCircleQuestion' },
  ];

  protected readonly favorites: readonly Sidebar10Favorite[] = [
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

  protected readonly workspaces: readonly Sidebar10Workspace[] = [
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
