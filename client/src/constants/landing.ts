import {
  Users,
  BookOpen,
  Star,
  GraduationCap,
  Zap,
  Shield,
  Globe,
  BarChart2,
  Award,
} from "lucide-react";

export const stats = [
  { value: "120K+", label: "Active Learners", icon: Users },
  { value: "4,800+", label: "Expert Courses", icon: BookOpen },
  { value: "98%", label: "Satisfaction Rate", icon: Star },
  { value: "650+", label: "Instructors", icon: GraduationCap },
];

export const features = [
  {
    icon: Zap,
    title: "AI-Powered Learning Paths",
    description:
      "Personalized course recommendations that adapt to your pace, goals, and learning style using advanced AI.",
    color: "text-warning",
    bg: "bg-warning/10",
  },
  {
    icon: Shield,
    title: "Enterprise-Grade Security",
    description:
      "SOC 2 compliant, end-to-end encrypted, with SSO support. Your data stays private and protected.",
    color: "text-success",
    bg: "bg-success/10",
  },
  {
    icon: Globe,
    title: "Learn From Anywhere",
    description:
      "Fully responsive across devices. Download lessons for offline access and learn on your schedule.",
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    icon: BarChart2,
    title: "Advanced Analytics",
    description:
      "Detailed progress reports, completion certificates, and learning insights for individuals and teams.",
    color: "text-accent",
    bg: "bg-accent/10",
  },
  {
    icon: Users,
    title: "Cohort-Based Learning",
    description:
      "Join live sessions, group projects, and peer discussions. Learning is better together.",
    color: "text-info",
    bg: "bg-info/10",
  },
  {
    icon: Award,
    title: "Verified Certificates",
    description:
      "Industry-recognized certificates that employers trust. Share directly to LinkedIn with one click.",
    color: "text-secondary",
    bg: "bg-secondary/10",
  },
];

export const testimonials = [
  {
    name: "Jordan Lee",
    role: "Senior Frontend Dev",
    company: "Stripe",
    text: "LearnFlow completely transformed how our team upskills. The AI recommendations are eerily accurate, and the course quality is exceptional.",
    avatar: "JL",
    rating: 5,
  },
  {
    name: "Priya Sharma",
    role: "Product Manager",
    company: "Notion",
    text: "I went from junior PM to leading a product team in 6 months. The structured paths and mentorship community made all the difference.",
    avatar: "PS",
    rating: 5,
  },
  {
    name: "Marcus Webb",
    role: "Data Scientist",
    company: "Airbnb",
    text: "The ML curriculum is industry-level. Real projects, real datasets, real feedback. Worth every penny.",
    avatar: "MW",
    rating: 5,
  },
];

export const pricingPlans = [
  {
    name: "Starter",
    price: "$0",
    period: "forever",
    description: "Perfect for curious learners",
    features: [
      "5 free courses/month",
      "Community access",
      "Mobile app",
      "Progress tracking",
    ],
    cta: "Get Started Free",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$29",
    period: "per month",
    description: "For serious learners",
    features: [
      "Unlimited courses",
      "AI learning paths",
      "Offline downloads",
      "Certificates",
      "Priority support",
      "1-on-1 mentorship (2h/mo)",
    ],
    cta: "Start 14-day Trial",
    highlighted: true,
  },
  {
    name: "Team",
    price: "$19",
    period: "per seat/month",
    description: "For growing organizations",
    features: [
      "Everything in Pro",
      "Team analytics",
      "SSO & SCIM",
      "Custom branding",
      "Dedicated CSM",
      "Bulk licensing",
    ],
    cta: "Contact Sales",
    highlighted: false,
  },
];
