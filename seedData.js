const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const Artist = require('./models/Artist');
const Artwork = require('./models/Artwork');
const User = require('./models/User');

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/kala-heritage');
    console.log('Connected to MongoDB');

    // Clear existing data
    await Artist.deleteMany({});
    await Artwork.deleteMany({});
    await User.deleteMany({});
    console.log('Cleared existing data');

    // Create sample artists
    const artists = [
      {
        name: 'Meera Devi',
        email: 'meera.devi@example.com',
        password: await bcrypt.hash('password123', 10),
        artform: 'Madhubani',
        bio: 'Master artist preserving the traditional Madhubani art for over 30 years. Born and raised in Madhubani district, I learned this sacred art from my grandmother and have been teaching it to young girls in my village.',
        location: { city: 'Madhubani', state: 'Bihar', country: 'India' },
        experience: 30,
        specializations: ['Religious themes', 'Nature motifs', 'Wedding art'],
        isVerified: true,
        rating: 4.8,
        totalRatings: 45
      },
      {
        name: 'Ravi Bhil',
        email: 'ravi.bhil@example.com',
        password: await bcrypt.hash('password123', 10),
        artform: 'Warli',
        bio: 'Traditional Warli artist from the Warli tribe, creating authentic tribal art that tells stories of our ancestors. I use natural pigments and traditional techniques passed down through generations.',
        location: { city: 'Dahanu', state: 'Maharashtra', country: 'India' },
        experience: 25,
        specializations: ['Tribal stories', 'Nature scenes', 'Festival celebrations'],
        isVerified: true,
        rating: 4.9,
        totalRatings: 52
      },
      {
        name: 'Kiran Patel',
        email: 'kiran.patel@example.com',
        password: await bcrypt.hash('password123', 10),
        artform: 'Pithora',
        bio: 'Renowned Pithora artist known for vibrant ceremonial wall paintings. I specialize in creating sacred horse paintings for traditional Pithora ceremonies and have exhibited my work across Gujarat.',
        location: { city: 'Vadodara', state: 'Gujarat', country: 'India' },
        experience: 20,
        specializations: ['Ceremonial art', 'Sacred horses', 'Wall murals'],
        isVerified: true,
        rating: 4.7,
        totalRatings: 38
      },
      {
        name: 'Bhuri Bai',
        email: 'bhuri.bai@example.com',
        password: await bcrypt.hash('password123', 10),
        artform: 'Gond',
        bio: 'Padma Shri awarded Gond artist who has brought tribal art to international recognition. My paintings depict the rich mythology and folklore of the Gond tribe using traditional dot techniques.',
        location: { city: 'Bhopal', state: 'Madhya Pradesh', country: 'India' },
        experience: 35,
        specializations: ['Mythology', 'Folklore', 'Contemporary Gond'],
        isVerified: true,
        rating: 5.0,
        totalRatings: 67
      },
      {
        name: 'Niranjan Swain',
        email: 'niranjan.swain@example.com',
        password: await bcrypt.hash('password123', 10),
        artform: 'Patachitra',
        bio: 'Master Patachitra artist from Raghurajpur village, known for intricate scroll paintings depicting stories from Hindu epics. I have been practicing this art for over 28 years.',
        location: { city: 'Puri', state: 'Odisha', country: 'India' },
        experience: 28,
        specializations: ['Religious scrolls', 'Epic narratives', 'Palm leaf art'],
        isVerified: true,
        rating: 4.6,
        totalRatings: 41
      },
      {
        name: 'Pedda Kalamkari',
        email: 'pedda.kalamkari@example.com',
        password: await bcrypt.hash('password123', 10),
        artform: 'Kalamkari',
        bio: 'Traditional Kalamkari artist specializing in hand-painted textiles with natural dyes. My family has been practicing this art for four generations in Srikalahasti.',
        location: { city: 'Srikalahasti', state: 'Andhra Pradesh', country: 'India' },
        experience: 22,
        specializations: ['Temple art', 'Textile painting', 'Natural dyes'],
        isVerified: true,
        rating: 4.5,
        totalRatings: 33
      }
    ];

    const createdArtists = await Artist.insertMany(artists);
    console.log(`Created ${createdArtists.length} artists`);

    // Create sample artworks
    const artworks = [
      {
        title: 'Village Celebration',
        description: 'A vibrant Warli painting depicting a traditional village festival with dancing figures, musicians, and ceremonial activities. This piece captures the joy and community spirit of tribal celebrations.',
        artist: createdArtists[1]._id, // Ravi Bhil
        artform: 'Warli',
        images: [{ url: '/images/warli-village-celebration.jpg', caption: 'Village Celebration - Warli Art' }],
        price: 5000,
        isForSale: true,
        dimensions: { width: 30, height: 40, unit: 'cm' },
        materials: ['Natural pigments', 'Rice paste', 'Canvas'],
        technique: 'Traditional brush painting',
        yearCreated: 2023,
        tags: ['festival', 'community', 'traditional', 'tribal'],
        featured: true,
        views: 245
      },
      {
        title: 'Goddess Lakshmi',
        description: 'An exquisite Madhubani painting of Goddess Lakshmi surrounded by lotus flowers and traditional geometric patterns. Created using natural colors and traditional techniques.',
        artist: createdArtists[0]._id, // Meera Devi
        artform: 'Madhubani',
        images: [{ url: '/images/madhubani-lakshmi.jpg', caption: 'Goddess Lakshmi - Madhubani Art' }],
        price: 8000,
        isForSale: true,
        dimensions: { width: 35, height: 45, unit: 'cm' },
        materials: ['Natural colors', 'Handmade paper', 'Bamboo brush'],
        technique: 'Traditional Madhubani style',
        yearCreated: 2023,
        tags: ['goddess', 'religious', 'lotus', 'traditional'],
        featured: true,
        views: 320
      },
      {
        title: 'Sacred Horses',
        description: 'A magnificent Pithora painting featuring sacred horses in a ceremonial procession. This artwork is traditionally painted on walls during Pithora ceremonies for prosperity and good fortune.',
        artist: createdArtists[2]._id, // Kiran Patel
        artform: 'Pithora',
        images: [{ url: '/images/pithora-horses.jpg', caption: 'Sacred Horses - Pithora Art' }],
        price: 6500,
        isForSale: true,
        dimensions: { width: 50, height: 35, unit: 'cm' },
        materials: ['Natural pigments', 'Clay base', 'Traditional brushes'],
        technique: 'Wall painting technique on canvas',
        yearCreated: 2023,
        tags: ['horses', 'ceremony', 'sacred', 'prosperity'],
        featured: true,
        views: 180
      },
      {
        title: 'Tree of Life',
        description: 'A stunning Gond painting depicting the tree of life with intricate dot patterns and mythological creatures. This piece represents the connection between all living beings in Gond philosophy.',
        artist: createdArtists[3]._id, // Bhuri Bai
        artform: 'Gond',
        images: [{ url: '/images/gond-tree-life.jpg', caption: 'Tree of Life - Gond Art' }],
        price: 12000,
        isForSale: true,
        dimensions: { width: 40, height: 50, unit: 'cm' },
        materials: ['Acrylic colors', 'Canvas', 'Fine brushes'],
        technique: 'Traditional dot painting',
        yearCreated: 2023,
        tags: ['tree', 'life', 'mythology', 'dots'],
        featured: true,
        views: 410
      },
      {
        title: 'Jagannath Rath Yatra',
        description: 'A detailed Patachitra scroll painting depicting the famous Jagannath Rath Yatra festival. This traditional art form narrates the divine journey with intricate details and vibrant colors.',
        artist: createdArtists[4]._id, // Niranjan Swain
        artform: 'Patachitra',
        images: [{ url: '/images/patachitra-jagannath.jpg', caption: 'Jagannath Rath Yatra - Patachitra Art' }],
        price: 7500,
        isForSale: true,
        dimensions: { width: 60, height: 30, unit: 'cm' },
        materials: ['Natural colors', 'Palm leaf', 'Traditional brushes'],
        technique: 'Scroll painting',
        yearCreated: 2023,
        tags: ['jagannath', 'festival', 'religious', 'scroll'],
        featured: true,
        views: 290
      },
      {
        title: 'Krishna Leela',
        description: 'A beautiful Kalamkari textile painting depicting various episodes from Krishna Leela. Hand-painted with natural dyes using traditional pen-like tools called kalam.',
        artist: createdArtists[5]._id, // Pedda Kalamkari
        artform: 'Kalamkari',
        images: [{ url: '/images/kalamkari-krishna.jpg', caption: 'Krishna Leela - Kalamkari Art' }],
        price: 9500,
        isForSale: true,
        dimensions: { width: 45, height: 60, unit: 'cm' },
        materials: ['Natural dyes', 'Cotton fabric', 'Kalam pen'],
        technique: 'Hand-painted textile art',
        yearCreated: 2023,
        tags: ['krishna', 'mythology', 'textile', 'handpainted'],
        featured: true,
        views: 235
      }
    ];

    const createdArtworks = await Artwork.insertMany(artworks);
    console.log(`Created ${createdArtworks.length} artworks`);

    // Update artists with their artworks
    for (let i = 0; i < createdArtists.length; i++) {
      const artist = createdArtists[i];
      const artistArtworks = createdArtworks.filter(artwork => 
        artwork.artist.toString() === artist._id.toString()
      );
      
      artist.artworks = artistArtworks.map(artwork => artwork._id);
      await artist.save();
    }

    // Create sample users
    const users = [
      {
        name: 'Arjun Sharma',
        email: 'arjun.sharma@example.com',
        password: await bcrypt.hash('password123', 10),
        interests: ['Madhubani', 'Warli', 'Gond'],
        location: { city: 'Delhi', state: 'Delhi', country: 'India' }
      },
      {
        name: 'Priya Menon',
        email: 'priya.menon@example.com',
        password: await bcrypt.hash('password123', 10),
        interests: ['Kalamkari', 'Patachitra'],
        location: { city: 'Bangalore', state: 'Karnataka', country: 'India' }
      },
      {
        name: 'Raj Patel',
        email: 'raj.patel@example.com',
        password: await bcrypt.hash('password123', 10),
        interests: ['Pithora', 'Warli'],
        location: { city: 'Mumbai', state: 'Maharashtra', country: 'India' }
      }
    ];

    const createdUsers = await User.insertMany(users);
    console.log(`Created ${createdUsers.length} users`);

    // Add some likes and comments to artworks
    for (const artwork of createdArtworks) {
      // Add random likes from users
      const randomUsers = createdUsers.sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 3) + 1);
      artwork.likes = randomUsers.map(user => ({ user: user._id, createdAt: new Date() }));
      
      // Add sample comments
      const sampleComments = [
        'Beautiful work! The colors are so vibrant.',
        'This captures the essence of traditional art perfectly.',
        'Amazing detail and craftsmanship.',
        'I love how this tells a story through art.',
        'Such intricate work, truly inspiring!'
      ];
      
      const randomComments = sampleComments.sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 3) + 1);
      artwork.comments = randomComments.map((text, index) => ({
        user: randomUsers[index % randomUsers.length]._id,
        text,
        createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000) // Random date within last week
      }));
      
      await artwork.save();
    }

    // Update user favorites
    for (const user of createdUsers) {
      const randomArtworks = createdArtworks.sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 3) + 1);
      user.favoriteArtworks = randomArtworks.map(artwork => artwork._id);
      
      const randomArtists = createdArtists.sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 2) + 1);
      user.followingArtists = randomArtists.map(artist => artist._id);
      
      await user.save();
    }

    // Update artist followers
    for (const artist of createdArtists) {
      const followers = createdUsers.filter(user => 
        user.followingArtists.some(followedArtist => followedArtist.toString() === artist._id.toString())
      );
      artist.followers = followers.map(user => user._id);
      await artist.save();
    }

    console.log('✅ Database seeded successfully!');
    console.log('\n📊 Summary:');
    console.log(`   Artists: ${createdArtists.length}`);
    console.log(`   Artworks: ${createdArtworks.length}`);
    console.log(`   Users: ${createdUsers.length}`);
    console.log('\n🔐 Sample Login Credentials:');
    console.log('   Artists:');
    console.log('     meera.devi@example.com / password123 (Madhubani)');
    console.log('     ravi.bhil@example.com / password123 (Warli)');
    console.log('     kiran.patel@example.com / password123 (Pithora)');
    console.log('   Users:');
    console.log('     arjun.sharma@example.com / password123');
    console.log('     priya.menon@example.com / password123');

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\nDatabase connection closed');
  }
};

// Run the seeding script
if (require.main === module) {
  seedData();
}

module.exports = seedData;