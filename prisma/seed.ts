import { prisma } from '../src/lib/db';
import * as bcrypt from 'bcryptjs';

async function main() {
  console.log('🌱 Seeding database...');

  // Seed default admin
  const email = process.env.ADMIN_EMAIL || 'admin@collegepredictor.com';
  const password = process.env.ADMIN_PASSWORD || 'admin123';
  const passwordHash = await bcrypt.hash(password, 12);

  const admin = await prisma.admin.upsert({
    where: { email },
    update: {},
    create: {
      email,
      passwordHash,
      role: 'admin',
    },
  });
  console.log(`✅ Admin seeded: ${admin.email}`);

  // Seed default prediction settings
  const existingSettings = await prisma.predictionSettings.findFirst();
  if (!existingSettings) {
    await prisma.predictionSettings.create({
      data: {
        safeMultiplier: 0.90,
        moderateMultiplier: 1.10,
        ambitiousMultiplier: 1.30,
      },
    });
    console.log('✅ Prediction settings seeded');
  }

  // Seed institute data (state/city mapping for enrichment)
  const institutes = [
    // === IITs ===
    { name: 'Indian Institute of Technology Bombay', type: 'IIT', state: 'Maharashtra', city: 'Mumbai' },
    { name: 'Indian Institute of Technology Delhi', type: 'IIT', state: 'Delhi', city: 'New Delhi' },
    { name: 'Indian Institute of Technology Kanpur', type: 'IIT', state: 'Uttar Pradesh', city: 'Kanpur' },
    { name: 'Indian Institute of Technology Kharagpur', type: 'IIT', state: 'West Bengal', city: 'Kharagpur' },
    { name: 'Indian Institute of Technology Madras', type: 'IIT', state: 'Tamil Nadu', city: 'Chennai' },
    { name: 'Indian Institute of Technology Roorkee', type: 'IIT', state: 'Uttarakhand', city: 'Roorkee' },
    { name: 'Indian Institute of Technology Guwahati', type: 'IIT', state: 'Assam', city: 'Guwahati' },
    { name: 'Indian Institute of Technology Hyderabad', type: 'IIT', state: 'Telangana', city: 'Hyderabad' },
    { name: 'Indian Institute of Technology Indore', type: 'IIT', state: 'Madhya Pradesh', city: 'Indore' },
    { name: 'Indian Institute of Technology (BHU) Varanasi', type: 'IIT', state: 'Uttar Pradesh', city: 'Varanasi' },
    { name: 'Indian Institute of Technology Patna', type: 'IIT', state: 'Bihar', city: 'Patna' },
    { name: 'Indian Institute of Technology Gandhinagar', type: 'IIT', state: 'Gujarat', city: 'Gandhinagar' },
    { name: 'Indian Institute of Technology Jodhpur', type: 'IIT', state: 'Rajasthan', city: 'Jodhpur' },
    { name: 'Indian Institute of Technology Ropar', type: 'IIT', state: 'Punjab', city: 'Rupnagar' },
    { name: 'Indian Institute of Technology Bhubaneswar', type: 'IIT', state: 'Odisha', city: 'Bhubaneswar' },
    { name: 'Indian Institute of Technology Mandi', type: 'IIT', state: 'Himachal Pradesh', city: 'Mandi' },
    { name: 'Indian Institute of Technology Tirupati', type: 'IIT', state: 'Andhra Pradesh', city: 'Tirupati' },
    { name: 'Indian Institute of Technology Palakkad', type: 'IIT', state: 'Kerala', city: 'Palakkad' },
    { name: 'Indian Institute of Technology Dharwad', type: 'IIT', state: 'Karnataka', city: 'Dharwad' },
    { name: 'Indian Institute of Technology (Indian School of Mines) Dhanbad', type: 'IIT', state: 'Jharkhand', city: 'Dhanbad' },
    { name: 'Indian Institute of Technology Bhilai', type: 'IIT', state: 'Chhattisgarh', city: 'Bhilai' },
    { name: 'Indian Institute of Technology Goa', type: 'IIT', state: 'Goa', city: 'Ponda' },
    { name: 'Indian Institute of Technology Jammu', type: 'IIT', state: 'Jammu and Kashmir', city: 'Jammu' },
    // === NITs ===
    { name: 'National Institute of Technology Tiruchirappalli', type: 'NIT', state: 'Tamil Nadu', city: 'Tiruchirappalli' },
    { name: 'National Institute of Technology Warangal', type: 'NIT', state: 'Telangana', city: 'Warangal' },
    { name: 'National Institute of Technology Karnataka, Surathkal', type: 'NIT', state: 'Karnataka', city: 'Mangalore' },
    { name: 'National Institute of Technology Rourkela', type: 'NIT', state: 'Odisha', city: 'Rourkela' },
    { name: 'National Institute of Technology Calicut', type: 'NIT', state: 'Kerala', city: 'Kozhikode' },
    { name: 'Motilal Nehru National Institute of Technology Allahabad', type: 'NIT', state: 'Uttar Pradesh', city: 'Prayagraj' },
    { name: 'Malaviya National Institute of Technology Jaipur', type: 'NIT', state: 'Rajasthan', city: 'Jaipur' },
    { name: 'National Institute of Technology Kurukshetra', type: 'NIT', state: 'Haryana', city: 'Kurukshetra' },
    { name: 'National Institute of Technology Durgapur', type: 'NIT', state: 'West Bengal', city: 'Durgapur' },
    { name: 'Visvesvaraya National Institute of Technology Nagpur', type: 'NIT', state: 'Maharashtra', city: 'Nagpur' },
    { name: 'Sardar Vallabhbhai National Institute of Technology Surat', type: 'NIT', state: 'Gujarat', city: 'Surat' },
    { name: 'Maulana Azad National Institute of Technology Bhopal', type: 'NIT', state: 'Madhya Pradesh', city: 'Bhopal' },
    { name: 'National Institute of Technology Silchar', type: 'NIT', state: 'Assam', city: 'Silchar' },
    { name: 'National Institute of Technology Hamirpur', type: 'NIT', state: 'Himachal Pradesh', city: 'Hamirpur' },
    { name: 'Dr B R Ambedkar National Institute of Technology Jalandhar', type: 'NIT', state: 'Punjab', city: 'Jalandhar' },
    { name: 'National Institute of Technology Patna', type: 'NIT', state: 'Bihar', city: 'Patna' },
    { name: 'National Institute of Technology Raipur', type: 'NIT', state: 'Chhattisgarh', city: 'Raipur' },
    { name: 'National Institute of Technology Agartala', type: 'NIT', state: 'Tripura', city: 'Agartala' },
    { name: 'National Institute of Technology Jamshedpur', type: 'NIT', state: 'Jharkhand', city: 'Jamshedpur' },
    { name: 'National Institute of Technology Srinagar', type: 'NIT', state: 'Jammu and Kashmir', city: 'Srinagar' },
    { name: 'National Institute of Technology Arunachal Pradesh', type: 'NIT', state: 'Arunachal Pradesh', city: 'Yupia' },
    { name: 'National Institute of Technology Manipur', type: 'NIT', state: 'Manipur', city: 'Imphal' },
    { name: 'National Institute of Technology Meghalaya', type: 'NIT', state: 'Meghalaya', city: 'Shillong' },
    { name: 'National Institute of Technology Mizoram', type: 'NIT', state: 'Mizoram', city: 'Aizawl' },
    { name: 'National Institute of Technology Nagaland', type: 'NIT', state: 'Nagaland', city: 'Dimapur' },
    { name: 'National Institute of Technology Sikkim', type: 'NIT', state: 'Sikkim', city: 'Ravangla' },
    { name: 'National Institute of Technology Uttarakhand', type: 'NIT', state: 'Uttarakhand', city: 'Srinagar' },
    { name: 'National Institute of Technology Andhra Pradesh', type: 'NIT', state: 'Andhra Pradesh', city: 'Tadepalligudem' },
    { name: 'National Institute of Technology Delhi', type: 'NIT', state: 'Delhi', city: 'New Delhi' },
    { name: 'National Institute of Technology Goa', type: 'NIT', state: 'Goa', city: 'Ponda' },
    { name: 'National Institute of Technology Puducherry', type: 'NIT', state: 'Puducherry', city: 'Puducherry' },
    // === IIITs ===
    { name: 'Indian Institute of Information Technology Allahabad', type: 'IIIT', state: 'Uttar Pradesh', city: 'Prayagraj' },
    { name: 'Indian Institute of Information Technology, Design and Manufacturing, Jabalpur', type: 'IIIT', state: 'Madhya Pradesh', city: 'Jabalpur' },
    { name: 'Indian Institute of Information Technology, Design and Manufacturing, Kancheepuram', type: 'IIIT', state: 'Tamil Nadu', city: 'Kancheepuram' },
    { name: 'Indian Institute of Information Technology Gwalior', type: 'IIIT', state: 'Madhya Pradesh', city: 'Gwalior' },
    { name: 'Indian Institute of Information Technology Sri City', type: 'IIIT', state: 'Andhra Pradesh', city: 'Sri City' },
    { name: 'Indian Institute of Information Technology Lucknow', type: 'IIIT', state: 'Uttar Pradesh', city: 'Lucknow' },
    { name: 'Indian Institute of Information Technology Kurnool', type: 'IIIT', state: 'Andhra Pradesh', city: 'Kurnool' },
    { name: 'Indian Institute of Information Technology Vadodara', type: 'IIIT', state: 'Gujarat', city: 'Vadodara' },
    { name: 'Indian Institute of Information Technology Sonepat', type: 'IIIT', state: 'Haryana', city: 'Sonepat' },
    { name: 'Indian Institute of Information Technology Nagpur', type: 'IIIT', state: 'Maharashtra', city: 'Nagpur' },
    { name: 'Indian Institute of Information Technology Pune', type: 'IIIT', state: 'Maharashtra', city: 'Pune' },
    { name: 'Indian Institute of Information Technology Ranchi', type: 'IIIT', state: 'Jharkhand', city: 'Ranchi' },
    { name: 'Indian Institute of Information Technology Kalyani', type: 'IIIT', state: 'West Bengal', city: 'Kalyani' },
    { name: 'Indian Institute of Information Technology Una', type: 'IIIT', state: 'Himachal Pradesh', city: 'Una' },
    { name: 'Indian Institute of Information Technology Kota', type: 'IIIT', state: 'Rajasthan', city: 'Kota' },
    { name: 'Indian Institute of Information Technology Tiruchirappalli', type: 'IIIT', state: 'Tamil Nadu', city: 'Tiruchirappalli' },
    { name: 'Indian Institute of Information Technology Surat', type: 'IIIT', state: 'Gujarat', city: 'Surat' },
    { name: 'Indian Institute of Information Technology Manipur', type: 'IIIT', state: 'Manipur', city: 'Imphal' },
    { name: 'Indian Institute of Information Technology Bhopal', type: 'IIIT', state: 'Madhya Pradesh', city: 'Bhopal' },
    { name: 'Indian Institute of Information Technology Bhagalpur', type: 'IIIT', state: 'Bihar', city: 'Bhagalpur' },
    { name: 'Indian Institute of Information Technology Agartala', type: 'IIIT', state: 'Tripura', city: 'Agartala' },
    { name: 'Indian Institute of Information Technology Raichur', type: 'IIIT', state: 'Karnataka', city: 'Raichur' },
    // === GFTIs ===
    { name: 'Indian Institute of Engineering Science and Technology, Shibpur', type: 'GFTI', state: 'West Bengal', city: 'Howrah' },
    { name: 'Birla Institute of Technology, Mesra', type: 'GFTI', state: 'Jharkhand', city: 'Ranchi' },
    { name: 'School of Planning and Architecture, Delhi', type: 'GFTI', state: 'Delhi', city: 'New Delhi' },
    { name: 'School of Planning and Architecture, Bhopal', type: 'GFTI', state: 'Madhya Pradesh', city: 'Bhopal' },
    { name: 'School of Planning and Architecture, Vijayawada', type: 'GFTI', state: 'Andhra Pradesh', city: 'Vijayawada' },
    { name: 'Jawaharlal Nehru University, Delhi', type: 'GFTI', state: 'Delhi', city: 'New Delhi' },
    { name: 'Tezpur University, Assam', type: 'GFTI', state: 'Assam', city: 'Tezpur' },
    { name: 'Mizoram University, Aizawl', type: 'GFTI', state: 'Mizoram', city: 'Aizawl' },
    { name: 'Assam University, Silchar', type: 'GFTI', state: 'Assam', city: 'Silchar' },
    { name: 'Birla Institute of Technology, Sindri', type: 'GFTI', state: 'Jharkhand', city: 'Dhanbad' },
    { name: 'SLIET, Longowal', type: 'GFTI', state: 'Punjab', city: 'Longowal' },
    { name: 'National Institute of Foundry and Forge Technology, Ranchi', type: 'GFTI', state: 'Jharkhand', city: 'Ranchi' },
    { name: 'Ghani Khan Choudhury Institute of Engineering and Technology', type: 'GFTI', state: 'West Bengal', city: 'Malda' },
    { name: 'International Institute of Information Technology, Naya Raipur', type: 'GFTI', state: 'Chhattisgarh', city: 'Naya Raipur' },
    { name: 'J.K. Institute of Applied Physics and Technology', type: 'GFTI', state: 'Uttar Pradesh', city: 'Prayagraj' },
    { name: 'Institute of Infrastructure Technology Research and Management', type: 'GFTI', state: 'Gujarat', city: 'Ahmedabad' },
  ];

  for (const inst of institutes) {
    await prisma.institute.upsert({
      where: { name: inst.name },
      update: { state: inst.state, city: inst.city, type: inst.type },
      create: inst,
    });
  }
  console.log(`✅ ${institutes.length} institutes seeded`);

  console.log('🎉 Seeding complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
