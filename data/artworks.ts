export interface Artwork {
  title: string;
  price: string;
  medium: string;
  image: string;
  href: string;
}

export const featuredArtworks: Artwork[] = [
  {
    title: 'Midnight Orchard',
    price: '$240',
    medium: 'Acrylic on linen',
    image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=900&q=80',
    href: '/shop',
  },
  {
    title: 'Golden Hour Study',
    price: '$180',
    medium: 'Ink and watercolor',
    image: 'https://images.unsplash.com/photo-1515405295579-ba7b45403062?auto=format&fit=crop&w=900&q=80',
    href: '/shop',
  },
  {
    title: 'Quiet Tide',
    price: '$320',
    medium: 'Oil on canvas',
    image: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?auto=format&fit=crop&w=900&q=80',
    href: '/shop',
  },
];
