import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database with demo data (Knowledge Park, Greater Noida)...');

  // 1. Clean existing data
  await prisma.match.deleteMany();
  await prisma.claim.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.item.deleteMany();
  await prisma.user.deleteMany();

  // 2. Create Users
  const passwordHash = await bcrypt.hash('password123', 10);
  
  const user1 = await prisma.user.create({
    data: {
      email: 'john.doe@example.com',
      name: 'John Doe',
      password: passwordHash,
      phone: '555-123-4567',
      avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=0D8ABC&color=fff',
    }
  });

  const user2 = await prisma.user.create({
    data: {
      email: 'jane.smith@example.com',
      name: 'Jane Smith',
      password: passwordHash,
      phone: '555-987-6543',
      avatar: 'https://ui-avatars.com/api/?name=Jane+Smith&background=E84118&color=fff',
    }
  });

  const user3 = await prisma.user.create({
    data: {
      email: 'alex.jones@example.com',
      name: 'Alex Jones',
      password: passwordHash,
      avatar: 'https://ui-avatars.com/api/?name=Alex+Jones&background=34D399&color=fff',
    }
  });

  // 3. Create Items (Knowledge Park coordinates)
  const itemsData = [
    {
      title: 'Lost Golden Retriever',
      description: 'Friendly golden retriever named Max. Wearing a blue collar. Last seen near Sharda University.',
      category: 'Pets',
      status: 'LOST',
      date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      latitude: 28.4735,
      longitude: 77.4891,
      location: 'Knowledge Park III, near Sharda University',
      images: ['https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=500&q=60'],
      userId: user1.id,
    },
    {
      title: 'Found Keys on Lanyard',
      description: 'Set of 4 keys with a yellow lanyard and a small gym tag. Found on a bench.',
      category: 'Accessories',
      status: 'FOUND',
      date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      latitude: 28.4688,
      longitude: 77.4912,
      location: 'Knowledge Park II, near Galgotias College',
      images: ['https://images.unsplash.com/photo-1555951000-bc66e52541f4?auto=format&fit=crop&w=500&q=60'],
      userId: user2.id,
    },
    {
      title: 'Lost iPhone 13 Pro',
      description: 'Black iPhone 13 Pro in a clear silicone case. Dropped it somewhere along main road.',
      category: 'Electronics',
      status: 'LOST',
      date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      latitude: 28.4650,
      longitude: 77.4950,
      location: 'Knowledge Park I',
      images: ['https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?auto=format&fit=crop&w=500&q=60'],
      userId: user3.id,
    },
    {
      title: 'Found Leather Wallet',
      description: 'Brown leather bi-fold wallet. Has some IDs and cards. Handed to cafe staff.',
      category: 'Accessories',
      status: 'FOUND',
      date: new Date(Date.now() - 10 * 60 * 60 * 1000), // 10 hours ago
      latitude: 28.4710,
      longitude: 77.4850,
      location: 'GL Bajaj Institute area',
      images: ['https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=500&q=60'],
      userId: user1.id,
    },
    {
      title: 'Lost Backpack',
      description: 'North Face black backpack with a red zipper. Contains my laptop and notebooks.',
      category: 'Bags',
      status: 'LOST',
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      latitude: 28.4750,
      longitude: 77.4820,
      location: 'KCC Institute of Technology',
      images: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=500&q=60'],
      userId: user2.id,
    },
    {
      title: 'Found Small Black Cat',
      description: 'Scared little black cat with green eyes found hiding near the parking.',
      category: 'Pets',
      status: 'FOUND',
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      latitude: 28.4730, // Center
      longitude: 77.4870,
      location: 'Noida Institute of Engineering and Technology (NIET)',
      images: ['https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=500&q=60'],
      userId: user3.id,
    }
  ] as const;

  for (const item of itemsData) {
    await prisma.item.create({ data: item });
  }

  // Fetch created items
  const createdItems = await prisma.item.findMany();
  const foundWallet = createdItems.find(i => i.title.includes('Wallet'));
  const lostRetriever = createdItems.find(i => i.title.includes('Retriever'));

  // 4. Create dummy claims
  if (foundWallet) {
    await prisma.claim.create({
      data: {
        itemId: foundWallet.id,
        claimantId: user2.id, // user2 claiming user1's found wallet
        message: 'This is my wallet! It has my ID inside.',
        status: 'PENDING',
        evidence: ['https://demo-evidence.com/id-scan.jpg']
      }
    });

    await prisma.notification.create({
      data: {
        userId: user1.id,
        type: 'CLAIM_UPDATE',
        title: 'New Claim on your Found Item',
        message: 'Jane Smith has claimed the "Found Leather Wallet".',
        read: false
      }
    });
  }

  if (lostRetriever) {
    await prisma.notification.create({
      data: {
        userId: user1.id,
        type: 'SYSTEM',
        title: 'Matching Items Found',
        message: 'We found potential matches for your "Lost Golden Retriever".',
        read: false
      }
    });
  }

  console.log('Demo data successfully seeded.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
