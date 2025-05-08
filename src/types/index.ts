export interface Testimonial {
  id: number;
  names: string;
  image: string;
  quote: string;
  rating: number;
}

export interface Feature {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  iconBgColor: string;
  iconColor: string;
}

export interface ProcessStep {
  id: number;
  title: string;
  description: string;
}
