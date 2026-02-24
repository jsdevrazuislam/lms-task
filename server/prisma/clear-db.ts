import prisma from '../src/config/prisma.js';

async function clearDatabase() {
    console.log('Clearing database...');

    // Deletion order matters due to foreign keys
    await prisma.review.deleteMany();
    await prisma.payment.deleteMany();
    await prisma.lessonProgress.deleteMany();
    await prisma.enrollment.deleteMany();
    await prisma.lesson.deleteMany();
    await prisma.module.deleteMany();
    await prisma.course.deleteMany();
    await prisma.category.deleteMany();
    await prisma.refreshToken.deleteMany();
    await prisma.user.deleteMany();
    await prisma.notification.deleteMany();

    console.log('Database cleared successfully.');
}

clearDatabase()
    .catch((e) => {
        console.error('Error clearing database:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
