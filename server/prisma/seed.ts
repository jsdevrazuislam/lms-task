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

dotenv.config({ path: path.join(process.cwd(), '.env') });

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const CATEGORIES = [
    'Web Development',
    'Mobile Development',
    'Data Science',
    'Artificial Intelligence',
    'UI/UX Design',
    'Digital Marketing',
    'Business & Management',
    'Photography',
    'Music',
    'Lifestyle',
];

const COURSE_TITLES = [
    'Complete React Mastery',
    'Advanced Node.js Architecture',
    'UI/UX Design Principles',
    'Python for Data Analysis',
    'Machine Learning A-Z',
    'Digital Marketing Strategy',
    'The Business of Freelancing',
    'Mobile App Development with Flutter',
    'Cybersecurity Essentials',
    'Cloud Computing with AWS',
    'JavaScript: The Hard Parts',
    'Modern CSS Layouts',
    'Introduction to Typography',
    'Financial Planning for Beginners',
    'Public Speaking for Professionals',
    'Photography Masterclass',
    'Songwriting and Production',
    'Mindfulness and Meditation',
    'Social Media Growth Hacking',
    'Kubernetes for Developers',
];

async function main() {
    console.log('🚀 Starting Seeding...');

    // 1. Clear existing data in reverse order of dependencies
    await prisma.lessonProgress.deleteMany();
    await prisma.review.deleteMany();
    await prisma.payment.deleteMany();
    await prisma.enrollment.deleteMany();
    await prisma.lesson.deleteMany();
    await prisma.module.deleteMany();
    await prisma.course.deleteMany();
    await prisma.category.deleteMany();
    await prisma.refreshToken.deleteMany();
    await prisma.user.deleteMany();

    console.log('🧹 Cleaned existing data.');

    // 2. Create Categories
    const createdCategories = [];
    for (const name of CATEGORIES) {
        const slug = name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
        const category = await prisma.category.create({
            data: {
                name,
                slug,
                description: faker.lorem.paragraph(),
            },
        });
        createdCategories.push(category);
    }
    console.log(`📂 Created ${createdCategories.length} categories.`);

    // 3. Create Users (Admin, Instructors, Students)
    const hashedPassword = await bcrypt.hash('password123', 10);

    // Admin
    await prisma.user.create({
        data: {
            email: 'admin@learnflow.com',
            password: hashedPassword,
            firstName: 'System',
            lastName: 'Admin',
            role: UserRole.ADMIN,
        },
    });

    // Instructors
    const instructors = [];
    for (let i = 0; i < 15; i++) {
        const user = await prisma.user.create({
            data: {
                email: faker.internet.email().toLowerCase(),
                password: hashedPassword,
                firstName: faker.person.firstName(),
                lastName: faker.person.lastName(),
                role: UserRole.INSTRUCTOR,
            },
        });
        instructors.push(user);
    }
    console.log(`👨‍🏫 Created ${instructors.length} instructors.`);

    // Students
    const students = [];
    for (let i = 0; i < 50; i++) {
        const user = await prisma.user.create({
            data: {
                email: faker.internet.email().toLowerCase(),
                password: hashedPassword,
                firstName: faker.person.firstName(),
                lastName: faker.person.lastName(),
                role: UserRole.STUDENT,
            },
        });
        students.push(user);
    }
    console.log(`👨‍🎓 Created ${students.length} students.`);

    // 4. Create Courses
    const courses = [];
    const courseLevels = [
        CourseLevel.BEGINNER,
        CourseLevel.INTERMEDIATE,
        CourseLevel.ADVANCED,
    ];

    for (let i = 0; i < 110; i++) {
        const instructor = faker.helpers.arrayElement(instructors);
        const category = faker.helpers.arrayElement(createdCategories);
        const price = faker.number.int({ min: 10, max: 200 });
        const originalPrice = price + faker.number.int({ min: 20, max: 100 });
        const titleBase = faker.helpers.arrayElement(COURSE_TITLES);
        const title = `${titleBase} - ${faker.word.adjective()} Guide ${i + 1}`;

        const course = await prisma.course.create({
            data: {
                title,
                subtitle: faker.company.catchPhrase(),
                description: faker.lorem.paragraphs(3),
                thumbnail: `https://picsum.photos/seed/${faker.string.alphanumeric(5)}/800/450`,
                price,
                originalPrice,
                level: faker.helpers.arrayElement(courseLevels),
                status: CourseStatus.PUBLISHED,
                duration: `${faker.number.int({ min: 2, max: 40 })} hours`,
                instructorId: instructor.id,
                categoryId: category.id,
                tags: [faker.word.noun(), faker.word.noun(), faker.word.noun()],
                whatYouLearn: Array.from({ length: 4 }, () => faker.lorem.sentence()),
                requirements: Array.from({ length: 2 }, () => faker.lorem.sentence()),
                rating: faker.number.float({ min: 3.5, max: 5, fractionDigits: 1 }),
                modules: {
                    create: Array.from(
                        { length: faker.number.int({ min: 4, max: 8 }) },
                        (_, mIdx) => ({
                            title: `${faker.word.adjective()} ${faker.word.noun()}`,
                            order: mIdx + 1,
                            duration: `${faker.number.int({ min: 10, max: 60 })}m`,
                            lessons: {
                                create: Array.from(
                                    { length: faker.number.int({ min: 3, max: 6 }) },
                                    (_, lIdx) => ({
                                        title: faker.git.commitMessage(),
                                        order: lIdx + 1,
                                        contentType: 'video',
                                        duration: `${faker.number.int({ min: 2, max: 15 })}m`,
                                        videoUrl: 'https://res.cloudinary.com/demo/video/upload/elephants.m3u8',
                                        isFree: mIdx === 0 && lIdx === 0,
                                    })
                                ),
                            },
                        })
                    ),
                },
            },
            include: {
                modules: {
                    include: {
                        lessons: true,
                    },
                },
            },
        });
        courses.push(course);
        if ((i + 1) % 20 === 0) console.log(`📚 Created ${i + 1} courses...`);
    }

    // 5. Create Enrollments, Payments, and Reviews
    console.log('📝 Creating enrollments and activity...');
    for (const student of students) {
        // Each student enrolls in 2-5 random courses
        const studentEnrolledCourses = faker.helpers.arrayElements(
            courses,
            faker.number.int({ min: 2, max: 5 })
        );

        for (const course of studentEnrolledCourses) {
            const enrollment = await prisma.enrollment.create({
                data: {
                    studentId: student.id,
                    courseId: course.id,
                    status: faker.helpers.arrayElement([
                        EnrollmentStatus.ACTIVE,
                        EnrollmentStatus.ACTIVE,
                        EnrollmentStatus.COMPLETED,
                    ]),
                },
            });

            // Create Payment
            await prisma.payment.create({
                data: {
                    amount: course.price,
                    currency: 'USD',
                    status: PaymentStatus.SUCCESS,
                    transactionId: `TX_${faker.string.alphanumeric(12).toUpperCase()}`,
                    studentId: student.id,
                    courseId: course.id,
                    enrollmentId: enrollment.id,
                },
            });

            // Create Progress for some lessons
            const allLessons = course.modules.flatMap((m) => m.lessons);
            const completedCount = faker.number.int({
                min: 0,
                max: allLessons.length,
            });
            const completedLessons = faker.helpers.arrayElements(
                allLessons,
                completedCount
            );

            for (const lesson of completedLessons) {
                await prisma.lessonProgress.create({
                    data: {
                        studentId: student.id,
                        lessonId: lesson.id,
                        isCompleted: true,
                        completedAt: faker.date.recent(),
                    },
                });
            }

            // Create Review for some courses
            if (faker.datatype.boolean(0.4)) {
                await prisma.review.create({
                    data: {
                        rating: faker.number.int({ min: 4, max: 5 }),
                        comment: faker.lorem.sentence(),
                        studentId: student.id,
                        courseId: course.id,
                    },
                });
            }
        }
    }

    console.log('✅ Seeding complete!');
    console.log(`
    📊 Stats:
    - Categories: ${createdCategories.length}
    - Instructors: ${instructors.length}
    - Students: ${students.length}
    - Courses: ${courses.length}
    - Total Lessons: ${courses.reduce((acc, c) => acc + c.modules.flatMap((m) => m.lessons).length, 0)}
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
