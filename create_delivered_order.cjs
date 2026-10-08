const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function addReviewToDelivered() {
  const customer = await prisma.user.findUnique({ where: { email: 'customer@foodhub.in' } });
  const restaurant = await prisma.restaurant.findUnique({
    where: { slug: 'bombay-canteen-co' },
  });
  const order = await prisma.order.findFirst({ where: { orderNumber: 'FH-7712' } });

  if (!order || !customer || !restaurant) {
    console.log('Order, customer, or restaurant not found');
    return;
  }

  const existingReview = await prisma.review.findUnique({ where: { orderId: order.id } });
  if (existingReview) {
    console.log('Review already exists');
    return;
  }

  const review = await prisma.review.create({
    data: {
      orderId: order.id,
      restaurantId: restaurant.id,
      customerId: customer.id,
      rating: 5,
      comment:
        'Outstanding flavors! The Arbi Tuk Chaat was delightfully crisp and the Cochin Calamari was cooked to absolute perfection. Fast delivery within 30 minutes!',
    },
  });

  await prisma.reviewReply.create({
    data: {
      reviewId: review.id,
      restaurantId: restaurant.id,
      content:
        'Namaste Aarav! Thank you so much for the glowing review. Delighted that you loved our signature small plates!',
    },
  });

  console.log('✅ Review and reply created for FH-7712');
}

addReviewToDelivered()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
