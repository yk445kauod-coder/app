import {
  HomeIcon,
  FireIcon,
  StarIcon,
  HeartIcon,
  MagnifyingGlassIcon,
  UserCircleIcon,
  Cog8ToothIcon,
} from '@heroicons/react/24/outline';

export const navigationItems = [
  {
    name: 'Home',
    href: '/',
    icon: HomeIcon,
  },
  {
    name: 'Trending',
    href: '/trending',
    icon: FireIcon,
  },
  {
    name: 'Search',
    href: '/search',
    icon: MagnifyingGlassIcon,
  },
  {
    name: 'Favorites',
    href: '/favorites',
    icon: HeartIcon,
  },
  {
    name: 'Top Rated',
    href: '/top-rated',
    icon: StarIcon,
  },
  {
    name: 'Profile',
    href: '/profile',
    icon: UserCircleIcon,
  },
  {
    name: 'Settings',
    href: '/settings',
    icon: Cog8ToothIcon,
  },
];