import { PrismaPg } from '@prisma/adapter-pg';
import {
    PrismaClient,
    UserRole,
    CourseLevel,
    CourseStatus,
    EnrollmentStatus,
    PaymentStatus,
} from '@prisma/client';
import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { faker } from '@faker-js/faker';
import bcrypt from 'bcryptjs';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

dotenv.config({ path: path.join(process.cwd(), '.env') });

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME as string,
    api_key: process.env.CLOUDINARY_API_KEY as string,
    api_secret: process.env.CLOUDINARY_API_SECRET as string,
    secure: true,
});

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const UDEMY_PROMO_VIDEO = 'https://res.cloudinary.com/dqh3uisur/video/upload/v1771891139/course_seeds/qdixo8crchiq35uhfbt5.mp4';

const CATEGORIES = [
    { name: 'Web Development', slug: 'web-development' },
    { name: 'Data Science', slug: 'data-science' },
    { name: 'Artificial Intelligence', slug: 'artificial-intelligence' },
    { name: 'UI/UX Design', slug: 'ui-ux-design' },
    { name: 'Mobile Development', slug: 'mobile-development' },
    { name: 'Digital Marketing', slug: 'digital-marketing' },
    { name: 'Cybersecurity', slug: 'cybersecurity' },
    { name: 'Cloud Computing', slug: 'cloud-computing' },
];

const DUMMY_VIDEOS = [
    'dummy/13328036_1280_720_30fps.mp4',
    'dummy/15338352_1280_720_30fps.mp4',
    'dummy/WebHD_720p.mp4',
];

const COURSE_TEMPLATES = [
    { title: 'The Ultimate Node.js Backend Masterclass', subtitle: 'Build scalable, enterprise-grade backend systems from scratch.' },
    { title: 'React Performance Optimization', subtitle: 'Advanced patterns and techniques for blazing-fast interfaces.' },
    { title: 'Prisma High-Performance Data Modeling', subtitle: 'Learn to design efficient database schemas with Prisma & PostgreSQL.' },
    { title: 'AI Engineering with OpenAI & LangChain', subtitle: 'Harness the power of LLMs to build intelligent applications.' },
    { title: 'Modern DevOps with Kubernetes & Terraform', subtitle: 'Master cloud-native infrastructure automation.' },
    { title: 'Machine Learning Fundamentals with Python', subtitle: 'A mathematical approach to data science and ML algorithms.' },
    { title: 'Full-Stack GraphQL with Apollo & Next.js', subtitle: 'The industry-standard approach to modern API development.' },
    { title: 'Enterprise JavaScript Design Patterns', subtitle: 'Writing maintainable and testable code at scale.' },
    { title: 'Mastering Adobe Creative Suite for UI Designers', subtitle: 'Go from wireframes to high-fidelity prototypes.' },
    { title: 'Growth Marketing for SaaS Founders', subtitle: 'Proven strategies to scale your product from 0 to 1M users.' },
];

async function uploadVideo(filePath: string) {
    const absolutePath = path.join(process.cwd(), filePath);
    if (!fs.existsSync(absolutePath)) {
        console.warn(`⚠️ Video file not found: ${absolutePath}. Using fallback.`);
        return 'https://res.cloudinary.com/demo/video/upload/elephants.m3u8';
    }

    try {
        console.log(`📤 Uploading ${filePath} to Cloudinary...`);
        const result = await cloudinary.uploader.upload(absolutePath, {
            resource_type: 'video',
            folder: 'course_seeds',
            eager: [
                { format: 'm3u8', streaming_profile: 'full_hd' },
                { format: 'mp4', transformation: [{ width: 1280, height: 720, crop: 'limit' }] }
            ],
            eager_async: true,
        });
        return result.secure_url;
    } catch (error) {
        console.error(`❌ Failed to upload ${filePath}:`, error);
        return 'https://res.cloudinary.com/demo/video/upload/elephants.m3u8';
    }
}

async function main() {
    console.log('🚀 Starting Production-Grade Seeding...');

    // 1. Clear existing data
    await prisma.lessonProgress.deleteMany();
    await prisma.review.deleteMany();
    await prisma.payment.deleteMany();
    await prisma.enrollment.deleteMany();
    await prisma.lesson.deleteMany();
    await prisma.module.deleteMany();
    await prisma.course.deleteMany();
    await prisma.category.deleteMany();
    await prisma.refreshToken.deleteMany();
    await prisma.notification.deleteMany();
    await prisma.user.deleteMany();
    await prisma.settings.deleteMany();

    console.log('🧹 Cleaned existing data.');

    // 2. Create Categories
    const createdCategories = [];
    for (const cat of CATEGORIES) {
        const category = await prisma.category.create({
            data: {
                name: cat.name,
                slug: cat.slug,
                description: `Professional-grade ${cat.name} training for career acceleration.`,
            },
        });
        createdCategories.push(category);
    }

    // 3. Create Users
    const hashedPassword = await bcrypt.hash('password123', 10);

    // Super Admin
    await prisma.user.create({
        data: {
            email: 'superadmin@learnflow.com',
            password: hashedPassword,
            firstName: 'Master',
            lastName: 'Editor',
            role: UserRole.SUPER_ADMIN,
            isVerified: true,
            isActive: true,
        },
    });

    // Admin
    await prisma.user.create({
        data: {
            email: 'admin@learnflow.com',
            password: hashedPassword,
            firstName: 'Sarah',
            lastName: 'Moderator',
            role: UserRole.ADMIN,
            isVerified: true,
            isActive: true,
        },
    });

    // Instructors
    const instructors = [];
    for (let i = 1; i <= 10; i++) {
        const user = await prisma.user.create({
            data: {
                email: `instructor${i}@learnflow.com`,
                password: hashedPassword,
                firstName: faker.person.firstName(),
                lastName: faker.person.lastName(),
                role: UserRole.INSTRUCTOR,
                isVerified: true,
                isActive: true,
            },
        });
        instructors.push(user);
    }

    // Students
    const students = [];
    for (let i = 1; i <= 50; i++) {
        const user = await prisma.user.create({
            data: {
                email: faker.internet.email().toLowerCase(),
                password: hashedPassword,
                firstName: faker.person.firstName(),
                lastName: faker.person.lastName(),
                role: UserRole.STUDENT,
                isVerified: true,
                isActive: true,
            },
        });
        students.push(user);
    }

    // 4. Upload Lesson Videos
    const uploadedVideoUrls: string[] = [];
    for (const videoPath of DUMMY_VIDEOS) {
        const url = await uploadVideo(videoPath);
        uploadedVideoUrls.push(url);
    }

    // 5. Create 50+ Realistic Courses
    console.log('📚 Creating 55 high-quality courses...');
    const createdCourses = [];
    for (let i = 0; i < 55; i++) {
        const template = faker.helpers.arrayElement(COURSE_TEMPLATES);
        const category = faker.helpers.arrayElement(createdCategories);
        const instructor = faker.helpers.arrayElement(instructors);

        // Make first few titles unique, then mix
        const title = i < 10 ? template.title : `${template.title}: Part ${faker.number.int({ min: 1, max: 100 })}`;
        const price = faker.number.int({ min: 19, max: 199 }) + 0.99;

        const course = await prisma.course.create({
            data: {
                title,
                subtitle: template.subtitle,
                description: faker.lorem.paragraphs(3),
                price,
                originalPrice: price + faker.number.int({ min: 10, max: 50 }),
                thumbnail: `https://picsum.photos/seed/${faker.string.alphanumeric(8)}/800/450`,
                promoVideoUrl: UDEMY_PROMO_VIDEO,
                instructorId: instructor.id,
                categoryId: category.id,
                status: CourseStatus.PUBLISHED,
                level: faker.helpers.arrayElement([CourseLevel.BEGINNER, CourseLevel.INTERMEDIATE, CourseLevel.ADVANCED]),
                tags: [category.name, 'Bestseller', 'New'],
                whatYouLearn: [
                    'Industry-standard workflows and patterns',
                    'Building complex, real-world applications',
                    'Deploying to cloud environments securely',
                    'Advanced debugging and performance optimization'
                ],
                requirements: [
                    'Basic understanding of programming concepts',
                    'Modern development environment setup',
                    'Commitment to finish the projects'
                ],
                modules: {
                    create: Array.from({ length: faker.number.int({ min: 3, max: 4 }) }, (_, mIdx) => ({
                        title: `Section ${mIdx + 1}: ${faker.commerce.productName()}`,
                        order: mIdx + 1,
                        lessons: {
                            create: Array.from({ length: faker.number.int({ min: 3, max: 5 }) }, (_, lIdx) => ({
                                title: faker.git.commitMessage().substring(0, 50),
                                order: lIdx + 1,
                                videoUrl: faker.helpers.arrayElement(uploadedVideoUrls),
                                isFree: mIdx === 0 && lIdx < 2, // First 2 lessons are free
                                contentType: 'video',
                                duration: `${faker.number.int({ min: 5, max: 20 })}:00`,
                            }))
                        }
                    }))
                }
            },
            include: {
                modules: {
                    include: {
                        lessons: true
                    }
                }
            }
        });

        createdCourses.push(course);
        if ((i + 1) % 10 === 0) console.log(`   ✅ ${i + 1} courses created...`);
    }

    // 6. Realistic Activity
    console.log('📈 Generating heavy activity (Enrollments, Payments, Reviews)...');
    for (const student of students) {
        // Each student enrolls in 5-15 courses
        const studentEnrolledCourses = faker.helpers.arrayElements(createdCourses, { min: 5, max: 15 });

        for (const course of studentEnrolledCourses) {
            const enrollment = await prisma.enrollment.create({
                data: {
                    studentId: student.id,
                    courseId: course.id,
                    status: faker.helpers.arrayElement([EnrollmentStatus.ACTIVE, EnrollmentStatus.ACTIVE, EnrollmentStatus.COMPLETED]),
                }
            });

            await prisma.payment.create({
                data: {
                    amount: course.price,
                    currency: 'USD',
                    status: PaymentStatus.SUCCESS,
                    transactionId: `TX_${faker.string.alphanumeric(12).toUpperCase()}`,
                    studentId: student.id,
                    courseId: course.id,
                    enrollmentId: enrollment.id,
                }
            });

            // Reviews
            if (faker.datatype.boolean(0.6)) {
                await prisma.review.create({
                    data: {
                        rating: faker.number.int({ min: 4, max: 5 }),
                        comment: faker.helpers.arrayElement([
                            'Absolutely amazing content!',
                            'Game changer for my career.',
                            'Detailed and very clear explanations.',
                            'One of the best courses on this topic.',
                            'Wait for it... it gets even better in section 2!'
                        ]),
                        studentId: student.id,
                        courseId: course.id,
                    }
                });
            }

            // Progress
            const allLessons = (course as any).modules.flatMap((m: any) => m.lessons);
            const completedCount = faker.number.int({ min: 0, max: allLessons.length });
            for (let i = 0; i < completedCount; i++) {
                await prisma.lessonProgress.create({
                    data: {
                        studentId: student.id,
                        lessonId: allLessons[i].id,
                        isCompleted: true,
                        completedAt: faker.date.recent(),
                    }
                });
            }
        }
    }

    // 7. Notifications
    console.log('🔔 Generating realistic notifications...');
    const allUsers = [await prisma.user.findFirst({ where: { role: UserRole.SUPER_ADMIN } }), await prisma.user.findFirst({ where: { role: UserRole.ADMIN } }), ...instructors, ...students].filter(Boolean) as any[];

    for (const user of allUsers) {
        const numNotifications = faker.number.int({ min: 5, max: 15 });
        for (let j = 0; j < numNotifications; j++) {
            let title = '';
            let message = '';
            let type = 'INFO';

            if (user.role === UserRole.STUDENT) {
                const scenarios = [
                    { t: 'Course Enrollment', m: `You have successfully enrolled in ${faker.helpers.arrayElement(createdCourses).title}.`, type: 'ENROLLMENT' },
                    { t: 'New Content Alert', m: `New lessons have been added to your course: ${faker.helpers.arrayElement(createdCourses).title}.`, type: 'INFO' },
                    { t: 'System Update', m: 'LearnFlow 2.0 is now live with faster streaming!', type: 'SUCCESS' },
                    { t: 'Payment Successful', m: 'Your payment for the course has been processed.', type: 'SUCCESS' },
                ];
                const s = faker.helpers.arrayElement(scenarios);
                title = s.t; message = s.m; type = s.type;
            } else if (user.role === UserRole.INSTRUCTOR) {
                const scenarios = [
                    { t: 'New Enrollment', m: `${faker.person.fullName()} has enrolled in your course.`, type: 'INFO' },
                    { t: 'Course Approved', m: `Your course "${faker.helpers.arrayElement(createdCourses).title}" has been approved and is now live.`, type: 'SUCCESS' },
                    { t: 'Platform Announcement', m: 'New instructor tools are available in your dashboard.', type: 'INFO' },
                    { t: 'Course Submission Received', m: 'Your course has been received and is under review.', type: 'INFO' },
                ];
                const s = faker.helpers.arrayElement(scenarios);
                title = s.t; message = s.m; type = s.type;
            } else if (user.role === UserRole.ADMIN || user.role === UserRole.SUPER_ADMIN) {
                const scenarios = [
                    { t: 'New Course Submission', m: `A new course "${faker.helpers.arrayElement(createdCourses).title}" is awaiting review.`, type: 'WARNING' },
                    { t: 'System Performance', m: 'Server load is currently stable.', type: 'INFO' },
                    { t: 'Account Action', m: 'An instructor account has been verified.', type: 'SUCCESS' },
                    { t: 'Security Alert', m: 'Unusual login activity detected on student portal.', type: 'ERROR' },
                ];
                const s = faker.helpers.arrayElement(scenarios);
                title = s.t; message = s.m; type = s.type;
            }

            await prisma.notification.create({
                data: {
                    userId: user.id,
                    title,
                    message,
                    type,
                    isRead: faker.datatype.boolean(0.4),
                    createdAt: faker.date.recent({ days: 10 }),
                }
            });
        }
    }

    // 8. Settings
    await prisma.settings.create({
        data: {
            commissionPercentage: 10.0,
            contactEmail: 'contact@learnflow.ai',
            supportEmail: 'support@learnflow.ai',
            globalBannerText: 'LearnFlow 2.0 is here! Experience faster learning.',
        }
    });

    console.log('✅ Production-Grade Seeding Complete!');
    console.log(`
      📊 Stats:
      - Categories: ${createdCategories.length}
      - Super Admin: 1
      - Admin: 1
      - Instructors: ${instructors.length}
      - Students: ${students.length}
      - Courses: ${createdCourses.length}
      - Total Lessons: ${createdCourses.reduce((acc, c) => acc + (c as any).modules.flatMap((m: any) => m.lessons).length, 0)}
  `);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
        await pool.end();
    });
