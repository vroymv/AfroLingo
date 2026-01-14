export const UNIT_5_THEME = {
  primary: "#00BCD4",
  primaryDark: "#0097A7",
  tint: "rgba(0, 188, 212, 0.12)",
};

export const DUMMY_AUDIO_URL =
  "https://firebasestorage.googleapis.com/v0/b/afrolingo-e7ef3.firebasestorage.app/o/audio%2FKaraoke-type-test-audio.mp3?alt=media&token=86fa9267-b71a-415c-b02a-24c08f62f619";

export function getVocabImageSource(imagePath?: string): any | null {
  if (!imagePath) return null;

  const filename = imagePath.split("/").pop()?.replace(".png", "");
  if (!filename) return null;

  const imageMap: Record<string, any> = {
    // Places
    "place-class": require("@/assets/images/vocab/place-class.png"),
    "place-house": require("@/assets/images/vocab/place-house.png"),
    "place-library": require("@/assets/images/vocab/place-library.png"),
    "place-airport": require("@/assets/images/vocab/place-airport.png"),
    "place-market": require("@/assets/images/vocab/place-market.png"),
    "place-office": require("@/assets/images/vocab/place-office.png"),
    "place-pharmacy": require("@/assets/images/vocab/place-pharmacy.png"),
    "place-hospital": require("@/assets/images/vocab/place-hospital.png"),
    "place-bank": require("@/assets/images/vocab/place-bank.png"),
    "place-school": require("@/assets/images/vocab/place-school.png"),

    // Occupations (asset is misspelled in repo (watier))
    "occupation-teacher": require("@/assets/images/vocab/occupation-teacher.png"),
    "occupation-cashier": require("@/assets/images/vocab/occupation-cashier.png"),
    "occupation-waiter": require("@/assets/images/vocab/occupation-watier.png"),
    "occupation-watier": require("@/assets/images/vocab/occupation-watier.png"),
    "occupation-lawyer": require("@/assets/images/vocab/occupation-lawyer.png"),
    "occupation-barber": require("@/assets/images/vocab/occupation-barber.png"),
    "occupation-police": require("@/assets/images/vocab/occupation-police.png"),
    "occupation-driver": require("@/assets/images/vocab/occupation-driver.png"),
    "occupation-doctor": require("@/assets/images/vocab/occupation-doctor.png"),
    "occupation-pharmacist": require("@/assets/images/vocab/occupation-pharmacist.png"),
    "occupation-farmer": require("@/assets/images/vocab/occupation-farmer.png"),
  };

  return imageMap[filename] ?? null;
}
