import { Metadata, ResolvingMetadata } from "next";
import { ICourse } from "@/features/course/types";

async function getCourse(id: string): Promise<ICourse | null> {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
    const res = await fetch(`${baseUrl}/courses/${id}`, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!res.ok) return null;

    const response = await res.json();
    return response.data;
  } catch (error) {
    console.error("Error fetching course for metadata:", error);
    return null;
  }
}

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const id = (await params).id;
  const course = await getCourse(id);

  if (!course) {
    return {
      title: "Course Not Found | LearnFlow",
      description: "The requested course could not be found.",
    };
  }

  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: `${course.title} | ${course.instructor?.firstName} ${course.instructor?.lastName} | LearnFlow`,
    description: course.subtitle || course.description?.substring(0, 160),
    keywords: [
      ...(course.tags || []),
      course.category?.name || "",
      "online course",
      "LearnFlow",
      "education",
    ].filter(Boolean),
    openGraph: {
      title: course.title,
      description: course.subtitle || course.description?.substring(0, 160),
      images: course.thumbnail
        ? [course.thumbnail, ...previousImages]
        : previousImages,
      type: "article",
      authors: [
        `${course.instructor?.firstName} ${course.instructor?.lastName}`,
      ],
      tags: course.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: course.title,
      description: course.subtitle || course.description?.substring(0, 160),
      images: course.thumbnail ? [course.thumbnail] : [],
    },
  };
}

export default async function CourseDetailLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  const course = await getCourse(id);

  const jsonLd = course
    ? {
        "@context": "https://schema.org",
        "@type": "Course",
        name: course.title,
        description: course.subtitle || course.description,
        provider: {
          "@type": "Organization",
          name: "LearnFlow",
          sameAs: "https://learnflow.com",
        },
        instructor: {
          "@type": "Person",
          name: `${course.instructor?.firstName} ${course.instructor?.lastName}`,
          description: course.instructor?.bio,
        },
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: course.rating,
          bestRating: "5",
          worstRating: "1",
          ratingCount: course.reviews || 1,
        },
        offers: {
          "@type": "Offer",
          price: course.price,
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
        },
      }
    : null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      {children}
    </>
  );
}
