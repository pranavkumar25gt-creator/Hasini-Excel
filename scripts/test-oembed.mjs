// Test script to verify YouTube IDs via oEmbed
const testIds = [
  'k1VUZEVuDJ8', // Kevin Stratvert: How to use Microsoft Excel for Beginners
  'Vl0H-qTclOg', // freeCodeCamp Excel course
  'oxda5y18q8Q', // Kevin Stratvert: How to use Excel on Web for Free
  'bJ5QsmS5v9w', // Chandoo Excel Tutorial for Beginners
  '3kYM_Tj51p8', // WsCube Tech Excel Full Course in Hindi
  'eI_7oc-E3h0', // WsCube Tech Excel
  'nKu3s7qX5g8', // Leila Gharani
];

async function check() {
  for (const id of testIds) {
    try {
      const res = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${id}&format=json`);
      if (res.ok) {
        const data = await res.json();
        console.log(`[VALID 200] ${id} -> "${data.title}" by ${data.author_name}`);
      } else {
        console.log(`[INVALID ${res.status}] ${id}`);
      }
    } catch (e) {
      console.log(`[ERROR] ${id}: ${e.message}`);
    }
  }
}
check();

