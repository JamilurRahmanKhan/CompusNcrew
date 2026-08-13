export type GalleryWallSide = "left" | "right";

export interface GalleryArtwork {
  id: string;
  title: string;
  category: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  wallSide: GalleryWallSide;
  zPosition: number;
  dimensions: {
    width: number;
    height: number;
  };
  interactionRadius: number;
  position: {
    x: number;
    y: number;
  };
}

const WALL_INTERACTION_X = 4.25;

export const portfolioWorks = [
  {
    id: "coffee-campaign",
    title: "Coffee Campaign",
    category: "Campaign design",
    description:
      "A tactile launch system pairing rich product photography with bold, editorial typography for a modern coffee brand.",
    imageSrc: "/media/design-portfolio/coffee-campaign.png",
    imageAlt:
      "Chocolate coffee poster with a dripping brown coffee cup, floating coffee beans, and the headline “The essence of pure chocolate coffee.”",
    wallSide: "left",
    zPosition: 5.25,
    dimensions: { width: 2.24, height: 2.8 },
    interactionRadius: 2,
    position: { x: -WALL_INTERACTION_X, y: 5.25 },
  },
  {
    id: "gaming-product",
    title: "Gaming Controller",
    category: "Product visual",
    description:
      "A high-energy product visual language built around dramatic lighting, crisp interface graphics, and competitive play.",
    imageSrc: "/media/design-portfolio/gaming-product.png",
    imageAlt:
      "Red-and-black gaming controller with dual thumbsticks, photographed against a deep red background.",
    wallSide: "right",
    zPosition: 1.25,
    dimensions: { width: 2.1, height: 2.8 },
    interactionRadius: 2,
    position: { x: WALL_INTERACTION_X, y: 1.25 },
  },
  {
    id: "shampoo-product",
    title: "Berry Shampoo",
    category: "Product campaign",
    description:
      "A playful personal-care identity using saturated berry color, expressive type, and clean product storytelling.",
    imageSrc: "/media/design-portfolio/shampoo-product.png",
    imageAlt:
      "Purple pump shampoo bottle covered in water droplets and surrounded by floating frosted blackberries.",
    wallSide: "left",
    zPosition: -3.25,
    dimensions: { width: 1.58, height: 2.8 },
    interactionRadius: 2,
    position: { x: -WALL_INTERACTION_X, y: -3.25 },
  },
  {
    id: "lemonade-campaign",
    title: "Raspberry Lemonade",
    category: "Social campaign",
    description:
      "A bright beverage identity balancing nostalgic fruit illustration with a confident, contemporary packaging system.",
    imageSrc: "/media/design-portfolio/lemonade-campaign.png",
    imageAlt:
      "Raspberry lemonade social poster with a tall iced pink drink, raspberries and mint, the headline “The bets is here,” and prices “Large: 30.50 / Small: 20.50.”",
    wallSide: "right",
    zPosition: -7.25,
    dimensions: { width: 1.87, height: 2.8 },
    interactionRadius: 2,
    position: { x: WALL_INTERACTION_X, y: -7.25 },
  },
] as const satisfies readonly GalleryArtwork[];

export const designServices = [
  "Brand identity",
  "Digital design",
  "Campaign creative",
  "Packaging & editorial",
] as const;
