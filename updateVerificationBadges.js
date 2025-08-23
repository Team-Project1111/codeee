const mongoose = require('mongoose');
const Artist = require('./models/Artist');
require('dotenv').config();

async function updateVerificationBadges() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find all artists
    const artists = await Artist.find({});
    console.log(`Found ${artists.length} artists to check`);

    let updatedCount = 0;

    for (const artist of artists) {
      const artworkCount = artist.artworks ? artist.artworks.length : 0;
      const shouldBeVerified = artworkCount >= 3;

      if (artist.isVerified !== shouldBeVerified) {
        artist.isVerified = shouldBeVerified;
        await artist.save();
        updatedCount++;
        console.log(`Updated ${artist.name}: ${artworkCount} artworks → ${shouldBeVerified ? 'VERIFIED' : 'NOT VERIFIED'}`);
      }
    }

    console.log(`\nVerification update complete!`);
    console.log(`- Total artists checked: ${artists.length}`);
    console.log(`- Artists updated: ${updatedCount}`);
    console.log(`- Verified artists: ${artists.filter(a => a.isVerified).length}`);

    // Display summary of verification status
    const verificationSummary = artists.reduce((acc, artist) => {
      const artworkCount = artist.artworks ? artist.artworks.length : 0;
      const status = artist.isVerified ? 'verified' : 'not_verified';
      
      if (!acc[status]) acc[status] = { count: 0, artists: [] };
      acc[status].count++;
      acc[status].artists.push({
        name: artist.name,
        artform: artist.artform,
        artworkCount
      });
      
      return acc;
    }, {});

    console.log('\n=== VERIFICATION SUMMARY ===');
    if (verificationSummary.verified) {
      console.log(`\nVERIFIED ARTISTS (${verificationSummary.verified.count}):`);
      verificationSummary.verified.artists.forEach(artist => {
        console.log(`  ✓ ${artist.name} (${artist.artform}) - ${artist.artworkCount} artworks`);
      });
    }

    if (verificationSummary.not_verified) {
      console.log(`\nNOT VERIFIED ARTISTS (${verificationSummary.not_verified.count}):`);
      verificationSummary.not_verified.artists.forEach(artist => {
        console.log(`  ○ ${artist.name} (${artist.artform}) - ${artist.artworkCount} artworks`);
      });
    }

    console.log('\n=== BADGE SYSTEM RULES ===');
    console.log('✓ VERIFIED: Artists with 3 or more artworks');
    console.log('○ NOT VERIFIED: Artists with fewer than 3 artworks');
    console.log('\nAuto-verification will apply to new artworks as they are uploaded.');

  } catch (error) {
    console.error('Error updating verification badges:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  }
}

// Run the update
updateVerificationBadges();