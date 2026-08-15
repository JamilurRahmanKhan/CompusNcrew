"use client";

import styles from "./rotating-cards.module.css";

const platformCards = [
  { label: "Instagram post", src: "instagram-card.png" },
  { label: "Facebook story", src: "facebook-card.png" },
  { label: "LinkedIn post", src: "linkedin-card.png" },
  { label: "Pinterest pin", src: "pinterest-card.png" },
  { label: "X conversation", src: "x-twitter-card.png" },
];

export function RotatingCards({ activeFace }: { activeFace: number }) {
  // Faces 0-4 are the 5 platforms; face 5 is the CTA. On a platform face,
  // every ring slot shows that platform's own card. On the CTA face, the
  // ring shows all 5 platforms at once.
  const isCta = activeFace === platformCards.length;
  const cards = isCta ? platformCards : platformCards.map(() => platformCards[activeFace] ?? platformCards[0]);

  return (
    <div className={styles.wrap}>
      <div className={styles.ring}>
        {cards.map((platform, i) => (
          <div
            className={styles.card}
            style={{ transform: `rotateY(${i * 72}deg) translateZ(170px)` }}
            key={`${platform.src}-${i}`}
          >
            <img
              src={`/media/social/${platform.src}`}
              alt={platform.label}
              className={styles.cardImage}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
