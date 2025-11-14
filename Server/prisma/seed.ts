import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Asset URLs from Firebase Storage
const ASSETS = {
  // Images
  images: {
    alphabet:
      "https://firebasestorage.googleapis.com/v0/b/afrolingo-e7ef3.firebasestorage.app/o/alphabet%2FSwahili-alphabet.png?alt=media&token=b875c95d-9a67-48de-ac06-19f428118183",

    // Greetings
    greetings: {
      hello:
        "https://firebasestorage.googleapis.com/v0/b/afrolingo-e7ef3.firebasestorage.app/o/greetings%2Fhow-are-you.jpeg?alt=media&token=2740f2e9-9643-4079-98f2-9e0810dfd57a",
      morning:
        "https://firebasestorage.googleapis.com/v0/b/afrolingo-e7ef3.firebasestorage.app/o/greetings%2Flittle-kid-wake-up-morning.png?alt=media&token=e2fbbbd4-9224-4375-9592-1f3b1d9bb840",
      afternoon:
        "https://firebasestorage.googleapis.com/v0/b/afrolingo-e7ef3.firebasestorage.app/o/greetings%2Fhow-are-you.jpeg?alt=media&token=2740f2e9-9643-4079-98f2-9e0810dfd57a",
      evening:
        "https://firebasestorage.googleapis.com/v0/b/afrolingo-e7ef3.firebasestorage.app/o/greetings%2Fgood-evening.jpg?alt=media&token=3c84ba5c-c1be-47c4-b803-99c7132a75ee",
      night:
        "https://firebasestorage.googleapis.com/v0/b/afrolingo-e7ef3.firebasestorage.app/o/greetings%2Fgood-evening.jpg?alt=media&token=3c84ba5c-c1be-47c4-b803-99c7132a75ee",
      goodbye:
        "https://firebasestorage.googleapis.com/v0/b/afrolingo-e7ef3.firebasestorage.app/o/greetings%2Fgood-bye.jpg?alt=media&token=8bf75b5d-02a3-4e2c-bca7-5457ac1bbe72",
      thankYou:
        "https://firebasestorage.googleapis.com/v0/b/afrolingo-e7ef3.firebasestorage.app/o/greetings%2Fthank-you.jpg?alt=media&token=b154c0b9-3177-4719-b7e4-ca5232e5ab5c",
      niceToMeet:
        "https://firebasestorage.googleapis.com/v0/b/afrolingo-e7ef3.firebasestorage.app/o/greetings%2Fnice-to-meet-you.jpg?alt=media&token=be637a75-4cb6-4721-b759-d3812c259646",
    },

    // Places
    places: {
      class:
        "https://firebasestorage.googleapis.com/v0/b/afrolingo-e7ef3.firebasestorage.app/o/places%2Fplace-class.png?alt=media&token=9cd2523c-0485-403e-969a-8cab36f9867c",
      house:
        "https://firebasestorage.googleapis.com/v0/b/afrolingo-e7ef3.firebasestorage.app/o/places%2Fplace-house.png?alt=media&token=3204d4f5-29b4-4a3e-bd0d-264cf3832424",
      library:
        "https://firebasestorage.googleapis.com/v0/b/afrolingo-e7ef3.firebasestorage.app/o/places%2Fplace-library.png?alt=media&token=a307013a-4043-4469-9abc-f9a7b53efc1d",
      airport:
        "https://firebasestorage.googleapis.com/v0/b/afrolingo-e7ef3.firebasestorage.app/o/places%2Fplace-airport.png?alt=media&token=284668ee-1cfc-4589-a952-0927ff6d3696",
      market:
        "https://firebasestorage.googleapis.com/v0/b/afrolingo-e7ef3.firebasestorage.app/o/places%2Fplace-market.png?alt=media&token=7aca2c1e-c617-424e-83de-3cc78f5f4d4f",
      office:
        "https://firebasestorage.googleapis.com/v0/b/afrolingo-e7ef3.firebasestorage.app/o/places%2Fplace-office.png?alt=media&token=00dbefd0-d5a4-4485-a2b2-e640d4c1290e",
      pharmacy:
        "https://firebasestorage.googleapis.com/v0/b/afrolingo-e7ef3.firebasestorage.app/o/places%2Fplace-pharmacy.png?alt=media&token=9932b19b-5aa2-4108-bdb3-b7722f3d5236",
      hospital:
        "https://firebasestorage.googleapis.com/v0/b/afrolingo-e7ef3.firebasestorage.app/o/places%2Fplace-hospital.png?alt=media&token=12b82b0f-c0c0-4435-b06a-40b208084090",
      bank: "https://firebasestorage.googleapis.com/v0/b/afrolingo-e7ef3.firebasestorage.app/o/places%2Fplace-bank.png?alt=media&token=e97107b3-c17c-4edd-ac0f-88e769f6fb90",
      school:
        "https://firebasestorage.googleapis.com/v0/b/afrolingo-e7ef3.firebasestorage.app/o/places%2Fplace-school.png?alt=media&token=0a822ac5-8b53-4610-9869-2745a454826d",
    },

    // Occupations
    occupations: {
      teacher:
        "https://firebasestorage.googleapis.com/v0/b/afrolingo-e7ef3.firebasestorage.app/o/occupation%2Foccupation-teacher.png?alt=media&token=391c1b05-1752-4ccd-9206-4fd30dbace05",
      cashier:
        "https://firebasestorage.googleapis.com/v0/b/afrolingo-e7ef3.firebasestorage.app/o/occupation%2Foccupation-cashier.png?alt=media&token=80f34d7e-b050-4c9c-9d42-3d4ff8b602e6",
      waiter:
        "https://firebasestorage.googleapis.com/v0/b/afrolingo-e7ef3.firebasestorage.app/o/occupation%2Foccupation-teacher.png?alt=media&token=391c1b05-1752-4ccd-9206-4fd30dbace05",
      lawyer:
        "https://firebasestorage.googleapis.com/v0/b/afrolingo-e7ef3.firebasestorage.app/o/occupation%2Foccupation-teacher.png?alt=media&token=391c1b05-1752-4ccd-9206-4fd30dbace05",
      barber:
        "https://firebasestorage.googleapis.com/v0/b/afrolingo-e7ef3.firebasestorage.app/o/occupation%2Foccupation-barber.png?alt=media&token=0c215a66-e764-498b-a487-7f43bf4030c9",
      police:
        "https://firebasestorage.googleapis.com/v0/b/afrolingo-e7ef3.firebasestorage.app/o/occupation%2Foccupation-police.png?alt=media&token=3a86b6df-59bf-44bd-9537-c9e6770c46b2",
      driver:
        "https://firebasestorage.googleapis.com/v0/b/afrolingo-e7ef3.firebasestorage.app/o/occupation%2Foccupation-driver.png?alt=media&token=7aa84de8-7724-400f-b81b-83d905afb88f",
      doctor:
        "https://firebasestorage.googleapis.com/v0/b/afrolingo-e7ef3.firebasestorage.app/o/occupation%2Foccupation-pharmacist.png?alt=media&token=79d3a907-6ce0-4e3f-b84f-3c020199ca32",
      pharmacist:
        "https://firebasestorage.googleapis.com/v0/b/afrolingo-e7ef3.firebasestorage.app/o/occupation%2Foccupation-pharmacist.png?alt=media&token=79d3a907-6ce0-4e3f-b84f-3c020199ca32",
      farmer:
        "https://firebasestorage.googleapis.com/v0/b/afrolingo-e7ef3.firebasestorage.app/o/occupation%2Foccupation-farmer.png?alt=media&token=52a2be9b-5ca8-4357-84a2-f2c709478d65",
    },

    // Colors
    colors: {
      red: "https://firebasestorage.googleapis.com/v0/b/afrolingo-e7ef3.firebasestorage.app/o/colors%2Fcolor-red.webp?alt=media&token=71a4148f-3ab3-4af9-af1b-56b39f6b0473",
      blue: "https://firebasestorage.googleapis.com/v0/b/afrolingo-e7ef3.firebasestorage.app/o/colors%2Fblue-color.avif?alt=media&token=7e3bf195-9b3f-4708-9397-c08021ae02c6",
      green:
        "https://firebasestorage.googleapis.com/v0/b/afrolingo-e7ef3.firebasestorage.app/o/colors%2Fgreen-color.png?alt=media&token=2f659259-5734-46fa-b311-f26db84165e2",
      yellow:
        "https://firebasestorage.googleapis.com/v0/b/afrolingo-e7ef3.firebasestorage.app/o/colors%2Fyellow-color.avif?alt=media&token=2303fa84-3f67-43de-b2b9-c4e908e0dde2",
      orange:
        "https://firebasestorage.googleapis.com/v0/b/afrolingo-e7ef3.firebasestorage.app/o/colors%2Forange-color.avif?alt=media&token=f47427ae-6b00-4c1f-855d-6ae9b1ac71bc",
      purple:
        "https://firebasestorage.googleapis.com/v0/b/afrolingo-e7ef3.firebasestorage.app/o/colors%2Fpurple-color.png?alt=media&token=43475f73-e3a6-4180-8e60-e5647deba31d",
      pink: "https://firebasestorage.googleapis.com/v0/b/afrolingo-e7ef3.firebasestorage.app/o/colors%2Fpink-color.avif?alt=media&token=d8cdc661-6c65-4aa6-a941-fa42388c6534",
      brown:
        "https://firebasestorage.googleapis.com/v0/b/afrolingo-e7ef3.firebasestorage.app/o/colors%2Fbrown-color.avif?alt=media&token=9dd2cfb5-581f-452c-b546-233633d4b952",
      white:
        "https://firebasestorage.googleapis.com/v0/b/afrolingo-e7ef3.firebasestorage.app/o/colors%2Fwhite-color.png?alt=media&token=b57e05be-8bd8-4b36-83a5-5ad22dfda447",
      black:
        "https://firebasestorage.googleapis.com/v0/b/afrolingo-e7ef3.firebasestorage.app/o/colors%2Fblack-color.png?alt=media&token=042ecead-bb02-4ad7-8082-11130708a05f",
      gray: "https://firebasestorage.googleapis.com/v0/b/afrolingo-e7ef3.firebasestorage.app/o/colors%2Fgray-color.png?alt=media&token=78639751-00e9-44c8-bec9-bb2eeec92e0f",
      gold: "https://firebasestorage.googleapis.com/v0/b/afrolingo-e7ef3.firebasestorage.app/o/colors%2Fgold-color.avif?alt=media&token=0470accb-1cba-4057-a3a9-0e87cb3c7d9c",
      silver:
        "https://firebasestorage.googleapis.com/v0/b/afrolingo-e7ef3.firebasestorage.app/o/colors%2Fsilver-color.avif?alt=media&token=1bdea3f3-e396-4a54-a3c0-ee6941970c82",
    },
  },

  // Audio - Using all-audio for all audio files
  audio:
    "https://firebasestorage.googleapis.com/v0/b/afrolingo-e7ef3.firebasestorage.app/o/audio%2Fswahili-alphabet.mp3?alt=media&token=a51382c7-fa18-4c21-9c29-d858ede081d2",
};

async function main() {
  console.log("🌱 Starting database seed...\n");

  // Clear existing data
  console.log("🧹 Cleaning up existing data...");
  await prisma.activityProgress.deleteMany();
  await prisma.lessonProgress.deleteMany();
  await prisma.userProgress.deleteMany();
  await prisma.activity.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.unit.deleteMany();
  console.log("✅ Cleanup complete\n");

  // Unit 1: Alphabet
  console.log("📚 Seeding Unit 1: Alphabet...");
  await prisma.unit.create({
    data: {
      externalId: "unit-1",
      title: "Beginning - The Alphabet",
      level: "Absolute Beginner",
      icon: "🔤",
      color: "#4CAF50",
      xpReward: 50,
      totalLessons: 1,
      order: 1,
      lessons: {
        create: {
          externalId: "lesson-alphabet",
          phrase: "The Swahili Alphabet",
          meaning: "Learn the foundation of the language",
          pronunciation: "ah-leh-fah-beh-tee",
          alphabetImage: ASSETS.images.alphabet,
          audio: ASSETS.audio,
          order: 1,
          activities: {
            create: [
              {
                externalId: "activity-alphabet-1",
                type: "introduction",
                question:
                  "Welcome! Let's start your journey by learning the Swahili alphabet.",
                order: 1,
              },
              {
                externalId: "activity-alphabet-2",
                type: "alphabet",
                question: "The Swahili Alphabet",
                alphabetImage: ASSETS.images.alphabet,
                order: 2,
              },
              {
                externalId: "activity-alphabet-3",
                type: "listening-dictation",
                question: "Listening Exercise: Write What You Hear",
                audio: ASSETS.audio,
                order: 3,
              },
              {
                externalId: "activity-alphabet-4",
                type: "vocabulary-fill-in",
                question: "Complete the Vocabulary Words",
                audio: ASSETS.audio,
                order: 4,
              },
              {
                externalId: "activity-alphabet-5",
                type: "alphabet-vocabulary-table",
                question: "Alphabet with Example Words",
                description: "Learn words that start with each letter",
                order: 5,
              },
            ],
          },
        },
      },
    },
  });
  console.log("✅ Unit 1 created\n");

  // Unit 2: Numbers
  console.log("📚 Seeding Unit 2: Numbers...");
  await prisma.unit.create({
    data: {
      externalId: "unit-2",
      title: "Numbers - Counting in Swahili",
      level: "Absolute Beginner",
      icon: "🔢",
      color: "#2196F3",
      xpReward: 75,
      totalLessons: 1,
      order: 2,
      lessons: {
        create: {
          externalId: "lesson-counting",
          phrase: "Counting in Swahili",
          meaning: "Learn to count from 1 to 1000",
          pronunciation: "he-sa-bu",
          audio: ASSETS.audio,
          order: 1,
          activities: {
            create: [
              {
                externalId: "activity-counting-1",
                type: "introduction",
                question:
                  "Let's learn to count in Swahili! Numbers are essential for everyday conversations.",
                order: 1,
              },
              {
                externalId: "activity-counting-2",
                type: "numbers-table",
                question: "Numbers 1-20",
                description: "Learn to count from one to twenty",
                audio: ASSETS.audio,
                order: 2,
              },
              {
                externalId: "activity-counting-3",
                type: "numbers-table",
                question: "Tens (30-100)",
                description: "Learn to count by tens",
                audio: ASSETS.audio,
                order: 3,
              },
              {
                externalId: "activity-counting-4",
                type: "numbers-table",
                question: "Hundreds and Thousands",
                description: "Learn larger numbers",
                audio: ASSETS.audio,
                order: 4,
              },
              {
                externalId: "activity-counting-5",
                type: "multiple-choice",
                question: "What is 'tano' in English?",
                options: ["Three", "Four", "Five", "Six"],
                correctAnswer: 2,
                explanation: "Tano means five in Swahili",
                order: 5,
              },
              {
                externalId: "activity-counting-6",
                type: "multiple-choice",
                question: "How do you say '15' in Swahili?",
                options: [
                  "kumi na tano",
                  "kumi na nne",
                  "ishirini",
                  "thelathini",
                ],
                correctAnswer: 0,
                explanation: "15 is 'kumi na tano' (ten and five)",
                order: 6,
              },
              {
                externalId: "activity-counting-7",
                type: "multiple-choice",
                question: "What is 'hamsini'?",
                options: ["30", "40", "50", "60"],
                correctAnswer: 2,
                explanation: "Hamsini means fifty",
                order: 7,
              },
              {
                externalId: "activity-counting-8",
                type: "numbers-listening",
                question: "Numbers Listening Exercise",
                description: "Listen and write the 10 numbers you hear",
                audio: ASSETS.audio,
                order: 8,
              },
              {
                externalId: "activity-counting-9",
                type: "numbers-translation",
                question: "Translate Numbers to Figures",
                description: "Convert Swahili numbers into numeric form",
                order: 9,
              },
            ],
          },
        },
      },
    },
  });
  console.log("✅ Unit 2 created\n");

  // Unit 3: Days, Months, Seasons
  console.log("📚 Seeding Unit 3: Days, Months, Seasons...");
  await prisma.unit.create({
    data: {
      externalId: "unit-3",
      title: "Days, Months, and Seasons",
      level: "Absolute Beginner",
      icon: "📅",
      color: "#9C27B0",
      xpReward: 100,
      totalLessons: 1,
      order: 3,
      lessons: {
        create: {
          externalId: "lesson-time",
          phrase: "Siku, Miezi, na Majira",
          meaning: "Days, Months, and Seasons",
          pronunciation: "see-koo, mee-eh-zee, nah mah-jee-rah",
          audio: ASSETS.audio,
          order: 1,
          activities: {
            create: [
              {
                externalId: "activity-time-1",
                type: "introduction",
                question:
                  "Let's learn how to talk about days, months, and seasons in Swahili!",
                order: 1,
              },
              {
                externalId: "activity-time-2",
                type: "vocabulary-table",
                question: "Days of the Week",
                description: "Learn the seven days",
                audio: ASSETS.audio,
                items: [
                  {
                    swahili: "Jumatatu",
                    english: "Monday",
                    pronunciation: "joo-mah-tah-too",
                  },
                  {
                    swahili: "Jumanne",
                    english: "Tuesday",
                    pronunciation: "joo-mah-neh",
                  },
                  {
                    swahili: "Jumatano",
                    english: "Wednesday",
                    pronunciation: "joo-mah-tah-no",
                  },
                  {
                    swahili: "Alhamisi",
                    english: "Thursday",
                    pronunciation: "al-hah-mee-see",
                  },
                  {
                    swahili: "Ijumaa",
                    english: "Friday",
                    pronunciation: "ee-joo-mah",
                  },
                  {
                    swahili: "Jumamosi",
                    english: "Saturday",
                    pronunciation: "joo-mah-mo-see",
                  },
                  {
                    swahili: "Jumapili",
                    english: "Sunday",
                    pronunciation: "joo-mah-pee-lee",
                  },
                ],
                order: 2,
              },
              {
                externalId: "activity-time-3",
                type: "vocabulary-table",
                question: "Months of the Year",
                description: "Learn all twelve months",
                audio: ASSETS.audio,
                items: [
                  {
                    swahili: "Januari",
                    english: "January",
                    pronunciation: "jah-noo-ah-ree",
                  },
                  {
                    swahili: "Februari",
                    english: "February",
                    pronunciation: "feh-broo-ah-ree",
                  },
                  {
                    swahili: "Machi",
                    english: "March",
                    pronunciation: "mah-chee",
                  },
                  {
                    swahili: "Aprili",
                    english: "April",
                    pronunciation: "ah-pree-lee",
                  },
                  { swahili: "Mei", english: "May", pronunciation: "meh-ee" },
                  {
                    swahili: "Juni",
                    english: "June",
                    pronunciation: "joo-nee",
                  },
                  {
                    swahili: "Julai",
                    english: "July",
                    pronunciation: "joo-lah-ee",
                  },
                  {
                    swahili: "Agosti",
                    english: "August",
                    pronunciation: "ah-go-stee",
                  },
                  {
                    swahili: "Septemba",
                    english: "September",
                    pronunciation: "seh-ptem-bah",
                  },
                  {
                    swahili: "Oktoba",
                    english: "October",
                    pronunciation: "ok-to-bah",
                  },
                  {
                    swahili: "Novemba",
                    english: "November",
                    pronunciation: "no-vem-bah",
                  },
                  {
                    swahili: "Desemba",
                    english: "December",
                    pronunciation: "deh-sem-bah",
                  },
                ],
                order: 3,
              },
              {
                externalId: "activity-time-4",
                type: "vocabulary-table",
                question: "Seasons",
                description: "Learn about the seasons",
                audio: ASSETS.audio,
                items: [
                  {
                    swahili: "Kiangazi",
                    english: "Summer/Dry Season",
                    pronunciation: "kee-ah-ngah-zee",
                  },
                  {
                    swahili: "Masika",
                    english: "Rainy Season",
                    pronunciation: "mah-see-kah",
                  },
                  {
                    swahili: "Kipupwe",
                    english: "Cool Season",
                    pronunciation: "kee-poo-pweh",
                  },
                  {
                    swahili: "Majira",
                    english: "Seasons (general)",
                    pronunciation: "mah-jee-rah",
                  },
                ],
                order: 4,
              },
              {
                externalId: "activity-time-5",
                type: "multiple-choice",
                question: "What day comes after 'Jumanne'?",
                options: ["Jumatatu", "Jumatano", "Alhamisi", "Ijumaa"],
                correctAnswer: 1,
                explanation:
                  "Jumatano (Wednesday) comes after Jumanne (Tuesday)",
                order: 5,
              },
            ],
          },
        },
      },
    },
  });
  console.log("✅ Unit 3 created\n");

  // Unit 4: Greetings
  console.log("📚 Seeding Unit 4: Greetings...");
  await prisma.unit.create({
    data: {
      externalId: "unit-4",
      title: "Greetings - Salamu",
      level: "Absolute Beginner",
      icon: "👋",
      color: "#FF9800",
      xpReward: 100,
      totalLessons: 1,
      order: 4,
      lessons: {
        create: {
          externalId: "lesson-greetings",
          phrase: "Salamu na Maagano",
          meaning: "Greetings and Farewells",
          pronunciation: "sah-lah-moo nah mah-ah-gah-no",
          audio: ASSETS.audio,
          order: 1,
          activities: {
            create: [
              {
                externalId: "activity-greetings-1",
                type: "introduction",
                question:
                  "Welcome! Let's learn how to greet people in Swahili - an essential part of African culture!",
                order: 1,
              },
              {
                externalId: "activity-greetings-2",
                type: "vocabulary-table",
                question: "Basic Greetings",
                description:
                  "Learn essential greetings for everyday conversations",
                audio: ASSETS.audio,
                items: [
                  {
                    swahili: "Habari",
                    english: "Hello / How are you?",
                    pronunciation: "hah-bah-ree",
                    image: ASSETS.images.greetings.hello,
                  },
                  {
                    swahili: "Habari ya asubuhi",
                    english: "Good morning",
                    pronunciation: "hah-bah-ree yah ah-soo-boo-hee",
                    image: ASSETS.images.greetings.morning,
                  },
                  {
                    swahili: "Habari ya mchana",
                    english: "Good afternoon",
                    pronunciation: "hah-bah-ree yah m-chah-nah",
                    image: ASSETS.images.greetings.afternoon,
                  },
                  {
                    swahili: "Habari ya jioni",
                    english: "Good evening",
                    pronunciation: "hah-bah-ree yah jee-oh-nee",
                    image: ASSETS.images.greetings.evening,
                  },
                  {
                    swahili: "Usiku mwema",
                    english: "Good night",
                    pronunciation: "oo-see-koo mweh-mah",
                    image: ASSETS.images.greetings.night,
                  },
                  {
                    swahili: "Kwaheri",
                    english: "Goodbye",
                    pronunciation: "kwah-heh-ree",
                    image: ASSETS.images.greetings.goodbye,
                  },
                  {
                    swahili: "Asante",
                    english: "Thank you",
                    pronunciation: "ah-sahn-teh",
                    image: ASSETS.images.greetings.thankYou,
                  },
                  {
                    swahili: "Nafurahi kukuona",
                    english: "Nice to see you",
                    pronunciation: "nah-foo-rah-hee koo-koo-oh-nah",
                    image: ASSETS.images.greetings.niceToMeet,
                  },
                ],
                order: 2,
              },
              {
                externalId: "activity-greetings-3",
                type: "vocabulary-table",
                question: "Common Responses",
                description: "Learn how to respond to greetings",
                audio: ASSETS.audio,
                items: [
                  {
                    swahili: "Nzuri",
                    english: "Good / Fine",
                    pronunciation: "n-zoo-ree",
                    image: ASSETS.images.greetings.hello,
                  },
                  {
                    swahili: "Salama",
                    english: "Peaceful / Well",
                    pronunciation: "sah-lah-mah",
                    image: ASSETS.images.greetings.hello,
                  },
                  {
                    swahili: "Karibu",
                    english: "Welcome",
                    pronunciation: "kah-ree-boo",
                    image: ASSETS.images.greetings.niceToMeet,
                  },
                  {
                    swahili: "Asante sana",
                    english: "Thank you very much",
                    pronunciation: "ah-sahn-teh sah-nah",
                    image: ASSETS.images.greetings.thankYou,
                  },
                ],
                order: 3,
              },
              {
                externalId: "activity-greetings-4",
                type: "multiple-choice",
                question: "How do you say 'Good morning' in Swahili?",
                options: [
                  "Habari ya jioni",
                  "Habari ya asubuhi",
                  "Usiku mwema",
                  "Habari ya mchana",
                ],
                correctAnswer: 1,
                explanation:
                  "Habari ya asubuhi means 'Good morning' in Swahili",
                order: 4,
              },
            ],
          },
        },
      },
    },
  });
  console.log("✅ Unit 4 created\n");

  // Unit 5: Occupations and Places
  console.log("📚 Seeding Unit 5: Occupations and Places...");
  await prisma.unit.create({
    data: {
      externalId: "unit-5",
      title: "Occupations and Places",
      level: "Absolute Beginner",
      icon: "🏢",
      color: "#00BCD4",
      xpReward: 120,
      totalLessons: 1,
      order: 5,
      lessons: {
        create: {
          externalId: "lesson-occupations-places",
          phrase: "Kazi na Maeneo",
          meaning: "Occupations and Places",
          pronunciation: "kah-zee nah mah-eh-neh-oh",
          audio: ASSETS.audio,
          order: 1,
          activities: {
            create: [
              {
                externalId: "activity-occ-places-1",
                type: "introduction",
                question:
                  "Let's learn about different occupations and important places in our community!",
                order: 1,
              },
              {
                externalId: "activity-occ-places-2",
                type: "vocabulary-table",
                question: "Common Places",
                description: "Learn the names of important places around you",
                audio: ASSETS.audio,
                items: [
                  {
                    swahili: "Darasa",
                    english: "Class",
                    pronunciation: "dah-rah-sah",
                    image: ASSETS.images.places.class,
                    audio: ASSETS.audio,
                  },
                  {
                    swahili: "Nyumba",
                    english: "House",
                    pronunciation: "nyoom-bah",
                    image: ASSETS.images.places.house,
                    audio: ASSETS.audio,
                  },
                  {
                    swahili: "Maktaba",
                    english: "Library",
                    pronunciation: "mah-ktah-bah",
                    image: ASSETS.images.places.library,
                    audio: ASSETS.audio,
                  },
                  {
                    swahili: "Uwanja wa ndege",
                    english: "Airport",
                    pronunciation: "oo-wahn-jah wah ndeh-geh",
                    image: ASSETS.images.places.airport,
                    audio: ASSETS.audio,
                  },
                  {
                    swahili: "Soko",
                    english: "Market",
                    pronunciation: "soh-koh",
                    image: ASSETS.images.places.market,
                    audio: ASSETS.audio,
                  },
                  {
                    swahili: "Ofisi",
                    english: "Office",
                    pronunciation: "oh-fee-see",
                    image: ASSETS.images.places.office,
                    audio: ASSETS.audio,
                  },
                  {
                    swahili: "Duka la dawa",
                    english: "Pharmacy",
                    pronunciation: "doo-kah lah dah-wah",
                    image: ASSETS.images.places.pharmacy,
                    audio: ASSETS.audio,
                  },
                  {
                    swahili: "Hospitali",
                    english: "Hospital",
                    pronunciation: "hoh-spee-tah-lee",
                    image: ASSETS.images.places.hospital,
                    audio: ASSETS.audio,
                  },
                  {
                    swahili: "Benki",
                    english: "Bank",
                    pronunciation: "behn-kee",
                    image: ASSETS.images.places.bank,
                    audio: ASSETS.audio,
                  },
                  {
                    swahili: "Shule",
                    english: "School",
                    pronunciation: "shoo-leh",
                    image: ASSETS.images.places.school,
                    audio: ASSETS.audio,
                  },
                ],
                order: 2,
              },
              {
                externalId: "activity-occ-places-3",
                type: "vocabulary-table",
                question: "Common Occupations",
                description: "Learn the names of different professions",
                audio: ASSETS.audio,
                items: [
                  {
                    swahili: "Mwalimu",
                    english: "Teacher",
                    pronunciation: "mwah-lee-moo",
                    image: ASSETS.images.occupations.teacher,
                    audio: ASSETS.audio,
                  },
                  {
                    swahili: "Karani",
                    english: "Cashier",
                    pronunciation: "kah-rah-nee",
                    image: ASSETS.images.occupations.cashier,
                    audio: ASSETS.audio,
                  },
                  {
                    swahili: "Mtumishi",
                    english: "Waiter",
                    pronunciation: "mtoo-mee-shee",
                    image: ASSETS.images.occupations.waiter,
                    audio: ASSETS.audio,
                  },
                  {
                    swahili: "Mwanasheria",
                    english: "Lawyer",
                    pronunciation: "mwah-nah-sheh-ree-ah",
                    image: ASSETS.images.occupations.lawyer,
                    audio: ASSETS.audio,
                  },
                  {
                    swahili: "Kinyozi",
                    english: "Barber",
                    pronunciation: "kee-nyoh-zee",
                    image: ASSETS.images.occupations.barber,
                    audio: ASSETS.audio,
                  },
                  {
                    swahili: "Askari",
                    english: "Police",
                    pronunciation: "ah-skah-ree",
                    image: ASSETS.images.occupations.police,
                    audio: ASSETS.audio,
                  },
                  {
                    swahili: "Dereva",
                    english: "Driver",
                    pronunciation: "deh-reh-vah",
                    image: ASSETS.images.occupations.driver,
                    audio: ASSETS.audio,
                  },
                  {
                    swahili: "Daktari",
                    english: "Doctor",
                    pronunciation: "dah-ktah-ree",
                    image: ASSETS.images.occupations.doctor,
                    audio: ASSETS.audio,
                  },
                  {
                    swahili: "Mfamasia",
                    english: "Pharmacist",
                    pronunciation: "mfah-mah-see-ah",
                    image: ASSETS.images.occupations.pharmacist,
                    audio: ASSETS.audio,
                  },
                  {
                    swahili: "Mkulima",
                    english: "Farmer",
                    pronunciation: "mkoo-lee-mah",
                    image: ASSETS.images.occupations.farmer,
                    audio: ASSETS.audio,
                  },
                ],
                order: 3,
              },
            ],
          },
        },
      },
    },
  });
  console.log("✅ Unit 5 created\n");

  // Unit 6: Plurals
  console.log("📚 Seeding Unit 6: Plurals...");
  await prisma.unit.create({
    data: {
      externalId: "unit-6",
      title: "Plurals of Nouns",
      level: "Beginner",
      icon: "🔄",
      color: "#FF9800",
      xpReward: 120,
      totalLessons: 1,
      order: 6,
      lessons: {
        create: {
          externalId: "lesson-plurals",
          phrase: "Wingi wa Nomino",
          meaning: "Plurals of Nouns",
          pronunciation: "wee-ngee wah no-mee-no",
          audio: ASSETS.audio,
          order: 1,
          activities: {
            create: [
              {
                externalId: "activity-plurals-1",
                type: "introduction",
                question:
                  "Let's master the plural forms of Swahili nouns! Swahili uses noun classes to form plurals, making it systematic and logical.",
                order: 1,
              },
              {
                externalId: "activity-plurals-2",
                type: "introduction",
                question:
                  "How Swahili Plurals Work: The Noun Class System\n\n📋 THE PATTERN:\nSwahili nouns belong to different 'classes' based on their prefixes...",
                order: 2,
              },
              {
                externalId: "activity-plurals-3",
                type: "vocabulary-table",
                question: "M-WA Class (People)",
                description:
                  "The most common class for people and living beings",
                audio: ASSETS.audio,
                items: [
                  {
                    swahili: "Mtu → Watu",
                    english: "Person → People",
                    pronunciation: "mm-too → wah-too",
                  },
                  {
                    swahili: "Mtoto → Watoto",
                    english: "Child → Children",
                    pronunciation: "mm-to-to → wah-to-to",
                  },
                  {
                    swahili: "Mwalimu → Walimu",
                    english: "Teacher → Teachers",
                    pronunciation: "mwah-lee-moo → wah-lee-moo",
                  },
                ],
                order: 3,
              },
            ],
          },
        },
      },
    },
  });
  console.log("✅ Unit 6 created\n");

  // Unit 7: Colors
  console.log("📚 Seeding Unit 7: Colors...");
  await prisma.unit.create({
    data: {
      externalId: "unit-7",
      title: "Colors - Rangi",
      level: "Absolute Beginner",
      icon: "🎨",
      color: "#E91E63",
      xpReward: 100,
      totalLessons: 1,
      order: 7,
      lessons: {
        create: {
          externalId: "lesson-colors",
          phrase: "Rangi",
          meaning: "Colors",
          pronunciation: "rah-ngee",
          audio: ASSETS.audio,
          order: 1,
          activities: {
            create: [
              {
                externalId: "activity-colors-1",
                type: "introduction",
                question:
                  "Let's learn about colors in Swahili! Colors help us describe the world around us.",
                order: 1,
              },
              {
                externalId: "activity-colors-2",
                type: "vocabulary-table",
                question: "Basic Colors",
                description: "Learn the most common colors",
                audio: ASSETS.audio,
                items: [
                  {
                    word: "Nyekundu",
                    meaning: "Red",
                    pronunciation: "nyeh-koon-doo",
                    image: ASSETS.images.colors.red,
                  },
                  {
                    word: "Bluu / Buluu",
                    meaning: "Blue",
                    pronunciation: "bloo-oo",
                    image: ASSETS.images.colors.blue,
                  },
                  {
                    word: "Kijani",
                    meaning: "Green",
                    pronunciation: "kee-jah-nee",
                    image: ASSETS.images.colors.green,
                  },
                  {
                    word: "Njano",
                    meaning: "Yellow",
                    pronunciation: "njah-no",
                    image: ASSETS.images.colors.yellow,
                  },
                  {
                    word: "Rangi ya chungwa",
                    meaning: "Orange",
                    pronunciation: "rah-ngee yah choon-gwah",
                    image: ASSETS.images.colors.orange,
                  },
                  {
                    word: "Zambarau",
                    meaning: "Purple",
                    pronunciation: "zahm-bah-rah-oo",
                    image: ASSETS.images.colors.purple,
                  },
                  {
                    word: "Waridi",
                    meaning: "Pink",
                    pronunciation: "wah-ree-dee",
                    image: ASSETS.images.colors.pink,
                  },
                  {
                    word: "Kahawia",
                    meaning: "Brown",
                    pronunciation: "kah-hah-wee-ah",
                    image: ASSETS.images.colors.brown,
                  },
                ],
                order: 2,
              },
              {
                externalId: "activity-colors-3",
                type: "vocabulary-table",
                question: "Neutral Colors",
                description: "Learn neutral and basic colors",
                audio: ASSETS.audio,
                items: [
                  {
                    word: "Nyeupe",
                    meaning: "White",
                    pronunciation: "nyeh-oo-peh",
                    image: ASSETS.images.colors.white,
                  },
                  {
                    word: "Nyeusi",
                    meaning: "Black",
                    pronunciation: "nyeh-oo-see",
                    image: ASSETS.images.colors.black,
                  },
                  {
                    word: "Kijivu",
                    meaning: "Gray",
                    pronunciation: "kee-jee-voo",
                    image: ASSETS.images.colors.gray,
                  },
                  {
                    word: "Dhahabu",
                    meaning: "Gold",
                    pronunciation: "thah-hah-boo",
                    image: ASSETS.images.colors.gold,
                  },
                  {
                    word: "Fedha",
                    meaning: "Silver",
                    pronunciation: "feh-thah",
                    image: ASSETS.images.colors.silver,
                  },
                ],
                order: 3,
              },
            ],
          },
        },
      },
    },
  });
  console.log("✅ Unit 7 created\n");

  // Get counts
  const unitCount = await prisma.unit.count();
  const lessonCount = await prisma.lesson.count();
  const activityCount = await prisma.activity.count();

  console.log("\n🎉 Seeding completed successfully!\n");
  console.log("📊 Summary:");
  console.log(`   - Units created: ${unitCount}`);
  console.log(`   - Lessons created: ${lessonCount}`);
  console.log(`   - Activities created: ${activityCount}`);
  console.log("\n✨ Database is ready for use!\n");
}

main()
  .catch((e) => {
    console.error("❌ Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
