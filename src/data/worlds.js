import { Building2, Clock, Leaf } from 'lucide-react'

export const worlds = [
  {
    id: 'city',
    name: 'City Lab',
    icon: Building2,
    description:
      'Explore simplified relationships between traffic, population, and public transport.',
    hint: 'Try lowering Car use and watch the road clear.',
    available: true,
  },
  {
    id: 'time',
    name: 'Time Lab',
    icon: Clock,
    description:
      'Experiment with daily time allocation, priorities, and productivity.',
    hint: 'Try raising Focused work to 12 hours and watch what happens to your energy.',
    available: true,
  },
  {
    id: 'nature',
    name: 'Nature Lab',
    icon: Leaf,
    description:
      'Explore simplified relationships between ecosystem variables.',
    hint: 'Try setting Predators to 0 and watch what the herbivores do to the plants.',
    available: true,
  },
]