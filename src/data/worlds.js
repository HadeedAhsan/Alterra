import { Building2, Clock, Leaf } from 'lucide-react'

export const worlds = [
  {
    id: 'city',
    name: 'City Lab',
    icon: Building2,
    description:
      'Explore simplified relationships between traffic, population, and public transport.',
    available: true,
  },
  {
    id: 'time',
    name: 'Time Lab',
    icon: Clock,
    description:
      'Experiment with daily time allocation, priorities, and productivity.',
    available: true,
  },
  {
    id: 'nature',
    name: 'Nature Lab',
    icon: Leaf,
    description:
      'Explore simplified relationships between ecosystem variables.',
    available: true,
  },
]